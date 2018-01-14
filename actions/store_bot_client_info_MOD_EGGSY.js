module.exports = {

//---------------------------------------------------------------------
// Action Name
//
// This is the name of the action displayed in the editor.
//---------------------------------------------------------------------

name: "Store Bot Client Info #3",

//---------------------------------------------------------------------
// Action Section
//
// This is the section the action will fall into.
//---------------------------------------------------------------------

section: "Bot Client Control",

//---------------------------------------------------------------------
// Action Subtitle
//
// This function generates the subtitle displayed next to the name.
//---------------------------------------------------------------------

subtitle: function(data) {
	const info = ['Total Amount of Channels', 'Total Amount of Emojis', 'Bot\'s Previous Pings', 'Uptime in Days', 'Uptime in Days (Rounded)', 'Memory (RAM) Usage'];
	return `${info[parseInt(data.info)]}`;
},

//---------------------------------------------------------------------
	 // DBM Mods Manager Variables (Optional but nice to have!)
	 //
	 // These are variables that DBM Mods Manager uses to show information
	 // about the mods for people to see in the list.
	 //---------------------------------------------------------------------

	 // Who made the mod (If not set, defaults to "DBM Mods")
	 author: "EGGSY",

	 // The version of the mod (Defaults to 1.0.0)
	 version: "1.0.3",

	 // A short description to show on the mod line for this mod (Must be on a single line)
	 short_description: "Stores more Bot Client Information by EGGSY",

	 // If it depends on any other mods by name, ex: WrexMODS if the mod uses something from WrexMods


	 //---------------------------------------------------------------------

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
			dataType = "Number";
			break;
		case 1:
			dataType = "Number";
			break;
		case 2:
			dataType = "Number";
			break;
		case 3:
			dataType = "Time";
			break;
		case 4:
			dataType = "Time";
			break;
		case 5:
			dataType = "Number";
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
	<div>
		<p>
			<u>Mod Info:</u><br>
			Created by EGGSY!
		</p>
	</div><br>
<div style="float: left; width: 80%;">
	Source Info:<br>
	<select id="info" class="round">
		<option value="0">Total Amount of Channels</option>
		<option value="1">Total Amount of Emojis</option>
		<option value="2">Bot's Previous Pings</option>
		<option value="3">Uptime in Days</option>
		<option value="4">Uptime in Days (Rounded)</option>
		<option value="5">Memory (RAM) Usage</option>
	</select>
</div><br>
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
	const {glob, document} = this;

	glob.messageChange(document.getElementById('message'), 'varNameContainer')
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
	const botClient = this.getDBM().Bot.bot;
	const info = parseInt(data.info);
	const msToDay = (1000*60*60*24);
	if(!botClient) {
		this.callNextAction(cache);
		return;
	}
	switch(info) {
		case 0:
			result = botClient.channels.size;
			break;
		case 1:
			result = botClient.emojis.size;
			break;
		case 2:
			result = botClient.pings;
			break;
		case 3:
			result = botClient.uptime/msToDay;
			break;
		case 4:
			result = Math.floor(botClient.uptime/msToDay);
			break;
		case 5:
			result = "%" + ((process.memoryUsage().heapUsed / 1024) / 1024).toFixed(2);
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

}; // End of module, thanks to Lasse btw!
