module.exports = {

//---------------------------------------------------------------------
// Action Name
//
// This is the name of the action displayed in the editor.
//---------------------------------------------------------------------

name: "Find Message",

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
	const channels = ['Same Channel', 'Mentioned Channel', '1st Server Channel', 'Temp Variable', 'Server Variable', 'Global Variable'];
	const info = ['Find by Content', 'Find by ID'];
	return `${channels[parseInt(data.channel)]} - ${info[parseInt(data.info)]}`;
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
	 version: "1.8.7", //Added in 1.8.5

	 // A short description to show on the mod line for this mod (Must be on a single line)
	 short_description: "Finds a message by content or ID.",

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
	let dataType = 'Message';
	return ([data.varName2, dataType]);
},

//---------------------------------------------------------------------
// Action Fields
//
// These are the fields for the action. These fields are customized
// by creating elements with corresponding IDs in the HTML. These
// are also the names of the fields stored in the action's JSON data.
//---------------------------------------------------------------------

fields: ["channel", "varName", "info", "search", "storage", "varName2"],

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
		Created by Lasse!
		Modified by General Wrex!
	</p>
</div><br>
<div>
	<div style="float: left; width: 35%;">
		Source Channel:<br>
		<select id="channel" class="round" onchange="glob.channelChange(this, 'varNameContainer')">
			${data.channels[isEvent ? 1 : 0]}
		</select>
	</div>
	<div id="varNameContainer" style="display: none; float: right; width: 60%;">
		Variable Name:<br>
		<input id="varName" class="round" type="text" list="variableList"><br>
	</div>
</div><br><br><br>
<div>
	<div style="float: left; width: 70%;">
		Find by:<br>
		<select id="info" class="round">
			<option value="0" selected>Find by Content</option>
			<option value="1">Find by ID</option>
		</select>
	</div><br><br><br>
	<div style="float: left; width: 70%;">
		Search for:<br>
		<input id="search" class="round" type="text"><br>
	</div>
</div><br>
<div>
	<div style="float: left; width: 35%;">
		Store In:<br>
		<select id="storage" class="round">
			${data.variables[1]}
		</select>
	</div>
	<div id="varNameContainer2" style="float: right; width: 60%;">
		Variable Name:<br>
		<input id="varName2" class="round" type="text"><br>
	</div>
</div><br><br><br>
<div>
	<p>
	<u>Note:</u><br>
	This mod can only find messages by <b>content</b> within the last 100 messages.<br>
	If there are multiple messages with the same content, the bot is always using the oldest message (after start).
</div>`;
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

	glob.channelChange(document.getElementById('channel'), 'varNameContainer');
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
	const channel = parseInt(data.channel);
	const varName = this.evalMessage(data.varName, cache);
	const info = parseInt(data.info);
	const search = this.evalMessage(data.search, cache);
	const targetChannel = this.getChannel(channel, varName, cache);
	if(!targetChannel) {
		this.callNextAction(cache);
		return;
	}

	const storage = parseInt(data.storage);
	const varName2 = this.evalMessage(data.varName2, cache);

	let result;
	switch(info) {
		case 0:
			targetChannel.fetchMessages({ limit: 100 }).then(messages =>{
				const message = messages.find(el => el.content.includes(search));			
				if(message !== undefined){
					this.storeValue(message, storage, varName2, cache);						
				}
				this.callNextAction(cache);
			}).catch(err=>{
				console.error(err); 
				this.callNextAction(cache);
			});	
			break;
		case 1:
			targetChannel.fetchMessage(search).then(message =>{			
				if(message !== undefined){
					this.storeValue(message, storage, varName2, cache);
				}						
				this.callNextAction(cache);
			}).catch(err=>{
				console.error(err); 
				this.callNextAction(cache);
			});	
			break;
		default:
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
