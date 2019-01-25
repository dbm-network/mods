module.exports = {

	//---------------------------------------------------------------------
	// Action Name
	//
	// This is the name of the action displayed in the editor.
	//---------------------------------------------------------------------
	
	name: "Store Message Info",
	
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
		const message = ['Command Message', 'Temp Variable', 'Server Variable', 'Global Variable'];
		const info = ['Message Object', 'Message ID', 'Message Text', 'Message Author', 'Message Channel', 'Message Timestamp', 'Message Is Pinned?', 'Message Is TTS?', 'Message edited at', 'Message edits history', 'Message is pinnable?', 'Message includes @everyone mention?', 'Messages different reactions count', 'Mentioned users list', 'Mentioned users count', 'Message URL'];
		return `${message[parseInt(data.message)]} - ${info[parseInt(data.info)]}`;
	},
	
	//---------------------------------------------------------------------
		 // DBM Mods Manager Variables (Optional but nice to have!)
		 //
		 // These are variables that DBM Mods Manager uses to show information
		 // about the mods for people to see in the list.
		 //---------------------------------------------------------------------
	
		 // Who made the mod (If not set, defaults to "DBM Mods")
		 author: "DBM Mods, Lasse & NetLuis",
	
		 // The version of the mod (Defaults to 1.0.0)
		 version: "1.9.4",
	
		 // A short description to show on the mod line for this mod (Must be on a single line)
		 short_description: "Added more options to default action.",
	
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
				dataType = 'Message';
				break;
			case 1:
				dataType = 'Message ID';
				break;
			case 2:
				dataType = 'Text';
				break;
			case 3:
				dataType = 'Server Member';
				break;
			case 4:
				dataType = 'Channel';
				break;
			case 5:
				dataType = 'Text';
				break;
			case 6:
			case 7:
				dataType = 'Boolean';
				break;
			case 8:
				dataType = "Date";
				break;
			case 9:
				dataType = "Array";
				break;
			case 10:
				dataType = "Boolean";
				break;
			case 11:
				dataType = "Boolean";
				break;
			case 12:
				dataType = "Number";
				break;
			case 13:
				dataType = "Array";
				break;
			case 14:
				dataType = "Number";
				break;
			case 15: 
				dataType = "URL";
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
	
	fields: ["message", "varName", "info", "storage", "varName2"],
	
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
		<div><p>This action has been modified by DBM Mods.</p></div><br>
	<div>
		<div style="float: left; width: 35%;">
			Source Message:<br>
			<select id="message" class="round" onchange="glob.messageChange(this, 'varNameContainer')">
				${data.messages[isEvent ? 1 : 0]}
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
				<option value="0" selected>Message Object</option>
				<option value="1">Message ID</option>
				<option value="2">Message Text</option>
				<option value="3">Message Author</option>
				<option value="4">Message Channel</option>
				<option value="5">Message Timestamp</option>
				<option value="6">Message Is Pinned?</option>
				<option value="7">Message Is TTS?</option>
				<option value="8">Message edited at</option>
				<option value="9">Message edit history</option>
				<option value="10">Message is pinnable?</option>
				<option value="11">Message includes @everyone mention?</option>
				<option value="12">Messages different reactions count</option>
				<option value="13">Messages mentioned users list</option>
				<option value="14">Messages mentioned users count</option>
				<option value="15">Message URL</option>
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
	
		glob.messageChange(document.getElementById('message'), 'varNameContainer')
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
		const message = parseInt(data.message);
		const varName = this.evalMessage(data.varName, cache);
		const info = parseInt(data.info);
		const msg = this.getMessage(message, varName, cache);
		if(!msg) {
			this.callNextAction(cache);
			return;
		}
		let result;
		switch(info) {
			case 0:
				result = msg;
				break;
			case 1:
				result = msg.id;
				break;
			case 2:
				result = msg.content;
				break;
			case 3:
				if(msg.member) {
					result = msg.member;
				} else if (msg.recipient) {
					result = msg.recipient; // Used for DM Channels
				}
				break;
			case 4:
				result = msg.channel;
				break;
			case 5:
				result = msg.createdTimestamp;
				break;
			case 6:
				result = msg.pinned;
				break;
			case 7:
				result = msg.tts;
			case 8:
				result = msg.editedAt;
				break;
			case 9:
				result = msg.edits;
				break;
			case 10:
				result = msg.pinnable;
				break;
			case 11:
				result = msg.mentions.everyone;
				break;
			case 12:
				result = msg.reactions.array().length;
				break;
			case 13:
				result = msg.mentions.users.array();
				break;
			case 14:
				result = msg.mentions.users.array().length;
				break;
			case 15:
				result = msg.url;
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
	