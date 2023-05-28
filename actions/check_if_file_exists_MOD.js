module.exports = {
  name: 'Check if File Exists',
  section: 'File Stuff',
  meta: {
    version: '2.1.7',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/check_if_file_exists_MOD.js',
  },

  subtitle(data, presets) {
    return `${presets.getConditionsText(data)}`;
  },

  fields: ['filename', 'branch'],

  html() {
    return `
<div style="float: left; width: 60%">
  <span class="dbminputlabel">Path</span>
  <input id="filename" class="round" type="text">
</div>
<br><br><br>

<conditional-input id="branch" style="padding-top: 8px;"></conditional-input>`;
  },

  init() {},

  async action(cache) {
    const data = cache.actions[cache.index];
    const fs = require('fs');
    const path = this.evalMessage(data.filename, cache);
    let result;

    if (path) result = fs.existsSync(path);
    else console.log('Path is missing in Check if File Exists.');

    this.executeResults(result, data?.branch ?? data, cache);
  },

  modInit(data) {
    this.prepareActions(data.branch?.iftrueActions);
    this.prepareActions(data.branch?.iffalseActions);
  },

  mod() {},
};
