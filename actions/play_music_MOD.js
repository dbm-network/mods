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

  subtitle(data, presets) {
    return `${data.query}`;
  },

  fields: ['query', 'channel', 'varName', 'voiceChannel', 'varName2', 'storage', 'varName3'],

  variableStorage(data, varType) {
    if (parseInt(data.storage, 10) !== varType) return;
    return [data.varName3, 'Music Track'];
  },

  html(_isEvent, data) {
    return `
<div>
  <span class="dbminputlabel">YouTube Query</span><br>
  <input id="query" class="round" type="text" value="https://www.youtube.com/watch?v=dQw4w9WgXcQ"><br>
</div>

<channel-input dropdownLabel="Metadata Channel" selectId="channel" variableContainerId="varNameContainer" variableInputId="varName"></channel-input>

<br><br><br>
<voice-channel-input dropdownLabel="Queue Voice Channel" selectId="voiceChannel" variableContainerId="varNameContainer2" variableInputId="varName2" selectWidth="45%" variableInputWidth="50%"></voice-channel-input>
<br><br><br>

<store-in-variable dropdownLabel="Store In" selectId="storage" variableContainerId="varNameContainer3" variableInputId="varName3"></store-in-variable>
`;
  },

  init() {},

  async action(cache) {
    const data = cache.actions[cache.index];
    const server = cache.server;
    const channel = await this.getChannelFromData(data.channel, data.varName, cache);
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
      async onBeforeCreateStream(track, source, _queue) {
        // only trap youtube source
        if (source === 'youtube') {
          // track here would be youtube track
          return (await playdl.stream(track.url, { discordPlayerCompatibility: true })).stream;
          // we must return readable stream or void (returning void means telling discord-player to look for default extractor)
        }
      },
    });

    // verify vc connection
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
      const varName3 = this.evalMessage(data.varName3, cache);
      this.storeValue(track, storage, varName3, cache);
    }
    this.callNextAction(cache);
  },

  mod() {},
};
