'use strict';

const https = require('https');
const http = require('http');
const path = require('path');
const { URL } = require('url');

const modDir = __dirname;
const { NT_ASK_MENTIONS, NT_ASK_WARN_COLOR, NT_EMBEDS_PER_MESSAGE } = require(path.join(modDir, 'constants'));
const { getNtAiSettings } = require(path.join(modDir, 'settings_read'));
const {
  resolveBotAvatarUrl,
  resolveBotAuthorName,
  sanitizeThumbnailUrl,
  thumbnailFromApiBody,
  embedImageFromApiBody,
  extractImageUrlFromText,
  stripFirstImageFromText,
} = require(path.join(modDir, 'bot_face'));
const { makeAskEmbeds, makeErrorEmbed, makeWarnEmbed } = require(path.join(modDir, 'embed_build'));
const { ntAiReplySlash, sendInteractionEmbedsChained } = require(path.join(modDir, 'slash_reply'));

/**
 * NT /ask bridge: POST to bridge URL with Authorization: Bearer ntai_… (Settings → API),
 * or X-NT-Bridge-Secret when the stored value does not start with ntai_ (self-hosted bridge secret).
 * Prefix: posts a “working…” reply, then edits when the API returns.
 * Thumbnail: bot avatar by default; override via API body or settings.ntAiAskThumbnailUrl.
 *
 * @param {import('discord.js').Message} [msg]
 * @param {object} cache
 * @param {function(string): *} tempVars
 * @param {{ invokeFrom?: string, ephemeral?: boolean }} [bridgeOpts] invokeFrom: both | slash | prefix
 */
module.exports = function ntAiBridge(msg, cache, tempVars, bridgeOpts) {
  bridgeOpts = bridgeOpts && typeof bridgeOpts === 'object' ? bridgeOpts : {};
  const invokeFrom = String(bridgeOpts.invokeFrom || 'both').toLowerCase();
  const slashEphemeral = bridgeOpts.ephemeral === true;
  const slashOpts = { ephemeral: slashEphemeral };

  const askT0 = Date.now();
  const interaction = cache && cache.interaction ? cache.interaction : null;
  const isPrefix = Boolean(msg && !interaction);
  const botFace = {
    iconUrl: resolveBotAvatarUrl(msg, interaction),
    authorName: resolveBotAuthorName(msg, interaction),
  };

  if (invokeFrom === 'slash' && !interaction) {
    if (msg && msg.channel) {
      const emb = makeWarnEmbed(
        'This NT AI Bridge action is set to **slash commands only**. Use your slash command (e.g. /ask), not a prefix or plain message trigger.',
        askT0,
        botFace,
      );
      const payload = { embeds: [emb], allowedMentions: NT_ASK_MENTIONS, content: null };
      const p = typeof msg.reply === 'function' ? msg.reply(payload) : msg.channel.send(payload);
      return Promise.resolve(p).catch(function (err) {
        console.error('[nt_ai_bridge] slash-only skip reply failed', err && err.message);
      });
    }
    return Promise.resolve();
  }
  if (invokeFrom === 'prefix' && interaction) {
    return ntAiReplySlash(
      interaction,
      [
        makeWarnEmbed(
          'This NT AI Bridge action is set to **prefix commands only**. Use your text command in the channel instead of this slash command.',
          askT0,
          botFace,
        ),
      ],
      slashOpts,
    );
  }

  const sendPlain = function (text, asError) {
    const c = interaction && interaction.channel ? interaction.channel : msg && msg.channel;
    if (!c || typeof c.send !== 'function') {
      return Promise.resolve();
    }
    const emb = asError ? makeErrorEmbed(text, askT0, botFace) : makeWarnEmbed(text, askT0, botFace);
    return c.send({ embeds: [emb], allowedMentions: NT_ASK_MENTIONS }).catch(function (err) {
      console.error('[nt_ai_bridge] sendPlain failed', err && err.message);
    });
  };

  const settings = getNtAiSettings();
  const urlStr = String(settings.ntAiBridgeUrl || '').trim();
  const secret = String(settings.ntAiBridgeSecret || '').trim();
  const rawAi = tempVars('ntAiPrompt');
  const rawAsk = tempVars('ntAskPrompt');
  const prompt = String(rawAi != null && String(rawAi).trim() !== '' ? rawAi : rawAsk || '').trim();

  if (!prompt) {
    if (interaction) {
      return ntAiReplySlash(interaction, [makeWarnEmbed('Please provide a question.', askT0, botFace)], slashOpts);
    }
    return sendPlain('Please provide a question.', false);
  }
  if (!urlStr || !secret) {
    const t =
      'Ask is not configured. Set **Bridge URL** and your **API token** in **Extensions → NT AI Bridge**, then save the project — or set **ntAiBridgeUrl** / **ntAiBridgeSecret** in settings.';
    if (interaction) {
      return ntAiReplySlash(interaction, [makeWarnEmbed(t, askT0, botFace)], slashOpts);
    }
    return sendPlain(t, false);
  }

  let guildId = 'DM';
  let channelId = '';
  let userId = '';
  let username = '';
  if (interaction && interaction.user) {
    guildId = interaction.guildId || 'DM';
    channelId = interaction.channelId || '';
    userId = interaction.user.id;
    username = interaction.user.username || '';
  } else if (msg) {
    guildId = msg.guild ? msg.guild.id : 'DM';
    channelId = msg.channel ? msg.channel.id : '';
    userId = msg.author ? msg.author.id : '';
    username = msg.author ? msg.author.username || '' : '';
  }

  const bodyObj = {
    prompt,
    guild_id: guildId,
    channel_id: channelId,
    user_id: userId,
    username,
  };
  const body = JSON.stringify(bodyObj);
  let u;
  try {
    u = new URL(urlStr);
  } catch (_e) {
    const t = 'Invalid bridge URL in settings.';
    if (interaction) {
      return ntAiReplySlash(interaction, [makeWarnEmbed(t, askT0, botFace)], slashOpts);
    }
    return sendPlain(t, false);
  }

  const lib = u.protocol === 'https:' ? https : http;
  const port = u.port ? Number(u.port) : u.protocol === 'https:' ? 443 : 80;
  /** Must exceed server LLM + RAG wall time (PHP ask handler allows up to 300s). */
  const BRIDGE_HTTP_TIMEOUT_MS = 300000;

  const useBearer = /^ntai_/i.test(secret);
  const headers = {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(body, 'utf8'),
  };
  if (useBearer) {
    headers['Authorization'] = `Bearer ${secret}`;
  } else {
    headers['X-NT-Bridge-Secret'] = secret;
  }

  const opts = {
    method: 'POST',
    hostname: u.hostname,
    port,
    path: u.pathname + (u.search || ''),
    headers,
    timeout: BRIDGE_HTTP_TIMEOUT_MS,
  };

  const obtainStatusMessage = function () {
    if (!isPrefix || !msg || !msg.channel) {
      return Promise.resolve(null);
    }
    const waitingEmbed = {
      color: NT_ASK_WARN_COLOR,
      title: 'Working on your answer',
      description:
        '\u23f3 This can take **under a minute to several minutes** (large models or RAG may be slower). Please wait - the next message will include timing in the footer.',
    };
    if (botFace.iconUrl) {
      waitingEmbed.author = {
        name: botFace.authorName.substring(0, 256),
        icon_url: botFace.iconUrl,
      };
      waitingEmbed.footer = {
        text: 'NT AI',
        icon_url: botFace.iconUrl,
      };
      waitingEmbed.thumbnail = { url: botFace.iconUrl.substring(0, 2048) };
    }
    return msg
      .reply({
        embeds: [waitingEmbed],
        allowedMentions: NT_ASK_MENTIONS,
        content: null,
      })
      .catch(function (err) {
        console.error('[nt_ai_bridge] status reply failed', err && err.message);
        return null;
      });
  };

  return obtainStatusMessage().then(function (statusMsg) {
    if (isPrefix && msg.channel && typeof msg.channel.sendTyping === 'function') {
      msg.channel.sendTyping().catch(function () {});
    }

    return new Promise(function (resolve) {
      let responseHandled = false;
      function finishResponse(fn) {
        if (responseHandled) {
          return;
        }
        responseHandled = true;
        fn();
      }

      const finishPrefix = function (p) {
        p.catch(function () {}).then(resolve);
      };

      const deliverPrefixManyEmbeds = function (allEmbeds) {
        if (!msg || !msg.channel) {
          resolve();
          return;
        }
        const ch = msg.channel;
        const firstBatch = allEmbeds.slice(0, NT_EMBEDS_PER_MESSAGE);
        let rest = allEmbeds.slice(NT_EMBEDS_PER_MESSAGE);
        let chain = Promise.resolve();
        if (statusMsg && typeof statusMsg.edit === 'function') {
          chain = statusMsg
            .edit({ embeds: firstBatch, content: null, allowedMentions: NT_ASK_MENTIONS })
            .catch(function (err) {
              console.error('[nt_ai_bridge] edit failed', err && err.message);
              return ch.send({ embeds: firstBatch, allowedMentions: NT_ASK_MENTIONS });
            });
        } else {
          chain = ch.send({ embeds: firstBatch, allowedMentions: NT_ASK_MENTIONS }).catch(function (err) {
            console.error('[nt_ai_bridge] send failed', err && err.message);
          });
        }
        while (rest.length) {
          const batch = rest.slice(0, NT_EMBEDS_PER_MESSAGE);
          rest = rest.slice(NT_EMBEDS_PER_MESSAGE);
          chain = chain.then(
            (function (b) {
              return function () {
                return ch.send({ embeds: b, allowedMentions: NT_ASK_MENTIONS }).catch(function (err) {
                  console.error('[nt_ai_bridge] follow-up send failed', err && err.message);
                });
              };
            })(batch),
          );
        }
        finishPrefix(chain);
      };

      const deliverPrefixError = function (errTxt) {
        const emb = makeErrorEmbed(String(errTxt), askT0, botFace);
        if (statusMsg && typeof statusMsg.edit === 'function') {
          finishPrefix(
            statusMsg.edit({ embeds: [emb], content: null, allowedMentions: NT_ASK_MENTIONS }).catch(function () {
              return sendPlain(String(errTxt), true);
            }),
          );
        } else {
          finishPrefix(sendPlain(String(errTxt), true));
        }
      };

      const req = lib.request(opts, function (res) {
        let data = '';
        res.on('data', function (c) {
          data += String(c);
        });
        res.on('end', function () {
          finishResponse(function () {
            const status = res.statusCode || 0;
            function tryParseJson() {
              try {
                return JSON.parse(data);
              } catch (_) {
                return null;
              }
            }

            if (status < 200 || status >= 300) {
              const jErr = tryParseJson();
              let errTxt =
                jErr && (jErr.message || jErr.error)
                  ? String(jErr.message || `Error: ${String(jErr.error)}`)
                  : `AI bridge returned HTTP ${String(status)}${data ? ' (non-JSON body).' : '.'}`;
              if (status === 524) {
                errTxt =
                  'AI site took too long behind Cloudflare (HTTP 524). The model or RAG step exceeded the proxy limit (~100s). Try a shorter question, a faster model in AI settings, or ask again.';
              }
              if (interaction) {
                ntAiReplySlash(interaction, [makeErrorEmbed(errTxt, askT0, botFace)], slashOpts).then(function () {
                  resolve();
                });
                return;
              }
              if (isPrefix) {
                deliverPrefixError(errTxt);
                return;
              }
              sendPlain(errTxt, true).then(resolve);
              return;
            }

            try {
              const j = tryParseJson();
              if (!j || typeof j !== 'object') {
                throw new Error('parse');
              }
              if (j.error) {
                const errTxt2 = j.message ? String(j.message) : `Error: ${String(j.error)}`;
                if (interaction) {
                  ntAiReplySlash(interaction, [makeErrorEmbed(errTxt2, askT0, botFace)], slashOpts).then(function () {
                    resolve();
                  });
                  return;
                }
                if (isPrefix) {
                  deliverPrefixError(errTxt2);
                  return;
                }
                sendPlain(errTxt2, true).then(resolve);
                return;
              }
              let text = String(j.answer || j.content || '').trim();
              if (!text) {
                text = 'No response.';
              }
              let apiImage = embedImageFromApiBody(j);
              const imageFromDedicatedFields = Boolean(apiImage);
              if (!apiImage) {
                apiImage = extractImageUrlFromText(text);
              }
              if (apiImage && (!imageFromDedicatedFields || text.indexOf(apiImage) !== -1)) {
                text = stripFirstImageFromText(text, apiImage);
              }
              const apiThumb = thumbnailFromApiBody(j);
              const settingsThumb = sanitizeThumbnailUrl(settings.ntAiAskThumbnailUrl);
              const customThumb = apiThumb || settingsThumb;
              const askFace = Object.assign({}, botFace);
              if (customThumb) {
                askFace.thumbnailUrl = customThumb;
              }
              if (apiImage) {
                askFace.imageUrl = apiImage;
              }
              const allEmbeds = makeAskEmbeds(text, askT0, askFace);

              if (interaction) {
                sendInteractionEmbedsChained(interaction, allEmbeds, resolve, slashOpts);
              } else if (isPrefix && msg && msg.channel) {
                deliverPrefixManyEmbeds(allEmbeds);
              } else if (msg && msg.channel) {
                deliverPrefixManyEmbeds(allEmbeds);
              } else {
                resolve();
              }
            } catch (_e) {
              console.error('[nt_ai_bridge] Bad JSON or body from bridge, bytes=', Buffer.byteLength(data, 'utf8'));
              if (isPrefix) {
                deliverPrefixError('Invalid response from AI bridge.');
              } else if (interaction) {
                ntAiReplySlash(
                  interaction,
                  [makeErrorEmbed('Invalid response from AI bridge.', askT0, botFace)],
                  slashOpts,
                ).then(resolve);
              } else {
                sendPlain('Invalid response from AI bridge.', true).then(resolve);
              }
            }
          });
        });
      });
      req.on('error', function (err) {
        console.error('[nt_ai_bridge] HTTP error', err && err.message);
        finishResponse(function () {
          if (isPrefix) {
            deliverPrefixError('Could not reach the AI bridge.');
          } else if (interaction) {
            ntAiReplySlash(
              interaction,
              [makeErrorEmbed('Could not reach the AI bridge.', askT0, botFace)],
              slashOpts,
            ).then(resolve);
          } else {
            sendPlain('Could not reach the AI bridge.', true).then(resolve);
          }
        });
      });
      req.setTimeout(BRIDGE_HTTP_TIMEOUT_MS, function () {
        try {
          req.destroy(new Error('bridge_timeout'));
        } catch (_d) {
          req.destroy();
        }
        finishResponse(function () {
          if (isPrefix) {
            deliverPrefixError('AI bridge timed out (5 minutes).');
          } else if (interaction) {
            ntAiReplySlash(
              interaction,
              [makeErrorEmbed('AI bridge timed out (5 minutes).', askT0, botFace)],
              slashOpts,
            ).then(resolve);
          } else {
            sendPlain('AI bridge timed out.', true).then(resolve);
          }
        });
      });
      req.write(body);
      req.end();
    });
  });
};
