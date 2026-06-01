/**
 * DBM editor extension: NT AI Bridge (HTTP bridge for /ask and prefix ask).
 * Settings persist via DBM project save → data/settings.json (same pattern as Top.gg Api).
 *
 * @see extensions/nt_ai_bridge_EXT/bridge.js
 */
'use strict';

const path = require('path');

const EXTENSION_DISPLAY_NAME = 'NT AI Bridge';

function escAttr(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;');
}

module.exports = {
  name: EXTENSION_DISPLAY_NAME,

  isCommandExtension: false,
  isEventExtension: false,
  isEditorExtension: true,

  fields: ['ntAiBridgeUrl', 'ntAiBridgeSecret', 'ntAiAskThumbnailUrl'],

  defaultFields: {
    ntAiBridgeUrl: 'https://ai.newstargeted.com/api/discord/ask',
    ntAiBridgeSecret: '',
    ntAiAskThumbnailUrl: '',
  },

  size() {
    return { width: 580, height: 560 };
  },

  html(data) {
    const u = escAttr(data.ntAiBridgeUrl);
    const sec = escAttr(data.ntAiBridgeSecret);
    const thumb = escAttr(data.ntAiAskThumbnailUrl);
    return `
<div style="float:left;width:99%;margin-left:auto;margin-right:auto;padding:12px;text-align:left;color:#ccc;font-family:sans-serif;">
  <h2 style="margin-top:0;color:#fff;">NT AI Bridge</h2>
  <p style="font-size:12px;line-height:1.5;">
    Create a token at <a href="https://ai.newstargeted.com/settings?section=api" style="color:#93c5fd;">Settings → API</a> and paste it below. Values starting with <code>ntai_</code> are sent as <code style="background:#333;padding:2px 4px;">Authorization: Bearer</code> (your credits and limits apply).
    <strong>Docs:</strong> <a href="https://ai.newstargeted.com/docs" style="color:#93c5fd;">ai.newstargeted.com/docs</a>.
  </p>
  <p style="font-size:12px;line-height:1.45;">
    Default URL targets the NT Discord ask endpoint. Save this dialog, then <b>save your DBM project</b>. Use the <b>NT AI Bridge MOD</b> action or <code>nt_ai_bridge_EXT/bridge.js</code>. Temp var <code>ntAskPrompt</code> still works if <code>ntAiPrompt</code> is empty.
  </p>
  <hr style="border-color:#444;">
  <label for="ntAiBridgeUrl" style="display:block;margin:8px 0 4px;font-weight:bold;">Bridge URL (HTTPS)</label>
  <input id="ntAiBridgeUrl" class="round" type="text" style="width:98%;box-sizing:border-box;" placeholder="https://ai.newstargeted.com/api/discord/ask" value="${u}">

  <label for="ntAiBridgeSecret" style="display:block;margin:12px 0 4px;font-weight:bold;">API token from Settings → API</label>
  <input id="ntAiBridgeSecret" class="round" type="password" style="width:98%;box-sizing:border-box;" autocomplete="off" placeholder="ntai_…" value="${sec}">

  <label for="ntAiAskThumbnailUrl" style="display:block;margin:12px 0 4px;font-weight:bold;">Optional embed thumbnail URL</label>
  <input id="ntAiAskThumbnailUrl" class="round" type="text" style="width:98%;box-sizing:border-box;" placeholder="https://…" value="${thumb}">
</div>`;
  },

  init() {},

  close(document, data) {
    function val(id) {
      const el = document.getElementById(id);
      return el && typeof el.value === 'string' ? el.value : '';
    }
    data.ntAiBridgeUrl = String(val('ntAiBridgeUrl') || '').trim();
    data.ntAiBridgeSecret = String(val('ntAiBridgeSecret') || '').trim();
    data.ntAiAskThumbnailUrl = String(val('ntAiAskThumbnailUrl') || '').trim();
  },

  load() {},

  save() {},

  mod(DBM) {
    try {
      const bridgePath = path.join(__dirname, 'nt_ai_bridge_EXT', 'bridge.js');
      const bridge = require(bridgePath);
      if (DBM.Bot) {
        DBM.Bot.runNtAiBridge = bridge;
        DBM.Bot.runNtAskBridge = bridge;
      }
      if (typeof global !== 'undefined') {
        global.runNtAiBridge = bridge;
        global.runNtAskBridge = bridge;
      }
      console.log(
        '[NT AI Bridge EXT] Loaded — use NT AI Bridge MOD action or require(.../nt_ai_bridge_EXT/bridge.js).',
      );
    } catch (e) {
      console.error('[NT AI Bridge EXT] Failed to load bridge:', e && e.message);
    }
  },
};
