module.exports = {

//---------------------------------------------------------------------
// Action Name
//
// This is the name of the action displayed in the editor.
//---------------------------------------------------------------------

name: "Store Game Info",

//---------------------------------------------------------------------
// Action Section
//
// This is the section the action will fall into.
//---------------------------------------------------------------------

section: "Member Control",

//---------------------------------------------------------------------
// Action Subtitle
//
// This function generates the subtitle displayed next to the name.
//---------------------------------------------------------------------

subtitle: function(data) {
	const members = ['Mentioned User', 'Command Author', 'Temp Variable', 'Server Variable', 'Global Variable'];
	const info = ['Game Application ID', 'Game Details', 'Game Name', 'Game State', 'Game Is Being Streamed?', 'Game Stream URL', 'Game Status Type', 'Game Large Image ID', 'Game Large Image URL', 'Game Large Image Text', 'Game Small Image ID', 'Game Small Image URL', 'Game Small Image Text', 'Game Timestamp Start', 'Game Party ID', 'Game Timestamp End', 'Game Party Size'];
	return `${members[parseInt(data.member)]} - ${info[parseInt(data.info)]}`;
},

//---------------------------------------------------------------------
// DBM Mods Manager Variables (Optional but nice to have!)
//
// These are variables that DBM Mods Manager uses to show information
// about the mods for people to see in the list.
//---------------------------------------------------------------------

// Who made the mod (If not set, defaults to "DBM Mods")
author: "MrGold",

// The version of the mod (Defaults to 1.0.0)
version: "1.9.5", //Added in 1.9.5

// A short description to show on the mod line for this mod (Must be on a single line)
short_description: "Stores Games information",

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
	let dataType = 'Unknown Type';
	switch(info) {
		case 0:
			dataType = "Application ID";
			break;
		case 1:
			dataType = "Text";
			break;
		case 2:
			dataType = "Text";
			break;
		case 3:
			dataType = "Text";
			break;
		case 4:
			dataType = "Boolean";
			break;
		case 5:
			dataType = "Stream URL";
			break;
		case 6:
			dataType = "Number";
			break;
		case 7:
			dataType = "Large Image ID";
			break;
		case 8:
			dataType = "Large Image URL";
			break;
		case 9:
			dataType = "Large Image Text";
			break;
		case 10:
			dataType = "Small Image ID";
			break;
		case 11:
			dataType = "Small Image URL";
			break;
		case 12:
			dataType = "Small Image Text";
			break;
		case 13:
			dataType = "Date";
			break;
		case 14:
			dataType = "Party ID";
			break;
		case 15:
			dataType = "Date";
			break;
		case 16:
			dataType = "Number";
			break;
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

fields: ["member", "varName", "info", "storage", "varName2"],

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
	Created by MrGold
    </p>
</div><br>
<div>
	<div style="float: left; width: 35%;">
		Source Member:<br>
		<select id="member" class="round" onchange="glob.memberChange(this, 'varNameContainer')">
			${data.members[isEvent ? 1 : 0]}
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
		<select id="info" class="round">
			<option value="0" selected>Game Application ID</option>
			<option value="1">Game Details</option>
			<option value="2">Game Name</option>
			<option value="3">Game State</option>
			<option value="4">Game Is Being Streamed?</option>
			<option value="5">Game Stream URL</option>
			<option value="6">Game Status Type</option>
			<option value="13">Game Timestamp Start</option>
			<option value="15">Game Timestamp End</option>
			<option value="14">Game Party ID</option>
			<option value="16">Game Party Size</option>
			<optgroup label="Assets Large Image">
			<option value="7">Game Large Image ID</option>
			<option value="8">Game Large Image URL</option>
			<option value="9">Game Large Image Text</option>
			</optgroup>
			<optgroup label="Assets Small Image">
			<option value="10">Game Small Image ID</option>
			<option value="11">Game Small Image URL</option>
			<option value="12">Game Small Image Text</option>
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

	glob.memberChange(document.getElementById('member'), 'varNameContainer');
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
	const info = parseInt(data.info);
	
	const member = parseInt(data.member);
	const varName = this.evalMessage(data.varName, cache);
	const mem = this.getMember(member, varName, cache);
	
	if(!mem) {
		this.callNextAction(cache);
		return;
	}
	
	let result;
	switch(info) {
		case 0:
		    if(!mem.presence.game) {
			    result = "null";
			} else {
				result = mem.presence.game.applicationID;
			}
			break;
		case 1:
			if(!mem.presence.game) {
			    result = "null";
			} else {
				result = mem.presence.game.details;
			}
			break;
		case 2:
		    if(!mem.presence.game) {
			    result = "null";
			} else {
				result = mem.presence.game.name;
			}
			break;
		case 3:
		    if(!mem.presence.game) {
			    result = "null";
			} else {
				result = mem.presence.game.state;
			}
			break;
		case 4:
		    if(!mem.presence.game) {
			    result = "null";
			} else {
				result = mem.presence.game.streaming;
			}
			break;
		case 5:
		    if(!mem.presence.game) {
			    result = "null";
			} else {
				result = mem.presence.game.url;
			}
			break;
		case 6:
		    if(!mem.presence.game) {
			    result = "null";
			} else {
				result = mem.presence.game.type;
			}
			break;
		case 7:
		    if(!mem.presence.game) {
			    result = "null";
			} else if(!mem.presence.game.assets) {
				result = "null";
			} else {
				result = mem.presence.game.assets.largeImage;
			}
			break;
		case 8:
		    if(!mem.presence.game) {
			    result = "null";
			} else if(!mem.presence.game.assets) {
				result = "null";
			} else {
				result = mem.presence.game.assets.largeImageURL;
			}
			break;
		case 9:
		    if(!mem.presence.game) {
			    result = "null";
			} else if(!mem.presence.game.assets) {
				result = "null";
			} else {
				result = mem.presence.game.assets.largeText;
			}
			break;
		case 10:
		    if(!mem.presence.game) {
			    result = "null";
			} else if(!mem.presence.game.assets) {
				result = "null";
			} else {
				result = mem.presence.game.assets.smallImage;
			}
			break;
		case 11:
		    if(!mem.presence.game) {
			    result = "null";
			} else if(!mem.presence.game.assets) {
				result = "null";
			} else {
				result = mem.presence.game.assets.smallImageURL;
			}
			break;
		case 12:
		    if(!mem.presence.game) {
			    result = "null";
			} else if(!mem.presence.game.assets) {
				result = "null";
			} else {
				result = mem.presence.game.assets.smallText;
			}
			break;
		case 13:
		    if(!mem.presence.game) {
			    result = "null";
			} else if(!mem.presence.game.timestamps) {
				result = "null";
			} else {
				result = mem.presence.game.timestamps.start;
			}
			break;
		case 14:
		    if(!mem.presence.game) {
			    result = "null";
			} else if(!mem.presence.game.party) {
				result = "null";
			} else {
				result = mem.presence.game.party.id;
			}
			break;
		case 15:
		    if(!mem.presence.game) {
			    result = "null";
			} else if(!mem.presence.game.timestamps) {
				result = "null";
			} else {
				result = mem.presence.game.timestamps.end;
			}
			break;
		case 16:
		    if(!mem.presence.game) {
			    result = "null";
			} else if(!mem.presence.game.party) {
				result = "null";
			} else {
				result = mem.presence.game.party.size;
			}
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