module.exports = {
  name: 'Play YouTube Video',
  section: 'Audio Control',

  requiresAudioLibraries: true,

  subtitle(data) {
    return `${data.url}`;
  },

  fields: ['url', 'seek', 'volume', 'passes', 'bitrate', 'type'],

  html() {
    return `
<div>
  <p>This action has been modified by DBM Mods.</p>
</div>
<div>
  YouTube URL:<br>
  <input id="url" class="round" type="text" value="https://www.youtube.com/watch?v=2zgcFFvEA9g"><br>
</div>
<div style="float: left; width: 50%;">
  Seek Position:<br>
  <input id="seek" class="round" type="text" value="0"><br>
  Passes:<br>
  <input id="passes" class="round" type="text" value="1">
</div>
<div style="float: right; width: 50%;">
  Volume (0 = min; 100 = max):<br>
  <input id="volume" class="round" type="text" placeholder="Leave blank for automatic..."><br>
  Bitrate:<br>
  <input id="bitrate" class="round" type="text" placeholder="Leave blank for automatic...">
</div><br><br><br><br><br><br><br>
<div>
  Play Type:<br>
  <select id="type" class="round" style="width: 90%;">
    <option value="0" selected>Add to Queue</option>
    <option value="1">Play Immediately</option>
  </select>
</div>`;
  },

  init() {},

  async action(cache) {
    const data = cache.actions[cache.index];
    const { Audio } = this.getDBM();
    const Mods = this.getMods();
    const { Client } = Mods.require('youtubei');
    const youtube = new Client();
    const url = this.evalMessage(data.url, cache);
    const { msg } = cache;
    const options = {};

    if (url) {
      if (data.seek) {
        options.seek = parseInt(this.evalMessage(data.seek, cache), 10);
      }
      if (data.volume) {
        options.volume = parseInt(this.evalMessage(data.volume, cache), 10) / 100;
      } else if (cache.server) {
        options.volume = Audio.volumes[cache.server.id] || 0.5;
      } else {
        options.volume = 0.5;
      }
      if (data.passes) {
        options.passes = parseInt(this.evalMessage(data.passes, cache), 10);
      }
      if (data.bitrate) {
        options.bitrate = parseInt(this.evalMessage(data.bitrate, cache), 10);
      } else {
        options.bitrate = 'auto';
      }
      if (msg) options.requester = msg.author;

      try {
        const video = await youtube.getVideo(url);

        options.title = video.title;
        options.duration = video.duration;
        options.thumbnail = video.thumbnails[video.thumbnails.length - 1].url;

        const info = ['yt', options, url];
        if (data.type === '0') {
          Audio.addToQueue(info, cache);
        } else if (cache.server && cache.server.id !== undefined) {
          Audio.playItem(info, cache.server.id);
        }
      } catch (err) {
        return this.displayError(data, cache, err);
      }
    }

    this.callNextAction(cache);
  },

  mod() {},
};
