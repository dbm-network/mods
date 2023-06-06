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
  fields: ['action', 'volume'],

  subtitle(data) {
    const actions = [
      'Stop Playing',
      'Pause Music',
      'Resume Music',
      'Skip Song',
      'Play Previous Song',
      'Clear Queue',
      'Shuffle Queue',
      'Set Volume',
    ];
    return `${actions[parseInt(data.action, 10)]}`;
  },

  html() {
    return `
<div style="float: left; width: calc(50% - 8px);">
	<span class="dbminputlabel">Music Action</span>
	<select id="action" class="round" onchange="glob.onChange(this)">
		<option value="0" selected>Stop Playing</option>
		<option value="1">Pause Music</option>
		<option value="2">Resume Music</option>
    <option value="3">Skip Song</option>
    <option value="4">Play Previous Song</option>
    <option value="5">Clear Queue</option>
    <option value="6">Shuffle Queue</option>
    <option value="7">Set Volume</option>
	</select>
</div>

<div id="volumeDiv" style="float: right; display: none; width: calc(50% - 8px);">
  <span class="dbminputlabel">Volume Level</span>
  <input id="volume" class="round" type="text">
</div>`;
  },

  init() {
    const { glob, document } = this;

    const volume = document.getElementById('volumeDiv');

    glob.onChange = function onChange(event) {
      switch (parseInt(event.value, 10)) {
        case 0:
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
          volume.style.display = 'none';
          break;
        case 7:
          volume.style.display = null;
          break;
        default:
          break;
      }
    };

    glob.onChange(document.getElementById('action'));
  },

  action(cache) {
    const { Bot } = this.getDBM();
    const data = cache.actions[cache.index];
    const queue = Bot.bot.player.getQueue(cache.server);
    const action = parseInt(data.action, 10);
    const volume = parseInt(this.evalMessage(data.volume, cache), 10);

    if (volume && isNaN(volume)) {
      console.log('Invalid volume number in Control Music');
      return this.callNexAction(cache);
    }

    if (!queue) return this.callNextAction(cache);

    try {
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
        case 7:
          queue.setVolume(volume);
          break;
      }
    } catch (err) {
      return this.callNextAction(cache);
    }

    this.callNextAction(cache);
  },

  mod() {},
};
