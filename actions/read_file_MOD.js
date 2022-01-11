module.exports = {
  name: 'Read File',
  section: 'File Stuff',
  meta: {
    version: '2.0.11',
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

  html(_isEvent, data) {
    return `
<div>
  <div style="float: left; width: 60%">
    Path:
    <input id="filename" class="round" type="text">
  </div><br>
</div><br><br><br>
<div>
  <div style="float: left; width: 35%;">
    Store In:<br>
    <select id="storage" class="round">
      ${data.variables[1]}
    </select>
  </div>
  <div id="varNameContainer2" style="float: right; width: 60%;">
    Variable Name:<br>
    <input id="varName2" class="round" type="text"><br>
  </div>
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
        this.storeValue(output, parseInt(data.storage, 10), this.evalMessage(data.varName2, cache), cache);
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
