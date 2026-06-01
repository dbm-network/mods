module.exports = {
  // ---------------------------------------------------------------------
  // Action Name
  //
  // This is the name of the action displayed in the editor.
  // ---------------------------------------------------------------------

  name: 'Play File',

  // ---------------------------------------------------------------------
  // Action Section
  //
  // This is the section the action will fall into.
  // ---------------------------------------------------------------------

  section: 'Audio Control',

  // ---------------------------------------------------------------------
  // Requires Audio Libraries
  //
  // If 'true', this action requires audio libraries to run.
  // ---------------------------------------------------------------------

  requiresAudioLibraries: true,

  // ---------------------------------------------------------------------
  // Action Subtitle
  //
  // This function generates the subtitle displayed next to the name.
  // ---------------------------------------------------------------------

  subtitle(data, presets) {
    return `${data.url}`;
  },

  // ---------------------------------------------------------------------
  // Action Meta Data
  //
  // Helps check for updates and provides info if a custom mod.
  // If this is a third-party mod, please set "author" and "authorUrl".
  //
  // It's highly recommended "preciseCheck" is set to false for third-party mods.
  // This will make it so the patch version (0.0.X) is not checked.
  // ---------------------------------------------------------------------

  meta: {
    version: '2.2.0',
    preciseCheck: true,
    author: 'DarkXenei',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods',
  },

  // ---------------------------------------------------------------------
  // Action Fields
  //
  // These are the fields for the action. These fields are customized
  // by creating elements with corresponding IDs in the HTML. These
  // are also the names of the fields stored in the action's JSON data.
  // ---------------------------------------------------------------------

  fields: ['url', 'seek', 'volume', 'bitrate', 'type'],

  // ---------------------------------------------------------------------
  // Command HTML
  //
  // This function returns a string containing the HTML used for
  // editing actions.
  //
  // The "isEvent" parameter will be true if this action is being used
  // for an event. Due to their nature, events lack certain information,
  // so edit the HTML to reflect this.
  // ---------------------------------------------------------------------

  html(isEvent, data) {
    return `
    <div class="dbmmodsbr1" style="height: 59px">
    <p>Mod Info:</p>
    <p>Created by DarkXenei</p>
    <p>
      Help:
      <a
        href="https://discord.gg/9HYB4n3Dz4"
        target="_blank"
        style="color: #0077ff; text-decoration: none"
        >discord</a
      >
    </p>
  </div>
  
  <div class="dbmmodsbr dbmmodsbr2">
    <p>Mod Version:</p>
    <p>
      <a
        href="https://github.com/Shadow64gg/DBM-14"
        target="_blank"
        style="color: #0077ff; text-decoration: none"
        >1.1</a
      >
    </p>
  </div>
  
  <style>
    .dbmmodsbr1,
    .dbmmodsbr2 {
      position: absolute;
      bottom: 0px;
      background: rgba(0, 0, 0, 0.7);
      color: #999;
      padding: 5px;
      font-size: 12px;
      z-index: 999999;
      cursor: pointer;
      line-height: 1.2;
      border-radius: 8px;
      transition: transform 0.3s ease, background-color 0.6s ease, color 0.6s ease;
    }
  
    .dbmmodsbr1 {
      left: 0px;
      border: 2px solid rgba(50, 50, 50, 0.7);
    }
  
    .dbmmodsbr2 {
      right: 0px;
      text-align: center;
    }
  
    .dbmmodsbr1:hover,
    .dbmmodsbr2:hover {
      transform: scale(1.01);
      background-color: rgba(29, 29, 29, 0.9);
      color: #fff;
    }
  
    .dbmmodsbr1 p,
    .dbmmodsbr2 p {
      margin: 0;
      padding: 0;
    }
  
    .dbmmodsbr1 a,
    .dbmmodsbr2 a {
      font-size: 12px;
      color: #0077ff;
      text-decoration: none;
    }
  
    .dbmmodsbr1 a:hover,
    .dbmmodsbr2 a:hover {
      text-decoration: underline;
    }
  </style>
  

  <div>
      <span class="dbminputlabel">Local URL</span><br>
      <input id="url" class="round" type="text" value="resources/"><br>
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
  </div>`;
  },

  // ---------------------------------------------------------------------
  // Action Editor Init Code
  //
  // When the HTML is first applied to the action editor, this code
  // is also run. This helps add modifications or setup reactionary
  // functions for the DOM elements.
  // ---------------------------------------------------------------------

  init() {},

  // ---------------------------------------------------------------------
  // Action Bot Function
  //
  // This is the function for the action within the Bot's Action class.
  // Keep in mind event calls won't have access to the "msg" parameter,
  // so be sure to provide checks for variable existence.
  // ---------------------------------------------------------------------

  async action(cache) {
    const data = cache.actions[cache.index];
    const { createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');

    // Pobranie aktywnego po³¹czenia
    const connection = this.getVariable(1, 'activeVoiceConnection', cache);
    if (!connection) {
      console.error('No active voice connection found.');
      this.callNextAction(cache);
      return;
    }

    const url = this.evalMessage(data.url, cache);
    if (!url) {
      console.error('No audio file URL provided.');
      this.callNextAction(cache);
      return;
    }

    const seek = parseInt(this.evalMessage(data.seek, cache), 10) || 0;
    const volume = parseInt(this.evalMessage(data.volume, cache), 10) || 100;
    const bitrate = parseInt(this.evalMessage(data.bitrate, cache), 10) || 128000;
    const type = parseInt(data.type, 10) || 0;

    const player = createAudioPlayer();
    connection.subscribe(player);

    const resource = createAudioResource(url, {
      inlineVolume: true,
      seek,
      bitrate,
    });

    resource.volume.setVolume(volume / 100);
    player.play(resource);

    player.on(AudioPlayerStatus.Idle, () => {
      if (type === 0) {
        connection.destroy();
        this.callNextAction(cache);
      }
    });

    player.on('error', (error) => {
      console.error('Error in audio player:', error);
      connection.destroy();
      this.callNextAction(cache);
    });

    if (type === 1) {
      this.callNextAction(cache);
    }
  },
  // ---------------------------------------------------------------------
  // Action Bot Mod
  //
  // Upon initialization of the bot, this code is run. Using the bot's
  // DBM namespace, one can add/modify existing functions if necessary.
  // In order to reduce conflicts between mods, be sure to alias
  // functions you wish to overwrite.
  // ---------------------------------------------------------------------

  mod() {},
};
