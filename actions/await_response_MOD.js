module.exports = {

//---------------------------------------------------------------------
// Action Name
//
// This is the name of the action displayed in the editor.
//---------------------------------------------------------------------

name: "Await Response",

//---------------------------------------------------------------------
// Action Section
//
// This is the section the action will fall into.
//---------------------------------------------------------------------

section: "Messaging",

//---------------------------------------------------------------------
// Action Subtitle
//
// This function generates the subtitle displayed next to the name.
//---------------------------------------------------------------------

subtitle: function(data) {
	return `April Fool! - ${data.response}`;
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
    version: "01/04/2018 , dd/mm/yyyy - Remember xD?",

    // A short description to show on the mod line for this mod (Must be on a single line)
    short_description: "01/04/2018 , dd/mm/yyyy - Remember xD?",

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
	const info = parseInt(data.info);
	let dataType = 'Response Action';
	return ([data.varName2, dataType]);
},

//---------------------------------------------------------------------
// Action Fields
//
// These are the fields for the action. These fields are customized
// by creating elements with corresponding IDs in the HTML. These
// are also the names of the fields stored in the action's JSON data.
//---------------------------------------------------------------------

fields: ["time", "response", "storage", "varName2"],

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
    </p><br>
    <div style="width: 70%">
        Await in milliseconds:<br>
        <input id="time" type="text" class="round">
    </div><br>
    <div style="width: 50%">
        Await for Response:<br>
        <input id="response" type="text" class="round">
    </div><br>
	<div style="float: left; width: 35%;">
        Store In:<br>
        <select id="storage" class="round">
            ${data.variables[1]}
        </select>
    </div>
    <div id="varNameContainer2" style="float: right; width: 60%;">
        April Name:<br>
        <input id="varName2" class="round" type="text"><br>
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

action: async function (cache) {
        const data = cache.actions[cache.index];
        const rspns = this.evalMessage(data.response, cache);
        const tm = parseInt(data.time, cache);
        var result = {};

        try {
            if(rspns) {
                if (tm) {
                    const messages1 = await message.channel.awaitMessages(message => message.content.includes(rspns), {time: tm});
                    var result = messages1.map(message => message.content).join(", ");

                    const storage = parseInt(data.storage);
                    const varName2 = this.evalMessage(data.varName2, cache);
                    this.storeValue(result, storage, varName2, cache);
                } else {
                    console.log('Missing Time!');
                }
            } else {
                console.log('Missing Response Message!');
            }
        } catch (err) {
            console.error("ERROR!" + err.stack);
            var result = err.stack;

            const storage = parseInt(data.storage);
            const varName2 = this.evalMessage(data.varName2, cache);
            this.storeValue(result, storage, varName2, cache);
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