'use strict';

const path = require('path');

/** Shown in editor footer and meta.version (DBM “Action Out of Date” check). */
const NT_AI_BRIDGE_MOD_VERSION = '2.2.0';

function normalizeInvokeFrom(v) {
  const s = String(v == null ? '' : v).toLowerCase();
  if (s === 'slash' || s === 'prefix') {
    return s;
  }
  return 'both';
}

module.exports = {
  name: 'NT AI Bridge MOD',
  section: 'Other Stuff',

  subtitle(data) {
    const v = data.promptVarName || 'ntAiPrompt';
    const d = data.deferSlash === 'false' ? 'no defer' : 'defer';
    const inv = normalizeInvokeFrom(data.invokeFrom);
    const invShort = inv === 'both' ? 'slash+prefix' : inv;
    const ep = data.ephemeralSlash === 'true' ? 'ephemeral' : 'public';
    return `${v} · ${invShort} · ${d} · ${ep}`;
  },

  // meta.version is the DBM build this action targets (same field DBM uses for “Action Out of Date”).
  meta: {
    version: NT_AI_BRIDGE_MOD_VERSION,
    preciseCheck: true,
    author: 'News Targeted',
    authorUrl: 'https://newstargeted.com',
    downloadUrl: null,
  },

  fields: ['promptVarName', 'invokeFrom', 'ephemeralSlash', 'deferSlash', 'behavior'],

  html(isEvent, data) {
    const pv = String(data.promptVarName != null ? data.promptVarName : 'ntAiPrompt').replace(/"/g, '&quot;');
    const invokeFrom = normalizeInvokeFrom(data.invokeFrom);
    const ephemeralSlash = data.ephemeralSlash === 'true' ? 'true' : 'false';
    const deferSlash = data.deferSlash === 'false' ? 'false' : 'true';
    const beh = data.behavior === '1' ? '1' : '0';
    return `
<div style="position:absolute;bottom:0px;border:1px solid #222;background:#000;color:#999;padding:3px;right:0px;z-index:999999;font:12px sans-serif;">Version ${NT_AI_BRIDGE_MOD_VERSION}</div>
<div style="position:absolute;bottom:0px;border:1px solid #222;background:#000;color:#999;padding:3px;left:0px;z-index:999999;font:12px sans-serif;">DBM Mods</div>
<div style="padding:10px;padding-bottom:36px;box-sizing:border-box;">
  <span class="dbminputlabel">Temp variable (prompt / question text)</span><br>
  <input id="promptVarName" class="round" type="text" placeholder="ntAiPrompt" value="${pv}"><br><br>

  <span class="dbminputlabel">Use this action from</span><br>
  <select id="invokeFrom" class="round">
    <option value="both" ${invokeFrom === 'both' ? 'selected' : ''}>Slash and prefix (auto-detect)</option>
    <option value="slash" ${invokeFrom === 'slash' ? 'selected' : ''}>Slash commands only</option>
    <option value="prefix" ${invokeFrom === 'prefix' ? 'selected' : ''}>Prefix / message commands only</option>
  </select><br><br>

  <span class="dbminputlabel">Slash reply visibility (ephemeral)</span><br>
  <select id="ephemeralSlash" class="round">
    <option value="false" ${
      ephemeralSlash === 'false' ? 'selected' : ''
    }>Public (everyone sees the reply in channel)</option>
    <option value="true" ${
      ephemeralSlash === 'true' ? 'selected' : ''
    }>Ephemeral (only the user who ran the command)</option>
  </select><br><br>

  <span class="dbminputlabel">Slash: defer first (needs Slash Command Defer extension)</span><br>
  <select id="deferSlash" class="round">
    <option value="true" ${deferSlash === 'true' ? 'selected' : ''}>Yes (recommended for slash /ask)</option>
    <option value="false" ${deferSlash === 'false' ? 'selected' : ''}>No (or defer elsewhere)</option>
  </select><br><br>

  <span class="dbminputlabel">End Behavior</span><br>
  <select id="behavior" class="round">
    <option value="0" ${beh === '0' ? 'selected' : ''}>Call Next Action Automatically</option>
    <option value="1" ${beh === '1' ? 'selected' : ''}>Do Not Call Next Action</option>
  </select>
  <p style="margin-top:12px;font-size:12px;opacity:0.85;">
    <b>Invoke from</b> skips the wrong trigger with a short hint (e.g. prefix-only blocks slash). <b>Ephemeral</b> applies to slash interactions; prefix replies stay public in the channel. Match <b>defer</b> to your <b>ephemeral</b> choice (defer uses the same flag). Configure URL/token under <b>Extensions → NT AI Bridge</b>. See <a href="https://ai.newstargeted.com/docs">ai.newstargeted.com/docs</a>.
  </p>
  <p style="margin-top:8px;font-size:11px;opacity:0.75;color:#888;">
    Targets <b>DBM 2.2.x</b> / Discord.js v14. No extra npm in <code>nt_ai_bridge_EXT</code> (Node built-ins only); run <code>npm install</code> in your <b>bot project root</b>.
  </p>
</div>`;
  },

  init() {},

  action(cache) {
    const data = cache.actions[cache.index];
    const DBM = this.getDBM();
    const Actions = DBM.Actions;
    const Bot = DBM.Bot;
    const promptVarName = this.evalMessage(data.promptVarName, cache) || 'ntAiPrompt';
    const invokeFrom = normalizeInvokeFrom(data.invokeFrom);
    const ephemeralSlash = data.ephemeralSlash === 'true';

    const baseTempVars = Actions.getActionVariable.bind(cache.temp);
    const tempVars = function (n) {
      if (n === 'ntAiPrompt' || n === 'ntAskPrompt') {
        return baseTempVars(promptVarName);
      }
      return baseTempVars(n);
    };
    let bridge;
    try {
      bridge = require(path.join(__dirname, '..', 'extensions', 'nt_ai_bridge_EXT', 'bridge.js'));
    } catch (reqErr) {
      console.error('[NT AI Bridge MOD] require failed:', reqErr && reqErr.message);
      if (data.behavior === '0') {
        this.callNextAction(cache);
      }
      return;
    }
    const proceed = () => {
      if (data.behavior === '0') {
        this.callNextAction(cache);
      }
    };
    const slashFallback = () => {
      const ix = cache && cache.interaction;
      if (!ix) {
        return Promise.resolve();
      }
      const payload = { content: 'AI bridge failed. Check bot logs.', allowedMentions: { parse: [] } };
      if (ephemeralSlash) {
        payload.ephemeral = true;
      }
      if (ix.deferred && !ix.replied && typeof ix.editReply === 'function') {
        return ix.editReply(payload).catch(function () {});
      }
      if (!ix.deferred && !ix.replied && typeof ix.reply === 'function') {
        return ix.reply(payload).catch(function () {});
      }
      return Promise.resolve();
    };
    const p = Promise.resolve()
      .then(function () {
        if (data.deferSlash === 'true' && Bot && typeof Bot.deferSlashIfNeeded === 'function') {
          return Bot.deferSlashIfNeeded(cache, { ephemeral: ephemeralSlash });
        }
        return null;
      })
      .then(function () {
        return bridge(cache.msg, cache, tempVars, {
          invokeFrom,
          ephemeral: ephemeralSlash,
        });
      });
    p.then(function () {
      proceed();
    }).catch(function (err) {
      console.error('[NT AI Bridge MOD]', err && err.message);
      slashFallback().finally(proceed);
    });
  },

  mod() {},
};
