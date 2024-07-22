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
  fields: [
    'query',
    'voiceChannel',
    'varName',
    'storage',
    'varName2',
    'type',
    'volume',
    'leaveOnEmpty',
    'leaveOnEnd',
    'useCookies',
    'cookies',
  ],

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
    <span class="dbminputlabel">YouTube URL</span><br>
    <input id="query" class="round" type="text" placeholder="Play URL from YouTube"><br>
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
    <dbm-checkbox style="padding-top: 8px;" id="useCookies" label="Use Cookies (Optional)"></dbm-checkbox>
  <div style="padding-top: 8px; display: none;" id="cookiesSection">
	<span class="dbminputlabel">Cookies</span><br>
	<textarea id="cookies" rows="9" name="cookiesarea" style="white-space: nowrap; resize: none;"></textarea>
<br>
  <p>
    <u><b><span style="color: white;">How to get cookies:</span></b></u><br>
    &#x2022; Install <span class="wrexlink" id="link" data-url="https://www.editthiscookie.com/">EditThisCookie</span> extension for your browser.<br>
    &#x2022; Go to YouTube.<br>
    &#x2022; Log in to your account. (You should use a new account for this purpose)<br>
    &#x2022; Click on the extension icon and click "Export" icon.<br>
    &#x2022; Your cookie will be added to your clipboard and paste it into cookies area above.
  </p>
  <div style="border-top: 3px solid #c7c8c8;"></div>
  </div>
  <p style="padding-top: 14px;">
    <u><b><span style="color: white;">NOTE:</span></b></u><br>
    This action supports both videos and playlists.<br>
  </p>
</div>

<style>
  span.wrexlink {
    color: #99b3ff;
    text-decoration:underline;
    cursor:pointer;
  }
  span.wrexlink:hover {
    color:#4676b9;
  }
</style>
`;
  },

  init() {
    const { document } = this;

    const cookiesCheckbox = document.getElementById('useCookies');
    const checkboxId2 = document.getElementById('checkboxId2');
    const cookiesSection = document.getElementById('cookiesSection');

    const checkCookiesCheckbox = (checkbox) => {
      if (checkbox.checked) {
        cookiesSection.style.display = 'block';
      } else {
        cookiesSection.style.display = 'none';
      }
    };

    checkCookiesCheckbox(checkboxId2);

    cookiesCheckbox.addEventListener('change', (event) => {
      checkCookiesCheckbox(event.target);
    });

    const specificSpan = document.getElementById('link');

    if (specificSpan) {
      const url = specificSpan.getAttribute('data-url');
      if (url) {
        specificSpan.setAttribute('title', url);
        specificSpan.addEventListener('click', (e) => {
          e.stopImmediatePropagation();
          console.log(`Launching URL: [${url}] in your default browser.`);
          try {
            require('child_process').execSync(`start ${url}`);
          } catch (err) {
            console.error('Error launching URL:', err);
          }
        });
      }
    }
  },

  async action(cache) {
    const data = cache.actions[cache.index];
    const server = cache.server;
    const { Bot, Files } = this.getDBM();
    const Mods = this.getMods();
    const ytdl = Mods.require('@distube/ytdl-core');
    const ytpl = Mods.require('@distube/ytpl');
    const {
      joinVoiceChannel,
      createAudioPlayer,
      createAudioResource,
      AudioPlayerStatus,
      VoiceConnectionStatus,
    } = require('@discordjs/voice');

    let agent;
    if (data.useCookies) {
      const cookiesarray = JSON.parse(this.evalMessage(data.cookies, cache));
      agent = ytdl.createAgent(cookiesarray);
    }
    const voiceChannel = await this.getVoiceChannelFromData(data.voiceChannel, data.varName, cache);

    if (!Bot.bot.queue) Bot.bot.queue = new Map();

    const volume = parseInt(this.evalMessage(data.volume, cache), 10) || 80;
    const leaveOnEnd = data.leaveOnEnd;
    const leaveOnEmpty = data.leaveOnEmpty;
    const autoDeafen = (Files.data.settings.autoDeafen ?? 'true') === 'true';
    const leaveVoiceTimeout = Files.data.settings.leaveVoiceTimeout ?? '10';
    let seconds = parseInt(leaveVoiceTimeout, 10);
    if (isNaN(seconds) || seconds < 0) seconds = 0;
    if (leaveVoiceTimeout === '' || !isFinite(seconds)) seconds = 0;
    if (seconds > 0) seconds *= 1000;

    const query = this.evalMessage(data.query, cache);

    const serverQueue = Bot.bot.queue.get(server.id);

    let songs = [];

    if (ytpl.validateID(query, { agent })) {
      let playlist;
      try {
        playlist = await ytpl(query, { agent });
      } catch (error) {
        console.log(error);
        return this.callNextAction(cache);
      }

      songs = playlist.items.map((item) => ({
        title: item.title,
        thumbnail: item.thumbnail,
        url: item.shortUrl,
        author: item.author.name,
        duration: item.duration.split(':').reduce((acc, time) => 60 * acc + Number(time)),
        requestedBy: cache.getUser().id,
      }));
    } else {
      let songInfo;
      try {
        songInfo = await ytdl.getInfo(query, { agent });
      } catch (error) {
        console.log(error);
        return this.callNextAction(cache);
      }

      songs.push({
        title: songInfo.videoDetails.title,
        thumbnail: songInfo.videoDetails.thumbnails[songInfo.videoDetails.thumbnails.length - 1].url,
        url: songInfo.videoDetails.video_url,
        author: songInfo.videoDetails.author.name,
        duration: songInfo.videoDetails.lengthSeconds,
        requestedBy: cache.getUser().id,
      });
    }

    if (!serverQueue) {
      const queueData = {
        connection: null,
        player: createAudioPlayer(),
        songs: [],
        currentIndex: 0,
        repeatMode: 0,
      };

      Bot.bot.queue.set(server.id, queueData);
      queueData.songs.push(...songs);

      let connection;
      try {
        connection = joinVoiceChannel({
          channelId: voiceChannel.id,
          guildId: server.id,
          adapterCreator: server.voiceAdapterCreator,
          selfDeaf: autoDeafen,
        });
      } catch {
        console.log('Could not join voice channel');
        queueData.player.stop();
        queueData.player.removeAllListeners();
        Bot.bot.queue.delete(server.id);
        return this.callNextAction(cache);
      }

      queueData.connection = connection;
      connection.subscribe(queueData.player);

      const stream = ytdl(queueData.songs[queueData.currentIndex].url, {
        filter: 'audioonly',
        fmt: 'mp3',
        highWaterMark: 1 << 30,
        liveBuffer: 20000,
        dlChunkSize: 1024 * 1024,
        quality: 'lowestaudio',
        bitrate: 128,
        agent,
      });
      const resource = createAudioResource(stream, { inlineVolume: true });
      resource.volume.setVolume(volume / 100);
      queueData.player.play(resource);

      queueData.player.on(AudioPlayerStatus.Idle, async () => {
        let nextSongUrl;
        if (queueData.repeatMode === 1) {
          nextSongUrl = queueData.songs[queueData.currentIndex].url;
        } else if (queueData.repeatMode === 2 && queueData.songs.length > 0) {
          queueData.currentIndex = (queueData.currentIndex + 1) % queueData.songs.length;
          nextSongUrl = queueData.songs[queueData.currentIndex].url;
        } else {
          queueData.currentIndex += 1;
          if (queueData.currentIndex < queueData.songs.length) {
            nextSongUrl = queueData.songs[queueData.currentIndex].url;
          } else {
            if (leaveOnEnd) {
              connection.disconnect();
            }
            return;
          }
        }

        const nextStream = ytdl(nextSongUrl, {
          filter: 'audioonly',
          fmt: 'mp3',
          highWaterMark: 1 << 30,
          liveBuffer: 20000,
          dlChunkSize: 1024 * 1024,
          quality: 'lowestaudio',
          bitrate: 128,
          agent,
        });
        const nextResource = createAudioResource(nextStream, { inlineVolume: true });
        nextResource.volume.setVolume(volume / 100);
        queueData.player.play(nextResource);
      });

      if (leaveOnEmpty) {
        Bot.bot.on('voiceStateUpdate', (oldState, newState) => {
          const botChannel = connection.joinConfig.channelId;
          if (!botChannel) return;

          const botVoiceChannel = server.channels.cache.get(botChannel);
          if (botVoiceChannel && botVoiceChannel.members.size === 1) {
            setTimeout(() => {
              if (botVoiceChannel.members.size === 1) {
                connection.disconnect();
              }
            }, seconds);
          }
        });
      }

      Bot.bot.on('voiceStateUpdate', (oldState, newState) => {
        if (oldState.channelId && !newState.channelId && oldState.member.id === Bot.bot.user.id) {
          connection.disconnect();
        }
      });

      connection.on(VoiceConnectionStatus.Disconnected, () => {
        connection.destroy();
        queueData.player.stop();
        queueData.player.removeAllListeners();
        Bot.bot.queue.delete(server.id);
      });
    } else if (data.type === '1') {
      const currentSong = serverQueue.songs[serverQueue.currentIndex];
      serverQueue.songs.splice(serverQueue.currentIndex + 1, 0, songs[0]);
      serverQueue.songs.splice(serverQueue.currentIndex + 2, 0, currentSong);
      serverQueue.player.stop();
    } else {
      serverQueue.songs.push(...songs);
    }

    const storage = parseInt(data.storage, 10);
    const varName2 = this.evalMessage(data.varName2, cache);
    this.storeValue(songs[0], storage, varName2, cache);
    this.callNextAction(cache);
  },

  mod() {},
};
