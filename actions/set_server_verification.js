module.exports = {
  // ---------------------------------------------------------------------
  // Action Name
  //
  // This is the name of the action displayed in the editor.
  // ---------------------------------------------------------------------

  name: 'Set Server Verification',

  // ---------------------------------------------------------------------
  // Action Section
  //
  // This is the section the action will fall into.
  // ---------------------------------------------------------------------

  section: 'Server Control',

  // ---------------------------------------------------------------------
  // Action Subtitle
  //
  // This function generates the subtitle displayed next to the name.
  // ---------------------------------------------------------------------

  subtitle(data, presets) {
    const verifications = ['None', 'Low', 'Medium', 'High', 'Highest'];
    return `${presets.getServerText(data.server, data.varName)} - ${verifications[parseInt(data.verification, 10)]}`;
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

  fields: ['server', 'varName', 'verification', 'reason'],

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
<server-input dropdownLabel="Server" selectId="server" variableContainerId="varNameContainer" variableInputId="varName"></server-input>

<br><br><br>

<div style="padding-top: 8px;">
	<span class="dbminputlabel">Verification Level</span><br>
	<select id="verification" class="round">
		<option value="0">None</option>
		<option value="1">Low</option>
		<option value="2">Medium</option>
		<option value="3">High</option>
		<option value="4">Highest</option>
	</select>
</div>

<br>

<div>
	<span class="dbminputlabel">Reason</span>
	<input id="reason" placeholder="Optional" class="round" type="text">
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
    const server = await this.getServerFromData(data.server, data.varName, cache);
    const reason = this.evalMessage(data.reason, cache);

    const { GuildVerificationLevel } = this.getDBM().DiscordJS;
    let level = GuildVerificationLevel.None;
    switch (data.verification) {
      case '0':
        level = GuildVerificationLevel.None;
      case '1':
        level = GuildVerificationLevel.Low;
      case '2':
        level = GuildVerificationLevel.Medium;
      case '3':
        level = GuildVerificationLevel.High;
      case '4':
        level = GuildVerificationLevel.VeryHigh;
    }

    if (Array.isArray(server)) {
      this.callListFunc(server, 'setVerificationLevel', [level, reason]).then(() => this.callNextAction(cache));
    } else if (server?.setVerificationLevel) {
      server
        .setVerificationLevel(level, reason)
        .then(() => this.callNextAction(cache))
        .catch((err) => this.displayError(data, cache, err));
    } else {
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
