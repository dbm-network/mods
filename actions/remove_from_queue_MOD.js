module.exports = {
  name: 'Remove from Queue MOD',
  displayName: 'Remove from Queue',
  section: 'Audio Control',
  meta: {
    version: '2.1.7',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/remove_from_queue_MOD.js',
  },

  subtitle(data) {
    return `Remove ${data.amount} Song(s)`;
  },

  fields: ['server', 'varName', 'position', 'amount'],

  html() {
    return `
    <div>
      <server-input dropdownLabel="Source Server" selectId="server" variableContainerId="varNameContainer" variableInputId="varName"></server-input>
    </div>
    <br><br><br>

<div>
  <div style="float: left; width: 47%;">
    <span class="dbminputlabel">Position</span>
    <input id="position" type="text" class="round" placeholder="Position start from 1">
  </div>
  <div style="float: left; padding-left: 3px; width: 50%;">
    <span class="dbminputlabel">Remove Amount</span>
    <input id="amount" type="text" class="round" placeholder="Input must be greater than 0">
  </div>
</div>`;
  },

  init() {},

  async action(cache) {
    const data = cache.actions[cache.index];
    const { Bot } = this.getDBM();
    const targetServer = await this.getServerFromData(data.server, data.varName, cache);
    const position = parseInt(this.evalMessage(data.position, cache), 10) - 1;
    const amount = parseInt(this.evalMessage(data.amount, cache), 10);

    if (!Bot.bot.queue) return this.callNextAction(cache);

    const queue = Bot.bot.queue.get(targetServer.id);
    if (!queue) return this.callNextAction(cache);

    if (queue.songs && queue.songs.length > position && amount > 0) {
      queue.songs.splice(position, amount);
    }
    this.callNextAction(cache);
  },

  mod() {},
};
