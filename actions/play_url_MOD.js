module.exports = {
  name: 'Play URL',
  section: 'Audio Control',
  requiresAudioLibraries: true,

  subtitle(data) {
    return 'Play media from URL';
  },

  meta: {
    version: '2.2.0',
    preciseCheck: true,
    author: 'Shadow',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods',
  },

  fields: ['url', 'volume', 'bitrate', 'seek', 'type', 'channel', 'varName'],

  html() {
    return `
<div style="position:fixed;bottom:0;left:0;padding:5px;padding-top:5px;padding-bottom:5px;font:13px sans-serif;border-radius:10px;background:rgba(0,0,0,0.7);color:#999;border:1px solid rgba(50,50,50,.7);z-index:999999;opacity:0.5;transition:all .3s" onmouseover="this.style.opacity='1';this.style.borderColor='gray'" onmouseout="this.style.opacity='0.5';this.style.borderColor='rgba(50,50,50,.7)'">Creator: Shadow<br><br>Help: <a href='https://discord.gg/9HYB4n3Dz4' target='_blank' style='color:#07f;text-decoration:none'>Discord</a></div><div style="position:fixed;bottom:0;right:0;padding:5px;font:20px sans-serif;border-radius:10px;background:rgba(0,0,0,0.7);color:#999;border:1px solid rgba(50,50,50,.7);z-index:999999;opacity:0.5;transition:all .3s" onmouseover="this.style.opacity='1';this.style.borderColor='gray'" onmouseout="this.style.opacity='0.5';this.style.borderColor='rgba(50,50,50,.7)'"><a href='https://dbm-polska.github.io/DBM-14/' target='_blank' style='color:#07f;text-decoration:none'><!--Version-->1.1</a></div>


    <div>
    <voice-channel-input dropdownLabel="Voice Channel" selectId="channel" variableContainerId="varNameContainer" variableInputId="varName" selectWidth="45%" variableInputWidth="50%"></voice-channel-input>
</div>
<div style="margin-top: 70px;">
    <span class="dbminputlabel">Web URL</span><br>
    <input id="url" class="round" type="text" value="http://"><br>
</div>
<div style="float: left; width: calc(50% - 12px);">
    <span class="dbminputlabel">Volume (0 = min; 100 = max)</span><br>
    <input id="volume" class="round" type="text" placeholder="Leave blank for automatic..."><br>
    <span class="dbminputlabel">Bitrate</span><br>
    <input id="bitrate" class="round" type="text" placeholder="Leave blank for automatic...">
</div>
<div style="float: right; width: calc(50% - 12px);">
    <span class="dbminputlabel">Seek Position</span><br>
    <input id="seek" class="round" type="text" value="0"><br>
</div>

<br><br><br><br><br><br><br>

<div>
    <span class="dbminputlabel">Play Type</span><br>
    <select id="type" class="round" style="width: 90%;">
        <option value="0" selected>Add to Queue</option>
        <option value="1">Play Immediately</option>
    </select>
</div>
`;
  },

  init() {},

  async action(cache) {
    const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
    const { VoiceConnectionStatus } = require('@discordjs/voice');
    const data = cache.actions[cache.index];

    const guild = cache.guild || cache.server;
    if (!guild) return;

    const voiceChannel = await this.getVoiceChannelFromData(data.channel, data.varName, cache);
    if (!voiceChannel) return;

    try {
      const connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: guild.id,
        adapterCreator: guild.voiceAdapterCreator,
      });

      connection.on(VoiceConnectionStatus.Ready, () => {});

      const volume = data.volume ? parseFloat(data.volume) / 100 : 1;

      const audioResource = createAudioResource(data.url, {
        inputType: data.bitrate ? 'opus' : 'webm',
        seek: parseFloat(data.seek) || 0,
        inlineVolume: true,
      });

      if (audioResource.volume) {
        audioResource.volume.setVolume(volume);
      }

      const audioPlayer = createAudioPlayer();
      audioPlayer.play(audioResource);

      connection.subscribe(audioPlayer);

      if (data.type !== '0') {
        audioPlayer.on(AudioPlayerStatus.Idle, () => {
          connection.destroy();
        });

        audioPlayer.on('error', (error) => {
          console.error('Error playing media:', error);
          connection.destroy();
        });
      }
    } catch (err) {
      console.error('Error joining voice channel:', err);
    }

    this.callNextAction(cache);
  },

  mod() {},
};
