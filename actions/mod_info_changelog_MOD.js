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
version: "1.9.6 ~ beta",

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
	<h2>1.9.6: Almost everything requires beta! WOO!</h2>
		● Added Check if File Exists<br>
		● Added Generate Random Word<br>
		● Added Merge Lists Mod<br>
		● Added Slice Mod<br>
		● Added Play Youtube (Revised default action)<br>
		● Added Create Anchor Mod<br>
		● Added Jump To Anchor Mod<br>
		● Revised Check If Member<br>
		● Revised Parse From Sored JSON<br>
		● Revised Read File<br>
		● Revised Store Member Info<br>
		● Revised Check Variable<br>
		● Revised Check Parameters<br>
		● Revised Randomize Letters<br>
		● Revised Remove Item From list<br>
		● Revised Set Bot Activity<br>
		● Revised Store Audio Info Mod<br>
		● Revised Youtube Info Mod<br>
		● Revised Check If User Reacted Mod<br>
		● Revised Convert Seconds To Days Mod<br>
		● Revissed File Control (V4)<br>
		● Revised Game Server Mod<br>
		● Fixed Create Voice Channel<br>
		● Fixed Create Channel<br>
		● Fixed Create Category<br>
		● Fixed Store Channel Info<br>
		● Fixed Send Image<br>
		● Fixed Mod Info<br>
	</p>
	<p>
	<h2>1.9.5: We fixed it all and YouTube Playlists are around now!</h2>
		● Added Store Game Info<br>
		● Added Find Item in List<br>
		● Added Play YouTube Playlist<br>
		● Added Store Twitch Info<br>
		● Added Set Time Restriction<br>
		● Added Global Data actions<br>
		● Revised Store Category Info<br>
		● Revised Control Variable<br>
		● Revised Store Server Info<br>
		● Revised YouTube Search<br>
		● Revised Call Command/Event<br>
		● Revised Remove Item From List<br>
		● Revised Find Member<br>
		● Revised Check If Member<br>
		● Revised Set Member Voice Channel<br>
		● Revised Embed Messaging actions<br>
		● Revised Music System actions<br>
		● Fixed Transfer Variable<br>
		● Fixed Send Embed Message<br>
		● Fixed Await Response Call Action<br>
		● Fixed Await Reaction Call Action<br>
		● Fixed Edit Channel<br>
		● Fixed Store Channel Info<br>
	</p>
	<p>
	<h2>1.9.4: owo Is this a release I see? A lot of revised mods.</h2>
		● Added Convert Seconds to Days<br>
		● Added Download File<br>
		● Renamed Convert a Variable<br>
		● Revised Add Embed Field<br>
		● Revised Await Response Call Action<br>
		● Revised Check Member Data<br>
		● Revised Check Server Data<br>
		● Revised Check Variable<br>
		● Revised Edit Channel<br>
		● Revised Edit Message<br>
		● Revised Find Emoji in Message<br>
		● Revised Member Data List<br>
		● Revised Store Category Info<br>
		● Revised Store Message Info<br>
		● Revised Youtube Info<br>
	</p>
	<p>
	<h2>1.9.3: Yet another update</h2>
		● Added RSS actions<br>
		● Added Speedtest action<br>
		● Added Message URL to Store Message Info<br>
		● Added Send Embed to Webhook<br>
		● Added Restart Bot<br>
		● Added Create Webhook<br>
		● Removed Set AFK Timeout<br>
		● Fixed Set Category using ID<br>
		● Fixed _id of Loop Through List<br>
		● Updated Convert Variable<br>
		● Updated Set Role Permissions<br>
		● Updated Control Variable<br>
		● Moved smaller, not always needed mods, to a separated folder<br>
	</p>
	<p>
	<h2>1.9.2: Update Update</h2>
		● Updated "Send Stats to DBL" - Removed automated success message from the console<br>
		● Updated "Convert List To Text" - Added sort option<br>
		● Updated "Store Audio Info" - Added current song URL<br>
		● Updated "Custom Image Effect"<br>
		● Fixed "Find Custom Emoji in Server"<br>
		● Fixed "Find Category"<br>
		● Fixed "Add Reaction"<br>
		● Fixed "Set Role Permissions"<br>
		● Fixed "Create Channel" - Set Category ID<br>
		● Merged "Store Role Info Things" with "Store Role Info"<br>
		● Merged "Store Member Things" with "Store Member Info"<br>
		● Added "Set AFK Channel"<br>
		● Added "Math Operation Plus"<br>
		● Added Donators to the "Welcome" action<br>
	</p>
	<p>
	<h2>1.9.1: Bunch of new mods, and yes, we now have the reaction stuff</h2>
		● Added Set Role Voice Channel Perms<br>
		● Added Set Member Voice Channel Perms<br>
		● Added Find Category<br>
		● Added Change Prefix<br>
		● Added Set Role Permissions<br>
		● Added Get Song Lyrics<br>
		● Added Get Bot Stats From DBXYZ<br>
		● Added Check If User Reacted<br>
		● Added Remove Reaction<br>
		● Added Find Reaction<br>
		● Added Store Game Server Info<br>
		● Added Find Custom Emoji In Server<br>
		● Merged Send Image MOD with Send Image<br>
		● Merged Store Server Things with Store Server Info<br>
		● Merged Store Message Things with Store Message Info<br>
		● Merged Store Voice Channel Things with Store Voice Channel Info<br>
		● Merged Store Voice Channel Things with Store Voice Channel Info<br>
		● Merged Store Channel Things with Store Channel Info<br>
		● Updated Create Text Channel<br>
		● Updated DBL actions<br>
		● Updated Create Voice Channel<br>
		● Updated Store Reaction Info<br>
		● Updated Remove Message Reactions<br>
		● Updated Add Reaction<br>
		● Fixed Find Member<br>
		● Fixed Send To Webhook<br>
		● Fixed Send Embed Message<br>
		● Fixed Set Bot Activity
	</p>
	<p>
		<h2>1.9: New Mods, Bug fixes and general quality of life improvements!</h2>
		● Added Store Invite Info<br>
		● Added Store Emoji Info<br>
		● Added Basic Math Operation<br>
		● Added Edit Embed Message<br>
		● Better YouTube Search<br>
		● Fixes for Parse From Stored JSON<br>
		● Fixes for Store Bot Client Info<br>
		● Fixes for Set Bot Activity<br>
		● Fixes for Store Reaction Info<br>
		● Fixes for Run SQL Query<br>
		● Fixes for Webhook actions<br>
		● Fixes for Get Item from List<br>
		● Updated Check If Member<br>
		● Merged Send Embed Message MOD with Send Embed Message<br>
		● Merged Store Channel Things with Store Channel Info<br>
		● Added Await Response (probably not what you are looking for...)<br>
		● Many little bug fixes
	</p>
	<p>
		<h2>1.8.9: HUGE fixes for everyone!</h2>
		● Added Math Operation mod! ~iAmaury<br>
		● Added Convert A Variable (to fix the "Add to member data" problem)! ~EliteArtz<br>
		● Added a new version of Replace Text! ~iAmaury<br>
		● Added Check if Member has voted on DBL! ~Lasse<br>
		● Added Get Stats from DBL! ~EGGS><br>
		● Added Send Stats to DBL! ~EGGSY<br>
		● Added Store Date Info! ~iAmaury<br>
		● Added Loop Through Folder! ~Jakob<br>
		● Fixed DBMs problem with find offline members! ~Lasse<br>
		● Added A new Run Script mod with a better UI! ~General Wrex<br>
		● Added Send Embed Message mod which allows you to store the message object! ~General Wrex<br>
		● Multiple UI updates and bug fixes!
	</p>
	<p>
		<h2>1.8.8: Store Reaction Info is now available!</h2>
		● Added Check If Member (is bot/is kickable/is banable/is in voice channel)<br>
		● Added Skip Actions<br>
		● Added Store Reaction Info<br>
		● Added Urban Dictionary Search modification<br>
		● Redesigned a few modifications UI<br>
		● MANY bug fixes!
	</p>
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
