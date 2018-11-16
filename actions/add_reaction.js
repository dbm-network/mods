module.exports = {

//---------------------------------------------------------------------
// Action Name
//
// This is the name of the action displayed in the editor.
//---------------------------------------------------------------------

name: "Add Reaction",

//---------------------------------------------------------------------
// Action Section
//
// This is the section the action will fall into.
//---------------------------------------------------------------------

section: "Reaction Control",

//---------------------------------------------------------------------
// Action Subtitle
//
// This function generates the subtitle displayed next to the name.
//---------------------------------------------------------------------

subtitle: function(data) {
	const names = ['Command Message', 'Temp Variable', 'Server Variable', 'Global Variable'];
	const index = parseInt(data.storage);
	return data.storage === "0" ? `Add Reaction to ${names[index]}` : `Add Reaction to ${names[index]} (${data.varName})`;
},


//---------------------------------------------------------------------
// DBM Mods Manager Variables (Optional but nice to have!)
//
// These are variables that DBM Mods Manager uses to show information
// about the mods for people to see in the list.
//---------------------------------------------------------------------

// Who made the mod (If not set, defaults to "DBM Mods")
author: "DBM",

// The version of the mod (Defaults to 1.0.0)
version: "1.9.2", //Added in 1.9.1

// A short description to show on the mod line for this mod (Must be on a single line)
short_description: "Changed Category.",

// If it depends on any other mods by name, ex: WrexMODS if the mod uses something from WrexMods


//---------------------------------------------------------------------



//---------------------------------------------------------------------
// Action Fields
//
// These are the fields for the action. These fields are customized
// by creating elements with corresponding IDs in the HTML. These
// are also the names of the fields stored in the action's JSON data.
//---------------------------------------------------------------------

fields: ["storage", "varName", "emoji", "varName2", "varName3"],

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
		Source Message:<br>
		<select id="storage" class="round" onchange="glob.messageChange(this, 'varNameContainer')">
			${data.messages[isEvent ? 1 : 0]}
		</select>
	</div>
	<div id="varNameContainer" style="display: none; float: right; width: 60%;">
		Variable Name:<br>
		<input id="varName" class="round" type="text" list="variableList"><br>
	</div>
</div><br><br><br>
<div style="padding-top: 8px;">
	<div style="float: left; width: 35%;">
		Source Emoji:<br>
		<select id="emoji" name="second-list" class="round" onchange="glob.onChange1(this)">
			<option value="4" selected>Direct Emoji</option>
			<option value="0">Custom Emoji</option>
			<option value="1">Temp Variable</option>
			<option value="2">Server Variable</option>
			<option value="3">Global Variable</option>
		</select>
	</div>
	<div id="varNameContainer2" style="float: right; width: 60%;">
		<span id="extName">Emoji  (right-click -> Insert Emoji)</span>:<br>
		<input id="varName2" class="round" type="text">
	</div>
	<div id="varNameContainer3" style="float: right; width: 60%; display: none;">
		Variable Name:<br>
		<input id="varName3" class="round" type="text" list="variableList2">
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

	glob.onChange1 = function(event) {
		const value = parseInt(event.value);
		const varNameInput = document.getElementById("extName");
		if(value === 0) {
			varNameInput.innerHTML = "Emoji Name";
			document.getElementById('varNameContainer3').style.display = 'none';
			document.getElementById('varNameContainer2').style.display = null;
		} else if(value === 4) {
			varNameInput.innerHTML = "Emoji  (right-click -> Insert Emoji)";
			document.getElementById('varNameContainer3').style.display = 'none';
			document.getElementById('varNameContainer2').style.display = null;
		} else {
			glob.onChangeBasic(event, "varNameContainer3");
			document.getElementById('varNameContainer3').style.display = null;
			document.getElementById('varNameContainer2').style.display = 'none';
		}
	};

	glob.onChange1(document.getElementById('emoji'));
	glob.messageChange(document.getElementById('storage'), 'varNameContainer');
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
	const message = this.getMessage(storage, varName, cache);

	const type = parseInt(data.emoji);
	let emoji;
	if(type === 4) {
		emoji = this.evalMessage(data.varName2, cache);
	} else if(type === 0) {
		emoji = this.getDBM().Bot.bot.emojis.find(element => element.name === this.evalMessage(data.varName2, cache));
	} else {
		emoji = this.getVariable(type, this.evalMessage(data.varName3, cache), cache);
	}

	if(Array.isArray(message)) {
		this.callListFunc(message, 'react', [emoji]).then(function() {
			this.callNextAction(cache);
		}.bind(this));
	} else if(emoji && message && message.react) {
		message.react(emoji).then(function() {
			this.callNextAction(cache);
		}.bind(this)).catch(this.displayError.bind(this, data, cache));
	} else {
		this.callNextAction(cache);
	}
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