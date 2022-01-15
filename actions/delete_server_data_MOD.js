module.exports = {
  name: 'Delete Server Data',
  section: 'Data',
  meta: {
    version: '2.0.11',
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

  html(isEvent, data) {
    return `
<div>
  <div style="float: left; width: 35%;">
    Server:<br>
    <select id="server" class="round" onchange="glob.serverChange(this, 'varNameContainer')">
      ${data.servers[isEvent ? 1 : 0]}
    </select>
  </div>
  <div id="varNameContainer" style="display: none; float: right; width: 60%;">
    Variable Name:<br>
    <input id="varName" class="round" type="text" list="variableList">
  </div>
</div><br><br><br
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
    const type = parseInt(data.server, 10);
    const varName = this.evalMessage(data.varName, cache);
    const server = await this.getServer(type, varName, cache);
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
