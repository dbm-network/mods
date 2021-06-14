module.exports = {
	//---------------------------------------------------------------------
	// Action Name
	//
	// This is the name of the action displayed in the editor.
	//---------------------------------------------------------------------

	name: "Remove Button",

	//---------------------------------------------------------------------
	// Action Section
	//
	// This is the section the action will fall into.
	//---------------------------------------------------------------------

	section: "Buttons",

	//---------------------------------------------------------------------
	// Action Subtitle
	//
	// This function generates the subtitle displayed next to the name.
	//---------------------------------------------------------------------

	subtitle: function(data) {
		const names = ["Command Message", "Temp Variable", "Server Variable", "Global Variable"];
		const index = parseInt(data.storage);
		return data.storage === "0" ? `Remove Button in ${names[index]}` : `Remove Button in ${names[index]} (${data.varName})`;
	},

	variableStorage: function(data, varType) {
		const type = parseInt(data.storage2)
		if (type !== varType) return
		return ([data.varName2, 'Button'])
	},

	//---------------------------------------------------------------------
	// Action Fields
	//
	// These are the fields for the action. These fields are customized
	// by creating elements with corresponding IDs in the HTML. These
	// are also the names of the fields stored in the action's JSON data.
	//---------------------------------------------------------------------

	fields: ["storage", "varName", "pos"],

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
Mod created by Bad#2541
<br><br>
	<div style="float: left; width: 35%;">
		Source Message:<br>
		<select id="storage" class="round" onchange="glob.messageChange(this, 'varNameContainer')">
			${data.messages[1]}
		</select>
	</div>
	<div id="varNameContainer" style="display: none; float: right; width: 60%;">
		Variable Name:<br>
		<input id="varName" class="round" type="text" list="variableList"><br>
	</div>
</div><br><br><br>
  <div id="Container">
   Warning! The list is counted from 0!<br><br>
  Button Position:<br>
  <input id="pos" class="round" type="text" value="0"><br>
  </div>
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
		const { glob, document } = this;
		glob.messageChange(document.getElementById("storage"), "varNameContainer");
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
		var pos = parseInt(data.pos);
		const message = this.getMessage(storage, varName, cache);
		var buttons = !message.buttons ? [] : message.buttons;
		if (buttons[pos]) {
			buttons.splice(pos, 1); 
		} else {
			err = `Button with position ${pos} not found!`
			throw err;
		}
		if (storage === 0) {
			cache.msg.buttons = buttons;
		} else if (storage === 1) {
			cache.temp[varName].buttons = buttons;
		} else if (storage === 2) {
			const server = cache.server;
			if(server && this.server[server.id]) {
				this.server[server.id][varName].buttons = buttons;
			}
		} else if (storage ===3) {
			this.global[varName].buttons = buttons;
		}
		message.edit(message.content, { buttons: buttons })
		this.callNextAction(cache)
	},

	//---------------------------------------------------------------------
	// Action Bot Mod
	//
	// Upon initialization of the bot, this code is run. Using the bot's
	// DBM namespace, one can add/modify existing functions if necessary.
	// In order to reduce conflictions between mods, be sure to alias
	// functions you wish to overwrite.
	//---------------------------------------------------------------------

	mod: function(i) {
		var DiscordJS = require('discord.js');
		i.Bot.initBot = function() {
			this.bot = new DiscordJS.Client({ ws: { intents: this.intents() }});require('discord-buttons')(this.bot);
		};
	}
}; // End of module
