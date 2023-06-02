module.exports = {
  name: 'Loop through Folder',
  section: 'Lists and Loops',
  meta: {
    version: '2.2.0',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/loop_through_folder_MOD.js',
  },

  subtitle() {
    return 'Loops through folder, and turns filenames into array';
  },

  variableStorage(data, varType) {
    if (parseInt(data.storage, 10) !== varType) return;
    return [data.varName2, 'Array'];
  },

  fields: ['filename', 'storage', 'varName2'],

  html() {
    return `
<div>
  <p>
    <u>Notice:</u><br>
    - The folder needs to be in the bot folder!<br>
    - This is a good path: ./resources/images<br>
    - This will turn all filenames in the folder into an array.<br>
  </p>
  <div style="float: left; width: 60%">
    <span class="dbminputlabel">Folder Path</span>
    <input id="filename" class="round" type="text">
  </div><br>
</div>
<br><br><br>

<div>
  <store-in-variable dropdownLabel="Store In" selectId="storage" variableContainerId="varNameContainer2" variableInputId="varName2"></store-in-variable>
</div>`;
  },

  init() {},

  async action(cache) {
    const data = cache.actions[cache.index];
    const path = this.evalMessage(data.filename, cache);
    const { readdirSync } = require('fs');
    let output = {};

    try {
      if (path) {
        output = readdirSync(path);
        this.storeValue(output, parseInt(data.storage, 10), this.evalMessage(data.varName2, cache), cache);
      } else {
        console.log('Loop Through Folder: Path is missing.');
      }
    } catch (err) {
      console.error(`Error: ${err.stack || err}`);
    }
    this.callNextAction(cache);
  },

  mod() {},
};
