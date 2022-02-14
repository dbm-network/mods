module.exports = {
  name: 'Run Action Sequence Once',
  section: 'Other Stuff',
  meta: {
    version: '2.0.11',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/run_action_sequence_once_MOD.js',
  },

  subtitle(data) {
    return `Run Once ${data.behavior === '2' ? 'Per Server' : 'Globally'}`;
  },

  fields: ['behavior'],

  html() {
    return `
<div>
  <p>
    <u>Help:</u><br>
    THIS IS ONCE PER BOT RUN! It will run every time the bot is restarted.<br>
    This goes above the actions you wouldn't like to run more than once per bot session!<br>
    It will ensure the command only runs once either per server, or once globally.<br>
    Can be used in Bot Initialization to make sure it only runs once. Sometimes Bot Initialization runs multiple times, this fixes it!<br>
    <br>
    Usecases:<br>
    Can be used to make setup commands that only work once per server.<br>
    Can use Any Message to run some actions, and have it only do it once globally.<br>
  </p><br>
</div>
<div>
  Run Once:<br>
  <select id="behavior" class="round">
    <option value="2" selected>Per Server</option>
    <option value="3">Globally</option>
  </select>
</div>`;
  },

  init() {},

  async action(cache) {
    const data = cache.actions[cache.index];
    const behavior = parseInt(data.behavior, 10);

    const unique = Buffer.from(`${cache.actions}`);

    const store = this.getVariable(behavior, unique, cache) || false;
    if (!store) {
      this.storeValue(true, behavior, unique, cache);
      this.callNextAction(cache);
    }
  },

  mod() {},
};
