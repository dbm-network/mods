module.exports = {

	//---------------------------------------------------------------------
	// Action Name
	//
	// This is the name of the action displayed in the editor.
	//---------------------------------------------------------------------

	name: "RSS Feed Watcher",

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
		return `${data.url}`;
	},

	//---------------------------------------------------------------------
	// DBM Mods Manager Variables (Optional but nice to have!)
	//
	// These are variables that DBM Mods Manager uses to show information
	// about the mods for people to see in the list.
	//---------------------------------------------------------------------

	// Who made the mod (If not set, defaults to "DBM Mods")
	author: "Two",

	// The version of the mod (Defaults to 1.0.0)
	version: "1.9.3",

	// A short description to show on the mod line for this mod (Must be on a single line)
	short_description: "This mod allows you to watch rss feeds for updates & store the update in a variable.",


	//---------------------------------------------------------------------
	// Action Storage Function
	//
	// Stores the relevant variable info for the editor.
	//---------------------------------------------------------------------

	variableStorage: function (data, varType) {
		const type = parseInt(data.storage);
		if (type !== varType) return;
		return ([data.varName, 'RSS Feed']);
	},

	//---------------------------------------------------------------------
	// Action Fields
	//
	// These are the fields for the action. These fields are customized
	// by creating elements with corresponding IDs in the HTML. These
	// are also the names of the fields stored in the action's JSON data.
	//---------------------------------------------------------------------

	fields: ["path", "url", "storage", "varName"],

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
	<div style="padding-top: 8px;">
	<div style="float:left"><u>Note:</u><b>This action will not stop watching the feed until bot restarts or using Stop RSS Feed Watcher action!</b></div><br>
<br>
<div style="float:left"><b>The next actions will be called on feed update!</b></div><br>

<div>
	Local/Web URL:<br>
	<input id="url" class="round" type="text" placeholder="eg. https://github.com/dbm-mods.atom"><br>
</div>
<div>
	Json Path:<br>
	<input id="path" class="round" type="text" placeholder="Leave Blank if not needed."><br>
</div>
<div>
	<div style="float: left; width: 35%;">
		Store In:<br>
		<select id="storage" class="round">
			${data.variables[1]}
		</select>
	</div>
	<div id="varNameContainer" style="float: right; width: 60%;">
		Variable Name:<br>
		<input id="varName" class="round" type="text"><br>
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

	init: function () {},

	//---------------------------------------------------------------------
	// Action Bot Function
	//
	// This is the function for the action within the Bot's Action class.
	// Keep in mind event calls won't have access to the "msg" parameter, 
	// so be sure to provide checks for variable existance.
	//---------------------------------------------------------------------

	action: function (cache) {
		const data = cache.actions[cache.index];
		const url = this.evalMessage(data.url, cache);
		const varName = this.evalMessage(data.varName, cache);
		const storage = parseInt(data.storage);
		const path = parseInt(data.path);
		var _this = this
		var stor = storage + varName
		console.log(stor)
		const WrexMODS = this.getWrexMods();
		const {
			JSONPath
		} = WrexMODS.require('jsonpath-plus');
		var Watcher = WrexMODS.require('feed-watcher'),
			feed = url,
			interval = 10 // seconds

		// if not interval is passed, 60s would be set as default interval.
		var watcher = new Watcher(feed, interval)
		this.storeValue(watcher, storage, stor, cache);
	
		// Check for new entries every n seconds.
		watcher.on('new entries', function (entries) {
			entries.forEach(function (entry) {

                if(path){
					var res = JSONPath({
						path: path,
						json: entry
					});
					_this.storeValue(res, storage, varName, cache);
				} else if (!path){
					_this.storeValue(entry, storage, varName, cache);
				}

				
				
                _this.callNextAction(cache);
			})
		})

		// Start watching the feed.
		watcher
			.start()
			.then(function (entries) {
				console.log('Starting watching...')
			})
			.catch(function (error) {
				console.error(error)
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

	mod: function (DBM) {}

}; // End of module