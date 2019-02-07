module.exports = {

//---------------------------------------------------------------------
// Action Name
//
// This is the name of the action displayed in the editor.
//---------------------------------------------------------------------

name: "Convert Seconds To D/H/M/S",

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
return `Convert ${data.time}`;
},

//---------------------------------------------------------------------
	 // DBM Mods Manager Variables (Optional but nice to have!)
	 //
	 // These are variables that DBM Mods Manager uses to show information
	 // about the mods for people to see in the list.
	 //---------------------------------------------------------------------

 // Who made the mod (If not set, defaults to "DBM Mods")
 author: "Aamon", //Idea by Tresmos    // I don't know who Tremos is but 'heya' =]]]

 // The version of the mod (Defaults to 1.0.0)
 version: "1.0.0", //not added yet....

 // A short description to show on the mod line for this mod (Must be on a single line)
 short_description: "Convert Seconds to Days, Hours, Minutes and Seconds.",

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
		return ([data.varName, 'Date']);
	},


//---------------------------------------------------------------------
// Action Fields
//
// These are the fields for the action. These fields are customized
// by creating elements with corresponding IDs in the HTML. These
// are also the names of the fields stored in the action's JSON data.
//---------------------------------------------------------------------

fields: ["time", "storage", "varName"],

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
	<div style="float: left; width: 95%; padding-top: 8px;">
		<p><u>Mod Info:</u><br>
		Made by <b>Aamon</b>! <br> Convert seconds to Days Hours Minutes and Seconds.</p>
	</div>
	<br><br><br>
	<div style="float: left; width: 70%; padding-top: 8px;">
		Seconds to Convert:
		<input id="time" class="round" type="text" placeholder="e.g. 1522672056 or use Variables">
	</div>
	<div style="float: left; width: 35%; padding-top: 8px;">
		Store Result In:<br>
		<select id="storage" class="round" onchange="glob.variableChange(this, 'varNameContainer')">
		${data.variables[0]}
		</select>
	</div>
	<div id="varNameContainer" style="float: right; display: none; width: 60%; padding-top: 8px;">
		Variable Name:<br>
		<input id="varName" class="round" type="text">
	</div><br><br>
	<div style=" float: left; width: 88%; padding-top: 8px;">
		<br>
		<p>
			For aditional information contact <b>Aamon#9130</b> on Discord or <a href ="https://twitter.com/44m0n"><b>@44m0n<b></a> on Twitter. 
		</p>
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
	const time = this.evalMessage(data.time, cache);
	var   _this = this; // this is needed sometimes.

    // Main code.



	
	let d, h, m, s;
	let result;

	if (isNaN(time)) {
		result.toString() = "Invalid Date";
		console.log('Please insert a number');
	}
	else {

		s = time;


		m = Math.floor(s / 60);
		s = s % 60;
		h = Math.floor(m / 60);
		m = m % 60;
		d = Math.floor(h / 24);
		h = h % 24;

		result = d + "d " + h + "h " + m + "m " + s + "s";

	}
		//return { days: d, hours: h, minutes: m, seconds: s }
	


	
	if (result.toString() === "Invalid Date") result = undefined;

    // Storage.
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
