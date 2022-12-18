module.exports = {
  name: 'Delete Server Data',
  section: 'Data',
  meta: {
    version: '2.1.6',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/delete_server_data_MOD.js',
  },

  subtitle(data) {
    const servers = ['Current Server', 'Temp Variable', 'Server Variable', 'Global Variable'];
    return `${servers[parseInt(data.server, 10)]} - ${data.dataName}`;
  },

  fields: ['server', 'varName', 'dataName'],

  html() {
    return `
<server-input dropdownLabel="Source Server" selectId="server" variableContainerId="varNameContainer" variableInputId="varName"></server-input>
<br><br><br

<div style="padding-top: 8px;">
  <div style="float: left; width: 80%;">
    Data Name:<br>
    <input id="dataName" class="round" placeholder="Leave it blank to delete all data" type="text">
  </div>
</div>`;
  },

  init() {
    const { glob, document } = this;
    glob.serverChange(document.getElementById('server'), 'varNameContainer');
  },

  async action(cache) {
    const data = cache.actions[cache.index];
    const server = await this.getServerFromData(data.server, data.varName, cache);
    const dataName = this.evalMessage(data.dataName, cache);

    if (!server) return this.callNextAction(cache);

    server.delData(dataName);
    this.callNextAction(cache);
  },

  mod(DBM) {
    DBM.Actions['Delete Server Data MOD'] = DBM.Actions['Delete Server Data'];

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
