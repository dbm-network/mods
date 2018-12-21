module.exports = {

	//---------------------------------------------------------------------
	// Action Name
	//
	// This is the name of the action displayed in the editor.
	//---------------------------------------------------------------------

	name: "Urban Dictionary Search",

	//---------------------------------------------------------------------
	// Action Section
	//
	// This is the section the action will fall into.
	//---------------------------------------------------------------------

	section: "Other Stuff",

	//---------------------------------------------------------------------
	// Action Subtitle
	//
	// This function generates the subtitle displayed next to the name.
	//---------------------------------------------------------------------

	subtitle: function (data) {
		const info = ['Definition', 'Result URL', 'Example', 'Thumbs Up Count', 'Thumbs Down Count', 'Author', 'Result ID', 'Tags'];
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
	version: "1.8.8", //Added in 1.8.8

	// A short description to show on the mod line for this mod (Must be on a single line)
	short_description: "Makes a Urban Dictionary search and gets informations.",

	// If it depends on any other mods by name, ex: WrexMODS if the mod uses something from WrexMods


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
		let dataType = 'Unknown Urban Dictionary Result';
		switch (info) {
			case 0:
				dataType = "U.D. Definition";
				break;
			case 1:
				dataType = "U.D. URL";
				break;
			case 2:
				dataType = "U.D. Example";
				break;
			case 3:
				dataType = "U.D. Thumbs Up Count";
				break;
			case 4:
				dataType = "U.D. Thumbs Down Count";
				break;
			case 5:
				dataType = "U.D. Author";
				break;
			case 6:
				dataType = "U.D. Result ID";
				break;
		}
		return ([data.varName, dataType]);
	},

	//---------------------------------------------------------------------
	// Action Fields
	//
	// These are the fields for the action. These fields are customized
	// by creating elements with corresponding IDs in the HTML. These
	// are also the names of the fields stored in the action's JSON data.
	//---------------------------------------------------------------------

	fields: ["string", "info", "storage", "varName"],

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
<div style="width: 550px; height: 350px; overflow-y: scroll;">
		<div>
			<p>
				<u>Mod Info:</u><br>
				Created by EGGSY!
			</p>
		</div><br>
	<div style="width: 100%; padding-top: 8px;">
		String to Search:<br>
		<textarea id="string" rows="6" placeholder="Write a something or use variables..." style="width: 95%; font-family: monospace; white-space: nowrap; resize: none;"></textarea>
	 </div>
	<div style="float: left; width: 94%; padding-top: 8px;">
		Source Info:<br>
		<select id="info" class="round">
			<option value="0">Definition</option>
			<option value="1">URL</option>
			<option value="2">Example</option>
			<option value="3">Thumbs Up Count</option>
			<option value="4">Thumbs Down Count</option>
			<option value="5">Author</option>
			<option value="6">Result ID</option>
		</select>
	</div><br><br><br>
	<div>
		<div style="float: left; width: 35%; padding-top: 8px;">
			Store In:<br>
			<select id="storage" class="round" onchange="glob.variableChange(this, 'varNameContainer')">
				${data.variables[0]}
			</select>
		</div>
		<div id="varNameContainer" style="float: right; width: 60%; padding-top: 8px;">
			Variable Name:<br>
			<input id="varName" class="round" type="text"><br>
		</div>
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

	init: function () {
		const { glob, document } = this;
		glob.variableChange(document.getElementById('storage'), 'varNameContainer');
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
		const info = parseInt(data.info);
		const string = this.evalMessage(data.string, cache);

		// Check if everything is ok:
		if (!string) return console.log("Please write something to search on Urban Dictionary.");

		// Main code:
		var _this = this; // This is needed most of the times; no one knows why!
		const WrexMODS = this.getWrexMods(); // as always.
		const urban = WrexMODS.require('urban'); // WrexMODS'll automatically try to install the module if you run it with CMD/PowerShell.

		urban(`${string}`).first(function (results) {
			if (!results) return _this.callNextAction(cache); // this will call next action and won't kill your bot process if there is no result.
			switch (info) {
				case 0:
					result = results.definition;
					break;
				case 1:
					result = results.permalink;
					break;
				case 2:
					result = results.example;
					break;
				case 3:
					result = results.thumbs_up;
					break;
				case 4:
					result = results.thumbs_down;
					break;
				case 5:
					result = results.author;
					break;
				case 6:
					result = results.defid;
					break;
				default:
					break;
			}
			// Storing:
			if (result !== undefined) {
				const storage = parseInt(data.storage);
				const varName2 = _this.evalMessage(data.varName, cache);
				_this.storeValue(result, storage, varName2, cache);
			}
			_this.callNextAction(cache);
		});
	},

	//---------------------------------------------------------------------
	// Action Bot Mod
	//
	// Upon initialization of the bot, this code is run. Using the bot's
	// DBM namespace, one can add/modify existing functions if necessary.
	// In order to reduce conflictions between mods, be sure to alias
	// functions you wish to overwrite.
	//---------------------------------------------------------------------

	mod: function (DBM) { }

}; // End of module
