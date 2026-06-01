module.exports = {
  // ---------------------------------------------------------------------
  // Action Name
  //
  // This is the name of the action displayed in the editor.
  // ---------------------------------------------------------------------

  name: 'Edit Role',

  // ---------------------------------------------------------------------
  // Action Section
  //
  // This is the section the action will fall into.
  // ---------------------------------------------------------------------

  section: 'Role Control',

  // ---------------------------------------------------------------------
  // Action Subtitle
  //
  // This function generates the subtitle displayed next to the name.
  // ---------------------------------------------------------------------

  subtitle(data, presets) {
    return `${presets.getRoleText(data.storage, data.varName)}`;
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

  fields: ['roleName', 'hoist', 'mentionable', 'color', 'position', 'storage', 'varName', 'reason'],

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
<role-input dropdownLabel="Source Role" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></role-input>

<br><br><br>

<div style="padding-top: 8px;">
	<span class="dbminputlabel">Name</span><br>
	<input id="roleName" placeholder="Leave blank to not edit!" class="round" type="text">
</div>

<br>

<div style="float: left; width: calc(50% - 12px);">
	<span class="dbminputlabel">Display Separately</span><br>
	<select id="hoist" class="round">
		<option value="none" selected>Don't Edit</option>
		<option value="true">Yes</option>
		<option value="false">No</option>
	</select><br>
	<span class="dbminputlabel">Mentionable</span><br>
	<select id="mentionable" class="round">
		<option value="none" selected>Don't Edit</option>
		<option value="true">Yes</option>
		<option value="false">No</option>
	</select><br>
</div>

<div style="float: right; width: calc(50% - 12px);">
	<span class="dbminputlabel">Color</span><br>
	<input id="color" class="round" type="text" placeholder="Leave blank to not edit!"><br>
	<span class="dbminputlabel">Position</span><br>
	<input id="position" class="round" type="text" placeholder="Leave blank to not edit!"><br>
</div>

<br><br><br><br><br><br><br>

<hr class="subtlebar">

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

    const roleData = {};
    if (data.roleName) {
      roleData.name = this.evalMessage(data.roleName, cache);
    }
    if (data.color) {
      roleData.color = this.evalMessage(data.color, cache);
    }
    if (data.position) {
      roleData.position = parseInt(this.evalMessage(data.position, cache), 10);
    }
    if (data.hoist !== 'none') {
      roleData.hoist = data.hoist === 'true';
    }
    if (data.mentionable !== 'none') {
      roleData.mentionable = data.mentionable === 'true';
    }
    if (data.reason) {
      roleData.reason = this.evalMessage(data.reason, cache);
    }

    const role = await this.getRoleFromData(data.storage, data.varName, cache);

    if (Array.isArray(role)) {
      this.callListFunc(role, 'edit', [{ roleData }]).then(() => this.callNextAction(cache));
    } else if (role?.edit) {
      role
        .edit(roleData)
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
