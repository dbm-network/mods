module.exports = {
  name: 'Delete Server Data',
  section: 'Data',
  meta: {
    version: '2.1.7',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/delete_server_data_MOD.js',
  },

  subtitle(data, presets) {
    return presets.getServerText(data.server, data.varName);
  },

  fields: ['server', 'varName', 'dataName'],

  html() {
    return `
<div>
  <server-input dropdownLabel="Source Server" selectId="server" variableContainerId="varNameContainer" variableInputId="varName"></server-input>
</div>
<br><br><br>

<div style="padding-top: 8px;">
  <div style="float: left; width: 80%;">
    <span class="dbminputlabel">Data Name</span>
    <input id="dataName" class="round" placeholder="Leave it blank to delete all data" type="text">
  </div>
</div>`;
  },

  init() {},

  async action(cache) {
    const data = cache.actions[cache.index];
    const server = await this.getServerFromData(data.server, data.varName, cache);
    const dataName = this.evalMessage(data.dataName, cache);

    if (!server) return this.callNextAction(cache);

    server.delData(dataName);
    this.callNextAction(cache);
  },

  mod(DBM) {
    Reflect.defineProperty(DBM.DiscordJS.Guild.prototype, 'delData', {
      value(name) {
        const { servers } = DBM.Files.data;

        if (servers && servers[this.id]?.[name]) {
          delete servers[this.id][name];
          DBM.Files.saveData('servers');
        } else if (!servers) {
          delete servers[this.id];
          DBM.Files.saveData('servers');
        }
      },
    });
  },
};
