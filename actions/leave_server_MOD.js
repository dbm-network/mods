module.exports = {
  name: 'Leave Server',
  section: 'Bot Client Control',
  meta: {
    version: '2.1.6',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/leave_server_MOD.js',
  },

  subtitle() {
    return 'Leaves a server';
  },

  fields: ['server', 'varName'],

  html() {
    return `<server-input dropdownLabel="Source Server" selectId="server" variableContainerId="varNameContainer" variableInputId="varName"></server-input>`;
  },

  init() {},

  async action(cache) {
    const data = cache.actions[cache.index];
    const server = await this.getServerFromData(data.server, data.varName, cache);

    if (Array.isArray(server)) {
      this.callListFunc(server, 'leave').then(() => {
        this.callNextAction(cache);
      });
    } else if (server && server.leave) {
      server
        .leave()
        .then(() => {
          this.callNextAction(cache);
        })
        .catch(this.displayError.bind(this, data, cache));
    }
    this.callNextAction(cache);
  },

  mod() {},
};
