module.exports = {
  name: 'Store Track Info',
  section: 'Audio Control',
  meta: {
    version: '2.1.7',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/store_track_info_MOD.js',
  },
  requiresAudioLibraries: true,
  fields: ['trackObject', 'varName', 'info', 'storage', 'varName1'],

  subtitle({ info }) {
    const names = ['Track Title', 'Track Thumbnail', 'Track URL', 'Track Author', 'Track Duration', 'Requested By'];
    return `${names[parseInt(info, 10)]}`;
  },

  variableStorage(data, varType) {
    if (parseInt(data.storage, 10) !== varType) return;
    return [
      data.varName1,
      ['Track Title', 'Track Thumbnail', 'Track URL', 'Track Author', 'Track Duration', 'Requested By'][
        parseInt(data.info, 10)
      ] || 'Track Info',
    ];
  },

  html() {
    return `
    <retrieve-from-variable dropdownLabel="Track" selectId="trackObject" variableContainerId="varNameContainer" variableInputId="varName"></retrieve-from-variable>
  
<div style="float: left; width: 100%;">
<span class="dbminputlabel">Track Info</span><br>
  <select id="info" class="round">
    <option value="0">Track Title</option>
    <option value="1">Track Thumbnail</option>
    <option value="2">Track URL</option>
    <option value="3">Track Author</option>
    <option value="4">Track Duration</option>
    <option value="5">Requested By</option>
  </select>
</div>
<br><br><br><br>

<div style="float: left; width: 100%; padding-top: 16px;">
  <store-in-variable dropdownLabel="Store In" selectId="storage" variableContainerId="varNameContainer1" variableInputId="varName1"></store-in-variable>
</div>
`;
  },

  init() {},

  async action(cache) {
    const data = cache.actions[cache.index];
    const info = parseInt(data.info, 10);

    const type = parseInt(data.trackObject, 10);
    const varName = this.evalMessage(data.varName, cache);
    const track = this.getVariable(type, varName, cache);
    if (!track) return this.callNextAction(cache);

    let result;
    switch (info) {
      case 0:
        result = track.title;
        break;
      case 1:
        result = track.thumbnail;
        break;
      case 2:
        result = track.url;
        break;
      case 3:
        result = track.author;
        break;
      case 4:
        result = track.duration;
        break;
      case 5:
        result = track.requestedBy;
        break;
    }

    if (result !== undefined) {
      const storage = parseInt(data.storage, 10);
      const varName1 = this.evalMessage(data.varName1, cache);
      this.storeValue(result, storage, varName1, cache);
    }
    this.callNextAction(cache);
  },

  mod() {},
};
