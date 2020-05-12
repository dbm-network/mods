module.exports = {

	//---------------------------------------------------------------------
	// Action Name
	//
	// This is the name of the action displayed in the editor.
	//---------------------------------------------------------------------

	name: "Google Image Search",

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
		return `Google Image Result ${info[parseInt(data.info)]}`;
	},

	//---------------------------------------------------------------------
	// DBM Mods Manager Variables (Optional but nice to have!)
	//
	// These are variables that DBM Mods Manager uses to show information
	// about the mods for people to see in the list.
	//---------------------------------------------------------------------

	// Who made the mod (If not set, defaults to "DBM Mods")
	author: "RigidStudios",

	// The version of the mod (Defaults to 1.0.0)
	version: "0.9",

	// A short description to show on the mod line for this mod (Must be on a single line)
	short_description: "Searches an Image on Google!",

	// Hi I depend on WrexMods :)


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

	fields: ["string", "apikey", "clientid","info", "resultNo", "storage", "varName"],

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
		<div style="height: 350px; width: 550px; overflow-y: scroll;">
			<div>
				<p><u>Mod Info:</u><br /> Created by RigidStudios</p>
			</div><br>
			<div style="width: 95%; padding-top: 2px;">Google Image Search Text:<br /> <textarea id="string" style="width: 100%; font-family: monospace; white-space: nowrap; resize: none;" rows="4" placeholder="Write something here or insert a variable..."></textarea></div><br>
			<div style="float: left; width: 95%; padding-top: 2px;">API Key:<br /> <input id="apikey" placeholder="xxxxxxxxxxxxxxxxxxxx-xxxxxxxxxxxxxxxxxxx" class="round" type="text" style="width: 100%;"/></div><br>
			<div style="float: left; width: 95%; padding-right: 10px padding-top: 2px;">Client ID:<br /> <input placeholder="000000000000000000000:aaaaaaaaaaa" id="clientid" class="round" type="text" style="width: 100%;"/></div><br>
		<br />
		<div style="float: left; width: 45%; padding-top: 2px;">Result Info:<br /><select id="info" class="round">
		<option value="0">Result Title</option>
		<option value="1">Result URL</option>
		<option value="2">Result Thumbnail URL</option>
		</select></div>
		<div style="float: left; width: 50%; padding-left: 10px; padding-top: 2px;">Result Number:<br /><select id="resultNo" class="round">
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
		<option value="10">11th Result</option>
		<option value="11">12th Result</option>
		</select></div>
		<br /><br />
		<div style="float: left; width: 45%; padding-top: 8px;">Store In:<br /><select id="storage" class="round" onchange="glob.variableChange(this, 'varNameContainer')">${data.variables[0]}</select></div>
		<div id="varNameContainer" style="float: right; padding-right: 0px; width: 53%; padding-top: 8px;">Variable Name:<br /> <input id="varName" class="round" type="text" /></div>
		<div style="text-align: left;"><br><br><br><br><br><br><br><br><br>
		https://github.com/RigidStudios/underground-rd/wiki/Google-Image-Search-Tutorial < Walkthrough
		</div></div>`
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
		const info = parseInt(data.info);// Desired Info
		const string = this.evalMessage(data.string, cache).replace(/[\u{0080}-\u{FFFF}]/gu, ""); // Replace taken from original Google Search Mod, invalid character parser.
		const resultNumber = parseInt(data.resultNo);// The result number.
		const clientid = this.evalMessage(data.clientid, cache);// CSE Client ID
		const apikey = this.evalMessage(data.apikey, cache);// GOOGLE Dev Credentials to access CSE API
		const index = parseInt(cache.index + 1);// Action Number for Quicker manual error logging

		// Check if everything is ok:
		if (!string) return console.error(`There was an error in Google Image Search MOD (#${index}): \nPlease write something to Google it!`);	// No Search
		if (!clientid) return console.error(`There was an error in Google Image Search MOD (#${index}): \nPlease provide a Client ID!`);// No Client ID
		if (!apikey) return console.error(`There was an error in Google Image Search MOD (#${index}): \nPlease provide an API Key`);// No API Key

		// Search Code:
		const WrexMODS = this.getWrexMods(); // as always.
		const imgSearch = WrexMODS.require('image-search-google');
		const imgClient = new imgSearch(`${clientid}`, `${apikey}`);
		const options = {page:1};
		imgClient.search(string, options)
				.then(result => {
					switch (info) {
						case 0:
							result = result[resultNumber].snippet;
							break;
						case 1:
							result = result[resultNumber].url;
							break;
						case 2:
							result = result[resultNumber].thumbnailLink;
							break;
						default:
							result = "Check Console.";
							console.error(`There was an error in Google Image Search MOD (#${index}): \nDesired Search Type does not exist.`);
							break;
					}
					if (result !== undefined) {
						const storage = parseInt(data.storage);
						const varName2 = this.evalMessage(data.varName, cache);
						this.storeValue(result, storage, varName2, cache);
						this.callNextAction(cache);
					} else {
						console.error(`There was an error in Google Image Search MOD (#${cache.index}): \nNo Result was provided.`)
						this.callNextAction(cache);
					}
					})
				.catch(error => {
					console.error(`There was an error in Google Image Search MOD (#${cache.index}): \n` + error);
					this.callNextAction(cache);
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
