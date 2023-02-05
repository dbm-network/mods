module.exports = {
  name: 'Convert Text to List',
  section: 'Lists and Loops',
  meta: {
    version: '2.1.6',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/convert_text_to_list_MOD.js',
  },

  subtitle(data) {
    const storeTypes = ['', 'Temp Variable', 'Server Variable', 'Global Variable'];
    return `Convert Text ${storeTypes[parseInt(data.storage, 10)]} (${data.varName}) to List ${
      storeTypes[parseInt(data.storage2, 10)]
    } (${data.varName2})`;
  },

  variableStorage(data, varType) {
    if (parseInt(data.storage, 10) !== varType) return;
    return [data.varName2, 'List'];
  },

  fields: ['storage', 'varName', 'separator', 'storage2', 'varName2'],

  html(isEvent, data) {
    return `
<div>
  <div style="float: left; width: 35%;">
    Source Text:<br>
    <select id="storage" class="round" onchange="glob.refreshVariableList(this)">
      ${data.variables[1]}
    </select><br>
  </div>
  <div id="varNameContainer" style="float: right; width: 60%;">
    Variable Name:<br>
    <input id="varName" class="round" type="text" list="variableList"><br>
  </div>
</div><br><br><br>
<div style="display: table; width: 105%;">
  <div style="display: table-cell;">
    Separator:
    <input id="separator" class="round" type="text">
  </div>
</div><br>
<div style="padding-top: 8px;">
  <div style="float: left; width: 35%;">
    Store In:<br>
    <select id="storage2" class="round">
      ${data.variables[1]}
    </select>
  </div>
  <div style="float: right; width: 60%;">
    Variable Name:<br>
    <input id="varName2" class="round" type="text">
  </div>
</div>`;
  },

  init() {
    const { glob, document } = this;
    glob.refreshVariableList(document.getElementById('storage'));
  },

  async action(cache) {
    const data = cache.actions[cache.index];
    const storage = parseInt(data.storage, 10);
    const varName = this.evalMessage(data.varName, cache);
    const text = this.getVariable(storage, varName, cache);
    const separator = this.evalMessage(data.separator, cache);
    const params = text.split(new RegExp(separator));

    const storage2 = parseInt(data.storage2, 10);
    const varName2 = this.evalMessage(data.varName2, cache);
    this.storeValue(params, storage2, varName2, cache);

    this.callNextAction(cache);
  },

  mod() {},
};
