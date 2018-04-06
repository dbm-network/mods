module.exports = {

//---------------------------------------------------------------------
// Action Name
//
// This is the name of the action displayed in the editor.
//---------------------------------------------------------------------

name: "Cleverbot",

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
	const WhichAPI = ['cleverbot.io', 'cleverbot.com'];
	return `Speak with ${WhichAPI[parseInt(data.WhichAPI)]}!`;
},

//---------------------------------------------------------------------
// DBM Mods Manager Variables (Optional but nice to have!)
//
// These are variables that DBM Mods Manager uses to show information
// about the mods for people to see in the list.
//---------------------------------------------------------------------

// Who made the mod (If not set, defaults to "DBM Mods")
author: "EGGSY & Lasse", //Basic cleverbot.io by EGGSY. Lasse added cleverbot.com and save to variable!

// The version of the mod (Defaults to 1.0.0)
version: "1.8.6", //Added in 1.8.6

// A short description to show on the mod line for this mod (Must be on a single line)
short_description: "Gathers auto responses from cleverbot APIs!",

// If it depends on any other mods by name, ex: WrexMODS if the mod uses something from WrexMods

//---------------------------------------------------------------------
// Action Storage Function
//
// Stores the relevant variable info for the editor.
//---------------------------------------------------------------------

variableStorage: function(data, varType) {
	const type = parseInt(data.storage);
	if(type !== varType) return;
	const info = parseInt(data.info);
	let dataType = 'Clever Response';
	return ([data.varName2, dataType]);
},


//---------------------------------------------------------------------
// Action Fields
//
// These are the fields for the action. These fields are customized
// by creating elements with corresponding IDs in the HTML. These
// are also the names of the fields stored in the action's JSON data.
//---------------------------------------------------------------------

fields: ["WhichAPI", "inputVarType", "inputVarName", "APIuser", "APIkey", "storage", "varName2"],

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
<div id ="wrexdiv" style="width: 550px; height: 350px; overflow-y: scroll;">
<div>
	<p>
	   <u>Mod Info:</u><br>
	   Made by EGGSY & Lasse!<br>
	</p>
</div>
<div>
	<div style="width: 45%; padding-top: 8px;">
		API:<br>
			<select id="WhichAPI" class="round">
				<option value="0" selected>Cleverbot.io (free)</option>
				<option value="1">Cleverbot.com (free trial)</option>
			</select>
	</div>
</div><br>
<div>
	<div style="float: left; width: 35%;">
	   Input Variable:<br>
	   <select id="inputVarType" class="round" onchange="glob.variableChange(this, 'varNameContainer')">
	   ${data.variables[1]}
	   </select>
	</div>
	<div id="varNameContainer" style="float: right; width: 60%;">
	   Variable Name:<br>
	   <input id="inputVarName" class="round" type="text" list="variableList">
	</div>
	<br><br><br>
	<div style="float: left; width: 80%; padding-top: 8px;">
	   API User:<br>
	   <input id="APIuser" class="round" type="text" placeholder="Leave blank if you use cleverbot.com">
	</div><br>
	<div style="float: left; width: 80%; padding-top: 8px;">
	   API Key:<br>
	   <input id="APIkey" class="round" type="text">
	</div>
	<br><br><br>
	<div style="float: left; width: 35%; padding-top: 8px;">
		Store Response In:<br>
		<select id="storage" class="round" onchange="glob.variableChange(this, 'varNameContainer2')">
			${data.variables[1]}
		</select>
	</div>
	<div id="varNameContainer2" style="float: right; width: 60%; padding-top: 8px;">
		Variable Name:<br>
		<input id="varName2" class="round" type="text"><br>
	</div>
	<br><br><br><br><br>
	<div id="comment" style="padding-top: 30px; padding-top: 8px;">
		<p>
		<u>Which API should I use?</u><br>
		Cleverbot.io is completely free. You only have to sign in with an email to get an API key. But that bot is a little bit dumb. It is asking you the same questions on every start etc.<br>
		Cleverbot.com is much more clever. But it is only free for 5000 calls/questions. If you want more, you'll have to pay (or create a new account).<br><br>
		Get cleverbot.io key: https://cleverbot.io/keys<br>
		Get cleverbot.com key: http://www.cleverbot.com/api<br>
		Copy the links to your browser.<br>
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
	glob.variableChange(document.getElementById('storage'), 'varNameContainer2');
},

//---------------------------------------------------------------------
// Action Bot Function
//
// This is the function for the action within the Bot's Action class.
// Keep in mind event calls won't have access to the "msg" parameter,
// so be sure to provide checks for variable existance.
//---------------------------------------------------------------------

action: function(cache) {
	var _this = this;

	const data = cache.actions[cache.index];
	const WhichAPI = parseInt(data.WhichAPI);

	const type = parseInt(data.inputVarType);
	const inVar = this.evalMessage(data.inputVarName, cache);
	const Input = this.getVariable(type, inVar, cache);

	const storage = parseInt(data.storage);
	const varName2 = this.evalMessage(data.varName2, cache);

	var WrexMODS = this.getWrexMods(); // Using WrexMods for better performance.

	let response;
	switch(WhichAPI) {
		case 0:
			const ioAPIuser = this.evalMessage(data.APIuser, cache);
			const ioAPIkey = this.evalMessage(data.APIkey, cache);
			if (!ioAPIuser) return console.log("Please enter a valid API User key from cleverbot.io!");
			if (!ioAPIkey) return console.log("Please enter a valid API Key from cleverbot.io!");

			const cleverbotio = WrexMODS.require("cleverbot.io");
			CLEVERBOT = new cleverbotio(ioAPIuser, ioAPIkey);
			const session = CLEVERBOT.setNick("DBM Bot");

			CLEVERBOT.create(function(err, session) {
				if (err) return console.log("ERROR with cleverbot.io: " + err);
					CLEVERBOT.ask(Input, function(err, response) {
						if (err) return console.log("ERROR with cleverbot.io: " + err);
						//Saving
						if(response !== undefined) {
							_this.storeValue(response, storage, varName2, cache);
						}
						_this.callNextAction(cache);
					});
			});

			break;
		case 1:
			const cleverbotcom = WrexMODS.require("cleverbot-node");
			const clbot = new cleverbotcom;
			const comAPIkey = this.evalMessage(data.APIkey, cache);

			if (!comAPIkey) return console.log("Please enter a valid API Key from cleverbot.com!");
			clbot.configure({botapi: comAPIkey});

			clbot.write(Input, function (response) {
				//Saving
				if(response.output !== undefined) {
					_this.storeValue(response.output, storage, varName2, cache);
				} else {
					console.log("cleverbot.com doesn't like this. Check your API key and your input!");
				}
				_this.callNextAction(cache);
			});
			break;
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
