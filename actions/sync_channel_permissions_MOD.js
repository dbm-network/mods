module.exports = {
  name: 'Sync Channel Permissions',
  section: 'Permission Control',
  meta: {
    version: '2.0.11',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/sync_channel_permissions_MOD.js',
  },

  subtitle(data) {
    const names = [
      'Same Channel',
      'Mentioned Channel',
      'Default Channel',
      'Temp Variable',
      'Server Variable',
      'Global Variable',
    ];
    const index = parseInt(data.storage, 10);
    return index < 3 ? `${names[index]}` : `${names[index]} - ${data.varName}`;
  },

  fields: ['storage', 'varName', 'permission', 'state'],

  html(isEvent, data) {
    return `
<div>
  <div style="float: left; width: 35%;">
    Source Channel:<br>
    <select id="storage" class="round" onchange="glob.channelChange(this, 'varNameContainer')">
      ${data.channels[isEvent ? 1 : 0]}
    </select>
  </div>
  <div id="varNameContainer" style="display: none; float: right; width: 60%;">
    Variable Name:<br>
    <input id="varName" class="round" type="text" list="variableList"><br>
  </div>
</div>`;
  },

  init() {
    const { glob, document } = this;
    glob.channelChange(document.getElementById('storage'), 'varNameContainer');
  },

  async action(cache) {
    const data = cache.actions[cache.index];
    const { server } = cache;
    const storage = parseInt(data.storage, 10);
    const varName = this.evalMessage(data.varName, cache);
    const channel = await this.getChannel(storage, varName, cache);

    if (!server) return this.callNextAction(cache);
    if (!channel.parent) return this.callNextAction(cache);

    channel
      .lockPermissions()
      .then(() => {
        this.callNextAction(cache);
      })
      .catch(this.displayError.bind(this, data, cache));
  },

  mod() {},
};
