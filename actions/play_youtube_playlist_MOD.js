module.exports = {
  name: 'Play YouTube Playlist',
  section: 'Audio Control',
  meta: {
    version: '2.1.6',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/play_youtube_playlist_MOD.js',
  },

  requiresAudioLibraries: true,

  subtitle(data) {
    return `${data.url}`;
  },

  fields: ['url', 'seek', 'volume', 'passes', 'bitrate', 'maxvid'],

  html() {
    return `
<div style="float: left; width: 105%;">
  YouTube Playlist:<br>
  <input id="url" class="round" type="text" placeholder="Insert your playlist URL or ID here"><br>
</div>
<div style="float: left; width: 49%;">
  Video Seek Positions:<br>
  <input id="seek" class="round" type="text" value="0"><br>
  Video Volumes:<br>
  <input id="volume" class="round" type="text" placeholder="Leave blank for automatic..."><br>
    Max Videos to Queue from Playlist:<br>
    <input id="maxvid" class="round" type="text" placeholder="Defaults to 250 videos"><br>
</div>
<div style="float: right; width: 49%;">
  Video Passes:<br>
  <input id="passes" class="round" type="text" value="1"><br>
  Video Bitrates:<br>
  <input id="bitrate" class="round" type="text" placeholder="Leave blank for automatic..."><br>
</div>`;
  },

  init() {},

  async action(cache) {
    const data = cache.actions[cache.index];
    const { Audio } = this.getDBM();
    const Mods = this.getMods();
    const url = this.evalMessage(data.url, cache);
    const maxvideos = this.evalMessage(data.maxvid, cache) || 250;
    const ytpl = Mods.require('ytpl'); // be sure you have the latest YTPL, this was modified with 2.0.3 in mind
    const { msg } = cache;
    const options = {
      watermark: 'highWaterMark: 1', // idk what this does, but the queue data has it, so i might as well add it in case someone needs it
    };

    // Check Input
    if (!url) {
      return console.log('Please insert a playlist url!');
    }

    // Check Options
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
    if (msg) {
      options.requester = msg.author;
    }
    ytpl(url, { limit: maxvideos }).then((playlist) => {
      playlist.items.forEach((video) => {
        if (video.id !== undefined) {
          const { title } = video;
          const duration = parseInt(video.durationSec, 10);
          const thumbnail = video.bestThumbnail.url;
          Audio.addToQueue(
            [
              'yt',
              {
                ...options,
                title,
                duration,
                thumbnail,
              },
              video.shortUrl,
            ],
            cache,
          );
        }
      });
    });
    this.callNextAction(cache);
  },

  mod() {},
};
