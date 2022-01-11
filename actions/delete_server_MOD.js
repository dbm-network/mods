module.exports = {
  name: 'Delete Server',
  section: 'Server Control',
  meta: {
    version: '2.0.11',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/delete_server_MOD.js',
  },

  subtitle(data) {
    const servers = ['Current Server', 'Temp Variable', 'Server Variable', 'Global Variable'];
    const index = parseInt(data.server, 10);
    return data.server === '0' ? `${servers[index]}` : `${servers[index]} - ${data.varName}`;
  },

  fields: ['server', 'varName'],

  html(isEvent, data) {
    return `
<div>
  <div style="float: left; width: 35%;">
    Source Server:<br>
    <select id="server" class="round" onchange="glob.serverChange(this, 'varNameContainer')">
      ${data.servers[isEvent ? 1 : 0]}
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
    glob.serverChange(document.getElementById('server'), 'varNameContainer');
  },

  async action(cache) {
    const data = cache.actions[cache.index];
    const server = parseInt(data.server, 10);
    const varName = this.evalMessage(data.varName, cache);
    const targetServer = await this.getServer(server, varName, cache);

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
