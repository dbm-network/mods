module.exports = {

	//---------------------------------------------------------------------
	// Action Name
	//
	// This is the name of the action displayed in the editor.
	//---------------------------------------------------------------------

	name: "Store Attachment Info",

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

	subtitle: function (data) {
		const info = ['Attachment\'s URL', 'Attachment File\'s Name', 'ttachment\'s Height', 'Attachment\'s Width', 'Attachment Message\'s Content', 'Attachment File\'s Size', 'Attachment Message\'s ID'];
		return `${info[parseInt(data.info)]}`;
	},

	//---------------------------------------------------------------------
	// DBM Mods Manager Variables (Optional but nice to have!)
	//
	// These are variables that DBM Mods Manager uses to show information
	// about the mods for people to see in the list.
	//---------------------------------------------------------------------

	// Who made the mod (If not set, defaults to "DBM Mods")
	author: "EGGSY",

	// The version of the mod (Defaults to 1.0.0)
	version: "1.8.6",

	// A short description to show on the mod line for this mod (Must be on a single line)
	short_description: "Stores attachment informations in messages.",

	// If it depends on any other mods by name, ex: WrexMODS if the mod uses something from WrexMods

	//---------------------------------------------------------------------
	// Action Storage Function
	//
	// Stores the relevant variable info for the editor.
	//---------------------------------------------------------------------

	variableStorage: function (data, varType) {
		const type = parseInt(data.storage2);
		if (type !== varType) return;
		const info = parseInt(data.info);
		let dataType = 'Message Attachment (Unknown) Info';
		switch (info) {
			case 0:
				dataType = "URL";
				break;
			case 1:
				dataType = "File Name";
				break;
			case 2:
				dataType = "Number";
				break;
			case 3:
				dataType = "Number";
				break;
			case 4:
				dataType = "Message Content";
				break;
			case 4:
				dataType = "File Size";
				break;
			case 6:
				dataType = "Message ID";
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

	fields: ["storage", "varName", "info", "storage2", "varName2"],

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
	<div>
		<p>
			<u>Mod Info:</u><br>
			Created by EGGSY!<br>
		</p>
	</div><br>
	<div style="float: left; width: 35%; padding-top: 8px;">
		Source Message:<br>
		<select id="storage" class="round" onchange="glob.messageChange(this, 'varNameContainer')">
			${data.messages[isEvent ? 1 : 0]}
		</select>
	</div>
	<div id="varNameContainer" style="display: none; float: right; width: 60%; padding-top: 8px;">
		Variable Name:<br>
		<input id="varName" class="round" type="text" list="variableList"><br>
	</div><br><br>
<div style="float: left; width: 80%; padding-top: 8px;">
	Source Info:<br>
	<select id="info" class="round">
		<option value="0">Attachment's URL</option>
		<option value="1">Attachment File's Name</option>
		<option value="2">Attachment's Height</option>
		<option value="3">Attachment's Width</option>
		<option value="4">Attachment Message's Content</option>
		<option value="5">Attachment File's Size (KB)</option>
		<option value="6">Attachment Message's ID</option>
	</select>
</div><br><br>
	<div style="float: left; width: 35%; padding-top: 8px;">
		Store In:<br>
		<select id="storage2" class="round" onchange="glob.variableChange(this, 'varNameContainer2')>
			${data.variables[0]}
		</select>
	</div>
	<div id="varNameContainer2" style="float: right; width: 60%; padding-top: 8px;">
		Variable Name:<br>
		<input id="varName2" class="round" type="text"><br>
	</div>`
	},

	//---------------------------------------------------------------------
	// Action Editor Init Code
	//
	// When the HTML is first applied to the action editor, this code
	// is also run. This helps add modifications or setup reactionary
	// functions for the DOM elements.
	//---------------------------------------------------------------------

	init: function () {
		const {
			glob,
			document
		} = this;

		glob.messageChange(document.getElementById('storage'), 'varNameContainer');
		glob.variableChange(document.getElementById('storage2'), 'varNameContainer2');
	},

	//---------------------------------------------------------------------
	// Action Bot Function
	//
	// This is the function for the action within the Bot's Action class.
	// Keep in mind event calls won't have access to the "msg" parameter,
	// so be sure to provide checks for variable existance.
	//---------------------------------------------------------------------

	action: function (cache) {
		const data = cache.actions[cache.index];
		const storage = parseInt(data.storage);
		const varName = this.evalMessage(data.varName, cache);
		const message = this.getMessage(storage, varName, cache);
		const info = parseInt(data.info);

		let attachments = message.attachments.array();
		for (let attachment of attachments) {
			switch (info) {
				case 0:
					result = attachment.url;
					break;
				case 1:
					result = attachment.filename;
					break;
				case 2:
					result = attachment.height;
					break;
				case 3:
					result = attachment.width;
					break;
				case 4:
					result = attachment.message.content;
					break;
				case 5:
					result = Math.floor(attachment.filesize / 1000);
					break;
				case 6:
					result = attachment.message.id;
					break;
				default:
					break;
			}
			if (result !== undefined) {
				const storage2 = parseInt(data.storage2);
				const varName2 = this.evalMessage(data.varName2, cache);
				this.storeValue(result, storage2, varName2, cache);
			}
			this.callNextAction(cache);
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

	mod: function (DBM) {}

}; // End of module, thanks to Lasse btw!