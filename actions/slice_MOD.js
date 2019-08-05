module.exports = {

//---------------------------------------------------------------------
// Action Name
//
// This is the name of the action displayed in the editor.
//---------------------------------------------------------------------

name: "Slice",

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
	return `Slice anything!`;
},

//---------------------------------------------------------------------
	// DBM Mods Manager Variables (Optional but nice to have!)
	//
	// These are variables that DBM Mods Manager uses to show information
	// about the mods for people to see in the list.
	//---------------------------------------------------------------------

	// Who made the mod (If not set, defaults to "DBM Mods")
	author: "EGGSY, TheMonDon",

	// The version of the mod (Defaults to 1.0.0)
	version: "1.9.6", //Added in 1.8.6

	// A short description to show on the mod line for this mod (Must be on a single line)
	short_description: "Slice anything!",

	// If it depends on any other mods by name, ex: WrexMODS if the mod uses something from WrexMods

//---------------------------------------------------------------------
// Action Storage Function
//
// Stores the relevant variable info for the editor.
//---------------------------------------------------------------------

variableStorage: function(data, varType) {
	const type = parseInt(data.storage);
	if(type !== varType) return;
	let dataType = 'Sliced Result';
	return ([data.varName, dataType]);
},
//---------------------------------------------------------------------
// Action Fields
//
// These are the fields for the action. These fields are customized
// by creating elements with corresponding IDs in the HTML. These
// are also the names of the fields stored in the action's JSON data.
//---------------------------------------------------------------------

fields: ["slice", "startingNumber", "sliceLength", "storage", "varName"],

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
	   Made by ${this.author}<br>
	</p></div><br>
	<div padding-top: 8px;">
		Slice Text:<br>
		<textarea id="slice" rows="2" placeholder="Insert message here..." style="width: 99%; font-family: monospace; white-space: nowrap; resize: none;"></textarea>
	</div><br>
	<div style="float: left; width: 45%; padding-top: 8px;">
	   Slice Starting Number:<br>
	   <input id="startingNumber" class="round" type="text">
	</div>
	<div style="float: right; width: 45%; padding-top: 8px;">
	   Slice Length:<br>
	   <input id="sliceLength" class="round" type="text">
	</div><br><br>
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
	<div id="RandomText" style="padding-top: 8px;">
		<p>
		example text: you are the best<br>
		If you want to slice <b>you</b>, starting number = 0, slice length = 3.
		</p>
	</div>
</div>`;
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
	const varName = this.evalMessage(data.varName, cache);
	const sliceText = this.evalMessage(data.slice, cache);
	const startingFrom = parseInt(this.evalMessage(data.startingNumber, cache));
	const sliceLength = parseInt(this.evalMessage(data.sliceLength, cache));

	// Check if everything is ok
	if(startingFrom < 0) return console.log("Your number can not be less than 0.");
	if(sliceLength == 0) return console.log("Slice length can not be 0.");
	if(!sliceText) return console.log("Please write something to slice.");
	if(!startingFrom && startingFrom != 0) return console.log("Please write a starting number.");
	if(!sliceLength) return console.log("Slice length can not be empty");

	// Main code
	const result = `${sliceText}`.slice(`${startingFrom}`, `${sliceLength + startingFrom}`);

	// Storing
	this.storeValue(result, data.storage, varName, cache);
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
