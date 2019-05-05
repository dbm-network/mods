module.exports = {

//---------------------------------------------------------------------
// Action Name
//
// This is the name of the action displayed in the editor.
//---------------------------------------------------------------------

name: "Set Embed Timestamp",

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
	if(data.text !== undefined) {var text = data.text} else {var text = ''};
	if(data.year !== undefined) {var year = data.year} else {var year = ''};
	if(data.month) {var month = data.month} else {var month = ''};
	if(data.day) {var day = data.day} else {var day = ''};
	if(data.hour) {var hour = data.hour} else {var hour = ''};
	if(data.minute) {var minute = data.minute} else {var minute = ''};
	if(data.second) {var second = data.second} else {var second = ''};
	var retult;
	switch(parseInt(data.type)) {
		case 0: result = 'Current Timestamp';
		case 1: result = `String Timestamp: "${text}"`;
		case 2: result = `Custom Timestamp: "${year} ${month} ${day} ${hour} ${minute} ${second}"`;
	};
	return result;
},

//---------------------------------------------------------------------
	 // DBM Mods Manager Variables (Optional but nice to have!)
	 //
	 // These are variables that DBM Mods Manager uses to show information
	 // about the mods for people to see in the list.
	 //---------------------------------------------------------------------

	 // Who made the mod (If not set, defaults to "DBM Mods")
	 author: "ZockerNico",

	 // The version of the mod (Defaults to 1.0.0)
	 version: "1.9.5",//Added in 1.9.5

	 // A short description to show on the mod line for this mod (Must be on a single line)
	 short_description: "You can add a timestamp with the current or a custom UTC timecode",

	 // If it depends on any other mods by name, ex: WrexMODS if the mod uses something from WrexMods


	 //---------------------------------------------------------------------

//---------------------------------------------------------------------
// Action Fields
//
// These are the fields for the action. These fields are customized
// by creating elements with corresponding IDs in the HTML. These
// are also the names of the fields stored in the action's JSON data.
//---------------------------------------------------------------------

fields: ["storage", "varName", "type", "timestamp1", "timestamp2", "text", "year", "month", "day", "hour", "minute", "second", "note1", "note2"],

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
		Made by ZockerNico.
	</p>
</div><br>
<div>
	<div style="float: left; width: 35%;">
		Source Embed Object:<br>
		<select id="storage" class="round" onchange="glob.refreshVariableList(this)">
			${data.variables[1]}
		</select>
	</div>
	<div id="varNameContainer" style="float: right; width: 60%;">
		Variable Name:<br>
		<input id="varName" class="round" type="text" list="variableList">
	</div>
</div><br><br><br>
<div style="float: left; width: 35%; padding-top: 8px;">
	Generation Type:<br>
	<select id="type" class="round" onchange="glob.onChange(this)">
		<option value="0" selected>Current Timestamp</option>
		<option value="1">String Timestamp</option>
		<option value="2">Custom Timestamp</option>
	</select><br>
</div><br><br><br><br>
<div id="timestamp1" class="round" style="float: left; width: 109.3%; padding-top: 8px; display: none;">
	UTC Timestamp:<br>
	<input id="text" class="round" type="text" placeholder="Insert your utc timestamp string..."><br>
</div>
<div id="timestamp2" style="padding-top: 8px; display: table;">
	<div style="display: table-cell;">
		Year:<br>
		<input id="year" class="round" type="text">
	</div>
	<div style="display: table-cell;">
		Month:<br>
		<input id="month" class="round" type="text">
	</div>
	<div style="display: table-cell;">
		Day:<br>
		<input id="day" class="round" type="text">
	</div>
	<div style="display: table-cell;">
		Hour:<br>
		<input id="hour" class="round" type="text">
	</div>
	<div style="display: table-cell;">
		Minute:<br>
		<input id="minute" class="round" type="text">
	</div>
	<div style="display: table-cell;">
		Second:<br>
		<input id="second" class="round" type="text">
	</div>
</div>
<div id="note1" style="float: left; padding-top: 8px; width: 100%; display: none;">
	<p>
		This setting works with time formats like "March 03, 1973 11:13:00" or "100000000000" (milliseconds).
	</p>
</div>
<div id="note2" style="float: left; padding-top: 8px; width: 100%; display: none;">
	<p><br>
		Correct input:<br>
		Year: [2019] Month: [8] Day: [10] Hour: [] Minute: [] Second: []<br>
		Incorrect input:<br>
		Year: [2019] Month: [8] Day: [] Hour: [6] Minute: [] Second: []
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
	const timestamp = document.getElementById('timestamp1');
	const timestamp2 = document.getElementById('timestamp2');
	const note = document.getElementById('note1');
	const note2 = document.getElementById('note2');

	glob.onChange = function() {
		switch(parseInt(document.getElementById('type').value)) {
			case 0:
				timestamp.style.display = 'none';
				timestamp2.style.display = 'none';
				note.style.display = 'none';
				note2.style.display = 'none';
				break;
			case 1:
				timestamp.style.display = 'table';
				timestamp2.style.display = 'none';
				note.style.display = null;
				note2.style.display = 'none';
				break;
			case 2:
				timestamp.style.display = 'none';
				timestamp2.style.display = 'table';
				note.style.display = 'none';
				note2.style.display = null;
				break;

		};
	};

	document.getElementById('type');

	glob.onChange(document.getElementById('type'));
	glob.refreshVariableList(document.getElementById('storage'));
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
	const embed = this.getVariable(storage, varName, cache);
	const text = this.evalMessage(data.text, cache);
	const year = parseInt(this.evalMessage(data.year, cache));
	const month = parseInt(this.evalMessage(data.month, cache)-1);
	const day = parseInt(this.evalMessage(data.day, cache));
	const hour = parseInt(this.evalMessage(data.hour, cache));
	const minute = parseInt(this.evalMessage(data.minute, cache));
	const second = parseInt(this.evalMessage(data.second, cache));
	
	switch(parseInt(data.type)) {
		case 0:
			embed.setTimestamp(new Date());
			break;
		case 1:
			if(text.length > 0) {
				embed.setTimestamp(new Date(`${text}`));
			} else {
				embed.setTimestamp(new Date());
				console.log('Invaild utc timestamp! Changed from [String Timestamp] to [Current Timestamp].');
			};
			break;
		case 2:
			if(year >= 1000 && year !== undefined && month >= 0 && month !== undefined && day >= 0 && day !== undefined && hour >= 0 && hour !== undefined && minute >= 0 && minute !== undefined && second >= 0 && second !== undefined) {
				if(year !== undefined && month !== undefined && day !== undefined && hour !== undefined && minute !== undefined && second !== undefined) {
					embed.setTimestamp(new Date(year, month, day, hour, minute, second));
				} else if(year !== undefined && month !== undefined && day !== undefined && hour !== undefined && minute !== undefined && second == undefined) {
					embed.setTimestamp(new Date(year, month, day, hour, minute));
				} else if(year !== undefined && month !== undefined && day !== undefined && hour !== undefined && minute == undefined && second == undefined) {
					embed.setTimestamp(new Date(year, month, day, hour));
				} else if(year !== undefined && month !== undefined && day !== undefined && hour == undefined && minute == undefined && second == undefined) {
					embed.setTimestamp(new Date(year, month, day));
				} else if(year !== undefined && month !== undefined && day == undefined && hour == undefined && minute == undefined && second == undefined) {
					embed.setTimestamp(new Date(year, month));
				} else if(year !== undefined && month == undefined && day == undefined && hour == undefined && minute == undefined && second == undefined) {
					embed.setTimestamp(new Date(year));
				} else {
					embed.setTimestamp(new Date());
					console.log('Invaild utc timestamp! Changed from [Custom Timestamp] to [Current Timestamp].');
				};
			} else {
				embed.setTimestamp(new Date());
				console.log('Invaild utc timestamp! from [Custom Timestamp] Changed to [Current Timestamp].');
			};
			break;
		default:
			embed.setTimestamp(new Date());
			break;
	};

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
