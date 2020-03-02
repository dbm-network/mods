module.exports = {

//---------------------------------------------------------------------
// Action Name
//
// This is the name of the action displayed in the editor.
//---------------------------------------------------------------------

name: "Auto Help",

//---------------------------------------------------------------------
// Action Section
//
// This is the section the action will fall into.
//---------------------------------------------------------------------

section: "Other Stuff",

//---------------------------------------------------------------------
	 // DBM Mods Manager Variables (Optional but nice to have!)
	 //
	 // These are variables that DBM Mods Manager uses to show information
	 // about the mods for people to see in the list.
	 //---------------------------------------------------------------------

	 // Who made the mod (If not set, defaults to "DBM Mods")
	 author: "Silversunset",

	 // The version of the mod (Defaults to 1.0.0)
	 version: "1.0",

	 // A short description to show on the mod line for this mod (Must be on a single line)
	 short_description: "Adds a custom JSON item for an automatic HELP command.",

	 // If it depends on any other mods by name, ex: WrexMODS if the mod uses something from WrexMods


	 //---------------------------------------------------------------------

//---------------------------------------------------------------------
// Action Subtitle
//
// This function generates the subtitle displayed next to the name.
//---------------------------------------------------------------------

subtitle: function(data) {
	return "Included? " + data.Include + " | " + data.Category + ": " + data.Description;
},

//---------------------------------------------------------------------
// Action Fields
//
// These are the fields for the action. These fields are customized
// by creating elements with corresponding IDs in the HTML. These
// are also the names of the fields stored in the action's JSON data.
//---------------------------------------------------------------------

fields: ["Category", "Description", "Include"],

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
			Created by Silversunset<br>
			This will add an additional field to your raw data for use in an automatic help command<br>
			<a href="https://www.silversunset.net/paste/raw/230" target="_blank">This RAW DATA</a> is <b>required</b> to use this mod.<br>
		</p>
	</div><br>
	<div style="float: left; width: 99%;">
		Category: <input id="Category" class="round" type="text" style="width:99%"><br>
		Description: <textarea id="Description" rows="3" placeholder="Insert description here..." style="width: 99%; font-family: monospace; white-space: nowrap; resize: none;"></textarea><br>
		Include in Auto Help: <select style="width:33%;" id="Include" class="round">
								<option value="No">No</option>
								<option value="Yes">Yes</option>
							  </select.
		

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

	glob.sendTargetChange(document.getElementById('Category'), 'varNameContainer');
	glob.sendTargetChange(document.getElementById('Description'), 'varNameContainer');
	glob.sendTargetChange(document.getElementById('Include'), 'varNameContainer');

},


//---------------------------------------------------------------------
// Action Bot Function
//
// This is the function for the action within the Bot's Action class.
// Keep in mind event calls won't have access to the "msg" parameter,
// so be sure to provide checks for variable existance.
//---------------------------------------------------------------------

action: function(cache) {
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
