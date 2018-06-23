module.exports = {

//---------------------------------------------------------------------
// Action Name
//
// This is the name of the action displayed in the editor.
//---------------------------------------------------------------------

name: "Math Operation",

//---------------------------------------------------------------------
// Action Section
//
// This is the section the action will fall into.
//---------------------------------------------------------------------

section: "Other Stuff",

//---------------------------------------------------------------------
// Action Subtitle
//
// This function generates the subtitle displayed next to the name.
//---------------------------------------------------------------------

subtitle: function(data) {
	const info = ['Round', 'Absolute', 'Ceil', 'Floor', 'Sine', 'Cosine', 'Tangent', 'Arc Sine', 'Arc Cosine', 'Arc Tangent'];
	return `${info[data.info]}`;
},
	
//---------------------------------------------------------------------
// DBM Mods Manager Variables (Optional but nice to have!)
//
// These are variables that DBM Mods Manager uses to show information
// about the mods for people to see in the list.
//---------------------------------------------------------------------

// Who made the mod (If not set, defaults to "DBM Mods")
author: "iAmaury",

// The version of the mod (Defaults to 1.0.0)
version: "1.8.9",

// A short description to show on the mod line for this mod (Must be on a single line)
short_description: "Do math operations using the Math object",

// If it depends on any other mods by name, ex: WrexMODS if the mod uses something from WrexMods

//---------------------------------------------------------------------
// Action Storage Function
//
// Stores the relevant variable info for the editor.
//---------------------------------------------------------------------

variableStorage: function (data, varType) {
	const type = parseInt(data.storage);
	if (type !== varType) return;
	let dataType = 'Number';
	return ([data.varName, dataType]);
},

//---------------------------------------------------------------------
// Action Fields
//
// These are the fields for the action. These fields are customized
// by creating elements with corresponding IDs in the HTML. These
// are also the names of the fields stored in the action's JSON data.
//---------------------------------------------------------------------

fields: ["math", "info", "storage", "varName"],

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
	<div style="float: left; width: 30%; padding-top: 8px;">
		<p><u>Mod Info:</u><br>
		Made by <b>iAmaury</b> !</p>
	</div>
	<div style="float: right; width: 60%; padding-top: 8px;">
		<p><u>Note:</u><br>
		Get more informations <a href="https://www.w3schools.com/js/js_math.asp">here</a>.
	</div><br>
</div><br><br>
<div style="padding-top: 8px;">
	Source Number:
	<textarea id="math" rows="2" placeholder="Insert number(s) here..." style="width: 99%; font-family: monospace; white-space: nowrap; resize: none;"></textarea>
</div><br>
<div style="padding-top: 8px; width: 60%;">
	Math Operation:
	<select id="info" class="round">
			<option value="0" selected>Round</option>
			<option value="1">Absolute</option>
			<option value="2">Ceil</option>
			<option value="3">Floor</option>
			<option value="4">Sine</option>
			<option value="5">Cosine</option>
			<option value="6">Tangent</option>
			<option value="7">Arc Sine</option>
			<option value="8">Arc Cosine</option>
			<option value="9">Arc Tangent</option>
	</select>
</div><br>
<div style="padding-top: 8px;">
	<div style="float: left; width: 35%;">
		Store In:<br>
		<select id="storage" class="round">
			${data.variables[1]}
		</select>
	</div>
	<div id="varNameContainer" style="float: right; width: 60%;">
		Variable Name:<br>
		<input id="varName" class="round" type="text">
	</div>
</div>
	`
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
	const data = cache.actions[cache.index];
	const storage = parseInt(data.storage);
	const varName = this.evalMessage(data.varName, cache);
	const math = parseInt(this.evalMessage(data.math, cache));
	const info = parseInt(data.info);

	if(!math) {
		console.log("There is no number !")
		this.callNextAction(cache);
	}
	let result;
	switch(info) {
		case 0:
			result = Math.round(math);
			break;
		case 1:
			result = Math.abs(math);
			break;
		case 2:
			result = Math.ceil(math);
			break;
		case 3:
			result = Math.floor(math);
			break;
		case 4:
			result = Math.sin(math);
			break;
		case 5:
			result = Math.cos(math);
			break;
		case 6:
			result = Math.tan(math);
			break;
		case 7:
			result = Math.asin(math);
			break;
		case 8:
			result = Math.acos(math);
			break;
		case 9:
			result = Math.atan(math);
			break;
		default:
			break;
	}
	if (result !== undefined) {
		const storage = parseInt(data.storage);
		const varName = this.evalMessage(data.varName, cache);
		this.storeValue(result, storage, varName, cache);
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