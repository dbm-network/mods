module.exports = {

//---------------------------------------------------------------------
// Action Name
//
// This is the name of the action displayed in the editor.
//---------------------------------------------------------------------

name: "Changelog",

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
	 // DBM Mods Manager Variables (Optional but nice to have!)
	 //
	 // These are variables that DBM Mods Manager uses to show information
	 // about the mods for people to see in the list.
	 //---------------------------------------------------------------------

	 // Who made the mod (If not set, defaults to "DBM Mods")
	 author: "DBM Mods",

	 // The version of the mod (Defaults to 1.0.0)
	 version: "1.8.7",

	 // A short description to show on the mod line for this mod (Must be on a single line)
	 short_description: "Changelog overview",

	 // If it depends on any other mods by name, ex: WrexMODS if the mod uses something from WrexMods


	 //---------------------------------------------------------------------

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
<div id ="wrexdiv" style="width: 550px; height: 350px; overflow-y: scroll;">
	<p>
		<h2>1.8.7: All your wishes except Await Response</h2>
		● Google & YouTube Search!<br>
		● Set the channel category in Edit Channel!<br>
		● Webhooks!<br>
		● Store the total amount of commands and events!<br>
		● Merged "Start & Stop Typing"!<br>
		● Added "File Control" which includes "Create", "Write", "Append" and "Delete" File!<br>
		● "Find Text" allows it to find a word in a text!<br>
		● Convert Timestamp!<br>
		● Store Weather Informations!<br>
		● Revise and Replace Mods!<br>
		● Many bug fixes....
	</p>
	<p>
		<h2>1.8.6: So many small new mods</h2>
		● Check Variable length<br>
		● HTML and Json fixes<br>
		● Generate Random Hex Color<br>
		● Change images name<br>
		● Delete File<br>
		● Cleverbot .io & .com support<br>
		● Randomize Letters<br>
		● Slice variable<br>
		● Translate variable<br>
		● Store Attachment Info<br>
		● Convert YouTube Time<br>
		... and much more!
	</p>
	<p>
		<h2>1.8.5: Many new options...</h2>
		● Store Human & Bot count!<br>
		● Json WebAPI with sliders and bug fixes!<br>
		● New Mod Information in DBM!<br>
		● Little text changes!<br>
		● Sorted many action options!<br>
		● Find Message!<br>
		● Merged Store Role Info!<br>
		● Refreshing uptimes (1h:27m:10s or 1:27:10 or...)!<br>
		● Store Bots platform OS & Bots directory!<br>
		● Store CPU usage in MB & Memory usage in MB!<br>
		● Removed deprecated files from 1.8.4!<br>
		● Store and parse XML -> You can store data from (nearly) every website!<br>
	</p>
	<p>
		<h2>1.8.4: Set Prefix + Write File + Jump to Action</h2>
		● Set Voice Channel Permissions<br>
		● Write File (Creates a real file like a txt file)<br>
		● Set Prefix (Global)<br>
		● Jump to Action<br>
		● Merged all Store Bot Client Info mods (Check info below)<br>
		● Merged all Store Server Things mods (Check info below)<br>
		● Reduced file size (We removed some obsolete modules 150 MB -> 330 KB)<br>
		● Bug and typo fixes<br>
		● Removed the music and discord.js fix because it is in beta fixed<br>
		The merged actions are still usable but are located in the deprecated section. All functions are copied info the main action.
	</p>
	<p>
		<h2>1.8.3: Category & Watching Netflix & Bot learned writing & Music Fix</h2>
		● Create Category<br>
		● Set Bot Activity (Playing, Watching, Listening & Streaming)<br>
		● Start Bot Typing & Stop Bot Typing (Allows the bot to get the typing status)<br>
		● Store Memory Usage<br>
		● DBM Beta Music Stuff fix action (Check the video)<br>
		● Update discord.js (Check the video)<br>
		● Bug fixes<br>
		● https://youtu.be/mrrtj5nlV58
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
