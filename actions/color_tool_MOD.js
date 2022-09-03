module.exports = {
  name: 'Color',
  section: 'Tools',
  meta: {
    version: '2.1.6',
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

  html(isEvent, data) {
    return `
Color:<br>
<input type="color" id="color"><br><br>
<div>
  <div style="float: left; width: 35%;">
    Store In:<br>
    <select id="storage" class="round">
      ${data.variables[1]}
    </select>
  </div>
  <div id="varNameContainer" style="float: right; width: 60%;">
    Variable Name:<br>
    <input id="varName" class="round" type="text"><br>
  </div>
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
