module.exports = {
  name: 'Create Server',
  section: 'Server Control',
  meta: {
    version: '2.0.11',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/create_server_MOD.js',
  },

  subtitle(data) {
    return `${data.serverName}`;
  },

  variableStorage(data, varType) {
    if (parseInt(data.storage, 10) !== varType) return;
    return [data.varName, 'Server'];
  },

  fields: ['serverName', 'serverRegion', 'storage', 'varName'],

  html(isEvent, data) {
    return `
<div style="padding-top: 8px;">
  <div style="float: left; width: 560px;">
    Server Name:<br>
    <input id="serverName" class="round" type="text">
  </div><br><br><br>
  <div style="padding-top: 8px;">
    <div style="float: left; width: 35%;">
      Store In:<br>
      <select id="storage" class="round" onchange="glob.variableChange(this, 'varNameContainer')">
        ${data.variables[0]}
      </select>
    </div>
    <div id="varNameContainer" style="display: none; float: right; width: 60%;">
      Variable Name:<br>
      <input id="varName" class="round" type="text"><br>
    </div>
  </div><br><br><br><br>
  <div style="float: left; width: 88%; padding-top: 20px;">
    <p>
      <b>NOTE:</b> <span style="color:red">This is only available to bots in less than 10 servers!</span>
    </p>
  </div>
</div>`;
  },

  init() {
    const { glob, document } = this;
    glob.variableChange(document.getElementById('storage'), 'varNameContainer');
  },

  async action(cache) {
    const data = cache.actions[cache.index];
    const serverName = this.evalMessage(data.serverName, cache);
    const botClient = this.getDBM().Bot.bot;

    if (!serverName) return this.callNextAction(cache);

    botClient.guilds
      .create(serverName)
      .then((server) => {
        const storage = parseInt(data.storage, 10);
        const varName = this.evalMessage(data.varName, cache);
        this.storeValue(server, storage, varName, cache);
        this.callNextAction(cache);
      })
      .catch(this.displayError.bind(this, data, cache));
  },

  mod() {},
};
