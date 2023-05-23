module.exports = {
  name: 'Control Music',
  section: 'Audio Control',
  meta: {
    version: '2.1.7',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/control_music_MOD.js',
  },
  requiresAudioLibraries: true,
  fields: ['action'],

  subtitle(data) {
    const actions = [
      'Stop Playing',
      'Pause Music',
      'Resume Music',
      'Skip Song',
      'Play Previous Song',
      'Clear Queue',
      'Shuffle Queue',
    ];
    return `${actions[parseInt(data.action, 10)]}`;
  },

  html() {
    return `
<div style="float: left; width: 80%;">
	<span class="dbminputlabel">Music Action</span><br>
	<select id="action" class="round">
		<option value="0" selected>Stop Playing</option>
		<option value="1">Pause Music</option>
		<option value="2">Resume Music</option>
    <option value="3">Skip Song</option>
    <option value="4">Play Previous Song</option>
    <option value="5">Clear Queue</option>
    <option value="6">Shuffle Queue</option>
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
      case 0:
        queue.destroy();
        break;
      case 1:
        queue.setPaused(true);
        break;
      case 2:
        queue.setPaused(false);
        break;
      case 3:
        queue.skip();
        break;
      case 4:
        queue.back();
        break;
      case 5:
        queue.destroy(false);
        break;
      case 6:
        queue.shuffle();
        break;
    }

    this.callNextAction(cache);
  },

  mod() {},
};
