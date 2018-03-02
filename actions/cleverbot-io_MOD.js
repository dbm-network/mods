module.exports = {

//---------------------------------------------------------------------
// Action Name
//
// This is the name of the action displayed in the editor.
//---------------------------------------------------------------------

name: "Cleverbot.io MOD",

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
	return `Speak with Cleverbot.io!`;
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
	short_description: "Gathers auto responses from cleverbot.io API!",

	// If it depends on any other mods by name, ex: WrexMODS if the mod uses something from WrexMods

//---------------------------------------------------------------------

//---------------------------------------------------------------------
// Action Fields
//
// These are the fields for the action. These fields are customized
// by creating elements with corresponding IDs in the HTML. These
// are also the names of the fields stored in the action's JSON data.
//---------------------------------------------------------------------

fields: ["inputVarType", "inputVarName", "APIuser", "APIkey", "channel", "varName"],

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
	   Made by EGGSY!<br>
	</p>
	<div style="float: left; width: 35%;">
	   Input Variable:<br>
	   <select id="inputVarType" class="round" onchange="glob.variableChange(this, 'varNameContainer')">
	   ${data.variables[1]}
	   </select>
	</div>
	<div id="varNameContainer" style="float: right; width: 60%;">
	   Variable Name:<br>
	   <input id="inputVarName" class="round" type="text">
	</div>
	<br><br><br>
	<div style="float: left; width: 40%; padding-top: 8px;">
	   API User:<br>
	   <input id="APIuser" class="round" type="text">
	</div>
	<div style="float: right; width: 60%; padding-top: 8px;">
	   API Key:<br>
	   <input id="APIkey" class="round" type="text">
	</div>
	<br><br><br>
	<div style="float: left; width: 35%; padding-top: 8px;">
	   Send Response To:<br>
	   <select id="channel" class="round" onchange="glob.sendTargetChange(this, 'varNameContainer2')">
	   ${data.sendTargets[isEvent ? 1 : 0]}
	   </select>
	</div>
	<div id="varNameContainer2" style="display: none; float: right; width: 60%; padding-top: 8px;">
	   Variable Name:<br>
	   <input id="varName" class="round" type="text" list="variableList"><br>
	</div>
	<br><br><br>
	<div id="comment" style="padding-top: 8px;">
	   <p>
		  Take your API User and API Key from <a href="https://cleverbot.io/keys" target="_blank">here</a> <i>(you can resize it, you can close the window from taskbar)</i>.
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

	glob.variableChange(document.getElementById('inputVarType'), 'varNameContainer');
	glob.sendTargetChange(document.getElementById('channel'), 'varNameContainer2');
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
	const APIuser = this.evalMessage(data.APIuser, cache);
	const APIkey = this.evalMessage(data.APIkey, cache);
	const sessionName = this.evalMessage(data.sessionName, cache);
	const type = parseInt(data.inputVarType);
	const inVar = this.evalMessage(data.inputVarName, cache);
	const Input = this.getVariable(type, inVar, cache);
	const channel = parseInt(data.channel);
	if (channel === undefined) return;
	const varName = this.evalMessage(data.varName, cache);
	const target = this.getSendTarget(channel, varName, cache);
	// Check if everything is correct:

	if (!APIuser) return console.log("Please enter a valid API User key from cleverbot.io!");
	if (!APIkey) return console.log("Please enter a valid API Key from cleverbot.io!");

	var WrexMODS = this.getWrexMods(); // Using WrexMods for better performance.
	const cleverbot = WrexMODS.require("cleverbot.io");
	CLEVERBOT = new cleverbot(APIuser, APIkey);
	const session = CLEVERBOT.setNick("DBM Bot");

	CLEVERBOT.create(function(err, session) {
		if (err) return console.log("ERROR with Cleverbot MOD: " + err);
		CLEVERBOT.ask(Input, function(err, response) {
			if (err) return console.log("ERROR with Cleverbot MOD: " + err);
			target.send(response);
		});
	});
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