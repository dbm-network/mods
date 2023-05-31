module.exports = {
  name: 'Sync Channel Permissions',
  section: 'Permission Control',
  meta: {
    version: '2.1.7',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/sync_channel_permissions_MOD.js',
  },

  subtitle(data, presets) {
    return presets.getChannelText(data.storage, data.varName);
  },

  fields: ['storage', 'varName', 'permission', 'state'],

  html() {
    return `
    <div>
      <channel-input dropdownLabel="Source Channel" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></channel-input>
    </div>`;
  },

  init() {},

  async action(cache) {
    const data = cache.actions[cache.index];
    const { server } = cache;
    const channel = await this.getChannelFromData(data.storage, data.varName, cache);

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
