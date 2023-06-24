module.exports = {
  name: 'Convert Text to List',
  section: 'Lists and Loops',
  meta: {
    version: '2.1.7',
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

  html() {
    return `
<div>
  <retrieve-from-variable dropdownLabel="Source Text" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></retrieve-from-variable>
</div>
<br><br><br>

<div style="padding-top: 8px;">
  <span class="dbminputlabel">Separator</span>
  <input id="separator" class="round" type="text">
</div>
<br>

<div style="padding-top: 8px;">
  <store-in-variable dropdownLabel="Store In" selectId="storage2" variableContainerId="varNameContainer2" variableInputId="varName2"></store-in-variable>
</div>`;
  },

  init() {},

  async action(cache) {
    const data = cache.actions[cache.index];
    const storage = parseInt(data.storage, 10);
    const varName = this.evalMessage(data.varName, cache);
    const text = this.getVariable(storage, varName, cache);
    const separator = this.evalMessage(data.separator, cache);

    const list = [];
    const params = text.split(new RegExp(separator));
    params.forEach((i) => list.push(i.replace(/\r/g, '')));

    const storage2 = parseInt(data.storage2, 10);
    const varName2 = this.evalMessage(data.varName2, cache);
    this.storeValue(list, storage2, varName2, cache);

    this.callNextAction(cache);
  },

  mod() {},
};
