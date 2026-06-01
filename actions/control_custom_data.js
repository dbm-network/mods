module.exports = {
  name: 'Control Custom Data',
  section: 'Data',
  fields: ['filePath', 'task', 'type', 'valueName', 'value', 'jsonPath', 'varName', 'storage'],

  meta: {
    version: '2.1.2',
    preciseCheck: true,
    author: 'DBM Extended',
    authorUrl: 'https://github.com/DBM-Extended/mods',
    downloadURL: 'https://github.com/DBM-Extended/mods/tree/main/actions/control_custom_data.js',
  },

  subtitle(data) {
    let task = '';
    let type2 = '';
    const filename = data.filePath !== '' ? data.filePath.split('/')[data.filePath.match(/[\/]/g).length] : '';
    const valuename = data.valueName;
    const nam = data.jsonPath ? data.jsonPath.split('/')[data.jsonPath.split('/').length - 1] : '';
    const val = data.type === 'value' ? ` to <b>${data.value}</b>` : '';
    const valName = data.task !== 'add' ? valuename : nam;

    if (data.type === 'array') {
      type2 = 'n array';
    } else if (data.type === 'object') {
      type2 = 'n object';
    } else type2 = ' value';

    if (data.task === 'create') {
      task = 'Create / Edit a';
    } else if (data.task === 'delete') {
      task = 'Delete a';
    } else task = `Add <b>${data.valueName}</b> to a`;

    if (filename === '') {
      return `The file path is empty <b>(Error!)</b>`;
    }

    if (data.valueName === '') {
      return `The value name is empty <b>(Error!)</b>`;
    }

    if (filename !== '' && data.valueName !== '') {
      return `${task}${type2} <b>${valName}</b>${val} in <b>${filename}</b>`;
    }

    return `Ignore this message :3`;
  },

  variableStorage(data, varType) {
    if (parseInt(data.storage, 10) !== varType) return;
    return [data.varName, 'Custom Data JSON'];
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
    </div><br>
  </div> <br><br>
  <!-- ----------------------------- -->
  <div style="padding-bottom: 12px">
    <div style="width: 50%; float: left;">
      <span class="dbminputlabel">Task</span> <br>
      <select id="task" class="round" onchange="glob.onDelete(this)">
        <option value="create" selected>Create / Edit</option>
        <option value="add" selected>Add an item</option>
        <option value="delete">Delete</option>
      </select>
    </div>
  <!-- ----------------------------- -->
    <div style="width: 50%; float: left; padding-left:5%;">
      <span class="dbminputlabel">Type</span> <br>
      <select id="type" class="round" onchange="glob.onArray(this)">
        <option value="array" selected>Array</option>
        <option value="value">Value</option>
        <option value="object">Object</option>
      </select>
    </div> <br><br><br>
  <!-- ----------------------------- -->
  <div style="padding-top: 12px;">
    <div style="width: 50%; float: left;" id="divname">
      <span class="dbminputlabel">Name</span> <br>
      <input id="valueName" placeholder="Gems" class="round" type="text">
    </div>
  <!-- ----------------------------- -->
    <div style="width: 50%; float: left; padding-left: 5%;" id="divalue">
      <span class="dbminputlabel">Value</span> <br>
      <input id="value" placeholder="2 or '2'" class="round" type="text">
    </div>
  </div>
  <!-- ----------------------------- -->
  </div> <br><br><br>
  <store-in-variable allowNone selectId="storage" variableInputId="varName" variableContainerId="varNameContainer"></store-in-variable>
`;
  },

  init() {
    const { glob, document } = this;

    glob.onArray = function (event) {
      if (event.value === 'array' || 'object') {
        document.getElementById('divalue').style.display = 'none';
        document.getElementById('divname').style.width = '100%';
      } else {
        document.getElementById('divalue').style.display = null;
        document.getElementById('divname').style.width = '50%';
      }
    };

    glob.onArray(document.getElementById('type'));

    glob.onDelete = function (event) {
      if (event.value === 'delete') {
        document.getElementById('divalue').style.display = 'none';
        document.getElementById('divname').style.width = '100%';
      } else {
        document.getElementById('divalue').style.display = null;
        document.getElementById('divname').style.width = '50%';
      }
    };

    glob.onDelete(document.getElementById('task'));
  },

  async action(cache) {
    // DBM
    const data = cache.actions[cache.index];
    const Mods = this.getMods();
    // Modules
    const fs = Mods.require('fs-extra');
    const path = Mods.require('path');
    // Datas
    const fpath = this.evalMessage(data.filePath, cache);
    const valueName = this.evalMessage(data.valueName, cache);
    const task = data.task;
    const type = data.type;
    const value = this.evalMessage(data.value, cache) ? this.evalMessage(data.value, cache) : false;
    let jsonPath = this.evalMessage(data.jsonPath, cache);
    // Other
    const fileformat = path.extname(fpath);
    const split = jsonPath.split('/');
    let file = ''; //
    let json = ''; //

    for (let tt = 1; tt <= split.length - 1; tt++) {
      jsonPath = jsonPath.replace('/', '"]["');
    }

    jsonPath = jsonPath !== '' ? `json["${jsonPath}"]` : 'json';

    // Script
    if (fileformat === '.json') {
      // Checking for file format

      try {
        // Executing the script safely

        // Reading the file
        file = fs.readFileSync(fpath, 'utf8');
        json = JSON.parse(file);

        // Create Value
        if (task === 'create' && type === 'value') {
          eval(`${jsonPath}["${valueName}"] = ${value}`);
          fs.writeFileSync(fpath, JSON.stringify(json, undefined, 4));
        }

        // Create Object
        if (task === 'create' && type === 'object') {
          eval(`${jsonPath}["${valueName}"] = {}`);
          fs.writeFileSync(fpath, JSON.stringify(json, undefined, 4));
        }

        // Create Array
        if (task === 'create' && type === 'array') {
          eval(`${jsonPath}["${valueName}"] = []`);
          fs.writeFileSync(fpath, JSON.stringify(json, undefined, 4));
        }

        // Add Array
        if (task === 'add' && type === 'array') {
          eval(`${jsonPath}.push("${valueName}")`);
          fs.writeFileSync(fpath, JSON.stringify(json, undefined, 4));
        }

        // Delete All
        if (task === 'delete') {
          eval(`delete ${jsonPath}["${valueName}"]`);
          fs.writeFileSync(fpath, JSON.stringify(json, undefined, 4));
        }
      } catch (err) {
        // Error!
        if (err.message.includes('no such file or directory')) {
          console.log(`Error: no such file or directory, open '${fpath}'`);
        } else {
          console.log(err);
        }
      }
    } else {
      // If the format is different, output an error
      console.log(`The file format should be JSON Not ${fileformat !== '' ? `'${fileformat}'` : 'empty'}!!!`);
    }

    const varName = this.evalMessage(data.varName, cache);
    const storage = parseInt(data.storage, 10);
    this.storeValue(json, storage, varName, cache);

    this.callNextAction(cache);
  },

  mod() {},
};
