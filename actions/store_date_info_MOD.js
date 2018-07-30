module.exports = {

	//---------------------------------------------------------------------
	// Action Name
	//
	// This is the name of the action displayed in the editor.
	//---------------------------------------------------------------------
	
	name: "Store Date Info",
	
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
		const info = ['Day of the Week', 'Month of the Year', 'Unix Timestamp', '', 'Day Number', 'Year', 'Full Time', 'Hour', 'Month Number', 'Minute', 'Second', 'Timezone']
		return `Store ${info[parseInt(data.info)]} from Date`;
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
 	version: "1.8.9", //Added in 1.8.9

 	// A short description to show on the mod line for this mod (Must be on a single line)
 	short_description: "Stores something from a Date.",

 	// If it depends on any other mods by name, ex: WrexMODS if the mod uses something from WrexMods

 	//---------------------------------------------------------------------

	//---------------------------------------------------------------------
	// Action Storage Function
	//
	// Stores the relevant variable info for the editor.
	//---------------------------------------------------------------------

	variableStorage: function(data, varType) {
		const type = parseInt(data.storage);
		if(type !== varType) return;
		const info = parseInt(data.info);
		let dataType = 'Unknown Type';
		switch(info) {
			case 0:
				dataType = 'String';
				break;
			case 1:
				dataType = 'String';
				break;
			case 2:
				dataType = 'Number';
				break;
			case 4:
				dataType = 'Number';
				break;
			case 5:
				dataType = 'Number';
				break;
			case 6:
				dataType = 'String';
				break;
			case 7:
				dataType = 'Number';
				break;
			case 8:
				dataType = 'Number';
				break;
			case 9:
				dataType = 'Number';
				break;
			case 10:
				dataType = 'Number';
				break;
			case 11:
				dataType = 'String';
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
	
	fields: ["date", "info", "storage", "varName"],
	
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
	<div style="float: left; width: 30%; padding-top: 8px;">
		<p><u>Mod Info:</u><br>
		Made by <b>iAmaury</b> !</p>
	</div><br><br><br>
	<div style="padding-top: 8px;">
		Source Date:<br>
		<textarea id="date" rows="3" placeholder="e.g. Fri Apr 06 2018 13:32:10 GMT+0200" style="width: 99%; font-family: monospace; white-space: nowrap; resize: none;"></textarea>
	</div><br>
	<div style="padding-top: 8px; width: 70%;">
		Source Info:<br>
		<select id="info" class="round">
			<option value="2" selected>Unix Timestamp</option>
			<option value="0">Day of the Week</option>
			<option value="4">Day Number</option>
			<option value="1">Month of the Year</option>
			<option value="8">Month Number</option>
			<option value="5">Year</option>
			<option value="6">Full Time</option>
			<option value="7">Hour</option>
			<option value="9">Minute</option>
			<option value="10">Second</option>
			<option value="11">Timezone</option>
			
		</select>
	</div><br>
	<div style="float: left; width: 35%; padding-top: 8px;">
		Store Result In:<br>
		<select id="storage" class="round" onchange="glob.variableChange(this, 'varNameContainer')">
		${data.variables[0]}
		</select>
	</div>
	<div id="varNameContainer" style="float: right; display: none; width: 60%; padding-top: 8px;">
		Variable Name:<br>
		<input id="varName" class="round" type="text">
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
		const date = this.evalMessage(data.date, cache);
		const info = parseInt(data.info);
		if(Date.parse(date) == NaN) {
			console.log('Invalid Date ! Check that your date is valid. A Date generally looks like the one stored in "Creation Date" of a server. (variables works)');
			this.callNextAction(cache);
		}

		let result;
		switch(info) {
			case 0:
				result = date.slice(0, 3);
				break;
			case 1:
				result = date.slice(4, 7);
				break;
			case 2:
				result = parseInt(Date.parse(date) / 1000);
				break;
			case 4:
				result = parseInt(date.slice(8, 10));
				break;
			case 5:
				result = parseInt(date.slice(11, 15));
				break;
			case 6:
				result = date.slice(16, 24);
				break;
			case 7:
				result = (date.slice(16, 18));
				break;
			case 8:
				result = date.slice(4, 7);
				if (result == 'Jan') {result = 1;}
				if (result == 'Feb') {result = 2;}
				if (result == 'Mar') {result = 3;}
				if (result == 'Apr') {result = 4;}
				if (result == 'May') {result = 5;}
				if (result == 'Jun') {result = 6;}
				if (result == 'Jul') {result = 7;}
				if (result == 'Aug') {result = 8;}
				if (result == 'Sep') {result = 9;}
				if (result == 'Oct') {result = 10;}
				if (result == 'Nov') {result = 11;}
				if (result == 'Dec') {result = 12;}
				if (result == date.slice(4, 7)) {
					console.log('An error occured on "Store Date Info (Month Number)"')
					this.callNextAction(cache)
				}
				break;
			case 9:
				result = date.slice(19, 21);
				break;
			case 10:
				result = date.slice(22, 24);
				break;
			case 11:
				result = 'GMT' + date.slice(28, 29) + parseInt(date.slice(29, 33)) / 100;
			default:
				break;
		}
		if(result !== undefined) {
			const storage = parseInt(data.storage);
			const varName = this.evalMessage(data.varName, cache);
			this.storeValue(result, storage, varName, cache);
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