module.exports = {
  name: 'Store Global Data',
  section: 'Data',
  meta: {
    version: '2.1.7',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/store_global_data_MOD.js',
  },

  subtitle(data, presets) {
    return presets.getVariableText(data.storage, data.varName);
  },

  variableStorage(data, varType) {
    if (parseInt(data.storage, 10) !== varType) return;
    return [data.varName, 'Unknown Type'];
  },

  fields: ['dataName', 'defaultVal', 'storage', 'varName'],

  html() {
    return `
<div style="padding-top: 8px;">
  <div style="float: left; width: 100%;">
    <span class="dbminputlabel">Data Name</span><br>
    <input id="dataName" class="round" type="text">
  </div>
</div>
<br><br><br>

<div style="padding-top: 8px;">
  <div style="float: left; width: 100%;">
  <span class="dbminputlabel">Default Value (if data doesn't exist)</span><br>
    <input id="defaultVal" class="round" type="text" value="0">
  </div>
</div>
<br><br><br>

<div style="padding-top: 8px;">
  <store-in-variable dropdownLabel="Store In" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></store-in-variable>
</div>`;
  },

  init() {},

  async action(cache) {
    const data = cache.actions[cache.index];
    const dataName = this.evalMessage(data.dataName, cache);
    const defVal = this.eval(this.evalMessage(data.defaultVal, cache), cache);
    const { Globals } = this.getDBM();
    const result = Globals.data(dataName, defVal);
    const storage = parseInt(data.storage, 10);
    const varName = this.evalMessage(data.varName, cache);
    this.storeValue(result, storage, varName, cache);
    this.callNextAction(cache);
  },

  mod() {},
};
