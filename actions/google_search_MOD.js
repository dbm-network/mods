module.exports = {

	//---------------------------------------------------------------------
	// Action Name
	//
	// This is the name of the action displayed in the editor.
	//---------------------------------------------------------------------

	name: "Google Search",

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
		const info = ['Title', 'URL', 'Snippet'];
		return `Google Result ${info[parseInt(data.info)]}`;
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
	version: "1.8.7", //Added in 1.8.7

	// A short description to show on the mod line for this mod (Must be on a single line)
	short_description: "Googles the given text!.",

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
		let dataType = 'Unknown Google Type';
		switch (info) {
			case 0:
				dataType = "Google Result Title";
				break;
			case 1:
				dataType = "Google Result URL";
				break;
			case 2:
				dataType = "Google Result Snippet";
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

	fields: ["string", "info", "resultNo", "storage", "varName"],

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
				Created by EGGSY!
			</p>
		</div><br>
	<div style="width: 95%; padding-top: 8px;">
		String(s) to Search on Google:<br>
		<textarea id="string" rows="5" placeholder="Write something or use variables to Google search it..." style="width: 100%; font-family: monospace; white-space: nowrap; resize: none;"></textarea>
	 </div><br>
	 <div style="float: left; width: 45%; padding-top: 8px;">
		Source Info:<br>
		<select id="info" class="round">
			<option value="0">Result Title</option>
			<option value="1">Result URL</option>
			<option value="2">Result Snippet (Description)</option>
		</select>
	</div>
	<div style="float: left; width: 50%; padding-left: 10px; padding-top: 8px;">
		Result Number:<br>
		<select id="resultNo" class="round">
			<option value="0">1st Result</option>
			<option value="1">2nd Result</option>
			<option value="2">3rd Result</option>
			<option value="3">4th Result</option>
			<option value="4">5th Result</option>
			<option value="5">6th Result</option>
			<option value="6">7th Result</option>
			<option value="7">8th Result</option>
			<option value="8">9th Result</option>
			<option value="9">10th Result</option>
		</select>
	</div><br><br>
		<div style="float: left; width: 43%; padding-top: 8px;">
			Store In:<br>
			<select id="storage" class="round" onchange="glob.variableChange(this, 'varNameContainer')">
				${data.variables[0]}
			</select>
		</div>
		<div id="varNameContainer" style="float: right; width: 53%; padding-top: 8px;">
			Variable Name:<br>
			<input id="varName" class="round" type="text"><br>
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
		const string = this.evalMessage(data.string, cache).replace(/[\u{0080}-\u{FFFF}]/gu, ""); // The replace thing is very new, it's just replacing the invalid characters so command won't stuck when you use other languages.
		const resultNumber = parseInt(data.resultNo);

		// Check if everything is ok:
		if (!string) return console.log("Please write something to Google it!");

		// Main code:
		const WrexMODS = this.getWrexMods(); // as always.
		WrexMODS.CheckAndInstallNodeModule('google-it');
		const googleIt = WrexMODS.require('google-it');

		googleIt({ 'query': `${string}`, 'no-display': 1, 'limit': 10 }).then(results => {
			switch (info) {
				case 0:
					result = results[resultNumber].title;
					break;
				case 1:
					result = results[resultNumber].link;
					break;
				case 2:
					result = results[resultNumber].snippet;
					break;
				default:
					break;
			}
			if (result !== undefined) {
				const storage = parseInt(data.storage);
				const varName2 = this.evalMessage(data.varName, cache);
				this.storeValue(result, storage, varName2, cache);
				this.callNextAction(cache);
			} else {
				this.callNextAction(cache);
			}
		}).catch(e => {
			console.log("An error in Google Search MOD: " + e);
			this.callNextAction(cache);
		})
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
