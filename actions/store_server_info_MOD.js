module.exports = {
//---------------------------------------------------------------------
// Notes Section
//
// More Than 250 Members is deprecated please keep in mind its the #3 vaule. (do NOT remove)
// given the large amount of Infos here PLEASE document everything properly so the next person that adds onto it will know whats going on. thanks
//---------------------------------------------------------------------

//---------------------------------------------------------------------
// Action Name
//
// This is the name of the action displayed in the editor.
//---------------------------------------------------------------------

name: "Store Server Things",

//---------------------------------------------------------------------
// Action Section
//
// This is the section the action will fall into.
//---------------------------------------------------------------------

section: "Server Control",

//---------------------------------------------------------------------
// Action Subtitle
//
// This function generates the subtitle displayed next to the name.
//---------------------------------------------------------------------

subtitle: function(data) {
	const servers = ['Current Server', 'Temp Variable', 'Server Variable', 'Global Variable'];
	const info = ['Creation Date', 'Time To AFK', 'Is Server Available?', 'More than 250 members?', 'Date Bot Joined Server', 'Channel Amount',	'Emoji Amount', 'Embed Links', 'DND Members Count', 'Online Members Count (fixed)',	'Offline Members Count',	'Idle Members Count',	'Total Bots Count In Server',	'Server Channel IDs',	'Server Role IDs',	'Server Member IDs',	'Server Bot Member Count',	'Server Human Member Count',	'Server Member Count',	'Role Count',	'Text Channel Count', 'Voice Channel Count'];
	return `${servers[parseInt(data.server)]} - ${data.info} - ${info[parseInt(data.info)]}`;
},

//---------------------------------------------------------------------
	 // DBM Mods Manager Variables (Optional but nice to have!)
	 //
	 // These are variables that DBM Mods Manager uses to show information
	 // about the mods for people to see in the list.
	 //---------------------------------------------------------------------

	 // Who made the mod (If not set, defaults to "DBM Mods")
	 author: "Lasse, EGGSY, EliteArtz & Danno3817",

	 // The version of the mod (Defaults to 1.0.0)
	 version: "1.8.7",

	 // A short description to show on the mod line for this mod (Must be on a single line)
	 short_description: "Stores more Server Information",

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
	let dataType = 'Text';
	// Case 3 is deprecated please read above Note Section before editing.
	switch(info) {
		case 0:
			dataType = "Date"; // Creation Date.
			break;
		case 1:
			dataType = "Number"; // Time To AFK.
			break;
		case 2:
			dataType = "Boolean"; // Is Server Avilable?
			break;
		case 3:
			dataType = "Boolean"; // More Than 250 Members? //Deprecated in v1.8.5
			break;
		case 4:
			dataType = "Date"; // Date bot Joined Server.
			break;
		case 5:
			dataType = "Number"; // Channel Amount.
			break;
		case 6:
			dataType = "Number"; // Emoji Amount.
			break;
		case 7:
			dataType = "Boolean"; // Embed Links.
			break;
		case 8:
			dataType = "Number"; // DND Members Count.
			break;
		case 9:
			dataType = "Number"; // Online Members Count. (fixed)
			break;
		case 10:
			dataType = "Number"; // Offline Members Count.
			break;
		case 11:
			dataType = "Number"; // Idle Members Count.
			break;
		case 12:
			dataType = "Number"; // Total Bots Count In Server.
			break;
		case 13:
			dataType = 'Server Channel IDs'; // Server Channel IDs.
			break;
		case 14:
			dataType = 'Server Role IDs'; // Server Roles IDs.
			break;
		case 15:
			dataType = 'Server Member IDs'; // Server Member IDs.
			break;
		case 16:
			dataType = 'Number'; // Server Bot Member Count.
			break;
		case 17:
			dataType = 'Number'; // Server Human Member Count.
			break;
		case 18:
			dataType = 'Number'; // Server Member Count. //Added by Lasse in 
			break;
		case 19:
			dataType = 'Number'; // Role Count.
			break;
		case 20:
			dataType = 'Number'; // Text Channel
			break;
		case 21:
			dataType = 'Number'; // Voice Channel
		
	}
	return ([data.varName2, dataType]);
},

//---------------------------------------------------------------------
// Action Fields
//
// These are the fields for the action. These fields are customized
// by creating elements with corresponding IDs in the HTML. These
// are also the names of the fields stored in the action's JSON data.
//---------------------------------------------------------------------

fields: ["server", "varName", "info", "storage", "varName2"],

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


// current Value is 21 (if you add to it please increase the Value as seen fit)
html: function(isEvent, data) {
	return `
	<div>
		<p>
			<u>Mod Info:</u><br>
			Created by EGGSY, EliteArtz, Lasse! & Danno3817
		</p>
	</div><br>
<div>
	<div style="float: left; width: 35%;">
		Source Server:<br>
		<select id="server" class="round" onchange="glob.serverChange(this, 'varNameContainer')">
			${data.servers[isEvent ? 1 : 0]}
		</select>
	</div>
	<div id="varNameContainer" style="display: none; float: right; width: 60%;">
		Variable Name:<br>
		<input id="varName" class="round" type="text" list="variableList"><br>
	</div>
</div><br><br><br>
<div>
	<div style="padding-top: 8px; width: 70%;">
		Source Info:<br>
		<select id="info" class="round" >
			<optgroup label="Creation/Join Dates">
				<option value="0" selected>Servers Creation Date</option>
				<option value="4">Date Bot Joined</option>
			</optgroup>
			<optgroup label="Member Infos">
				<option value="12">Total Bots in Servers</option>
				<option value="16">Bot Count (Same as Total Bots In Servers)</option>
				<option value="17">Human Member Count</option>
				<option value="18">Member Count(Same as Human Member Count)</option>				
			</optgroup>
			<optgroup label="Member Status Infos">
				<option value="8">DND Members Count</option>
				<option value="9">Online Members Count</option>
				<option value="10">Offline Members Count</option>
				<option vaule="11">Idle Members Count</option>			
			</optgroup>
			<optgroup label="ID Infos">
				<option value="13">Server Channel IDs</option>
				<option value="14">Server Role IDs</option>
				<option value="15">Server Member IDs</option>
			</optgroup>
			<optgroup label="Channel Infos">
				<option value="5">Channel Amount</option>
				<option value="20">Text Channel Count</option>
				<option value="21">Voice Channel Count</option>
			</optgroup>			
			<optgroup label="Other">
				<option value="1">Time User gets AFK</option>
				<option value="2">Is Server available?</option>
				<option value="6">Emoji Amount</option>
				<option value="7">Embeds links?</option>
				<option value="19">Role Count</option>
			</optgroup>	
			
			</select>
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

	glob.serverChange(document.getElementById('server'), 'varNameContainer')
},

//---------------------------------------------------------------------
// Action Bot Function
//
// This is the function for the action within the Bot's Action class.
// Keep in mind event calls won't have access to the "msg" parameter,
// so be sure to provide checks for variable existance.
//---------------------------------------------------------------------

// Please read above Notes Section before editing.
action: function(cache) {
	const data = cache.actions[cache.index];
	const server = parseInt(data.server);
	const varName = this.evalMessage(data.varName, cache);
	const info = parseInt(data.info);
	const targetServer = this.getServer(server, varName, cache);
	if(!targetServer) {
		this.callNextAction(cache);
		return;
	}
	let result;
	switch(info) {
		case 0:
			result = targetServer.createdAt; // Creation Date.
			break;
		case 1:
			result = targetServer.afkTimeout; // Time To AFK.
			break;
		case 2:
			result = targetServer.available; // Is Server Avilable?
			break;
		case 3:
			result = targetServer.large; // More Than 250 Members? //Deprecated in v1.8.5
			break;
		case 4:
			result = targetServer.joinedAt; // Date bot Joined Server.
			break;
		case 5:
			result = targetServer.channels.array().length; // Channel Amount.
			break;
		case 6:
			result = targetServer.emojis.array().length; // Emoji Amount.
			break;
		case 7:
			result = targetServer.embedEnabled; // Embed Links.
			break;
		case 8:
			result = targetServer.members.filter(m => m.user.presence.status == "dnd").size; // DND Members Count.
			break;
		case 9:
			result = targetServer.members.filter(m => m.user.presence.status == "online").size; // Online Members Count.
			break;
		case 10:
			result = targetServer.members.filter(m => m.user.presence.status == "offline").size; // Offline Members Count.
			break;
		case 11:
			result = targetServer.members.filter(m => m.user.presence.status == "idle").size; // Idle Members Count.
			break;
		case 12:
			result = targetServer.members.filter(m => m.user.bot).size; // Total Bots Count In Server.
			break;
		case 13:
			result = targetServer.channels.map(channels => channels.id); // Server Channel IDs.
			break;
		case 14:
			result = targetServer.roles.map(roles => roles.id); // Server Roles IDs.
			break;
		case 15:
			result = targetServer.members.map(members => members.id); // Server Member IDs.
			break;
		case 16:
			result = targetServer.members.filter(m => m.user.bot == true).size; // Server Bot Member Count.
			break;
		case 17:
			result = targetServer.members.filter(m => m.user.bot == false).size; // Server Human Member Count.
			break;
		case 18:
			result = targetServer.memberCount; // Server Member Count. //Added by Lasse in 1.8.7
			break;
		case 19:
			result = targetServer.roles.size; // Role Count.
			break;
		case 20:
			result = targetServer.channels.findAll('type', 'text').length; // Text Channel Count.
			break;
		case 21:
			result = targetServer.channels.findAll('type', 'voice').length; // Voice Channel Count.
			break;
		default:
			break;
	}
	if(result !== undefined) {
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
