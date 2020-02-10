module.exports = {

	//---------------------------------------------------------------------
	// Action Name
	//
	// This is the name of the action displayed in the editor.
	//---------------------------------------------------------------------
	
	name: "Find Text",
	
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
	
	subtitle: function(data) {
		return `Find "${data.wordtoFind}"`;
	},
	
	//---------------------------------------------------------------------
		// DBM Mods Manager Variables (Optional but nice to have!)
		//
		// These are variables that DBM Mods Manager uses to show information
		// about the mods for people to see in the list.
		//---------------------------------------------------------------------
	
		// Who made the mod (If not set, defaults to "DBM Mods")
		author: "iAmaury",
	
		// The version of the mod (Defaults to 1.0.0)
		version: "1.8.7", //Added in 1.8.7
	
		// A short description to show on the mod line for this mod (Must be on a single line)
		short_description: "Find text",
	
		// If it depends on any other mods by name, ex: WrexMODS if the mod uses something from WrexMods
	
	//---------------------------------------------------------------------
	// Action Storage Function
	//
	// Stores the relevant variable info for the editor.
	//---------------------------------------------------------------------
	
	variableStorage: function(data, varType) {
		const type = parseInt(data.storage);
		if(type !== varType) return;
		let dataType = 'Number';
		return ([data.varName, dataType]);
	},
	//---------------------------------------------------------------------
	// Action Fields
	//
	// These are the fields for the action. These fields are customized
	// by creating elements with corresponding IDs in the HTML. These
	// are also the names of the fields stored in the action's JSON data.
	//---------------------------------------------------------------------
	
	fields: ["text", "wordtoFind", "position", "storage", "varName"],
	
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
		<div id="modinfo">
		<p>
		   <u>Mod Info:</u><br>
		   Made by <b>iAmaury</b> !<br>
		</p>
		</div><br>
		<div style="float: left; width: 65%; padding-top: 8px;">
			Text to Find:
			<input id="wordtoFind" class="round" type="text">
		</div>
		<div style="float: left; width: 29%; padding-top: 8px;">
			Position:<br>
			<select id="position" class="round">
				<option value="0" selected>Position at Start</option>
				<option value="1">Position at End</option>
		</select>
		</div>
		<div style="float: left; width: 99%; padding-top: 8px;">
			Source Text:
			<textarea id="text" rows="3" placeholder="Insert text here..." style="width: 95%; font-family: monospace; white-space: nowrap; resize: none;"></textarea>
		</div>
		<div style="float: left; width: 35%; padding-top: 8px;">
			Store Result In:<br>
			<select id="storage" class="round" onchange="glob.variableChange(this, 'varNameContainer')">
				${data.variables[0]}
			</select>
		</div>
		<div id="varNameContainer" style="float: right; display: none; width: 60%; padding-top: 8px;">
			Variable Name:<br>
			<input id="varName" class="round" type="text" >
		</div>
		<div style="float: left; width: 99%; padding-top: 8px;">
			<p>
			This action will output the position of the text depending of your choice.<br>
			If you choose <b>Position at End</b>, it will find the position of the last character of your text.<br>
			If you choose <b>Position at Start</b>, it will find the position of the first character of your text.
			<b>Example</b>: We search word "a" | <u>This is<b> *</b>a<b>- </b>test</u> | * is the start (8) | - is the end (9)
			</p>
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
	
		glob.variableChange(document.getElementById('storage'), 'varNameContainer');
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
		const text = this.evalMessage(data.text, cache);
		const wordtoFind = this.evalMessage(data.wordtoFind, cache);
		const position = parseInt(data.position);
		// Check if everything is ok
		if(!wordtoFind) return console.log("Find Text MOD: Text to find is missing!");
		if(!text) return console.log("Find Text MOD: Source text is missing!");
		if(!text.includes(wordtoFind)) {console.log(`Find Text MOD: The requested text wasn't found in the source text!\n	Source text: ${text}\n	Text to find: ${wordtoFind}`)};
	
		// Main code
		let result;
		switch(position) {
			case 0:
				result = text.indexOf(wordtoFind);
				break;
			case 1:
				result = wordtoFind.length + text.indexOf(wordtoFind);
				break;
			default:
				break;
		}

		// Storing
		const storage = parseInt(data.storage);
		const varName = this.evalMessage(data.varName, cache);
		this.storeValue(result, storage, varName, cache);
	
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
	
