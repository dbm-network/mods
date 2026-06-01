module.exports = {
  // ---------------------------------------------------------------------
  // Action Name
  //
  // This is the name of the action displayed in the editor.
  // ---------------------------------------------------------------------

  name: 'Find Member',

  // ---------------------------------------------------------------------
  // Action Section
  //
  // This is the section the action will fall into.
  // ---------------------------------------------------------------------

  section: 'Member Control',

  // ---------------------------------------------------------------------
  // Action Subtitle
  //
  // This function generates the subtitle displayed next to the name.
  // ---------------------------------------------------------------------

  subtitle(data, presets) {
    const info = ['Member ID', 'Member Username', 'Member Display Name', 'Member Color', 'Member Tag'];
    return `Find Member by ${info[parseInt(data.info, 10)]}`;
  },

  // ---------------------------------------------------------------------
  // Action Storage Function
  //
  // Stores the relevant variable info for the editor.
  // ---------------------------------------------------------------------

  variableStorage(data, varType) {
    const type = parseInt(data.storage, 10);
    if (type !== varType) return;
    return [data.varName, 'Server Member'];
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

  fields: ['info', 'find', 'storage', 'varName'],

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
	<div style="float: left; width: 40%;">
		<span class="dbminputlabel">Source Field</span><br>
		<select id="info" class="round">
			<option value="0" selected>Member ID</option>
			<option value="1">Member Username</option>
			<option value="2">Member Display Name</option>
			<option value="3">Member Color</option>
			<option value="4">Member Tag (Deprecated)</option>
		</select>
	</div>
	<div style="float: right; width: 55%;">
		<span class="dbminputlabel">Search Value</span><br>
		<input id="find" class="round" type="text">
	</div>
</div>

<br><br><br>

<store-in-variable style="padding-top: 8px;" dropdownLabel="Store In" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName" selectWidth="40%" variableInputWidth="55%"></store-in-variable>`;
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
    const server = cache.server;
    if (!server?.members) {
      this.callNextAction(cache);
      return;
    }

    const data = cache.actions[cache.index];
    const info = parseInt(data.info, 10);
    const find = this.evalMessage(data.find, cache);
    if (server.memberCount !== server.members.cache.size) server.members.fetch();
    const members = server.members.cache;
    let result;
    switch (info) {
      case 0:
        result = members.get(find);
        break;
      case 1:
        result = members.find((m) => m.user?.username === find);
        break;
      case 2:
        result = members.find((m) => m.displayName === find);
        break;
      case 3:
        result = members.find((m) => m.displayHexColor === find);
        break;
      case 4: // Leave this here until the username update is actually finished.
        result = members.find((m) => m.user?.tag === find);
        break;
      default:
        break;
    }

    if (result !== undefined) {
      const storage = parseInt(data.storage, 10);
      const varName = this.evalMessage(data.varName, cache);
      this.storeValue(result, storage, varName, cache);
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
