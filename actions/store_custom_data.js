module.exports = {
  name: 'Store Custom Data',
  section: 'Data',
  fields: ['filePath', 'valueName', 'jsonPath', 'varName', 'storage'],

  meta: {
    version: '2.1.2',
    preciseCheck: true,
    author: 'DBM Extended',
    authorUrl: 'https://github.com/DBM-Extended/mods',
    downloadURL: 'https://github.com/DBM-Extended/mods/tree/main/actions/store_custom_data.js',
  },

  subtitle(data) {
    const filepath = data.filePath;
    const filename = filepath !== '' ? filepath.split('/')[filepath.match(/[\/]/g).length] : '';
    const match = data.jsonPath.split('/')[data.jsonPath.split('.').length - 1];
    if (data.filePath !== '' && data.jsonPath !== '' && data.varName !== '') {
      return `Store <b>${match}</b> from <b>${filename}</b> to <b>${data.varName}</b>`;
    }

    if (data.filePath !== '' && data.dataField !== '' && data.varName === '') {
      return `Store <b>${match}</b> from <b>${filename}</b> but not to a variable`;
    }

    if (data.filePath === '') {
      return `File path is empty <b>( Error! )</b>`;
    }

    if (data.dataField === '') {
      return `Data field is empty <b>( Error! )</b>`;
    }
  },

  variableStorage(data, varType) {
    if (parseInt(data.storage, 10) !== varType) return;
    return [data.varName, 'Custom Data'];
  },

  html() {
    return `
    <div style="padding-bottom: 12px">
    <div style="width: 40%; float: left;">
      <span class="dbminputlabel">Path</span> <br>
      <input placeholder="./data/" value="./data/" id="filePath" class="round" type="text">
    </div>
    <!-- ----------------------------- -->
    <div style="width: 60%; float: left; padding-left: 5%;">
      <span class="dbminputlabel">JSON path</span> <br>
      <input id="jsonPath" class="round" type="text">
    </div>
    </div> <br><br><br>
    <!-- ----------------------------- -->
    </div>
    <store-in-variable allowNone selectId="storage" variableInputId="varName" variableContainerId="varNameContainer"></store-in-variable>
`;
  },

  init() {},

  async action(cache) {
    // DBM
    const data = cache.actions[cache.index];
    const Mods = this.getMods();
    const result = '';
    // Modules
    const fs = Mods.require('fs-extra');
    const path = Mods.require('path');
    // Datas
    const fpath = this.evalMessage(data.filePath, cache);
    let jsonPath = this.evalMessage(data.jsonPath, cache);
    const fileformat = path.extname(fpath);
    const split = jsonPath.split('/');

    for (let tt = 1; tt <= split.length - 1; tt++) {
      jsonPath = jsonPath.replace('/', '"]["');
    }

    jsonPath = jsonPath !== '' ? `json["${jsonPath}"]` : 'json';
    // Script
    try {
      if (fileformat === '.json') {
        const file = fs.readFileSync(fpath, 'utf8');
        const _json = JSON.parse(file);
        eval(`result = ${jsonPath}`);
      } else {
        console.error(`the file format should be .json!`);
      }
    } catch (e) {
      console.error(e);
    }

    const varName = this.evalMessage(data.varName, cache);
    const storage = parseInt(data.storage, 10);
    this.storeValue(result, storage, varName, cache);

    this.callNextAction(cache);
  },

  mod() {},
};
