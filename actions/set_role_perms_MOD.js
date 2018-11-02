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
	const perm = ['Administrator', 'Manage Guild', 'Manage Nicknames', 'Manage Roles', 'Manage Emojis', 'Kick Members', 'Ban Members', 'View Audit Log', 'Change Nickname', 'Create Instant Invite', 'Priority Speaker', 'Manage Channel', 'Manage Webhooks', 'Read Messages', 'Send Messages', 'Send TTS Messages', 'Manage Messages', 'Embed Links', 'Attach Files', 'Read Message History', 'Mention Everyone', 'Use External Emojis', 'Add Reactions', 'Connect to Voice', 'Speak in Voice', 'Mute Members', 'Deafen Members', 'Move Members', 'Use Voice Activity']
  return `${roles[data.role]} - ${perm[data.permission]} - ${index[data.state]}`;
},

//---------------------------------------------------------------------
// DBM Mods Manager Variables (Optional but nice to have!)
//
// These are variables that DBM Mods Manager uses to show information
// about the mods for people to see in the list.
//---------------------------------------------------------------------

// Who made the mod (If not set, defaults to "DBM Mods")
author: "MrGold & EliteArtz",

// The version of the mod (Defaults to 1.0.0)
version: "1.9.1", //Added in 1.8.2

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
			Created by <b>MrGold</b> & <b>EliteArtz</b>!
		</p>
	</div><br>
<div style="padding-top: 8px;">
	<div style="float: left; width: 35%;">
		Source Role:<br>
		<select id="role" class="round" onchange="glob.roleChange(this, 'varNameContainer')">
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
			<option value="0" selected>Administrator</option>
			<option value="1">Manage Guild</option>
			<option value="2">Manage Nicknames</option>
			<option value="3">Manage Roles</option>
			<option value="4">Manage Emojis</option>
			<option value="5">Kick Members</option>
			<option value="6">Ban Members</option>
			<option value="7">View Audit Log</option>
			<option value="8">Change Nickname</option>
			<option value="9">Create Instant Invite</option>
			<option value="10">Priority Speaker</option>
			<option value="11">Manage Channel</option>
			<option value="12">Manage Webhooks</option>
			<option value="13">Read Messages</option>
			<option value="14">Send Messages</option>
			<option value="15">Send TTS Messages</option>
			<option value="16">Manage Messages</option>
			<option value="17">Embed Links</option>
			<option value="18">Attach Files</option>
			<option value="19">Read Message History</option>
			<option value="20">Mention Everyone</option>
			<option value="21">Use External Emojis</option>
			<option value="22">Add Reactions</option>
			<option value="23">Connect to Voice</option>
			<option value="24">Speak in Voice</option>
			<option value="25">Mute Members</option>
			<option value="26">Deafen Members</option>
			<option value="27">Move Members</option>
			<option value="28">Use Voice Activity</option>
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
	const info = parseInt(data.permission);
	
	let result;
	switch(info) {
		case 0:
			result = 8;
			break;
		case 1:
			result = 32;
			break;
		case 2:
			result = 134217728;
			break;
		case 3:
			result = 268435456;
			break;
		case 4:
			result = 1073741824;
			break;
		case 5:
			result = 2;
			break;
		case 6:
			result = 4;
			break;
		case 7:
			result = 128;
			break;
		case 8:
			result = 67108864;
			break;
		case 9:
			result = 1;
			break;
		case 10:
			result = 256;
			break;
		case 11:
			result = 16;
			break;
		case 12:
			result = 536870912;
			break;
		case 13:
			result = 1024;
			break;
		case 14:
			result = 2048;
			break;
		case 15:
			result = 4096;
			break;
		case 16:
			result = 8192;
			break;
		case 17:
			result = 16384;
			break;
		case 18:
			result = 32768;
			break;
		case 19:
			result = 65536;
			break;
		case 20:
			result = 131072;
			break;
		case 21:
			result = 262144;
			break;
		case 22:
			result = 64;
			break;
		case 23:
			result = 1048576;
			break;
		case 24:
			result = 2097152;
			break;
		case 25:
			result = 4194304;
			break;
		case 26:
			result = 8388608;
			break;
		case 27:
			result = 16777216;
			break;
		case 28:
			result = 33554432;
			break;
		default:
			break;
	}

	const options = {};
	options[data.permission] = data.state === "0" ? true : (data.state === "1" ? false : null);
	if(role && role.id) {
		if(Array.isArray(role)) {
			this.callListFunc(role, 'setPermissions', [role.id, options]).then(function() {
				this.callNextAction(cache);
			}.bind(this));
		} else if(role && role.setPermissions) {
			} if(data.state === "0") {
			    const perms = role.permissions
			    role.setPermissions([perms, result]).then(function() {
				    this.callNextAction(cache);
			    }.bind(this)).catch(this.displayError.bind(this, data, cache));
			} else if(data.state === "1") {
			    const perms2 = role.permissions - result
			    role.setPermissions([perms2]).then(function() {
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
