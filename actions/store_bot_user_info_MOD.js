module.exports = {

//---------------------------------------------------------------------
// Action Name
//
// This is the name of the action displayed in the editor.
//---------------------------------------------------------------------

name: "Store Bot User Info",

//---------------------------------------------------------------------
// Action Section
//
// This is the section the action will fall into.
//---------------------------------------------------------------------

section: "Mods by Lasse",

//---------------------------------------------------------------------
// Action Subtitle
//
// This function generates the subtitle displayed next to the name.
//---------------------------------------------------------------------

subtitle: function(data) {
	const info = ['Username', 'Is bot?', 'Avatar URL', 'User ID', 'Account created', 'Status', 'Last Message'];
	return `Bot User - ${info[parseInt(data.info)]}`;
},

//---------------------------------------------------------------------
// Action Storage Function
//
// Stores the relevant variable info for the editor.
//---------------------------------------------------------------------

variableStorage: function(data, varType) {
	const type = parseInt(data.storage);
	if(type !== varType) return;
	const info = parseInt(data.info);
	let dataType = 'Unknown Type';
	switch(info) {
		case 0:
			dataType = "Text";
			break;
		case 1:
			dataType = "Boolean";
			break;
		case 2:
			dataType = "Text";
			break;
		case 3:
			dataType = "Number";
			break;
		case 4:
			dataType = "Date";
			break;
		case 5:
			dataType = "Text";
			break;
		case 6:
			dataType = "Text";
			break;
	}
	return ([data.varName2, dataType]);
},

//---------------------------------------------------------------------
// Action Fields
//
// These are the fields for the action. These fields are customized
// by creating elements with corresponding IDs in the HTML. These
// are also the names of the fields stored in the action's JSON data.
//---------------------------------------------------------------------

fields: ["info", "storage", "varName2"],

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
// The names are: sendTargets, members, roles, channels,
//                messages, servers, variables
//---------------------------------------------------------------------

html: function(isEvent, data) {
	return `
<div style="float: left; width: 80%;">
	Source Info:<br>
	<select id="info" class="round">
		<option value="0">Username</option>
		<option value="1">Is bot?</option>
		<option value="2">Avatar URL</option>
		<option value="3">User ID</option>
		<option value="4">Account created</option>
		<option value="5">Status</option>
		<option value="6">Last message</option>
	</select>
</div>
<div>
	<div style="float: left; width: 35%;">
		Store In:<br>
		<select id="storage" class="round">
			${data.variables[1]}
		</select>
	</div>
	<div id="varNameContainer2" style="float: right; width: 60%;">
		Variable Name:<br>
		<input id="varName2" class="round" type="text"><br>
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
},

//---------------------------------------------------------------------
// Action Bot Function
//
// This is the function for the action within the Bot's Action class.
// Keep in mind event calls won't have access to the "msg" parameter,
// so be sure to provide checks for variable existance.
//---------------------------------------------------------------------

action: function(cache) {
	const botClient = this.getDBM().Bot.bot.user;
	const data = cache.actions[cache.index];
	const info = parseInt(data.info);
	if(!botClient) {
		this.callNextAction(cache);
		return;
	}
	switch(info) {
		case 0:
			result = botClient.username;
			break;
		case 1:
			result = botClient.bot;
			break;
		case 2:
			result = botClient.avatarURL;
			break;
		case 3:
			result = botClient.id;
			break;
		case 4:
			result = botClient.createdAt;
			break;
		case 5:
			if(botClient.presence) {
				const status = botClient.presence.status;
				if(status === 'online') result = 'Online';
				else if(status === 'offline') result = 'Offline';
				else if(status === 'idle') result = 'Idle';
				else if(status === 'dnd') result = 'Do Not Disturb';
			}
			break;
		case 6:
			result = botClient.lastMessage;
			break;
		default:
		break;
	}
	if(result !== undefined) {
		const storage = parseInt(data.storage);
		const varName2 = this.evalMessage(data.varName2, cache);
		this.storeValue(result, storage, varName2, cache);
	}
	this.callNextAction(cache);
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
