module.exports = {
  name: 'Control Music',
  section: 'Audio Control',
  meta: {
    version: '2.2.0',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/control_music_MOD.js',
  },
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

  async action(cache) {
    const data = cache.actions[cache.index];
    const action = parseInt(data.action, 10);
    const volume = parseInt(this.evalMessage(data.volume, cache), 10);
    const { useQueue, useHistory } = require('discord-player');

    const server = cache.server;
    if (!server) return this.callNextAction(cache);

    const queue = useQueue(server.id);
    const history = useHistory(server.id);

    if (volume && isNaN(volume)) {
      console.log('Invalid volume number in Control Music');
      return this.callNexAction(cache);
    }

    try {
      switch (action) {
        case 0:
          queue.delete(); // Stop playing
          break;
        case 1:
          queue.node.pause();
          break;
        case 2:
          queue.node.resume();
          break;
        case 3:
          queue.node.skip();
          break;
        case 4:
          await history.previous();
          break;
        case 5:
          queue.destroy(false);
          break;
        case 6:
          queue.tracks.shuffle();
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
