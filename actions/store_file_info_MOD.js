module.exports = {
  name: 'Store File Info',
  section: 'File Stuff',
  meta: {
    version: '2.0.11',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/store_file_info_MOD.js',
  },

  subtitle(data) {
    return `Store File Info - ${data.info}`;
  },

  fields: ['filePath', 'info', 'storage', 'varName'],

  variableStorage(data, varType) {
    let dataType = 'Unknown type';
    switch (parseInt(data.info, 10)) {
      case 0:
      case 2:
        dataType = 'Number';
        break;
      case 1:
      case 5:
      case 6:
        dataType = 'String';
        break;
      case 3:
        dataType = 'Timestamp';
        break;
      case 4:
        dataType = 'Boolean';
        break;
    }
    if (parseInt(data.storage, 10) !== varType) return;
    return [data.varName, dataType];
  },

  html(_isEvent, data) {
    return `
File path (example: <strong>./bot.js</strong>):
<input class='round' id='filePath' /><br>
Info:
<select class='round' id='info'>
  <option value='0' selected>File Size</option>
  <option value='1'>File Extension</option>
  <option value='2'>File Character Count</option>
  <option value='3'>File Creation Date Timestamp</option>
  <option value='4'>File Exists</option>
  <option value='5'>File Content</option>
  <option value='6'>File Name</option>
</select><br>
Store in:<br>
<select class='round' id='storage'>
  ${data.variables[0]}
</select><br>
Variable name:<br>
<input class='round' id='varName' />`;
  },

  init() {},

  async action(cache) {
    const data = cache.actions[cache.index];
    const storage = parseInt(data.storage, 10);
    const { info } = data;
    const path = require('path');
    const fs = require('fs');
    const varName = this.evalMessage(data.varName, cache);
    const filePath = this.evalMessage(data.filePath, cache);

    if (!filePath) return this.displayError('Insert a file path!');

    let result;
    switch (info) {
      case 0:
        result = fs.statSync(filePath).size;
        break;
      case 1:
        result = path.extname(/[^/]*$/.exec(filePath)[0]);
        break;
      case 2:
        result = fs.readFileSync(filePath).toString().length;
        break;
      case 3:
        result = fs.statSync(filePath).mtimeMs;
        break;
      case 4:
        result = fs.existsSync(filePath);
        break;
      case 5:
        result = fs.readFileSync(filePath).toString();
        break;
      case 6:
        result = path.basename(filePath);
        break;
    }
    this.storeValue(result, storage, varName, cache);
    this.callNextAction(cache);
  },

  mod() {},
};
