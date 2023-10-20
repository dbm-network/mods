module.exports = {
  name: 'Control Music',
  section: 'Music Control',
  meta: {
    version: '2.2.0',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/control_music_MOD.js',
  },

  fields: ['action', 'volume', 'skip', 'bitrate'],

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
      'Set Bitrate',
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
    <option value="8">Set Bitrate</option>
	</select>
</div>

<div id="volumeDiv" style="float: right; display: none; width: calc(50% - 8px);">
  <span class="dbminputlabel">Volume Level</span>
  <input id="volume" class="round" type="text">
</div>
<div id="skipDiv" style="float: right; display: none; width: calc(50% - 8px);">
  <span class="dbminputlabel">Skip Amount</span>
  <input id="skip" class="round" type="text" value="1">

<div id="bitrateDiv" style="float: right; display: none; width: calc(50% - 8px);">
  <span class="dbminputlabel">Bitrate</span>
  <input id="bitrate" class="round" type="text" value="auto">
</div>
`;
  },

  init() {
    const { glob, document } = this;

    const volume = document.getElementById('volumeDiv');
    const skip = document.getElementById('skipDiv');
    const bitrate = document.getElementById('bitrateDiv');

    glob.onChange = function onChange(event) {
      switch (parseInt(event.value, 10)) {
        case 3:
          skip.style.display = null;
          volume.style.display = 'none';
          bitrate.style.display = 'none';
          break;
        case 0:
        case 1:
        case 2:
        case 4:
        case 5:
        case 6:
          volume.style.display = 'none';
          skip.style.display = 'none';
          bitrate.style.display = 'none';
          break;
        case 7:
          volume.style.display = null;
          skip.style.display = 'none';
          bitrate.style.display = 'none';
          break;
        case 8:
          volume.style.display = 'none';
          skip.style.display = 'none';
          bitrate.style.display = null;
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
    const bitrate = this.evalMessage(data.bitrate, cache);

    const { useQueue } = require('discord-player');

    const server = cache.server;
    if (!server) return this.callNextAction(cache);

    const queue = useQueue(server.id);
    if (!queue) return this.callNextAction(cache);

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
        case 3: {
          const amount = parseInt(this.evalMessage(data.skip, cache), 10) ?? 1;
          amount === 1 ? queue.node.skip() : queue.node.skipTo(amount);
          break;
        }
        case 4:
          queue.history.back();
          break;
        case 5:
          queue.clear();
          break;
        case 6:
          queue.tracks.shuffle();
          break;
        case 7:
          queue.setVolume(volume);
          break;
        case 8:
          queue.setBitrate(bitrate);
          break;
      }
    } catch (err) {
      console.log(err);
      return this.callNextAction(cache);
    }

    this.callNextAction(cache);
  },

  mod() {},
};
