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
  fields: ['action', 'volume', 'bitrate'],

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

<div id="bitrateDiv" style="float: right; display: none; width: calc(50% - 8px);">
  <span class="dbminputlabel">Bitrate</span>
  <input id="bitrate" class="round" type="text" value="auto">
</div>
`;
  },

  init() {
    const { glob, document } = this;

    const volume = document.getElementById('volumeDiv');
    const bitrate = document.getElementById('bitrateDiv');

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
          bitrate.style.display = 'none';
          break;
        case 7:
          volume.style.display = null;
          bitrate.style.display = 'none';
          break;
        case 8:
          volume.style.display = 'none';
          bitrate.style.display = null;
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
    const server = cache.server;
    const action = parseInt(data.action, 10);
    const volume = parseInt(this.evalMessage(data.volume, cache), 10);
    const bitrate = this.evalMessage(data.bitrate, cache);

    if (volume && isNaN(volume)) {
      console.log('Invalid volume number in Control Music');
      return this.callNexAction(cache);
    }

    if (!Bot.bot.queue) return this.callNextAction(cache);

    const queue = Bot.bot.queue.get(server.id);
    if (!queue) return this.callNextAction(cache);

    try {
      switch (action) {
        case 0:
          queue.connection.disconnect();
          break;
        case 1:
          queue.player.pause();
          break;
        case 2:
          queue.player.unpause();
          break;
        case 3:
          queue.player.stop();
          break;
        case 4:
          queue.currentIndex -= 2;
          queue.player.stop();
          break;
        case 5:
          queue.songs = [];
          break;
        case 6: {
          const currentIndex = queue.currentIndex + 1;
          for (let i = queue.songs.length - 1; i > currentIndex; i--) {
            const j = Math.floor(Math.random() * (i - currentIndex + 1)) + currentIndex;
            [queue.songs[i], queue.songs[j]] = [queue.songs[j], queue.songs[i]];
          }
          break;
        }
        case 7:
          queue.player.state.resource.volume.setVolume(volume / 100);
          break;
        case 8:
          queue.player.state.resource.encoder.setBitrate(bitrate);
          break;
      }
    } catch (err) {
      return this.callNextAction(cache);
    }

    this.callNextAction(cache);
  },

  mod() {},
};
