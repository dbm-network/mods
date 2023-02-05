module.exports = {
  name: 'Store Regex Matched Variable',
  section: 'Variable Things',
  meta: {
    version: '2.1.6',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/store_regex_matched_variable_MOD.js',
  },

  subtitle(data) {
    const storage = ['', 'Temp Variable', 'Server Variable', 'Global Variable'];
    return ` (${data.typeVariable}) ~Var: ${storage[parseInt(data.storage, 10)]} (${data.varName})`;
  },

  variableStorage(data, varType) {
    if (parseInt(data.storage, 10) !== varType) return;
    return [data.varName, 'Unknown Type'];
  },

  fields: ['behavior', 'inputStorage', 'inputVarName', 'theType', 'typeVariable', 'storage', 'varName'],

  html(_isEvent, data) {
    return `
<div id ="wrexdiv" style="width: 550px; height: 350px; overflow-y: scroll;">
  <div>
    <div style="float: left; width: 95%;">
      End Behavior:<br>
      <select id="behavior" class="round">
        <option value="0" selected>Call Next Action Automatically</option>
        <option value="1">Do Not Call Next Action</option>
      </select>
      <br>
    </div>
    <div>
      <div style="float: left; width: 30%;">
        Input Variable:<br>
        <select id="inputStorage" class="round" onchange="glob.variableChange(this, 'inputVarNameContainer')">
          ${data.variables[1]}
        </select>
      </div>
      <div id="inputVarNameContainer" style="display: ; float: right; width: 60%;">
        Input Variable Name:<br>
        <input id="inputVarName" class="round" type="text">
      </div>
    </div>
    <div>
      <div style="float: left; width: 30%;">
        <br>Type:<br>
        <select id="theType" class="round">
          <option value="0" selected>Regex Match</option>
          <option value="1" >Regex Replace</option>
        </select>
      </div>
      <div id="typeContainer" style="display: ; float: right; width: 60%;">
        <br>Match: (Regex Builder)<a href="#" onclick="require('child_process').execSync('start https://regexr.com')">regexr.com</a>
        <input id="typeVariable" class="round" type="text">
      </div>
    </div>
    <div>
      <div style="float: left; width: 30%;"><br><br>
        Store In:<br>
        <select id="storage" class="round" onchange="glob.variableChange(this, 'varNameContainer')">
          ${data.variables[1]}
        </select>
      </div>
      <div id="varNameContainer" style="display: ; float: right; width: 60%;"><br><br>
        Variable Name:<br>
        <input id="varName" class="round" type="text">
      </div>
    </div>
  </div>
</div>`;
  },

  init() {
    const { glob, document } = this;
    glob.variableChange(document.getElementById('inputStorage'), 'inputVarNameContainer');
    glob.variableChange(document.getElementById('storage'), 'varNameContainer');
  },

  async action(cache) {
    const data = cache.actions[cache.index];

    const inputStorage = parseInt(data.inputStorage, 10);
    const storage = parseInt(data.storage, 10);
    const type = parseInt(data.theType, 10);

    const inputVarName = this.evalMessage(data.inputVarName, cache);
    const typeVariable = this.evalMessage(data.typeVariable, cache);
    const varName = this.evalMessage(data.varName, cache);

    const inputData = this.getVariable(inputStorage, inputVarName, cache);

    if (inputData) {
      let regex;
      let outputData;
      let jsonData;
      switch (type) {
        case 0:
          try {
            if (typeVariable) {
              regex = new RegExp(typeVariable, 'i');
              if (regex.test(inputData)) {
                outputData = inputData.match(regex);
                if (outputData) {
                  jsonData = JSON.stringify(outputData);
                  this.storeValue(this.eval(jsonData, cache), storage, varName, cache);
                }
              } else {
                console.log(`Store Regex Match: Invalid Regex: (RegEx String: ${typeVariable})`);
                this.storeValue(this.eval(outputData, cache), storage, varName, cache);
              }
            }
          } catch (error) {
            console.error(`Store Regex Match: Error ${error}`);
          }
          break;
        case 1:
          try {
            if (typeVariable) {
              regex = new RegExp(typeVariable, 'g');
              if (inputData) {
                outputData = inputData.replace(regex, typeVariable);
                if (outputData) {
                  jsonData = JSON.stringify(outputData);
                  this.storeValue(this.eval(jsonData, cache), storage, varName, cache);
                }
              }
            }
          } catch (error) {
            console.error(`Store Regex Match: Error ${error}`);
          }
          break;
      }
    }

    if (data.behavior === '0') {
      this.callNextAction(cache);
    }
  },

  mod() {},
};
