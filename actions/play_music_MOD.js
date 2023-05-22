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

  subtitle(data) {
    return `${data.query}`;
  },

  fields: ['query', 'voiceChannel', 'varName', 'storage', 'varName2'],

  variableStorage(data, varType) {
    if (parseInt(data.storage, 10) !== varType) return;
    return [data.varName3, 'Music Track'];
  },

  html() {
    return `
<div>
  <span class="dbminputlabel">YouTube Query</span><br>
  <input id="query" class="round" type="text" value="https://www.youtube.com/watch?v=dQw4w9WgXcQ"><br>
</div>

<br><br><br>
<voice-channel-input dropdownLabel="Voice Channel" selectId="voiceChannel" variableContainerId="varNameContainer" variableInputId="varName" selectWidth="45%" variableInputWidth="50%"></voice-channel-input>
<br><br><br>

<store-in-variable dropdownLabel="Store In" selectId="storage" variableContainerId="varNameContainer2" variableInputId="varName2"></store-in-variable>
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

    try {
      if (!queue.connection) await queue.connect(voiceChannel);
    } catch {
      queue.destroy();
      console.log('Could not join voice channel');
      return this.callNextAction(cache);
    }

    const track = await player
      .search(query, {
        requestedBy: cache.getUser(),
      })
      .then((x) => x.tracks[0]);

    if (track !== undefined) {
      queue.play(track);
      const storage = parseInt(data.storage, 10);
      const varName2 = this.evalMessage(data.varName2, cache);
      this.storeValue(track, storage, varName2, cache);
    }
    this.callNextAction(cache);
  },

  mod() {},
};
