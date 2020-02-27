module.exports = {

//---------------------------------------------------------------------
// Action Name
//
// This is the name of the action displayed in the editor.
//---------------------------------------------------------------------

name: "Generate Random Word(s)",

//---------------------------------------------------------------------
// DBM Mods Manager Variables (Optional but nice to have!)
//
// These are variables that DBM Mods Manager uses to show information
// about the mods for people to see in the list.
//---------------------------------------------------------------------

// Who made the mod (If not set, defaults to "DBM Mods")
author: "TheMonDon",

// The version of the mod (Last edited version number of DBM Mods)
version: "1.9.5", //added in 1.9.5

// A short description to show on the mod line for this mod (Must be on a single line)
short_description: "Generates random words based on min/max input",
	 
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
	const storage = ['', 'Temp Variable', 'Server Variable', 'Global Variable'];
	return `Generate Random Word(s)`;
},

depends_on_mods: ["WrexMODS"],

//---------------------------------------------------------------------
// Action Storage Function
//
// Stores the relevant variable info for the editor.
//---------------------------------------------------------------------

variableStorage: function(data, varType) {
	const type = parseInt(data.storage);
	if(type !== varType) return;
	return ([data.varName, 'Text']);
},

//---------------------------------------------------------------------
// Action Fields
//
// These are the fields for the action. These fields are customized
// by creating elements with corresponding IDs in the HTML. These
// are also the names of the fields stored in the action's JSON data.
//---------------------------------------------------------------------

fields: ["storage", "varName", "min", "max", "wps"],

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
		<div>
			<p>
				<u>Mod Info:</u><br>
				Created by ${this.author}<br>
			</p>
		</div><br>
	<div style="float: left; width: 45%;">
		Minimum Range:<br>
		<input id="min" class="round" type="text"><br>
	</div>
	<div style="padding-left: 5%; float: left; width: 50%;">
		Maximum Range:<br>
		<input id="max" class="round" type="text"><br>
	</div><br>
	<div style="float: left; width: 45%;">
		Words Per String:<br>
		<input id="wps" class="round" type="text"><br>
	</div><br><br><br>
</div><br><br><br>
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
	const WrexMODS = this.getWrexMods();
	const randomWords = WrexMODS.require('random-words');
	const data = cache.actions[cache.index];
	const type = parseInt(data.storage);
	const varName = this.evalMessage(data.varName, cache);
	const wps = parseInt(this.evalMessage(data.wps, cache));
	const min = parseInt(this.evalMessage(data.min, cache));
	const max = parseInt(this.evalMessage(data.max, cache)) + 1;
	if (isNaN(min)) {
		console.log('Error with Generate Random Word(s), Action #' + cache.index + ': min is not a number');
		this.callNextAction(cache);
	} else if (isNaN(max)) {
		console.log('Error with Generate Random Word(s), Action #' + cache.index + ': max is not a number');
		this.callNextAction(cache);
	} else if (isNaN(wps)) {
		console.log('Error with Generate Random Word(s), Action #' + cache.index + ': Words Per Sentence is not a number');
		this.callNextAction(cache);
	} else {
	const words = randomWords({ min: min, max: max, wordsPerString: wps})
	this.storeValue(words, type, varName, cache);
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
