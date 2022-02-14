module.exports = {
  name: 'Convert Variable',
  section: 'Variable Things',
  meta: {
    version: '2.0.11',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/convert_variable_MOD.js',
  },

  subtitle(data) {
    const info = [
      'Number (Parsing Int)',
      'Number (Parsing Float)',
      'String',
      'Uppercased String',
      'Lowercased String',
      'Number (Int)',
      'Number (Float)',
    ];
    return `Conversion Type: ${info[parseInt(data.conversion, 10)]}`;
  },

  variableStorage(data, varType) {
    const info2 = ['Number', 'Number', 'String', 'String', 'String', 'Number', 'Number'];
    if (parseInt(data.storage2, 10) !== varType) return;
    return [data.varName2, info2[parseInt(data.conversion, 10)]];
  },

  fields: ['storage', 'varName', 'conversion', 'storage2', 'varName2'],

  html(isEvent, data) {
    return `
<div>
  <div style="float: left; width: 35%;">
    Source Variable:<br>
    <select id="storage" class="round" onchange="glob.refreshVariableList(this)">
      ${data.variables[1]}
    </select>
  </div>
  <div id="varNameContainer" style="float: right; width: 60%;">
    Variable Name:<br>
    <input id="varName" class="round" type="text" list="variableList">
  </div>
</div><br><br><br>
<div>
  <div style="padding-top: 8px; width: 35%;">
    Conversion Type:<br>
    <select id="conversion" class="round">
      <option value="0" selected>Number (Parsing Int)</option>
      <option value="1">Number (Parsing Float)</option>
      <option value="2">String</option>
      <option value="3">Uppercased String</option>
      <option value="4">Lowercased String</option>
      <option value="5">Number (Int)</option>
      <option value="6">Number (Float)</option>
    </select>
  </div>
</div><br>
<div>
  <div style="float: left; width: 35%;">
    Store In:<br>
    <select id="storage2" class="round">
      ${data.variables[1]}
    </select>
  </div>
  <div id="varNameContainer2" style="float: right; width: 60%;">
    Variable Name:<br>
    <input id="varName2" class="round" type="text"><br>
  </div>
</div>
<style>
  /* My Embed CSS code */
  .embed {
    position: relative;
  }
  .embedinfo {
    background: rgba(46,48,54,.45) fixed;
    border: 1px solid hsla(0,0%,80%,.3);
    padding: 10px;
    margin:0 4px 0 7px;
    border-radius: 0 3px 3px 0;
  }
  embedleftline {
    background-color: #eee;
    width: 4px;
    border-radius: 3px 0 0 3px;
    border: 0;
    height: 100%;
    margin-left: 4px;
    position: absolute;
  }
  span {
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  }
  span.embed-auth {
    color: rgb(255, 255, 255);

  }
  span.embed-desc {
    color: rgb(128, 128, 128);
  }
</style>`;
  },

  init() {
    const { glob, document } = this;
    glob.refreshVariableList(document.getElementById('storage'));
  },

  async action(cache) {
    const data = cache.actions[cache.index];

    const storage = parseInt(data.storage, 10);
    const varName = this.evalMessage(data.varName, cache);
    const variable = this.getVariable(storage, varName, cache);
    const conversion = parseInt(data.conversion, 10);

    let result;

    switch (conversion) {
      case 0:
        result = parseInt(variable, 10);
        break;
      case 1:
        result = parseFloat(variable);
        break;
      case 2:
        result = variable.toString();
        break;
      case 3:
        result = variable.toString().toUpperCase();
        break;
      case 4:
        result = variable.toString().toLowerCase();
        break;
      case 5:
        result = parseInt(Number(variable), 10);
        break;
      case 6:
        result = Number(variable);
        break;
      default:
        break;
    }

    if (result !== undefined) {
      const storage2 = parseInt(data.storage2, 10);
      const varName2 = this.evalMessage(data.varName2, cache);
      this.storeValue(result, storage2, varName2, cache);
    }
    this.callNextAction(cache);
  },

  mod() {},
};
