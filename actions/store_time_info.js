module.exports = {

//---------------------------------------------------------------------
// Action Name
//
// This is the name of the action displayed in the editor.
//---------------------------------------------------------------------

name: "Store Time Info",

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
	const time = ['Year', 'Month', 'Day of the Month', 'Hour', 'Minute', 'Second', 'Milisecond', 'Month (text)'];
	return `${time[parseInt(data.type)]}`;
},

//---------------------------------------------------------------------
// Action Storage Function
//
// Stores the relevant variable info for the editor.
//---------------------------------------------------------------------

variableStorage: function(data, varType) {
	const type = parseInt(data.storage);
	if(type !== varType) return;
	let result = "Number";
	if(data.type === "7") {
		result = "Text";
	}
	return ([data.varName, result]);
},

//---------------------------------------------------------------------
// Action Fields
//
// These are the fields for the action. These fields are customized
// by creating elements with corresponding IDs in the HTML. These
// are also the names of the fields stored in the action's JSON data.
//---------------------------------------------------------------------

fields: ["type", "storage", "varName"],

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
	<div style="padding-top: 8px; width: 70%;">
		Time Info:<br>
		<select id="type" class="round">
			<option value="0" selected>Year</option>
			<option value="1">Month (Number)</option>
			<option value="7">Month (Text)</option>
			<option value="2">Day of the Month</option>
			<option value="3">Hour</option>
			<option value="4">Minute</option>
			<option value="5">Second</option>
			<option value="6">Milisecond</option>
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
	<div id="varNameContainer" style="float: right; width: 60%;">
		Variable Name:<br>
		<input id="varName" class="round" type="text"><br>
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
	const data = cache.actions[cache.index];
	const type = parseInt(data.type);
	let result;
	switch(type) {
		case 0:
			result = new Date().getFullYear();
			break;
		case 1:
			result = new Date().getMonth() + 1;
			break;
		case 2:
			result = new Date().getDate();
			break;
		case 3:
			result = new Date().getHours();
			break;
		case 4:
			result = new Date().getMinutes();
			break;
		case 5:
			result = new Date().getSeconds();
			break;
		case 6:
			result = new Date().getMiliseconds();
			break;
		case 7:
			const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
			result = months[(new Date().getMonth())];
		default:
			break;
	}
	//console.log((new Date()).year)
	if(result !== undefined) {
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