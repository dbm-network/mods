module.exports = {

	//---------------------------------------------------------------------
	// Action Name
	//
	// This is the name of the action displayed in the editor.
	//---------------------------------------------------------------------

	name: "Bot Typing",

	//---------------------------------------------------------------------
	// Action Section
	//
	// This is the section the action will fall into.
	//---------------------------------------------------------------------

	section: "Bot Client Control",

	//---------------------------------------------------------------------
	// Action Subtitle
	//
	// This function generates the subtitle displayed next to the name.
	//---------------------------------------------------------------------

	subtitle: function(data) {
		const names = ['Same Channel', 'Mentioned Channel', 'Default Channel', 'Temp Variable', 'Server Variable', 'Global Variable'];
		const names2 = ['Starts Typing', 'Stops Typing']
		const index2 = parseInt(data.type);
		const index = parseInt(data.storage);
		return index < 3 ? `${names[index]} - ${names2[index2]}` : `${names[index]} - ${data.varName} - ${names2[index2]}`;
	},

	//---------------------------------------------------------------------
	// Action Fields
	//
	// These are the fields for the action. These fields are customized
	// by creating elements with corresponding IDs in the HTML. These
	// are also the names of the fields stored in the action's JSON data.
	//---------------------------------------------------------------------

	fields: ["storage", "varName", "type"],

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
			<p>
				<u>Mod Info:</u><br>
				Created by Lasse! (merged by EliteArtz and fixed by iAmaury)
			</p>
		</div><br>
	<div>
		<div style="float: left; width: 35%;">
			Typing Option:<br>
			<select id="type" class="round">
				<option value="0" selected>Start Typing</option>
				<option value="1">Stop Typing</option>
			</select>
		</div><br>
	</div><br>
	<div>
		<div style="float: left; width: 35%;">
			Channel to start typing in:<br>
			<select id="storage" class="round" onchange="glob.channelChange(this, 'varNameContainer')">
				${data.channels[isEvent ? 1 : 0]}
			</select>
		</div>
		<div id="varNameContainer" style="display: none; float: right; width: 60%;">
			Variable Name:<br>
			<input id="varName" class="round" type="text" list="variableList"><br>
		</div>
	</div><br><br><br>
	<div>
		<p>
			You can stop the typing with <b>Stop Typing</b>
		</p>
	</div><br>`
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

		glob.channelChange(document.getElementById('storage'), 'varNameContainer');
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
		const channel = this.getChannel(storage, varName, cache);

		try { //This "Try and Catch" Function is really useful for when it's coming up an error, it will log it in your logs.
			if (data.type == "0") { //"If and else" Function is for looking if the result of them equals what you wan't.
				channel.startTyping(); //Starts the Typing
			} else {
				channel.stopTyping(true); //Stops the Typing
			}
		} catch (e) {
			console.error("ERROR!" + e + e.stack); // Here it's gonna log if an error occured.
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
