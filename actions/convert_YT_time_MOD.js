module.exports = {

//---------------------------------------------------------------------
// Action Name
//
// This is the name of the action displayed in the editor.
//---------------------------------------------------------------------

name: "Youtube Time Converter",

//---------------------------------------------------------------------
// Action Section
//
// This is the section the action will fall into.
//---------------------------------------------------------------------

section: "Audio Control",


//---------------------------------------------------------------------
// Action Subtitle
//
// This function generates the subtitle displayed next to the name.
//---------------------------------------------------------------------

subtitle: function(data) {
return `Convert into ${data.varName}`;
},

//---------------------------------------------------------------------
	 // DBM Mods Manager Variables (Optional but nice to have!)
	 //
	 // These are variables that DBM Mods Manager uses to show information
	 // about the mods for people to see in the list.
	 //---------------------------------------------------------------------

 // Who made the mod (If not set, defaults to "DBM Mods")
 author: "General Wrex", //Idea by Tresmos

 // The version of the mod (Defaults to 1.0.0)
 version: "1.8.6", //Added in 1.8.6

 // A short description to show on the mod line for this mod (Must be on a single line)
 short_description: "Converts YouTube Time Code into numeric time.",

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
		return ([data.varName, 'Time']);
	},


//---------------------------------------------------------------------
// Action Fields
//
// These are the fields for the action. These fields are customized
// by creating elements with corresponding IDs in the HTML. These
// are also the names of the fields stored in the action's JSON data.
//---------------------------------------------------------------------

fields: ["ytTime", "storage", "varName"],

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
			Created by General Wrex!
		</p>
</div><br>
<div>
<br>
    Youtube Time:<br>
	<textarea id="ytTime" class="round" style="width: 35%; resize: none;" type="textarea" rows="1" cols="20"></textarea><br>
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
</div>`;
},

//---------------------------------------------------------------------
// Action Editor Init Code
//
// When the HTML is first applied to the action editor, this code
// is also run. This helps add modifications or setup reactionary
// functions for the DOM elements.
//---------------------------------------------------------------------

init: function() {},

//---------------------------------------------------------------------
// Action Bot Function
//
// This is the function for the action within the Bot's Action class.
// Keep in mind event calls won't have access to the "msg" parameter,
// so be sure to provide checks for variable existance.
//---------------------------------------------------------------------

action: function (cache) {

	const data = cache.actions[cache.index];
	const storage = parseInt(data.storage);
	const varName = this.evalMessage(data.varName, cache);

	const ytTime = this.evalMessage(data.ytTime, cache);

	// Taken from https://www.npmjs.com/package/youtube-duration-format
	function parseDuration(PT, format) {
		var output = [];
		var durationInSec = 0;
		var matches = PT.match(/P(?:(\d*)Y)?(?:(\d*)M)?(?:(\d*)W)?(?:(\d*)D)?T?(?:(\d*)H)?(?:(\d*)M)?(?:(\d*)S)?/i);
		var parts = [
		  { // years
			pos: 1,
			multiplier: 86400 * 365
		  },
		  { // months
			pos: 2,
			multiplier: 86400 * 30
		  },
		  { // weeks
			pos: 3,
			multiplier: 604800
		  },
		  { // days
			pos: 4,
			multiplier: 86400
		  },
		  { // hours
			pos: 5,
			multiplier: 3600
		  },
		  { // minutes
			pos: 6,
			multiplier: 60
		  },
		  { // seconds
			pos: 7,
			multiplier: 1
		  }
		];

		for (var i = 0; i < parts.length; i++) {
		  if (typeof matches[parts[i].pos] != 'undefined') {
			durationInSec += parseInt(matches[parts[i].pos]) * parts[i].multiplier;
		  }
		}
		var totalSec = durationInSec;
		// Hours extraction
		if (durationInSec > 3599) {
		  output.push(parseInt(durationInSec / 3600));
		  durationInSec %= 3600;
		}
		// Minutes extraction with leading zero
		output.push(('0' + parseInt(durationInSec / 60)).slice(-2));
		// Seconds extraction with leading zero
		output.push(('0' + durationInSec % 60).slice(-2));
		if (format === undefined)
		  return output.join(':');
		else if (format === 'sec')
		  return totalSec;
	};


	this.storeValue(parseDuration(ytTime), storage, varName, cache);

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
