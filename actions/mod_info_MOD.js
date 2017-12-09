module.exports = {

//---------------------------------------------------------------------
// Action Name
//
// This is the name of the action displayed in the editor.
//---------------------------------------------------------------------

name: "Mod Information",

//---------------------------------------------------------------------
// Action Section
//
// This is the section the action will fall into.
//---------------------------------------------------------------------

section: "#Mod Information",

//---------------------------------------------------------------------
// Action Subtitle
//
// This function generates the subtitle displayed next to the name.
//---------------------------------------------------------------------

subtitle: function(data) {
	return `Does nothing - Click "Edit" for more information`;
},

//---------------------------------------------------------------------
// Action Storage Function
//
// Stores the relevant variable info for the editor.
//---------------------------------------------------------------------

//variableStorage: function(data, varType) {},

//---------------------------------------------------------------------
// Action Fields
//
// These are the fields for the action. These fields are customized
// by creating elements with corresponding IDs in the HTML. These
// are also the names of the fields stored in the action's JSON data.
//---------------------------------------------------------------------

fields: [],

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
		<u>Welcome!</u><br>
		Thank you for using the DBM Mod Collection!<br>
		If you want to tell us something, join the Discord Guild below.<br>
		And if something doesn't work feel free to create an issue on GitHub<br>
		or open #support and describe your problem.<br>
		<u>Discord:</u><br>
		Join the Discord Guild to stay updated and be able to suggest things.<br>
		<a href="https://discord.gg/Y4fPBnZ" target="_blank">Join now</a><br>
		<u>Your version:</u><br>
		1.8<br>
		<u>Changelog:</u><br>
		Click here to see the latest updates:<br>
		<a href="https://github.com/Discord-Bot-Maker-Mods/DBM-Mods/releases" target="_blank">Open Changelog</a><br>
		<u>GitHub:</u><br>
		Visit us on GitHub! The whole mod collection is on GitHub<br>
		and everyone is invited to join us developing new mods!<br>
		Copy and paste the link to view the site in your browser.<br>
		<a href="https://github.com/Discord-Bot-Maker-Mods/DBM-Mods/" target="_blank">https://github.com/Discord-Bot-Maker-Mods/DBM-Mods/</a><br>
	</p>
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

action: function(cache) {},

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
