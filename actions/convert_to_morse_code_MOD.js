module.exports = {
  name: 'Morse Code',
  section: 'Other Stuff',
  meta: {
    version: '2.1.7',
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

  html() {
    return `
<div style="width: 90%;">
  Text or Morse Code:<br>
  <input id="input" class="round" type="text">
</div>
<br>

<div style="padding-top: 8px; width: 60%;">
  Options:
  <select id="info" class="round">
    <option value="0" selected>Encode</option>
    <option value="1">Decode</option>
  </select>
</div>
<br>

<div style="padding-top: 8px;">
  <store-in-variable dropdownLabel="Store In" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></store-in-variable>
</div>`;
  },

  init() {},

  async action(cache) {
    const data = cache.actions[cache.index];
    const Mods = this.getMods();
    const morse = Mods.require('morse-decoder');
    const storage = parseInt(data.storage, 10);
    const info = parseInt(data.info, 10);
    const varName = this.evalMessage(data.varName, cache);
    const input = this.evalMessage(data.input, cache);
    let result;

    switch (info) {
      case 0:
        result = morse.encode(input);
        break;
      case 1:
        result = morse.decode(input);
        break;
      default:
        break;
    }
    this.storeValue(result, storage, varName, cache);
    this.callNextAction(cache);
  },

  mod() {},
};
