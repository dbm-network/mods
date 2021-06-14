module.exports = {
	//---------------------------------------------------------------------
	// Action Name
	//
	// This is the name of the action displayed in the editor.
	//---------------------------------------------------------------------

	name: "Add Button",

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
		return data.storage === "0" ? `Add button to ${names[index]}` : `Add Button to ${names[index]} (${data.varName})`;
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

	fields: ["storage", "varName", "button", "content","storage2","varName2", "url", "emoji"],

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
<div style="padding-top: 8px;">
	<div style="float: left; width: 35%;">
		Button type:<br>
		<select id="button" name="second-list" class="round" onchange="glob.onChangeValue(this)">
			<option value="0" selected>Red</option>
			<option value="1" selected>Green</option>
			<option value="2" selected>Blurple</option>
			<option value="3" selected>Gray</option>
			<option value="4" selected>URL</option>
		</select>
	</div>
	<div id="contentContainer" style="float: right; width: 60%;">
		<span id="extName">Button Content</span>:<br>
		<input id="content" class="round" type="text">
	</div>
	<br><br><br>
	<div>
    <div style="float: left; width: 35%;">
      Store In:<br>
      <select id="storage2" class="round" onchange="glob.variableChange(this, 'varNameContainer2')">
        ${data.variables[0]}
      </select>
    </div>
    <div id="varNameContainer2" style="display: none; float: right; width: 60%;">
      Variable Name:<br>
      <input id="varName2" class="round" type="text">
    </div>
  </div><br><br><br>
  <div id="urlContainer">
  URL:<br>
  <input id="url" class="round" type="text" value=""><br>
  </div>
  <div>
  Emoji (Optional):<br>
  <input id="emoji" class="round" type="text" value=""><br>
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
		if (parseInt(document.getElementById('button').value) === 4) {
			document.getElementById('urlContainer').style.display = null
		} else {
			document.getElementById('urlContainer').style.display = 'none'
			document.getElementById('url').value = ""
		}
		glob.onChangeValue = function (event) {
			if (parseInt(event.value) === 4) {
			   document.getElementById('urlContainer').style.display = null
			} else {
			   document.getElementById('urlContainer').style.display = 'none'
			   document.getElementById('url').value = ""
			}
		}

		glob.variableChange(document.getElementById('storage2'), 'varNameContainer2')
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
		const message = this.getMessage(storage, varName, cache);
		const content = this.evalMessage(data.content, cache);
		var emoji = this.evalMessage(data.emoji, cache);
		if (!emoji) {
			emoji = undefined
		}
		const { MessageButton } = require('discord-buttons');
		const type = parseInt(data.button);
		let style
		switch(type) {
			case 0:
				style = "red"
				break;
			case 1:
				style = "green"
				break;
			case 2:
				style = "blurple"
				break;
			case 3:
				style = "gray"
				break;
			case 4:
				style = "url"
				break;
			default:
				style = "gray"
		}
		var buttons = !message.buttons ? [] : message.buttons;
		var button;
		if (!data.url) {
			button = new MessageButton()
			.setStyle(style)
			.setLabel(content)
			.setEmoji(emoji)
			.setID("button" + Number(buttons.length + 1));
		} else {
			button = new MessageButton()
			.setStyle(style)
			.setLabel(content)
			.setURL(this.evalMessage(data.url, cache));
		}

		buttons.push(button)
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
		if (parseInt(data.storage2) >= 0) {
			const varName2 = this.evalMessage(data.varName2, cache)
			const storage = parseInt(data.storage2)
			this.storeValue(button, storage, varName2, cache)
		}
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
