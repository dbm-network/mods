module.exports = {
  name: 'Color',
  section: 'Tools',
  meta: {
    version: '2.1.7',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/color_tool_MOD.js',
  },

  subtitle(data) {
    return `${data.color}`;
  },

  variableStorage(data, varType) {
    if (parseInt(data.storage, 10) !== varType) return;
    return [data.varName, 'Color'];
  },

  fields: ['color', 'storage', 'varName'],

  html() {
    return `
Color:<br>
<input type="color" id="color"><br><br>
<div>
  <store-in-variable dropdownLabel="Store In" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></store-in-variable>
</div>`;
  },

  init() {},

  async action(cache) {
    const data = cache.actions[cache.index];
    const color = this.evalMessage(data.color, cache);

    if (color !== undefined) {
      const storage = parseInt(data.storage, 10);
      const varName = this.evalMessage(data.varName, cache);
      this.storeValue(color, storage, varName, cache);
    }
    this.callNextAction(cache);
  },

  mod() {},
};
