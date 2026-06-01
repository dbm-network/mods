module.exports = {
  name: 'Create Custom Data File',
  section: 'Data',
  fields: ['filePath', 'fileName', 'varName', 'storage'],

  meta: {
    version: '2.1.2',
    preciseCheck: true,
    author: 'DBM Extended',
    authorUrl: 'https://github.com/DBM-Extended/mods',
    downloadURL: 'https://github.com/DBM-Extended/mods/tree/main/actions/create_custom_data.js',
  },

  subtitle(data) {
    if (data.filePath && data.fileName) {
      return `Create ${data.filePath}${data.fileName}.json`;
    }
    return `Nothing to create (error)`;
  },

  variableStorage(data, varType) {
    if (data.filePath && data.fileName) {
      if (parseInt(data.storage, 10) !== varType) return;
      return [data.varName, 'Data Path'];
    }
  },

  html() {
    return `
    <div style="padding-bottom: 12px">
      <div style="width: 40%; float: left;">
          <span class="dbminputlabel">Path</span><br>
          <input placeholder="./data/" value="./data/" id="filePath" class="round" type="text">
      </div>
      <div style="width: 60%; float: left; padding-left:5%; ">
        <span class="dbminputlabel">Name</span><br>
        <input placeholder="Myrealycoolcustomdata" id="fileName" class="round" type="text">
      </div>
    </div><br><br><br>

    <store-in-variable allowNone selectId="storage" variableInputId="varName" variableContainerId="varNameContainer"></store-in-variable>
    `;
  },

  init() {},

  async action(cache) {
    const data = cache.actions[cache.index];
    const Mods = this.getMods();
    const fs = Mods.require('fs-extra');

    const result =
      data.filePath && data.fileName ? `${data.filePath}${data.fileName}.json` : `Nothing to create (error)`;
    const varName = this.evalMessage(data.varName, cache);
    const storage = parseInt(data.storage, 10);
    this.storeValue(result, storage, varName, cache);

    if (data.filePath && data.fileName) {
      fs.pathExistsSync(`${data.filePath}/${data.fileName}.json`)
        ? console.log('File already exists!')
        : fs.writeFileSync(`${data.filePath}/${data.fileName}.json`, '{}');
    }

    this.callNextAction(cache);
  },

  mod() {},
};
