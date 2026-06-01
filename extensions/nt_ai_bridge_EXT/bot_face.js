'use strict';

const { URL } = require('url');

/**
 * @param {string} url
 * @returns {string}
 */
function sanitizeThumbnailUrl(url) {
  const s = String(url || '')
    .trim()
    .substring(0, 2048);
  if (!s) {
    return '';
  }
  try {
    const u = new URL(s);
    if (u.protocol !== 'http:' && u.protocol !== 'https:') {
      return '';
    }
    return s;
  } catch (_) {
    return '';
  }
}

function resolveBotUser(msg, interaction) {
  try {
    if (interaction && interaction.client && interaction.client.user) {
      return interaction.client.user;
    }
    if (msg && msg.client && msg.client.user) {
      return msg.client.user;
    }
    if (global.DBM && global.DBM.Bot && global.DBM.Bot.bot && global.DBM.Bot.bot.user) {
      return global.DBM.Bot.bot.user;
    }
  } catch (_) {}
  return null;
}

function resolveBotAvatarUrl(msg, interaction) {
  const user = resolveBotUser(msg, interaction);
  if (!user || typeof user.displayAvatarURL !== 'function') {
    return '';
  }
  try {
    return String(user.displayAvatarURL({ extension: 'png', size: 128 }));
  } catch (_) {
    try {
      return String(user.displayAvatarURL());
    } catch (_2) {
      return '';
    }
  }
}

function resolveBotAuthorName(msg, interaction) {
  const user = resolveBotUser(msg, interaction);
  if (!user) {
    return 'NT AI';
  }
  const gn = user.globalName && String(user.globalName).trim();
  if (gn) {
    return gn;
  }
  const un = user.username && String(user.username).trim();
  if (un) {
    return un;
  }
  return 'NT AI';
}

function stringOrObjectImageUrl(v) {
  if (v == null) {
    return '';
  }
  if (typeof v === 'string') {
    return sanitizeThumbnailUrl(v);
  }
  if (typeof v === 'object' && typeof v.url === 'string') {
    return sanitizeThumbnailUrl(v.url);
  }
  return '';
}

/**
 * Small corner image only (not the large embed image).
 * @param {Record<string, unknown>} body
 */
function thumbnailFromApiBody(body) {
  if (!body || typeof body !== 'object') {
    return '';
  }
  const keys = ['thumbnail_url', 'thumbnail', 'embed_thumbnail', 'answer_thumbnail'];
  for (let i = 0; i < keys.length; i++) {
    const ok = stringOrObjectImageUrl(body[keys[i]]);
    if (ok) {
      return ok;
    }
  }
  return '';
}

/**
 * Large embed image (bottom of embed), separate from thumbnail.
 * @param {Record<string, unknown>} body
 */
function embedImageFromApiBody(body) {
  if (!body || typeof body !== 'object') {
    return '';
  }
  const keys = [
    'embed_image_url',
    'image_url',
    'answer_image',
    'embed_image',
    'picture_url',
    'photo_url',
    'picture',
    'image',
    'generated_image',
    'imageUrl',
    'media_url',
    'attachment_url',
  ];
  for (let i = 0; i < keys.length; i++) {
    const ok = stringOrObjectImageUrl(body[keys[i]]);
    if (ok) {
      return ok;
    }
  }
  try {
    const media = body.media;
    if (media && typeof media === 'object') {
      const ok = stringOrObjectImageUrl(media);
      if (ok) {
        return ok;
      }
    }
  } catch (_) {}
  return '';
}

/**
 * Find first usable image URL inside answer text (markdown or bare image URL).
 * @param {string} text
 */
function extractImageUrlFromText(text) {
  const t = String(text || '');
  const md = t.match(/!\[[^\]]*\]\((https?:[^)\s]+)\)/i);
  if (md && md[1]) {
    const u = sanitizeThumbnailUrl(md[1]);
    if (u) {
      return u;
    }
  }
  const bare = t.match(/(https?:\/\/[^\s<>"')]+\.(?:png|jpe?g|gif|webp)(?:\?[^\s<>"')]*)?)/i);
  if (bare && bare[1]) {
    return sanitizeThumbnailUrl(bare[1]);
  }
  const lines = t.split(/\n/);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (/^https?:\/\//i.test(line)) {
      const u = sanitizeThumbnailUrl(line);
      if (u && /\.(png|jpe?g|gif|webp)(\?|$)/i.test(u)) {
        return u;
      }
    }
  }
  return '';
}

/**
 * Remove markdown / line that carries the image URL from description so it does not duplicate the embed image.
 * @param {string} text
 * @param {string} imageUrl
 */
function stripFirstImageFromText(text, imageUrl) {
  if (!imageUrl || text == null) {
    return String(text);
  }
  let out = String(text);
  const esc = imageUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  out = out.replace(new RegExp(`!\\[[^\\]]*\\]\\(${esc}\\)`, 'gi'), '');
  out = out.replace(new RegExp(`^\\s*${esc}\\s*$`, 'gm'), '');
  out = out.replace(/\n{3,}/g, '\n\n').trim();
  return out.length ? out : '\u200b';
}

module.exports = {
  sanitizeThumbnailUrl,
  thumbnailFromApiBody,
  embedImageFromApiBody,
  extractImageUrlFromText,
  stripFirstImageFromText,
  stringOrObjectImageUrl,
  resolveBotUser,
  resolveBotAvatarUrl,
  resolveBotAuthorName,
};
