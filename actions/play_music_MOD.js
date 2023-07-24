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
  fields: ['query', 'voiceChannel', 'varName', 'storage', 'varName2', 'type', 'volume', 'leaveOnEmpty', 'leaveOnEnd'],

  subtitle(data) {
    return `${data.query}`;
  },

  variableStorage(data, varType) {
    if (parseInt(data.storage, 10) !== varType) return;
    return [data.varName2, 'Music Track'];
  },

  html() {
    return `
<div style="max-height: 350px; overflow-y: scroll;">
  <div style="padding-top: 8px;">
    <span class="dbminputlabel">YouTube Search</span><br>
    <input id="query" class="round" type="text" placeholder="Search for a song from youtube"><br>
  </div>

  <div>
    <voice-channel-input dropdownLabel="Voice Channel" selectId="voiceChannel" variableContainerId="varNameContainer" variableInputId="varName"></voice-channel-input>
  </div>
  <br><br><br>

  <div style="padding-top: 8px; width: 100%;">
	  <span class="dbminputlabel">Play Type</span><br>
	  <select id="type" class="round" style="width: 35%;">
		  <option value="0" selected>Add to Queue</option>
		  <option value="1">Play Immediately</option>
	  </select>
  </div>
  <br>

  <div style="padding-top: 8px; width: 100%; height: 50px; display: flex;">
    <div style="width: 35%; height: 100%;">
      <span class="dbminputlabel">Default Volume</span><br>
      <input id="volume" class="round" type="text" placeholder="Leave blank for 80">
    </div>
    <div style="width: 60%; height: 100%; padding-top: 20px; padding-left: 5%;">
      <dbm-checkbox style="float: left;" id="leaveOnEmpty" label="Leave On Empty" checked></dbm-checkbox>
      <dbm-checkbox style="float: right;" id="leaveOnEnd" label="Leave On End" checked></dbm-checkbox>
    </div>
  </div>
  <br>

  <div style="float: left; width: 100%;">
    <store-in-variable dropdownLabel="Store In" selectId="storage" variableContainerId="varNameContainer2" variableInputId="varName2"></store-in-variable>
  </div>

  <br><br><br>
  <p>
    <u><b><span style="color: white;">NOTE:</span></b></u><br>
    Youtube URLs and IDs are hit and miss due to using ytdl-core.<br>
    In theory you should be able to use the following:<br>
    Soundcloud URL, YouTube Search, YouTube song/playlist URL, YouTube ID,<br>
    Spotify Song/playlist/album, vimeo, facebook and reverbnation.
  </p>
</div>
`;
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
    const voiceChannel = await this.getVoiceChannelFromData(data.voiceChannel, data.varName2, cache);

    let volume = 80;
    if (data.volume) volume = parseInt(this.evalMessage(data.volume, cache), 10) || 80;

    // leaveOnEnd & leaveOnEmpty Cooldowns from DBM Settings
    const leaveVoiceTimeout = Files.data.settings.leaveVoiceTimeout ?? '10';
    let seconds = parseInt(leaveVoiceTimeout, 10);

    if (isNaN(seconds) || seconds < 0) seconds = 0;
    if (leaveVoiceTimeout === '' || !isFinite(seconds)) seconds = 0;
    // Needs to be converted to Milliseconds, keeping the same variable.
    if (seconds > 0) seconds *= 1000;

    const query = this.evalMessage(data.query, cache);
    const queue = player.createQueue(server, {
      metadata: {
        channel,
      },
      autoSelfDeaf: (Files.data.settings.autoDeafen ?? 'true') === 'true',
      initialVolume: volume,
      leaveOnEmpty: data.leaveOnEmpty,
      leaveOnEmptyCooldown: seconds,
      leaveOnEnd: data.leaveOnEnd,
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
