module.exports = {
  name: 'Find Category',
  section: 'Channel Control',
  meta: {
    version: '2.2.0',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/find_category_MOD.js',
  },

  subtitle(data) {
    const info = ['Category ID', 'Category Name', 'Category Topic'];
    return `Find Category by ${info[parseInt(data.info, 10)]}`;
  },

  variableStorage(data, varType) {
    if (parseInt(data.storage, 10) !== varType) return;
    return [data.varName, 'Category'];
  },

  fields: ['info', 'find', 'storage', 'varName'],

  html() {
    return `
<div>
  <div style="float: left; width: 35%;">
    <span class="dbminputlabel">Source Field</span>
    <select id="info" class="round">
      <option value="0" selected>Category ID</option>
      <option value="1">Category Name</option>
    </select>
  </div>
  <div style="float: right; width: 60%;">
    <span class="dbminputlabel">Source Value</span>
    <input id="find" class="round" type="text">
  </div>
</div>
<br><br><br>

<div style="padding-top: 8px;">
  <store-in-variable dropdownLabel="Store In" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></store-in-variable>
</div>
<br><br><br>

<p>You can store and edit a category using the channel actions "Store Channel Info", "Edit Channel" or "Set Channel Permission".</p>`;
  },

  init() {},

  async action(cache) {
    const { server } = cache;
    if (!server || !server.channels) return this.callNextAction(cache);
    const data = cache.actions[cache.index];
    const info = parseInt(data.info, 10);
    const find = this.evalMessage(data.find, cache);
    const channels = server.channels.cache.filter((s) => s.type === 'GUILD_CATEGORY');
    let result;

    switch (info) {
      case 0:
        result = channels.get(find);
        break;
      case 1:
        result = channels.find((e) => e.name === find);
        break;
      default:
        break;
    }

    if (result !== undefined) {
      const storage = parseInt(data.storage, 10);
      const varName = this.evalMessage(data.varName, cache);
      this.storeValue(result, storage, varName, cache);
    }
    this.callNextAction(cache);
  },

  mod() {},
};
