module.exports = {
  name: 'Delete Server',
  section: 'Server Control',
  meta: {
    version: '2.1.7',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/delete_server_MOD.js',
  },

  subtitle(data, presets) {
    return presets.getServerText(data.server, data.varName);
  },

  fields: ['server', 'varName'],

  html() {
    return '<server-input dropdownLabel="Source Server" selectId="server" variableContainerId="varNameContainer" variableInputId="varName"></server-input>';
  },

  init() {},

  async action(cache) {
    const data = cache.actions[cache.index];
    const targetServer = await this.getServerFromData(data.server, data.varName, cache);

    if (Array.isArray(targetServer)) {
      this.callListFunc(targetServer, 'delete', []).then(() => {
        this.callNextAction(cache);
      });
    } else if (targetServer && targetServer.delete) {
      targetServer
        .delete()
        .then(() => {
          this.callNextAction(cache);
        })
        .catch(this.displayError.bind(this, data, cache));
    }
    this.callNextAction(cache);
  },

  mod() {},
};
