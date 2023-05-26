module.exports = {
  name: 'Split',
  section: 'Other Stuff',
  meta: {
    version: '2.1.7',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/split_MOD.js',
  },

  subtitle() {
    return 'Split anything!';
  },

  variableStorage(data, varType) {
    if (parseInt(data.storage, 10) !== varType) return;
    return [data.varName, 'String'];
  },

  fields: ['split', 'spliton', 'storage', 'varName'],

  html() {
    return `
<div id ="wrexdiv" style="width: 550px; height: 350px; overflow-y: scroll;">
  <div style="padding-top: 8px;">
    <span class="dbminputlabel">Split Text</span><br>
    <textarea id="split" rows="2" placeholder="Insert text here..." style="width: 99%; font-family: monospace; white-space: nowrap; resize: none;"></textarea>
  </div>
  <br>
  <div style="float: left; width: 45%; padding-top: 8px;">
    <span class="dbminputlabel">Split On</span><br>
    <input id="spliton" class="round" type="text">
  </div>
  <br><br><br><br>

  <div>
    <store-in-variable dropdownLabel="Store In" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></store-in-variable>
  </div>
</div>`;
  },

  init() {},

  async action(cache) {
    const data = cache.actions[cache.index];
    const texttosplit = this.evalMessage(data.split, cache);
    const spliton = this.evalMessage(data.spliton, cache);

    if (!texttosplit || !spliton) return this.callNextAction(cache);

    const result = texttosplit.split(spliton);
    const storage = parseInt(data.storage, 10);
    const varName = this.evalMessage(data.varName, cache);
    this.storeValue(result, storage, varName, cache);
    this.callNextAction(cache);
  },

  mod() {},
};
