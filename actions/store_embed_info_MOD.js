module.exports = {
	//---------------------------------------------------------------------
	//
	// This is the name of the action displayed in the editor.
	//---------------------------------------------------------------------
	name: "Store Embed Info",

	//---------------------------------------------------------------------
	// Action Section
	//
	// This is the section the action will fall into.
	//---------------------------------------------------------------------
	section: "Embed Message",

	//---------------------------------------------------------------------
	// Action Subtitle
	//
	// This function generates the subtitle displayed next to the name.
	//---------------------------------------------------------------------
	subtitle: function(data) {
		const message = ["Command Message","Temp Variable", "Server Variable", "Global Variable"];
		const info = ["Embed Object", "Embed Title", "Embed Description", "Embed Author Name", "Embed Author Icon URL", "Embed Thumbnail", "Embed Footer", "Embed Footer Icon URL", "Embed Image URL", "Embed Color", "", "", "Embed Fields", "", "", "", "", "", "", "", "", ""];
		return `${message[parseInt(data.message)]} - ${info[parseInt(data.info)]}`;
	},

	//---------------------------------------------------------------------
	// Action Storage Function
	//
	// Stores the relevant variable info for the editor.
	//---------------------------------------------------------------------
	variableStorage: function(data, varType) {
		const type = parseInt(data.storage);
		if(type !== varType) return;
		const info = parseInt(data.info);
		let dataType = "Unknown Type";
		switch(info) {
			case 0:
				dataType = "Embed Message";
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
				dataType = "URL";
				break;
			case 5:
				dataType = "URL";
				break;
			case 6:
				dataType = "Text";
				break;
			case 7:
				dataType = "URL";
				break;
			case 8:
                dataType = "URL";
			case 9:
                dataType = "Color";
			case 12:
				dataType = "Array";
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
<div>
	<div style="float: left; width: 35%;">
		Source Embed:<br>
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
			<option value="0" selected>Embed Object</option>
			<option value="1">Embed Title</option>
			<option value="2">Embed Description</option>
			<option value="3">Embed Author Name</option>
			<option value="4">Embed Author Icon URL</option>
			<option value="5">Embed Thumbnail</option>
			<option value="6">Embed Footer</option>
            <option value="7">Embed Footer Icon URL</option>
            <option value="8">Embed Image URL</option>
			<option value="9">Embed Color</option>
			<option value="12">Embed Fields</option>
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

		glob.messageChange(document.getElementById("message"), "varNameContainer");
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
		const embed = this.getVariable(message, varName, cache);
		if(!embed) {
			this.callNextAction(cache);
			return;
		}
		let result;
		switch(info) {
			case 0:
				result = embed;
				break;
			case 1:
				result = embed.title;
				break;
			case 2:
				result = embed.description;
				break;
			case 3:
				result = embed.author.name;
				break;
			case 4:
				result = embed.author.iconURL;
				break;
			case 5:
				result = embed.thumbnail.url;
				break;
			case 6:
				result = embed.footer.text;
				break;
			case 7:
				result = embed.footer.iconURL;
				break;
			case 8:
				result = embed.image.url;
				break;
			case 9:
				result = embed.color;
				break;
			case 12:
				result = embed.fields;
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
	mod: function() {}
}; // End of module
