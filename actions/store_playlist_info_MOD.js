module.exports = {
  name: 'Store Playlist Info',
  section: 'YouTube Tools',
  meta: {
    version: '2.1.7',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/store_playlist_info_MOD.js',
  },

  subtitle() {
    return 'Store YouTube playlist information.';
  },

  variableStorage(data, varType) {
    if (parseInt(data.storage, 10) !== varType) return;
    return [data.varName, 'Playlist Info'];
  },

  fields: ['query', 'info', 'storage', 'varName'],

  html() {
    return `
<div style="width: 90%;">
  <span class="dbminputlabel">Playlist URL</span>
  <input id="query" class="round" type="text">
</div>

<div style="padding-top: 16px; width: 60%;">
  <span class="dbminputlabel">Options</span>
  <select id="info" class="round">
    <option value="0" selected>Video Data List</option>
    <option value="1">Video URL List</option>
    <option value="2">Video Name List</option>
    <option value="3">Video Duration List</option>
    <option value="4">Video ID List</option>
  </select>
</div>

<div style="padding-top: 16px;">
  <store-in-variable dropdownLabel="Store In" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></store-in-variable>
</div>`;
  },

  init() {},

  async action(cache) {
    const data = cache.actions[cache.index];
    const storage = parseInt(data.storage, 10);
    const varName = this.evalMessage(data.varName, cache);
    const url = this.evalMessage(data.query, cache);
    const INFO = parseInt(data.info, 10);
    const Mods = this.getMods();
    const ytlist = Mods.require('youtube-playlist');
    let result;

    switch (INFO) {
      case 0:
        result = await ytlist(url, ['id', 'name', 'url']);
        break;
      case 1:
        result = await ytlist(url, 'url');
        break;
      case 2:
        result = await ytlist(url, 'name');
        break;
      case 3:
        result = await ytlist(url, 'duration');
        break;
      case 4:
        result = await ytlist(url, 'id');
        break;
      default:
        break;
    }

    this.storeValue(result, storage, varName, cache);
    this.callNextAction(cache);
  },

  mod() {},
};
