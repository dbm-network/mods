module.exports = {

	//---------------------------------------------------------------------
	// Action Name
	//
	// This is the name of the action displayed in the editor.
	//---------------------------------------------------------------------

	name: "Store Webhook Info",

	//---------------------------------------------------------------------
	// Action Section
	//
	// This is the section the action will fall into.
	//---------------------------------------------------------------------

	section: "Webhook Control",

	//---------------------------------------------------------------------
	// Action Subtitle
	//
	// This function generates the subtitle displayed next to the name.
	//---------------------------------------------------------------------

	subtitle: function (data) {
		const info = ['Webhook ', 'Webhook ', 'Webhook ', 'Webhook ', 'Webhook ', 'Webhook ', 'Webhook ', 'Webhook '];
		return `${info[parseInt(data.info)]}`;
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
	 version: "1.8.7", //Added in 1.8.7

	 // A short description to show on the mod line for this mod (Must be on a single line)
	 short_description: "Stores information about a webhook.",

	 // If it depends on any other mods by name, ex: WrexMODS if the mod uses something from WrexMods
	 depends_on_mods: [
 		{name:'WrexMods',path:'aaa_wrexmods_dependencies_MOD.js'}
 	],


	 //---------------------------------------------------------------------

	//---------------------------------------------------------------------
	// Action Storage Function
	//
	// Stores the relevant variable info for the editor.
	//---------------------------------------------------------------------

	variableStorage: function (data, varType) {
		const type = parseInt(data.storage);
		if (type !== varType) return;
		const info = parseInt(data.info);
		let dataType = 'Webhook Info';
		switch (info) {
			case 0:
				dataType = "ID";
				break;
			case 1:
				dataType = "ID";
				break;
			case 2:
				dataType = "ID";
				break;
			case 3:
				dataType = "Username";
				break;
			case 4:
				dataType = "User";
				break;
			case 5:
				dataType = "Token";
				break;
			case 6:
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

	fields: ["webhook", "varName", "info", "storage", "varName2"],

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

	html: function (isEvent, data) {
		return `
<div><p><u>Mod Info:</u><br>Created by Lasse!</p></div>
<div>
	<div style="float: left; width: 35%;">
		Transfer Value From:<br>
		<select id="webhook" class="round" onchange="glob.refreshVariableList(this)">
			${data.variables[1]}
		</select>
	</div>
	<div id="varNameContainer" style="float: right; width: 60%;">
		Variable Name:<br>
		<input id="varName" class="round" type="text" list="variableList"><br>
	</div>
</div><br><br><br>
<div style="float: left; width: 80%; padding-top: 8px;">
	Source Info:<br>
	<select id="info" class="round">
		<option value="6" selected>Webhook URL</option>
		<option value="2">Webhook ID</option>
		<option value="5">Webhook Token</option>
		<option value="3">Webhook Name</option>
		<option value="4">Webhook Owner</option>
		<option value="1">Webhook Guild ID</option>
		<option value="0">Webhook Channel ID</option>
	</select>
</div><br><br>
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
</div><br><br><br>`
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

		glob.refreshVariableList(document.getElementById('webhook'));
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
			const webhook = parseInt(data.webhook);
			const varName = this.evalMessage(data.varName, cache);
			const info = parseInt(data.info);
			var WrexMods = this.getWrexMods();
			const wh = WrexMods.getWebhook(webhook, varName, cache);
			let result;
			switch(info) {
				case 0:
					result = wh.channelID;
					break;
				case 1:
					result = wh.guildID;
					break;
				case 2:
					result = wh.id;
					break;
				case 3:
					result = wh.name;
					break;
				case 4:
					result = wh.owner;
					break;
				case 5:
					result = wh.token;
					break;
				case 6:
					result = "https://canary.discordapp.com/api/webhooks/" + wh.id + "/" + wh.token;
					break;
				default:
					break;
			}
			if (result !== undefined) {
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
