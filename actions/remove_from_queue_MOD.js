module.exports = {
  name: 'Remove from Queue MOD',
  section: 'Audio Control',
  meta: {
    version: '2.0.11',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/remove_from_queue_MOD.js',
  },

  subtitle(data) {
    return `Remove ${data.amount} Song`;
  },

  fields: ['server', 'varName', 'position', 'amount'],

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
    <input id="varName" class="round" type="text" list="variableList">
  </div>
</div><br><br><br>
<div>
  <div style="float: left; width: 47%;">
    Position:<br>
    <input id="position" type="text" class="round" placeholder="Position start from 0">
  </div>
  <div style="float: left; padding-left: 3px; width: 50%;">
    Remove Amount:<br>
    <input id="amount" type="text" class="round" placeholder="Input must be great than 0">
  </div>
</div>`;
  },

  init() {
    const { glob, document } = this;
    glob.serverChange(document.getElementById('server'), 'varNameContainer');
  },

  async action(cache) {
    const data = cache.actions[cache.index];
    const { Audio } = this.getDBM();
    const server = parseInt(data.server, 10);
    const varName = this.evalMessage(data.varName, cache);
    const targetServer = await this.getServer(server, varName, cache);
    const position = parseInt(this.evalMessage(data.position, cache), 10);
    const amount = parseInt(this.evalMessage(data.amount, cache), 10);
    let queue;

    if (targetServer) queue = Audio.queue[targetServer.id];
    if (queue && queue.length >= 1 && queue.length > amount + position) {
      queue.splice(position, amount);
      Audio.queue[targetServer.id] = queue;
    }
    this.callNextAction(cache);
  },

  mod() {},
};
