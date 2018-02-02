module.exports = {

//---------------------------------------------------------------------
// Action Name
//
// This is the name of the action displayed in the editor.
//---------------------------------------------------------------------

name: "Store Bot Client Info #2",

//---------------------------------------------------------------------
// Action Section
//
// This is the section the action will fall into.
//---------------------------------------------------------------------

section: "Deprecated",

//---------------------------------------------------------------------
// Action Subtitle
//
// This function generates the subtitle displayed next to the name.
//---------------------------------------------------------------------

subtitle: function(data) {
    const info = ['Bot Guilds Objects', 'Bot Guilds Names', 'Bot Guilds IDs', 'Bot Current Prefix', 'Bot Client ID'];
	return `Bot Client - ${info[parseInt(data.info)]}`;
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
	 version: "1.8.4",

	 // A short description to show on the mod line for this mod (Must be on a single line)
	 short_description: "Stores a list of Bots Guilds Objects/IDs/Names and your Bot tag + Client ID",

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
			dataType = "Guild";
			break;
		case 1:
			dataType = "Guild Name";
			break;
		case 2:
			dataType = "Guild ID";
            break;
        case 3:
            dataType = "Bot Tag";
            break;
        case 4:
            dataType = "Bot ID";
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
			Created by EliteArtz!<br>
			Merged into <b>Store Bot Client Info</b>.<br>
			Please use that action instead!
		</p>
	</div><br>
<div style="float: left; width: 80%;">
	Source Info:<br>
	<select id="info" class="round">
		<option value="0" selected>Bot Guilds Objects</option>
		<option value="1">Bot Guilds Names</option>
		<option value="2">Bot Guilds IDs</option>
		<option value="3">Bot Current Prefix</option>
		<option value="4">Bot Client ID</option>
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
    const botClient = this.getDBM().Bot.bot;
    const dibiem = this.getDBM();
	const data = cache.actions[cache.index];
	const info = parseInt(data.info);
	if(!botClient) {
		this.callNextAction(cache);
		return;
	}
	switch(info) {
		case 0:
		    result = botClient.guilds;
		    break;
		case 1:
		    result = botClient.guilds.array();
		    break;
		case 2:
		    result = botClient.guilds.map(guilds => guilds.id);
            break;
        case 3:
            result = dibiem.Files.data.settings.tag;
            break;
        case 4:
            result = dibiem.Files.data.settings.client;
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
