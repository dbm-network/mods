module.exports = {

//---------------------------------------------------------------------
// Action Name
//
// This is the name of the action displayed in the editor.
//---------------------------------------------------------------------

name: "Randomize Letters",

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
	return `Randomize [${data.input}]`;
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
	version: "1.8.6",

	// A short description to show on the mod line for this mod (Must be on a single line)
	short_description: "Randomize words!",

	// If it depends on any other mods by name, ex: WrexMODS if the mod uses something from WrexMods

//---------------------------------------------------------------------
// Action Storage Function
//
// Stores the relevant variable info for the editor.
//---------------------------------------------------------------------

variableStorage: function(data, varType) {
	const type = parseInt(data.storage);
	if(type !== varType) return;
	let dataType = 'Randomized Letters';
	return ([data.varName, dataType]);
},
//---------------------------------------------------------------------
// Action Fields
//
// These are the fields for the action. These fields are customized
// by creating elements with corresponding IDs in the HTML. These
// are also the names of the fields stored in the action's JSON data.
//---------------------------------------------------------------------

fields: ["input", "wordLength", "storage", "varName"],

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
<div id="modinfo">
	<p>
	   <u>Mod Info:</u><br>
	   Made by EGGSY!<br>
	</p>
	<div style="float: left; width: 60%; padding-top: 8px;">
	   Randomize Letters:<br>
	   <input id="input" class="round" type="text" placeholder="Use '*' for all options.">
	</div>
	<div style="float: right; width: 35%; padding-top: 8px;">
	   Random Word Length:<br>
	   <input id="wordLength" class="round" type="text">
	</div><br><br><br>
	<div style="float: left; width: 35%; padding-top: 8px;">
		Store Result In:<br>
		<select id="storage" class="round" onchange="glob.variableChange(this, 'varNameContainer')">
			${data.variables[0]}
		</select>
	</div>
	<div id="varNameContainer" style="float: right; display: none; width: 60%; padding-top: 8px;">
		Variable Name:<br>
		<input id="varName" class="round" type="text">
	</div><br><br><br><br>
	<div id="commentSection" style="padding-top: 8px;">
		<p>
		<b>Randomize Letters Options:</b><br>	
		a: Lowercase alpha characters (abcdefghijklmnopqrstuvwxyz')<br>
		A: Uppercase alpha characters (ABCDEFGHIJKLMNOPQRSTUVWXYZ')<br>
		0: Numeric characters (0123456789')<br>
		!: Special characters (~!@#$%^&()_+-={}[];\',.)<br>
		*: All characters (all of the above combined)<br>
		?: Custom characters (pass a string of custom characters to the options)
		</p>
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

	glob.variableChange(document.getElementById('storage'), 'varNameContainer');
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
	const Input = this.evalMessage(data.input, cache);
	const wordLength = this.evalMessage(data.wordLength, cache);

	// Check if everything is ok
	if(!Input) return console.log("Please specify letters to randomize.");
	if(!wordLength) return console.log("Please specify amount of randomized letters.");
	
	// Main code
	var WrexMODS = this.getWrexMods(); // I will always use Wrex' thing so I won't explain this everytime! Go go Wrex!
	const randomize = WrexMODS.require('randomatic');
	var random = randomize(Input, wordLength);

	// Storing
	const storage = parseInt(data.storage);
	const varName = this.evalMessage(data.varName, cache);
	this.storeValue(random, storage, varName, cache);

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