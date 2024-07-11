module.exports = {
  name: 'Set Music Repeat Mode',
  section: 'Audio Control',
  meta: {
    version: '2.1.7',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/set_music_repeat_mode_MOD.js',
  },
  fields: ['action'],

  subtitle(data) {
    const actions = ['Off', 'Track', 'Queue'];
    return `${actions[parseInt(data.action, 10)]}`;
  },

  html() {
    return `
<div style="float: left; width: 80%;">
  <span class="dbminputlabel">Repeat Mode</span><br>
  <select id="action" class="round">
    <option value="0" selected>Off</option>
    <option value="1">Track</option>
    <option value="2">Queue</option>
  </select>
</div>`;
  },

  init() {},

  action(cache) {
    const { Bot } = this.getDBM();
    const data = cache.actions[cache.index];
    const server = cache.server;
    const queue = Bot.bot.queue.get(server.id);
    const action = parseInt(data.action, 10);

    if (!queue) return this.callNextAction(cache);

    queue.repeatMode = action;

    this.callNextAction(cache);
  },

  mod() {},
};
