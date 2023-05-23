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
  requiresAudioLibraries: true,
  fields: ['action'],

  subtitle(data) {
    const actions = ['Off', 'Track', 'Queue', 'Autoplay'];
    return `${actions[parseInt(data.action, 10)]}`;
  },

  html() {
    return `
<div style="float: left; width: 80%;">
	<span class="dbminputlabel">Music Action</span><br>
	<select id="action" class="round">
		<option value="0" selected>Off</option>
		<option value="1">Track</option>
		<option value="2">Queue</option>
    <option value="3">Autoplay</option>
	</select>
</div>`;
  },

  init() {},

  action(cache) {
    const { Bot } = this.getDBM();
    const data = cache.actions[cache.index];
    const queue = Bot.bot.player.getQueue(cache.server);
    const action = parseInt(data.action, 10);

    if (!queue) return this.callNextAction(cache);

    switch (action) {
      case 0: // Off
        queue.setRepeatMode(0);
        break;
      case 1: // Track
        queue.setRepeatMode(1);
        break;
      case 2: // Queue
        queue.setRepeatMode(2);
        break;
      case 3: // Autoplay
        queue.setRepeatMode(3);
        break;
    }

    this.callNextAction(cache);
  },

  mod() {},
};
