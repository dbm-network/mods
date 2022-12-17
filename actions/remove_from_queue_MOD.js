module.exports = {
  name: 'Remove from Queue MOD',
  section: 'Audio Control',
  meta: {
    version: '2.1.6',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/remove_from_queue_MOD.js',
  },

  subtitle(data) {
    return `Remove ${data.amount} Song`;
  },

  fields: ['server', 'varName', 'position', 'amount'],

  html() {
    return `
<server-input dropdownLabel="Source Server" selectId="server" variableContainerId="varNameContainer" variableInputId="varName"></server-input>
<br><br><br>

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
    const targetServer = await this.getServerFromData(data.server, data.varName, cache);
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
