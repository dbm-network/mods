module.exports = {
  name: 'Store Unix Timestamp',
  section: 'Other Stuff',
  meta: {
    version: '2.1.7',
    preciseCheck: true,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadUrl: 'https://github.com/dbm-network/mods/blob/master/actions/store_unix_timestamp_MOD.js',
  },

  subtitle() {
    return `Current Unix Timestamp`;
  },

  fields: ['storage', 'varName'],

  html() {
    return `
<div style="padding-top: 8px;">
  <span class="dbminputlabel">Time Info</span>
  <input value="Current Timestamp" class="round" disabled></input>
</div>

<br>

<div>
  <store-in-variable dropdownLabel="Store In" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></store-in-variable>
</div>
`;
  },

  init() {
    const { glob, document } = this;
    glob.variableChange(document.getElementById('storage'), 'varNameContainer');
  },

  action(cache) {
    const data = cache.actions[cache.index];
    const result = Math.floor(new Date().getTime() / 1000);

    const storage = parseInt(data.storage, 10);
    const varName = this.evalMessage(data.varName, cache);

    this.storeValue(result, storage, varName, cache);
    this.callNextAction(cache);
  },

  mod() {},
};
