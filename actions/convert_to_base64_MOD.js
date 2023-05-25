module.exports = {
  name: 'Convert to Base64',
  section: 'Other Stuff',
  meta: {
    version: '2.1.7',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/convert_to_base64_MOD.js',
  },

  subtitle() {
    return 'Convert To Base64';
  },

  variableStorage(data, varType) {
    if (parseInt(data.storage, 10) !== varType) return;
    return [data.varName, 'String'];
  },

  fields: ['input', 'info', 'storage', 'varName'],

  html() {
    return `
    <div style="float: left; width: 100%">
      <div style="float: left; width: 50%;">
        <span class="dbminputlabel">Options</span>
        <select id="info" class="round">
          <option value="0" selected>Encode</option>
          <option value="1">Decode</option>
        </select>
      </div>
      <div style="float: right; width: 50%; padding-left: 10px;">
        <span class="dbminputlabel">Text or Morse Code</span>
        <input id="input" class="round" type="text"">
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
    const storage = parseInt(data.storage, 10);
    const info = parseInt(data.info, 10);
    const varName = this.evalMessage(data.varName, cache);
    const input = this.evalMessage(data.input, cache);
    let result;

    switch (info) {
      case 0:
        result = Buffer.from(input).toString('base64');
        break;
      case 1:
        result = Buffer.from(input, 'base64').toString();
        break;
      default:
        break;
    }
    this.storeValue(result, storage, varName, cache);
    this.callNextAction(cache);
  },

  mod() {},
};
