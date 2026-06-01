module.exports = {
  // ---------------------------------------------------------------------
  // Action Name
  //
  // This is the name of the action displayed in the editor.
  // ---------------------------------------------------------------------

  name: 'Check Variable Type',

  // ---------------------------------------------------------------------
  // Action Section
  //
  // This is the section the action will fall into.
  // ---------------------------------------------------------------------

  section: 'Conditions',

  // ---------------------------------------------------------------------
  // Action Subtitle
  //
  // This function generates the subtitle displayed next to the name.
  // ---------------------------------------------------------------------

  subtitle(data, presets) {
    return `${presets.getConditionsText(data)}`;
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

  fields: ['storage', 'varName', 'comparison', 'branch'],

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
<retrieve-from-variable allowSlashParams dropdownLabel="Variable" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></retrieve-from-variable>

<br><br><br>

<div style="padding-top: 8px; width: 80%;">
		<span class="dbminputlabel">Variable Type to Check</span><br>
		<select id="comparison" class="round">
			<option value="0" selected>Number</option>
			<option value="1">String</option>
			<option value="2">Image</option>
			<option value="3">Member</option>
			<option value="4">Message</option>
			<option value="5">Text Channel</option>
			<option value="6">Voice Channel</option>
			<option value="7">Role</option>
			<option value="8">Server</option>
			<option value="9">Emoji</option>
			<option value="10">Sticker</option>
			<option value="11">Thread Channel</option>
		</select>
</div>

<br>

<hr class="subtlebar">

<br>

<conditional-input id="branch"></conditional-input>`;
  },

  // ---------------------------------------------------------------------
  // Action Editor Pre-Init Code
  //
  // Before the fields from existing data in this action are applied
  // to the user interface, this function is called if it exists.
  // The existing data is provided, and a modified version can be
  // returned. The returned version will be used if provided.
  // This is to help provide compatibility with older versions of the action.
  //
  // The "formatters" argument contains built-in functions for formatting
  // the data required for official DBM action compatibility.
  // ---------------------------------------------------------------------

  preInit(data, formatters) {
    return formatters.compatibility_2_0_0_iftruefalse_to_branch(data);
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

  action(cache) {
    const data = cache.actions[cache.index];
    const type = parseInt(data.storage, 10);
    const varName = this.evalMessage(data.varName, cache);
    const variable = this.getVariable(type, varName, cache);
    let result = false;
    if (variable) {
      const DiscordJS = this.getDBM().DiscordJS;
      const compare = parseInt(data.comparison, 10);
      switch (compare) {
        case 0:
          result = typeof variable === 'number';
          break;
        case 1:
          result = typeof variable === 'string';
          break;
        case 2:
          result = this.getDBM().Images.isImage(variable);
          break;
        case 3:
          result = variable instanceof DiscordJS.GuildMember;
          break;
        case 4:
          result = variable instanceof DiscordJS.Message;
          break;
        case 5:
          result = variable instanceof DiscordJS.TextChannel || variable instanceof DiscordJS.NewsChannel;
          break;
        case 6:
          result = variable instanceof DiscordJS.VoiceChannel;
          break;
        case 7:
          result = variable instanceof DiscordJS.Role;
          break;
        case 8:
          result = variable instanceof DiscordJS.Guild;
          break;
        case 9:
          result = variable instanceof DiscordJS.Emoji || variable instanceof DiscordJS.GuildEmoji;
          break;
        case 10:
          result = variable instanceof DiscordJS.Sticker;
          break;
        case 11:
          result = variable instanceof DiscordJS.ThreadChannel;
          break;
      }
    }

    this.executeResults(result, data?.branch ?? data, cache);
  },

  // ---------------------------------------------------------------------
  // Action Bot Mod Init
  //
  // An optional function for action mods. Upon the bot's initialization,
  // each command/event's actions are iterated through. This is to
  // initialize responses to interactions created within actions
  // (e.g. buttons and select menus for Send Message).
  //
  // If an action provides inputs for more actions within, be sure
  // to call the `this.prepareActions` function to ensure all actions are
  // recursively iterated through.
  // ---------------------------------------------------------------------

  modInit(data) {
    this.prepareActions(data.branch?.iftrueActions);
    this.prepareActions(data.branch?.iffalseActions);
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
