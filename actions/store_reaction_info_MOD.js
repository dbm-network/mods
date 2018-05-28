module.exports = {

//---------------------------------------------------------------------
// Action Name
//
// This is the name of the action displayed in the editor.
//---------------------------------------------------------------------

name: "Store Reaction Info",

//---------------------------------------------------------------------
// Action Section
//
// This is the section the action will fall into.
//---------------------------------------------------------------------

section: "Messaging",

//---------------------------------------------------------------------
// Action Subtitle
//
// This function generates the subtitle displayed next to the name.
//---------------------------------------------------------------------

subtitle: function(data) {
	const reaction = ['You cheater!', 'Temp Variable', 'Server Variable', 'Global Variable'];
	const info = ['Message Object', 'Bot reacted?', 'User List', 'Emoji Name', 'Reaction Count', 'User'];
	return `${reaction[parseInt(data.reaction)]} - ${info[parseInt(data.info)]}`;
},

//---------------------------------------------------------------------
// DBM Mods Manager Variables (Optional but nice to have!)
//
// These are variables that DBM Mods Manager uses to show information
// about the mods for people to see in the list.
//---------------------------------------------------------------------

// Who made the mod (If not set, defaults to "DBM Mods")
author: "Lasse",

// The version of the mod (Defaults to 1.0.0)
version: "1.8.8", //Added in 1.8.8

// A short description to show on the mod line for this mod (Must be on a single line)
short_description: "Stores Messages Reaction information",

// If it depends on any other mods by name, ex: WrexMODS if the mod uses something from WrexMods
depends_on_mods: [
{name:'custommods',path:'abb_custom_methods_MOD.js'}
],


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
			dataType = "Message";
			break;
		case 1:
			dataType = "Boolean";
			break;
		case 2:
			dataType = "List";
			break;
		case 3:
			dataType = "String";
			break;
		case 4:
			dataType = "Number";
			break;
		case 5:
			dataType = "User";
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

fields: ["reaction", "varName", "info", "storage", "varName2"],

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
			Created by Lasse!
		</p>
	</div><br>
<div>
	<div style="float: left; width: 35%;">
		Source Reaction:<br>
		<select id="reaction" class="round" onchange="glob.refreshVariableList(this)">
			${data.variables[1]}
		</select>
	</div>
	<div id="varNameContainer" style="float: right; width: 60%;">
		Variable Name:<br>
		<input id="varName" class="round" type="text" list="variableList"><br>
	</div>
</div><br><br><br>
<div>
	<div style="padding-top: 8px; width: 70%;">
		Source Info:<br>
		<select id="info" class="round">
			<option value="0" selected>Message Object</option>
			<option value="5">User Who Reacted</option>
			<option value="1">Bot Reacted?</option>
			<option value="2">User Who Reacted List</option>
			<option value="3">Emoji Name</option>
			<option value="4">Same Reaction Count</option>
		</select>
	</div>
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
//display: none;
//---------------------------------------------------------------------
// Action Editor Init Code
//
// When the HTML is first applied to the action editor, this code
// is also run. This helps add modifications or setup reactionary
// functions for the DOM elements.
//---------------------------------------------------------------------

init: function() {
	const {glob, document} = this;

	glob.refreshVariableList(document.getElementById('reaction'));
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
	const reaction = parseInt(data.reaction);
	const varName = this.evalMessage(data.varName, cache);
	const info = parseInt(data.info);
	var custommethods = this.getcustommethods(); //Find abb_custom_methods_MOD
	const rea = custommethods.getReaction(reaction, varName, cache); //Get Reaction
	if(!custommethods) console.log('Store Reaction Info ERROR: You need abb_custom_methods_MOD.js to use this modification'); //If abb_custom_methods_MOD.js file is missing -> Error
	if(custommethods.Version < "1.0.1") console.log('Store Reaction Info ERROR: Please update abb_custom_methods_MOD.js to 1.0.1 or newer to use this modification'); //If custommethods are too old -> Error
	if(!rea) {
		console.log('This is not a reaction'); //Variable is not a reaction -> Error
		this.callNextAction(cache);
	}
	let result;
	switch(info) {
		case 0:
			result = rea.message; //Message Object
			break;
		case 1:
			result = rea.me; //This bot reacted?
			break;
		case 2:
			result = rea.users.array(); //All users who reacted list
			break;
		case 3:
			result = rea.emoji.name; //Emoji (/Reaction) name
			break;
		case 4:
			result = rea.count; //Number (user+bots) who reacted like this
			break;
		case 5:
			const lastid = rea.users.lastKey(); //Stores last user ID reacted
			result = cache.server.members.find('id', lastid);
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
