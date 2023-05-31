/* eslint-disable no-empty */
module.exports = {
  name: 'Translate',
  section: 'Other Stuff',
  meta: {
    version: '2.1.7',
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

  html() {
    return `
  <div>
    <div style="float: left; width: 35%">
      <span class="dbminputlabel">Translate to</span>
      <input id="translateTo" placeholder="2 Letter ISO Code" class="round" type="text" maxlength="2">
    </div>
    <div style="float: right; width: 60%; padding-top: 22px;">
      <p>Find ISO Codes <a target="_blank" href="https://phyrok.github.io/iso_codes.html">Here</a href></p>
    </div>
  </div>
  <br><br><br>

  <div style="padding-top: 16px;">
    <div>
      <span class="dbminputlabel">Translate Message</span>
      <textarea id="translateMessage" rows="9" placeholder="Insert message that you want to translate here..." style="font-family: monospace; white-space: nowrap; resize: none;"></textarea>
    </div>
  </div>

  <div style="padding-top: 16px;">
    <store-in-variable dropdownLabel="Store In" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></store-in-variable>
  </div>`;
  },

  init() {},

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
