module.exports = {

//---------------------------------------------------------------------
// Action Name
//
// This is the name of the action displayed in the editor.
//---------------------------------------------------------------------

name: "Create Embed Message",

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
	return `${data.title}`;
},

//---------------------------------------------------------------------
	 // DBM Mods Manager Variables (Optional but nice to have!)
	 //
	 // These are variables that DBM Mods Manager uses to show information
	 // about the mods for people to see in the list.
	 //---------------------------------------------------------------------

	 // Who made the mod (If not set, defaults to "DBM Mods")
	 author: "DBM, ZockerNico",

	 // The version of the mod (Defaults to 1.0.0)
	 version: "1.9.5",//Added in 1.8.2

	 // A short description to show on the mod line for this mod (Must be on a single line)
	 short_description: "Changed category, added author url, the ability to customize the timestamp and a debug button.",

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
	return ([data.varName, 'Embed Message']);
},

//---------------------------------------------------------------------
// Action Fields
//
// These are the fields for the action. These fields are customized
// by creating elements with corresponding IDs in the HTML. These
// are also the names of the fields stored in the action's JSON data.
//---------------------------------------------------------------------

fields: ["title", "author", "color", "url", "authorIcon", "authorUrl", "imageUrl", "thumbUrl", "timestamp", "debug", "timestamp1", "timestamp2", "text", "year", "month", "day", "hour", "minute", "second", "note1", "note2", "storage", "varName"],

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
<div id ="wrexdiv" style="width: 550px; height: 350px; overflow-y: scroll; overflow-x: hidden;">
<div>
	<p>
		This action has been modified by DBM Mods.
	</p>
</div>
<div style="float: left; width: 50%; padding-top: 16px;">
	Title:<br>
	<input id="title" class="round" type="text"><br>
	Author Name:<br>
	<input id="author" class="round" type="text" placeholder="Leave blank to disallow author!"><br>
	Author URL:<br>
	<input id="authorUrl" class="round" type="text" placeholder="Leave blank for none!"><br>
	Author Icon URL:<br>
	<input id="authorIcon" class="round" type="text" placeholder="Leave blank for none!"><br>
</div>
<div style="float: right; width: 50%; padding-top: 16px;">
	Color:<br>
	<input id="color" class="round" type="text" placeholder="Leave blank for default!"><br>
	URL:<br>
	<input id="url" class="round" type="text" placeholder="Leave blank for none!"><br>
	Image URL:<br>
	<input id="imageUrl" class="round" type="text" placeholder="Leave blank for none!"><br>
	Thumbnail URL:<br>
	<input id="thumbUrl" class="round" type="text" placeholder="Leave blank for none!"><br>
</div>
<div id="timestampDiv" style="float: left; width: 45%; display: none;">
	Timestamp:<br>
	<select id="timestamp" class="round" onchange="glob.onChange1(this)">
		<option value="false" selected>No Timestamp</option>
		<option value="true">Current Timestamp</option>
		<option value="string">String Timestamp</option>
		<option value="custom">Custom Timestamp</option>
	</select>
</div>
<div id="timestampDivDebug" style="float: left; width: 45%; display: none;">
	Timestamp:<br>
	<select id="timestampDebug" class="round" onchange="glob.onChange1(this)">
		<option value="false" selected>No Timestamp</option>
		<option value="true">Current Timestamp</option>
	</select>
</div>
<div style="float: right; width: 50%; padding-right: 26px;">
	Debug:<br>
	<select id="debug" class="round" onchange="glob.onChange2(this)">
		<option value="false" selected>No - More options</option>
		<option value="true">Yes - More stable</option>
	</select>
</div>
<div id="timestamp1" class="round" style="float: left; width: 104.6%; padding-top: 16px; display: none;">
	UTC Timestamp:<br>
	<input id="text" class="round" type="text" placeholder="Insert your utc timestamp string...">
</div>
<div id="timestamp2" style="padding-top: 16px; display: table; width: 95.5%;">
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
<div>
	<div style="float: left; width: 35%;">
		<br>Store In:<br>
		<select id="storage" class="round">
			${data.variables[1]}
		</select>
	</div>
	<div id="varNameContainer" style="float: right; width: 60%;">
		<br>Variable Name:<br>
		<input id="varName" class="round" type="text"><br>
	</div>
</div>
<div id="note1" style="float: left; padding-top: 8px; width: 100%; display: none;">
	<h2>
		String Timestamp<br>
	</h2>
	<p>
		This setting works with time formats like "March 03, 1973 11:13:00" or "100000000000" (milliseconds).<br>
	</p>
</div>
<div id="note2" style="float: left; padding-top: 8px; width: 100%; display: none;">
	<h2>
		Custom Timestamp<br>
	</h2>
	<p>
		Correct input:<br>
		Year: [2019] Month: [8] Day: [10] Hour: [ ] Minute: [ ] Second: [ ]<br>
		Incorrect input:<br>
		Year: [2019] Month: [8] Day: [ ] Hour: [6] Minute: [ ] Second: [ ]<br>
	</p>
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

init: function() {
	const {glob, document} = this;
	const timestampDiv = document.getElementById('timestampDiv');
	const timestamp = document.getElementById('timestamp');
	const timestampDivDebug = document.getElementById('timestampDivDebug');
	const timestampDebug = document.getElementById('timestampDebug');
	const debug = document.getElementById('debug');
	const timestamp1 = document.getElementById('timestamp1');
	const timestamp2 = document.getElementById('timestamp2');
	const note = document.getElementById('note1');
	const note2 = document.getElementById('note2');
	const authorUrl = document.getElementById('authorUrl');

	glob.onChange1 = function() {
		if(debug.value == "false") {
			authorUrl.placeholder = 'Leave blank for none!';
			switch(timestamp.value) {
				case "false":
				case "true":
					timestamp1.style.display = 'none';
					timestamp2.style.display = 'none';
					note.style.display = 'none';
					note2.style.display = 'none';
					break;
				case "string":
					timestamp1.style.display = 'table';
					timestamp2.style.display = 'none';
					note.style.display = null;
					note2.style.display = 'none';
					break;
				case "custom":
					timestamp1.style.display = 'none';
					timestamp2.style.display = 'table';
					note.style.display = 'none';
					note2.style.display = null;
					break;
	
			};
		};
	};

	glob.onChange2 = function() {
		switch(debug.value) {
			case "false":
				timestampDiv.style.display = null;
				timestampDivDebug.style.display = 'none';
				break;
			case "true":
				timestampDiv.style.display = 'none';
				timestampDivDebug.style.display = null;
				timestamp1.style.display = 'none';
				timestamp2.style.display = 'none';
				note.style.display = 'none';
				note2.style.display = 'none';
				authorUrl.placeholder = 'Unavaible!';
				break;
		};
		glob.onChange1();
	};

	document.getElementById('timestamp');
	document.getElementById('debug');

	glob.onChange1(document.getElementById('timestamp'));
	glob.onChange2(document.getElementById('debug'));
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
	const embed = this.createEmbed();
	const text = this.evalMessage(data.text, cache);
	const year = parseInt(this.evalMessage(data.year, cache));
	const month = parseInt(this.evalMessage(data.month, cache)-1);
	const day = parseInt(this.evalMessage(data.day, cache));
	const hour = parseInt(this.evalMessage(data.hour, cache));
	const minute = parseInt(this.evalMessage(data.minute, cache));
	const second = parseInt(this.evalMessage(data.second, cache));
	const timestamp = this.evalMessage(data.timestamp, cache);
	const timestampDebug = this.evalMessage(data.timestampDebug, cache);
	const debug = this.evalMessage(data.debug);

	if(debug != "true") {
		//Title
		embed.setTitle(this.evalMessage(data.title, cache));
	
		//URL
		if(data.url) {
			embed.setURL(this.evalMessage(data.url, cache));
		};
	
		//Author Name
		if(data.author) {
			if(data.authorIcon && data.authorUrl) {
				embed.setAuthor(this.evalMessage(data.author, cache), this.evalMessage(data.authorIcon, cache), this.evalMessage(data.authorUrl, cache));
			} else if(data.authorIcon && !data.authorUrl) {
				embed.setAuthor(this.evalMessage(data.author, cache), this.evalMessage(data.authorIcon, cache));
			} else if(!data.authorIcon && data.authorUrl) {
				embed.setAuthor(this.evalMessage(data.author, cache), '', this.evalMessage(data.authorUrl, cache));
			} else {
				embed.setAuthor(this.evalMessage(data.author, cache));
			};
		};
	
		//Color
		if(data.color) {
			embed.setColor(this.evalMessage(data.color, cache));
		};
	
		//Image URL
		if(data.imageUrl) {
			embed.setImage(this.evalMessage(data.imageUrl, cache));
		};
	
		//Thumbnail URL
		if(data.thumbUrl) {
			embed.setThumbnail(this.evalMessage(data.thumbUrl, cache));
		};
	
		//Timestamp
		switch(timestamp) {
			case "false":
				break;
			case "true":
				embed.setTimestamp(new Date());
				break;
			case "string":
				if(text.length > 0) {
					embed.setTimestamp(new Date(`${text}`));
				} else {
					embed.setTimestamp(new Date());
					console.log('Invaild utc timestamp! Changed from [String Timestamp] to [Current Timestamp].');
				};
				break;
			case "custom":
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
	
		const storage = parseInt(data.storage);
		const varName = this.evalMessage(data.varName, cache);
		this.storeValue(embed, storage, varName, cache);
		this.callNextAction(cache);
	} else {
		const data = cache.actions[cache.index];
		const embed = this.createEmbed();
		embed.setTitle(this.evalMessage(data.title, cache));
		if(data.url) {
			embed.setURL(this.evalMessage(data.url, cache));
		};
		if(data.author && data.authorIcon) {
			embed.setAuthor(this.evalMessage(data.author, cache), this.evalMessage(data.authorIcon, cache));
		};
		if(data.color) {
			embed.setColor(this.evalMessage(data.color, cache));
		};
		if(data.imageUrl) {
			embed.setImage(this.evalMessage(data.imageUrl, cache));
		};
		if(data.thumbUrl) {
			embed.setThumbnail(this.evalMessage(data.thumbUrl, cache));
		};
		if(timestampDebug === "true") {
			embed.setTimestamp(new Date());
		};
		const storage = parseInt(data.storage);
		const varName = this.evalMessage(data.varName, cache);
		this.storeValue(embed, storage, varName, cache);
		this.callNextAction(cache);
	};
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
	const DiscordJS = DBM.DiscordJS;
	const Actions = DBM.Actions;

	Actions.createEmbed = function() {
		return new DiscordJS.RichEmbed();
	};
}

}; // End of module
