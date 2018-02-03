module.exports = {

//---------------------------------------------------------------------
// Action Name
//
// This is the name of the action displayed in the editor.
//---------------------------------------------------------------------

name: "Write File",

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
	return `${data.filename}${data.format}`;
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
    version: "1.8.4",

    // A short description to show on the mod line for this mod (Must be on a single line)
    short_description: "Creates a File with your File name and File format + including your Text you wan't to.",

	 // If it depends on any other mods by name, ex: WrexMODS if the mod uses something from WrexMods


	 //---------------------------------------------------------------------

//---------------------------------------------------------------------
// Action Fields
//
// These are the fields for the action. These fields are customized
// by creating elements with corresponding IDs in the HTML. These
// are also the names of the fields stored in the action's JSON data.
//---------------------------------------------------------------------

fields: ["input", "format", "filename"],

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
        Made by EliteArtz<br>
    </p>
	<div style="float: left; width: 30%;">
		File Format:<br>
		<select id="format" class="round">
			<option value=".json">json File</option>
			<option value=".txt" selected>txt File</option>
			<option value=".js">js File</option>
		</select>
	</div><br>
    <div style="float: left; width: 99%">
        File name:<br>
        <textarea id="filename" class="round" style="width 50%; resize: none;" type="textarea" rows="1" cols="30"></textarea><br>
    </div>
	<div style="float: left; width: 99%;">
		Input Text:<br>
		<textarea id="input" class="round" style="width: 99%; resize: none;" type="textarea" rows="5" cols="35"></textarea><br>
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

    try {
        const fileNAME = this.evalMessage(data.filename, cache);
        const fs = require('fs');
        if (fileNAME) {
            const inputtext = this.evalMessage(data.input, cache);
            fs.writeFileSync(fileNAME + `${data.format}`, inputtext, console.log(`${data.filename}${data.format} File was written.`));
        } else {
        console.log(`File name is missing.`);
        }
    } catch (err) {
        console.log("ERROR!" + err.stack ? err.stack : err);
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