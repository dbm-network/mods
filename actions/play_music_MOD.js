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
  fields: [
    'query',
    'voiceChannel',
    'varName',
    'type',
    'storage',
    'varName2',
    'leaveOnEnd',
    'leaveOnStop',
    'leaveOnEmpty',
  ],

  subtitle(data) {
    return `${data.query}`;
  },

  variableStorage(data, varType) {
    if (parseInt(data.storage, 10) !== varType) return;
    return [data.varName3, 'Music Track'];
  },

  html() {
    return `
<<<<<<< Updated upstream
<div>
  <span class="dbminputlabel">YouTube Search</span><br>
  <input id="query" class="round" type="text" placeholder="Search for a song from youtube"><br>
</div>
=======
    <tab-system>
    <tab label="Music">
        <div class="scroll">
            <div style="float: left; width: 100%; padding-top: 16px;">
                <span class="dbminputlabel">YouTube Search</span><br>
                <input id="query" class="round" type="text" placeholder="Search for a song from youtube">
              </div>
        
              <div style="float: left; width: 100%; padding-top: 16px;">
                <voice-channel-input dropdownLabel="Voice Channel" selectId="voiceChannel" variableContainerId="varNameContainer" variableInputId="varName" selectWidth="45%" variableInputWidth="50%"></voice-channel-input>
              </div>
        
              <div style="float: left; width: 100%; padding-top: 16px;">
                <span class="dbminputlabel">Play Type</span><br>
                <select id="type" class="round">
                  <option value="0" selected>Add to Queue</option>
                  <option value="1">Play Immediately</option>
                </select>
              </div>
        
              <div style="float: left; width: 100%; padding-top: 16px;">
                <store-in-variable dropdownLabel="Store In" selectId="storage" variableContainerId="varNameContainer2" variableInputId="varName2"></store-in-variable>
              </div>
>>>>>>> Stashed changes

              <div style="float: left; width: 100%; padding-top: 16px;">
                <p>
                    <u><b><span style="color: white;">NOTE:</span></b></u><br>
                    Youtube URLs and IDs are hit and miss due to using ytdl-core.<br>
                    In theory you should be able to use the following:<br>
                    Soundcloud URL, YouTube Search, YouTube song/playlist URL, YouTube ID,<br>
                    Spotify Song/playlist/album, vimeo, facebook and reverbnation.
                  </p>
              </div>
        </div>
    </tab>
    <tab label="Player Options" icon="cogs">
      <div>
        <dbm-checkbox style="float: left;" id="leaveOnEnd" label="Leave On End" checked></dbm-checkbox>
        <dbm-checkbox style="float: left;" id="leaveOnStop" label="Leave On Stop" checked></dbm-checkbox>
        <dbm-checkbox style="float: left;" id="leaveOnEmpty" label="Leave On Empty" checked></dbm-checkbox>
      </div>
    </tab>
</tab-system>

<<<<<<< Updated upstream
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
=======
<style>
    .scroll {
      height: 56vh;
      overflow-y: scroll;
      scroll-snap-type: y mandatory;
    }
  </style>
    `;
>>>>>>> Stashed changes
  },

  init() {},

  async action(cache) {
    const data = cache.actions[cache.index];
    const server = cache.server;
    const channel = cache.msg?.channel ?? cache.interaction?.channel;
    const { Bot, Files } = this.getDBM();
    const Mods = this.getMods();
    const playdl = Mods.require('play-dl');
    const player = Bot.bot.player;
    const query = this.evalMessage(data.query, cache);
    const voiceChannel = await this.getVoiceChannelFromData(data.voiceChannel, data.varName2, cache);

    const queue = player.createQueue(server, {
      metadata: {
        channel,
      },
      autoSelfDeaf: (Files.data.settings.autoDeafen ?? 'true') === 'true',
      leaveOnEnd: data.leaveOnEnd,
      leaveOnStop: data.leaveOnStop,
      leaveOnEmpty: data.leaveOnEmpty,
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
