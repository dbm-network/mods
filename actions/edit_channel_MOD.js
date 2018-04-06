module.exports = {

//---------------------------------------------------------------------
// Action Name
//
// This is the name of the action displayed in the editor.
//---------------------------------------------------------------------

name: "Edit Channel",
//Changed by Lasse in 1.8.7 from "Edit channel" to "Edit Channel"

//---------------------------------------------------------------------
// Action Section
//
// This is the section the action will fall into.
//---------------------------------------------------------------------

section: "Channel Control",

//---------------------------------------------------------------------
// Action Subtitle
//
// This function generates the subtitle displayed next to the name.
//---------------------------------------------------------------------

subtitle: function(data) {
	const names = ['Same Channel', 'Mentioned Channel', 'Default Channel', 'Temp Variable', 'Server Variable', 'Global Variable'];
	const index = parseInt(data.storage);
	return index < 3 ? `${names[index]}` : `${names[index]} - ${data.varName}`;
},

//---------------------------------------------------------------------
	 // DBM Mods Manager Variables (Optional but nice to have!)
	 //
	 // These are variables that DBM Mods Manager uses to show information
	 // about the mods for people to see in the list.
	 //---------------------------------------------------------------------

	 // Who made the mod (If not set, defaults to "DBM Mods")
	 author: "Lasse",

	 // The version of the mod (Defaults to 1.0.0)
	 version: "1.8.7", //Added in 1.8.2

	 // A short description to show on the mod line for this mod (Must be on a single line)
	 short_description: "Edits a specific channel",

	 // If it depends on any other mods by name, ex: WrexMODS if the mod uses something from WrexMods


	 //---------------------------------------------------------------------


//---------------------------------------------------------------------
// Action Fields
//
// These are the fields for the action. These fields are customized
// by creating elements with corresponding IDs in the HTML. These
// are also the names of the fields stored in the action's JSON data.
//---------------------------------------------------------------------

fields: ["storage", "varName", "toChange", "newState"],

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
			Created by Lasse!
		</p>
	</div><br>
<div>
	<div style="float: left; width: 35%;">
		Source Channel:<br>
		<select id="storage" class="round" onchange="glob.channelChange(this, 'varNameContainer')">
			${data.channels[isEvent ? 1 : 0]}
		</select>
	</div>
	<div id="varNameContainer" style="display: none; float: right; width: 60%;">
		Variable Name:<br>
		<input id="varName" class="round" type="text" list="variableList"><br>
	</div>
</div><br><br><br>
<div>
	<div style="float: left; width: 35%;">
		Change:<br>
		<select id="toChange" class="round">
			<option value="name">Name</option>
			<option value="topic">Topic</option>
    	<option value="position">Position</option>
    	<option value="bitrate">Bitrate</option>
    	<option value="userLimit">User Limit</option>
			<option value="parent">Category ID</option>
		</select>
	</div><br>
<div>
	<div style="float: left; width: 80%;">
		Change to:<br>
		<input id="newState" class="round" type="text"><br>
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

	glob.channelChange(document.getElementById('storage'), 'varNameContainer');
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
	const channel = this.getChannel(storage, varName, cache);
	const toChange = parseInt(data.toChange);
	const newState = this.evalMessage(data.newState, cache);
	//const reason = parseInt(data.reason);
	if(data.toChange === "topic") {
		channel.edit({topic: newState});
	} else if(data.toChange === "name") {
		channel.edit({name: newState});
	} else if(data.toChange === "position") {
		channel.edit({position: newState});
	} else if(data.toChange === "bitrate") {
		channel.edit({bitrate: newState});
	} else if(data.toChange === "userLimit") {
		channel.edit({userLimit: newState});
	} else if(data.toChange === "parent") {
		channel.setParent(newState); //Added by Lasse in 1.8.7
	} else {
		console.log('This should never been shown!');
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
	// aliases for backwards compatibility, in the bot only, DBM will still say the action is missing.
	DBM.Actions["Edit channel"] = DBM.Actions["Edit Channel"];
	//Thank You Wrex!
}

}; // End of module
