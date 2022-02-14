module.exports = {
  name: 'Morse Code',
  section: 'Other Stuff',
  meta: {
    version: '2.0.11',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/convert_to_morse_code_MOD.js',
  },

  subtitle() {
    return 'Convert To Morse Code';
  },

  variableStorage(data, varType) {
    if (parseInt(data.storage, 10) !== varType) return;
    return [data.varName, 'Morse Code'];
  },

  fields: ['input', 'info', 'storage', 'varName'],

  html(_isEvent, data) {
    return `
<div style="width: 90%;">
  Text or Morse Code:<br>
  <input id="input" class="round" type="text">
</div><br>
<div style="padding-top: 8px; width: 60%;">
  Options:
  <select id="info" class="round">
    <option value="0" selected>Encode</option>
    <option value="1">Decode</option>
  </select>
</div><br>
<div style="padding-top: 8px;">
  <div style="float: left; width: 35%;">
    Store In:<br>
    <select id="storage" class="round">
      ${data.variables[1]}
    </select>
  </div>
  <div id="varNameContainer" style="float: right; width: 60%;">
    Variable Name:<br>
    <input id="varName" class="round" type="text">
  </div>
</div>`;
  },

  init() {},

  async action(cache) {
    const data = cache.actions[cache.index];
    const Mods = this.getMods();
    const morsify = Mods.require('morsify');
    const storage = parseInt(data.storage, 10);
    const info = parseInt(data.info, 10);
    const varName = this.evalMessage(data.varName, cache);
    const input = this.evalMessage(data.input, cache);
    let result;

    switch (info) {
      case 0:
        result = morsify.encode(input);
        break;
      case 1:
        result = morsify.decode(input);
        break;
      default:
        break;
    }
    this.storeValue(result, storage, varName, cache);
    this.callNextAction(cache);
  },

  mod() {},
};
