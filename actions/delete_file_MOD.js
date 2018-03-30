module.exports = {

//---------------------------------------------------------------------
// Action Name
//
// This is the name of the action displayed in the editor.
//---------------------------------------------------------------------

name: "Delete File",

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
	return `Delete [${data.filePath}]`;
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
short_description: "Deletes files -_-",

// If it depends on any other mods by name, ex: WrexMODS if the mod uses something from WrexMods


//---------------------------------------------------------------------

//---------------------------------------------------------------------
// Action Fields
//
// These are the fields for the action. These fields are customized
// by creating elements with corresponding IDs in the HTML. These
// are also the names of the fields stored in the action's JSON data.
//---------------------------------------------------------------------

fields: ["filePath"],

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
        Made by EGGSY<br>
    </p><br>
    <div style="float: left; width: 99%">
        File Path:<br>
        <textarea id="filePath" class="round" style="width 99%; resize: none;" type="textarea" rows="2" cols="60"></textarea><br>
    </div><br>
    <p>
        If you want to delete something in current directory, you can add '.' (dot) before '/':<br>
            e.g:<br>
            My bot directory is: "<b>/root/myBot/</b>"<br>
            I want to delete: "<b>/root/myBot/delete.txt</b>"<br>
            Then I need to write "<b>./delete.txt</b>" in the field.<br><br>
        <i>Please be careful while using this mod. Don't forget there is no turning back after deleting the file.</i><br>
    </p><br>
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
        const fs = require('fs');
        const filePath = this.evalMessage(data.filePath, cache);
        if (filePath) {
            fs.exists(`${filePath}`, function(exists) {
                if(exists) {
                    fs.unlink(`${filePath}`, (err) => {
                        if (err) return console.log(`Something went wrong while deleting: [${err}]`);
                        console.log(`Sucessfully deleted [${filePath}].`);
                      });
                } else {
                    console.log('File not found, nothing to delete.');
                }
              });
        } else {
        console.log(`File path is missing.`);
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
