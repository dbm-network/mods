module.exports = {
  name: 'Store Regex Matched Variable',
  section: 'Variable Things',
  meta: {
    version: '2.1.7',
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

  html() {
    return `
<div id ="wrexdiv" style="height: 350px; overflow-y: scroll;">
  <div>
    <div style="float: left; width: 100%; padding-top: 16px;">
      <span class="dbminputlabel">End Behavior</span>
      <select id="behavior" class="round">
        <option value="0" selected>Call Next Action Automatically</option>
        <option value="1">Do Not Call Next Action</option>
      </select>
    </div>
    <br><br><br>

    <div style="float: left; padding-top: 16px; width: 100%;">
      <store-in-variable dropdownLabel="Input Variable" selectId="inputStorage" variableContainerId="inputVarNameContainer" variableInputId="inputVarName"></store-in-variable>
    </div>
    <br><br><br>

    <div style="width: 100%;">
      <div style="float: left; width: 35%; padding-top: 16px;">
        <span class="dbminputlabel">Type</span>
        <select id="theType" class="round">
          <option value="0" selected>Regex Match</option>
          <option value="1" >Regex Replace</option>
        </select>
      </div>
      <div id="typeContainer" style="float: right; width: 60%; padding-top: 16px;">
        <span class="dbminputlabel">Match: (Regex Builder)<a href="#" onclick="require('child_process').execSync('start https://regexr.com')">regexr.com</a></span>
        <input id="typeVariable" class="round" type="text">
      </div>
    </div>
    <br><br><br>

    <div style="float: left; padding-top: 16px; width: 100%;">
      <store-in-variable dropdownLabel="Store In" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></store-in-variable>
    </div>
  </div>
</div>`;
  },

  init() {},

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
