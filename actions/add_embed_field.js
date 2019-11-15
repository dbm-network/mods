module.exports = {

//---------------------------------------------------------------------
// Action Name
//
// This is the name of the action displayed in the editor.
//---------------------------------------------------------------------

name: "Add Embed Field",

//---------------------------------------------------------------------
// Action Section
//
// This is the section the action will fall into.
//---------------------------------------------------------------------

section: "Embed Message",

//---------------------------------------------------------------------
// Action Subtitle
//
// This function generates the subtitle displayed next to the name.
//---------------------------------------------------------------------

subtitle: function(data) {
	return `${data.name} - ${data.message}`;
},

//---------------------------------------------------------------------
	 // DBM Mods Manager Variables (Optional but nice to have!)
	 //
	 // These are variables that DBM Mods Manager uses to show information
	 // about the mods for people to see in the list.
	 //---------------------------------------------------------------------

	 // Who made the mod (If not set, defaults to "DBM Mods")
	 author: "DBM, Aioi & MrGold",

	 // The version of the mod (Defaults to 1.0.0)
	 version: "1.9.4", //Added in 1.8.2

	 // A short description to show on the mod line for this mod (Must be on a single line)
	 short_description: "Changed category and added blank field feature",

	 // If it depends on any other mods by name, ex: WrexMODS if the mod uses something from WrexMods


	 //---------------------------------------------------------------------


//---------------------------------------------------------------------
// Action Fields
//
// These are the fields for the action. These fields are customized
// by creating elements with corresponding IDs in the HTML. These
// are also the names of the fields stored in the action's JSON data.
//---------------------------------------------------------------------

fields: ["storage", "varName", "fieldName", "message", "inline"],

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
<div><p>This action has been modified by DBM Mods. Use [Title](Link) to mask links here.</p></div><br>
<div>
	<div style="float: left; width: 35%;">
		Source Embed Object:<br>
		<select id="storage" class="round" onchange="glob.refreshVariableList(this)">
			${data.variables[1]}
		</select>
	</div>
	<div id="varNameContainer" style="float: right; width: 60%;">
		Variable Name:<br>
		<input id="varName" class="round varSearcher" type="text" list="variableList"><br>
	</div>
</div><br><br><br>
<div style="padding-top: 8px;">
	<div style="float: left; width: 50%;">
		Field Name:<br>
		<input id="fieldName" placeholder="Optional" class="round" type="text">
	</div>
	<div style="float: left; width: 50%;">
		Display Inline:<br>
		<select id="inline" class="round">
			<option value="0">Yes</option>
			<option value="1" selected>No</option>
		</select>
	</div>
</div><br><br><br>
<div style="padding-top: 8px;">
	Field Description:<br>
	<textarea id="message" rows="7.5" placeholder="Insert message here... (Optional)" style="width: 99%; font-family: monospace; white-space: nowrap; resize: none;"></textarea>
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

	const storage = parseInt(data.storage);
	const varName = this.evalMessage(data.varName, cache);
	const embed = this.getVariable(storage, varName, cache);

	const name = this.evalMessage(data.fieldName, cache);
	const message = this.evalMessage(data.message, cache);

	const inline = Boolean(data.inline === "0");
	if(embed && embed.addField) {
		embed.addField(name ? name : '\u200B', message ? message : '\u200B', inline);
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
