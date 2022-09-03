/* eslint-disable no-empty */
module.exports = {
  name: 'Translate',
  section: 'Other Stuff',
  meta: {
    version: '2.1.6',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/translate_MOD.js',
  },

  subtitle(data) {
    return `Translate to [${data.translateTo}]`;
  },

  variableStorage(data, varType) {
    if (parseInt(data.storage, 10) !== varType) return;
    return [data.varName, 'String'];
  },

  fields: ['translateTo', 'translateMessage', 'storage', 'varName'],

  html(_isEvent, data) {
    return `
<div style="width: 30%;">
  Translate to:<br>
  <input id="translateTo" placeholder="Should be 2 letters." class="round" type="text" maxlength="2"><br>
</div>
<div>
  Translate Message:<br>
  <textarea id="translateMessage" rows="9" placeholder="Insert message that you want to translate here..." style="width: 99%; font-family: monospace; white-space: nowrap; resize: none;"></textarea>
</div>
<div style="padding-top: 30px;">
  <div style="float: left; width: 35%;">
    Store In:<br>
    <select id="storage" class="round" onchange="glob.variableChange(this, 'varNameContainer')">
      ${data.variables[0]}
    </select>
  </div>
  <div id="varNameContainer" style="display: none; float: right; width: 60%;">
    Variable Name:<br>
    <input id="varName" class="round" type="text">
  </div>
</div>`;
  },

  init() {
    const { glob, document } = this;
    glob.variableChange(document.getElementById('storage'), 'varNameContainer');
  },

  async action(cache) {
    const data = cache.actions[cache.index];
    const translateTo = this.evalMessage(data.translateTo, cache);
    const translateMessage = this.evalMessage(data.translateMessage, cache);
    const storage = parseInt(data.storage, 10);
    const varName = this.evalMessage(data.varName, cache);

    const Mods = this.getMods();
    const translate = Mods.require('node-google-translate-skidz');

    if (!translateTo || translateTo.length > 2) return console.log('Translate to can only be 2 letters.');
    if (!translateMessage) return console.log('You need to write something to translate.');

    let result;
    try {
      const { translation } = await translate(translateMessage, translateTo);
      result = translation;
    } catch {}

    if (result) this.storeValue(result, storage, varName, cache);
    this.callNextAction(cache);
  },

  mod() {},
};
