module.exports = {
  name: 'Generate Random Hex Color',
  section: 'Other Stuff',
  meta: {
    version: '2.1.6',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/generate_random_hex_MOD.js',
  },

  subtitle() {
    return 'Generates random hex color code';
  },

  variableStorage(data, varType) {
    if (parseInt(data.storage, 10) !== varType) return;
    return [data.varName, 'Color Code'];
  },

  fields: ['storage', 'varName'],

  html(_isEvent, data) {
    return `
<div>
  <div style="float: left; width: 35%;">
    Store In:<br>
    <select id="storage" class="round" onchange="glob.variableChange(this, 'varNameContainer')">
      ${data.variables[0]}
    </select>
  </div>
  <div id="varNameContainer" style="display: none; float: right; width: 60%;">
    Variable Name:<br>
    <input id="varName" class="round" type="text">
  </div>
</div>`;
  },

  init() {
    const { glob, document } = this;

    glob.variableChange(document.getElementById('storage'), 'varNameContainer');
  },

  async action(cache) {
    const data = cache.actions[cache.index];
    const type = parseInt(data.storage, 10);
    const varName = this.evalMessage(data.varName, cache);

    const code = '000000'.replace(/0/g, () => (~~(Math.random() * 16)).toString(16));
    this.storeValue(`#${code}`, type, varName, cache);
    this.callNextAction(cache);
  },
  mod() {},
};
