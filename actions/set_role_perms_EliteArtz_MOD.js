module.exports = {

//---------------------------------------------------------------------
// Action Name
//
// This is the name of the action displayed in the editor.
//---------------------------------------------------------------------

name: "Set Role Permissions",

//---------------------------------------------------------------------
// Action Section
//
// This is the section the action will fall into.
//---------------------------------------------------------------------

section: "Role Control",

//---------------------------------------------------------------------
// Action Subtitle
//
// This function generates the subtitle displayed next to the name.
//---------------------------------------------------------------------

subtitle: function(data) {
	const roles = ['Mentioned Role', '1st Author Role', '1st Server Role', 'Temp Variable', 'Server Variable', 'Global Variable'];
	const index = ['Yes', 'No']
  return `${index[data.state]} - ${data.permission} - ${data.varName}`;
},

//---------------------------------------------------------------------
	 // DBM Mods Manager Variables (Optional but nice to have!)
	 //
	 // These are variables that DBM Mods Manager uses to show information
	 // about the mods for people to see in the list.
	 //---------------------------------------------------------------------

	 // Who made the mod (If not set, defaults to "DBM Mods")
	 author: "EliteArtz",

	 // The version of the mod (Defaults to 1.0.0)
	 version: "1.8.2",

	 // A short description to show on the mod line for this mod (Must be on a single line)
	 short_description: "Allows it to edit a roles permissions",

	 // If it depends on any other mods by name, ex: WrexMODS if the mod uses something from WrexMods


	 //---------------------------------------------------------------------

//---------------------------------------------------------------------
// Action Fields
//
// These are the fields for the action. These fields are customized
// by creating elements with corresponding IDs in the HTML. These
// are also the names of the fields stored in the action's JSON data.
//---------------------------------------------------------------------

fields: ["role", "varName", "permission", "state"],

//---------------------------------------------------------------------
// Command HTML
//
// This function returns a string containing the HTML used for
// editting actions.
//
// The "isEvent" parameter will be true if this action is being used
// for an event. Due to their nature, events lack certain information,
// so edit the HTML to reflect this.
//
// The "data" parameter stores constants for select elements to use.
// Each is an array: index 0 for commands, index 1 for events.
// The names are: sendTargets, members, roles,
//                messages, servers, variables
//---------------------------------------------------------------------

html: function(isEvent, data) {
	return `
	<div>
		<p>
			<u>Mod Info:</u><br>
			Created by EliteArtz!
		</p><br>
		<p>
			<u>Notices:</u><br>
			- Requires Discord Bot Maker <b>BETA</b>
		</p>
	</div><br>
<div style="padding-top: 8px;">
	<div style="float: left; width: 35%;">
		Source Role:<br>
		<select id="role" name="second-list" class="round" onchange="glob.roleChange(this, 'varNameContainer')">
			${data.roles[isEvent ? 1 : 0]}
		</select>
	</div>
	<div id="varNameContainer" style="display: none; float: right; width: 60%;">
		Variable Name:<br>
		<input id="varName" class="round" type="text" list="variableList"><br>
	</div>
</div><br><br><br>
<div style="padding-top: 8px;">
	<div style="float: left; width: 45%;">
		Permission:<br>
		<select id="permission" class="round">
			${data.permissions[2]}
		</select>
	</div>
	<div style="padding-left: 5%; float: left; width: 55%;">
		Change To:<br>
  		<select id="state" class="round">
	  	<option value="0" selected>Yes</option>
	   	<option value="1">No</option>
		</select>
	</div>
</div>`
},

//---------------------------------------------------------------------
// Action Editor Init Code
//
// When the HTML is first applied to the action editor, this code
// is also run. This helps add modifications or setup reactionary
// functions for the DOM elements.
//---------------------------------------------------------------------

init: function() {
	const {glob, document} = this;

	glob.roleChange(document.getElementById('role'), 'varNameContainer')
},

//---------------------------------------------------------------------
// Action Bot Function
//
// This is the function for the action within the Bot's Action class.
// Keep in mind event calls won't have access to the "msg" parameter,
// so be sure to provide checks for variable existance.
//---------------------------------------------------------------------

action: function(cache) {
	const data = cache.actions[cache.index];
	const storage = parseInt(data.role);
	const varName = this.evalMessage(data.varName, cache);
	const role = this.getRole(storage, varName, cache);

	const options = {};
	options[data.permission] = data.state === "0" ? true : (data.state === "1" ? false : null);
	if(role && role.id) {
		if(Array.isArray(role)) {
			this.callListFunc(role, 'setPermissions', [permissions, [reason]]).then(function() {
				this.callNextAction(cache);
			}.bind(this));
		} else if(role && role.setPermissions) {
			role.setPermissions([data.permission], [data.state]).then(function() {
				this.callNextAction(cache);
			}.bind(this)).catch(this.displayError.bind(this, data, cache));
		} else {
			this.callNextAction(cache);
		}
	} else {
		this.callNextAction(cache);
	}
},

//---------------------------------------------------------------------
// Action Bot Mod
//
// Upon initialization of the bot, this code is run. Using the bot's
// DBM namespace, one can add/modify existing functions if necessary.
// In order to reduce conflictions between mods, be sure to alias
// functions you wish to overwrite.
//---------------------------------------------------------------------

mod: function(DBM) {
}

}; // End of module
