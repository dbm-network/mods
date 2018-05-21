module.exports = {

//---------------------------------------------------------------------
// Action Name
//
// This is the name of the action displayed in the editor.
//---------------------------------------------------------------------

name: "Replace",

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
	return `Replaces Text`;
},

//---------------------------------------------------------------------
	// DBM Mods Manager Variables (Optional but nice to have!)
	//
	// These are variables that DBM Mods Manager uses to show information
	// about the mods for people to see in the list.
	//---------------------------------------------------------------------

	// Who made the mod (If not set, defaults to "DBM Mods")
	author: "EliteArtz",

	// The version of the mod (Defaults to 1.0.0)
	version: "1.8.7", //Added in 1.8.7

	// A short description to show on the mod line for this mod (Must be on a single line)
	short_description: "Replaces your message what you wan't.",

	// If it depends on any other mods by name, ex: WrexMODS if the mod uses something from WrexMods

//---------------------------------------------------------------------
// Action Storage Function
//
// Stores the relevant variable info for the editor.
//---------------------------------------------------------------------

variableStorage: function(data, varType) {
	const type = parseInt(data.storage);
	if(type !== varType) return;
	let dataType = 'Replaced Text';
	return ([data.varName, dataType]);
},
//---------------------------------------------------------------------
// Action Fields
//
// These are the fields for the action. These fields are customized
// by creating elements with corresponding IDs in the HTML. These
// are also the names of the fields stored in the action's JSON data.
//---------------------------------------------------------------------

fields: ["replacemsg", "replaceto", "storage", "varName", "ifEach"],

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
	   Made by EliteArtz!<br>
	</p>
	<div padding-top: 8px;">
		Replace Text:<br>
		<textarea id="replacemsg" rows="2" placeholder="Insert message here..." style="width: 99%; font-family: monospace; white-space: nowrap; resize: none;"></textarea>
	</div><br>
	<div style="float: left; width: 50%; padding-top: 8px;">
	   Replace to:<br>
	   <input id="replaceto" class="round" type="text">
    </div><br>
    <div style="padding-top: 8px;">
        <select id="ifEach" class="round" style="float: right; width: 45%;">
            <option value="1">Hole content</option>
            <option value="0" selected>For Each Word</option>
        </select>
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
	//Global Variable's
	const data = cache.actions[cache.index];
	var result = {};

    // Code
	try {
		const replaceTEXT = this.evalMessage(data.replacemsg, cache);
		const replaceTO = this.evalMessage(data.replaceto, cache);
		if (replaceTEXT) {
			if (replaceTO) {
                if (data.ifEach === "1") {

                    result = replaceTEXT.replace(replaceTEXT, replaceTO); //This is the action that we're running if everything is Okay.

                    const storage = parseInt(data.storage);
                    const varName = this.evalMessage(data.varName, cache);
                    this.storeValue(result, storage, varName, cache);

                } else if (data.ifEach === "0") {

                    result = replaceTEXT.replace(/(\w+)/g, replaceTO); //This is the action that we're running if everything is Okay.

					const storage = parseInt(data.storage);
                    const varName = this.evalMessage(data.varName, cache);
                    this.storeValue(result, storage, varName, cache);
                }
			} else {
				console.log('No insert in "Replace To"...'); //logs it in the console if nothing were inserted...
            }
		} else {
		    console.log(`No insert in "Replace Message"...`); //logs it in the console if nothing were inserted...
		}
	} catch (e) {
		console.error("ERROR!" + e + e.stack); //logs if there was an error
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
