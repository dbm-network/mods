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
		const opt = ['Name', 'Topic', 'Position', 'Bitrate', 'User Limit', 'Category ID', 'Rate Limit Per User'];
		return `${names[parseInt(data.storage)]} - ${opt[parseInt(data.toChange)]}`;
	},
	
	//---------------------------------------------------------------------
		 // DBM Mods Manager Variables (Optional but nice to have!)
		 //
		 // These are variables that DBM Mods Manager uses to show information
		 // about the mods for people to see in the list.
		 //---------------------------------------------------------------------
	
		 // Who made the mod (If not set, defaults to "DBM Mods")
		 author: "Lasse, MrGold & NetLuis", // UI fixed by MrGold
	
		 // The version of the mod (Defaults to 1.0.0)
		 version: "1.9.5", //Added in 1.8.2
	
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
	
	fields: ["storage", "varName", "channelType", "toChange", "newState"],
	
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
				Created by Lasse, MrGold & NetLuis!
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
			Channel Type:<br>
			<select id="channelType" class="round">
				<option value="0" selected>Text Channel</option>
				<option value="1">Voice Channel</option>
			</select>
		</div><br><br><br>
	</div>
	<div>
		<div style="float: left; width: 35%;">
			Change:<br>
			<select id="toChange" class="round">
				<option value="0" selected>Name</option>
				<option value="1">Topic</option>
				<option value="2">Position</option>
				<option value="3">Bitrate</option>
				<option value="4">User Limit</option>
				<option value="5">Category ID</option>
				<option value="6">Rate Limit Per User</option>
			</select>
		</div><br><br><br>
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
		const channelType = parseInt(data.channelType);
		const newState = this.evalMessage(data.newState, cache);
		const toChange = parseInt(data.toChange, cache);

		let channel;
		switch(channelType) {
			case 0:
				channel = this.getChannel(storage, varName, cache);
				break;
			case 1:
				channel = this.getVoiceChannel(storage, varName, cache);
				break;
			default:
				channel = this.getChannel(storage, varName, cache);
				break;
		}

		if(toChange === 1) {
			channel.edit({topic: newState});
		} else if(toChange === 0) {
			channel.edit({name: newState});
		} else if(toChange === 2) {
			channel.edit({position: newState});
		} else if(toChange === 3) {
			channel.edit({bitrate: parseInt(newState)});
		} else if(toChange === 4) {
			channel.edit({userLimit: parseInt(newState)});
		} else if(toChange === 5) {
			channel.setParent(newState); // Added by Lasse in 1.8.7
		} else if(toChange === 6) {
			if(newState >= 0 && newState <= 120) {
			
			new Promise((resolve, _reject) => {
				this.getWrexMods().require('snekfetch').patch('https://discordapp.com/api/channels/' + channel.id)
					.set('Authorization', `Bot ${this.getDBM().Files.data.settings.token}`)
					.send({rate_limit_per_user: newState})
					.catch();
					
			}).catch(console.error);
			// First Version by Lasse in 1.9 // Second Version by MrGold with help by NetLuis in 1.9.4

		    } else {
				console.log('Edit Channel ERROR: The value must be between 0 and 120')
			}
		} else {
			console.log('Please update your edit_channel_MOD.js in your projects action folder!');
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
