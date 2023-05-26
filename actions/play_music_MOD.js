module.exports = {
  name: 'Play Music',
  section: 'Audio Control',
  meta: {
    version: '2.1.7',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/play_music_MOD.js',
  },
  requiresAudioLibraries: true,
  fields: ['query', 'voiceChannel', 'varName', 'storage', 'varName2', 'type'],

  subtitle(data) {
    return `${data.query}`;
  },

  variableStorage(data, varType) {
    if (parseInt(data.storage, 10) !== varType) return;
    return [data.varName3, 'Music Track'];
  },

  html() {
    return `
<div>
  <span class="dbminputlabel">YouTube Search</span><br>
  <input id="query" class="round" type="text" placeholder="Search for a song from youtube"><br>
</div>

<voice-channel-input dropdownLabel="Voice Channel" selectId="voiceChannel" variableContainerId="varNameContainer" variableInputId="varName" selectWidth="45%" variableInputWidth="50%"></voice-channel-input>
<br><br><br>

<div>
	<span class="dbminputlabel">Play Type</span><br>
	<select id="type" class="round" style="width: 90%;">
		<option value="0" selected>Add to Queue</option>
		<option value="1">Play Immediately</option>
	</select>
</div>
<br>

<store-in-variable dropdownLabel="Store In" selectId="storage" variableContainerId="varNameContainer2" variableInputId="varName2"></store-in-variable>
<br><br><br>

<p>
  <u><b><span style="color: white;">NOTE:</span></b></u><br>
  Youtube URLs and IDs are hit and miss due to using ytdl-core.<br>
  In theory you should be able to use the following:<br>
  Soundcloud URL, YouTube Search, YouTube song/playlist URL, YouTube ID,<br>
  Spotify Song/playlist/album, vimeo, facebook and reverbnation.
</p>
`;
  },

  init() {},

  async action(cache) {
    const data = cache.actions[cache.index];
    const server = cache.server;
    const channel = cache.msg?.channel ?? cache.interaction?.channel;
    const { Bot } = this.getDBM();
    const Mods = this.getMods();
    const playdl = Mods.require('play-dl');
    const player = Bot.bot.player;
    const voiceChannel = await this.getVoiceChannelFromData(data.voiceChannel, data.varName2, cache);

    const query = this.evalMessage(data.query, cache);
    const queue = player.createQueue(server, {
      metadata: {
        channel,
      },
      async onBeforeCreateStream(track, source) {
        if (source === 'youtube') {
          return (await playdl.stream(track.url, { discordPlayerCompatibility: true })).stream;
        }
      },
    });

    const track = await player.search(query, {
      requestedBy: cache.getUser(),
    });

    if (track.tracks.length > 0) {
      try {
        if (!queue.connection) await queue.connect(voiceChannel);
      } catch {
        queue.destroy();
        console.log('Could not join voice channel');
        return this.callNextAction(cache);
      }

      track.playlist ? queue.addTracks(track.tracks) : queue.addTrack(track.tracks[0]);
      if (data.type === '1') {
        await queue.play();
      }
      if (data.type === '0') {
        if (!queue.playing) await queue.play();
      }
      const storage = parseInt(data.storage, 10);
      const varName2 = this.evalMessage(data.varName2, cache);
      this.storeValue(track, storage, varName2, cache);
    }
    this.callNextAction(cache);
  },

  mod() {},
};
