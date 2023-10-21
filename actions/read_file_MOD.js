module.exports = {
  name: 'Read File',
  section: 'File Stuff',
  meta: {
    version: '2.2.0',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/read_file_MOD.js',
  },

  subtitle(data) {
    return `Read File "${data.filename}"`;
  },

  variableStorage(data, varType) {
    if (parseInt(data.storage, 10) !== varType) return;
    return [data.varName2, 'File'];
  },

  fields: ['filename', 'storage', 'varName2'],

  html() {
    return `
  <div>
    <span class="dbminputlabel">Path</span>
    <input id="filename" class="round" type="text">
  </div>
  <br>

  <div>
    <store-in-variable dropdownLabel="Store In" selectId="storage" variableContainerId="varNameContainer2" variableInputId="varName2"></store-in-variable>
  </div>`;
  },

  init() {},

  async action(cache) {
    const data = cache.actions[cache.index];
    const { readFileSync } = require('fs');
    const path = this.evalMessage(data.filename, cache);
    try {
      if (path) {
        const output = readFileSync(path, 'utf8');
        const storage = parseInt(data.storage, 10);
        const varName2 = this.evalMessage(data.varName2, cache);
        this.storeValue(output, storage, varName2, cache);
      } else {
        console.log('File path is missing from read file mod!');
      }
    } catch (err) {
      console.error(`ERROR! ${err.stack || err}`);
    }
    this.callNextAction(cache);
  },

  mod() {},
};
