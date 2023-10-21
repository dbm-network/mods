module.exports = {
  name: 'Play Music',
  section: 'Music Control',
  meta: {
    version: '2.2.0',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/play_music_MOD.js',
  },
  requiresAudioLibraries: true,
  fields: ['query', 'voiceChannel', 'varName', 'storage', 'varName2', 'volume', 'leaveOnEmpty', 'leaveOnEnd'],

  subtitle(data) {
    return `${data.query}`;
  },

  variableStorage(data, varType) {
    if (parseInt(data.storage, 10) !== varType) return;
    return [data.varName2, 'Music Track'];
  },

  html() {
    return `
<div style="max-height: 200px;">
<div>
  <span class="dbminputlabel">YouTube Search</span><br>
  <input id="query" class="round" type="text" placeholder="Search for a song from youtube"><br>
</div>

<div>
  <voice-channel-input dropdownLabel="Voice Channel" selectId="voiceChannel" variableContainerId="varNameContainer" variableInputId="varName"></voice-channel-input>
</div>
<br><br><br>

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
</div>
`;
  },

  init() {},

  async action(cache) {
    const data = cache.actions[cache.index];
    const server = cache.server;
    const { Files, Actions } = this.getDBM();
    const channel = cache.msg?.channel ?? cache.interaction?.channel;
    const voiceChannel = await this.getVoiceChannelFromData(data.voiceChannel, data.varName2, cache);
    const Mods = this.getMods();

    // Setup Music
    const { useMainPlayer } = Mods.require('discord-player');
    const player = useMainPlayer();
    const query = this.evalMessage(data.query, cache);
    if (!server ?? !query) return this.callNextAction();

    let volume = 80;
    if (data.volume) volume = parseInt(this.evalMessage(data.volume, cache), 10) ?? 80;

    // leaveOnEnd & leaveOnEmpty Cooldowns from DBM Settings
    const leaveVoiceTimeout = Files.data.settings.leaveVoiceTimeout ?? '10';
    let seconds = parseInt(leaveVoiceTimeout, 10);

    if (isNaN(seconds) || seconds < 0) seconds = 0;
    if (leaveVoiceTimeout === '' || !isFinite(seconds)) seconds = 0;
    // Needs to be converted to Milliseconds, keeping the same variable.
    if (seconds > 0) seconds *= 1000;

    try {
      const searchResult = await player.search(query, { requestedBy: cache.getUser() });

      if (!searchResult.hasTracks()) {
        // If player didn't find any songs for this query
        return Actions.callNextAction();
      }

      const { track } = await player.play(voiceChannel, searchResult, {
        nodeOptions: {
          metadata: channel,
          selfDeaf: (Files.data.settings.autoDeafen ?? 'true') === 'true',
          volume,
          leaveOnEmpty: data.leaveOnEmpty,
          leaveOnEmptyCooldown: seconds,
          leaveOnEnd: data.leaveOnEnd,
          leaveOnEndCooldown: seconds,
        },
      });

      if (track) {
        const storage = parseInt(data.storage, 10);
        const varName2 = this.evalMessage(data.varName2, cache);
        this.storeValue(track, storage, varName2, cache);
      }
    } catch (err) {
      console.log(err);
      this.callNextAction(cache);
    }

    this.callNextAction(cache);
  },

  mod() {},
};
