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

  meta: { version: '2.2.0', preciseCheck: true, author: null, authorUrl: null, downloadUrl: null },

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
    const Audio = this.getDBM().Audio;
    const options = {};
    if (data.seek) {
      options.seek = parseInt(this.evalMessage(data.seek, cache), 10);
    }
    if (data.volume) {
      options.volume = parseInt(this.evalMessage(data.volume, cache), 10) / 100;
    }
    if (data.bitrate) {
      options.bitrate = parseInt(this.evalMessage(data.bitrate, cache), 10);
    }
    const url = this.evalMessage(data.url, cache);
    if (url) {
      const info = ['file', options, url];
      await Audio.addAudio(info, cache.server, data.type === '0');
    }
    this.callNextAction(cache);
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
