module.exports = {

//---------------------------------------------------------------------
// Action Name
//
// This is the name of the action displayed in the editor.
//---------------------------------------------------------------------

name: "Send Embed Message",

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
	const channels = ['Same Channel', 'Command Author', 'Mentioned User', 'Mentioned Channel', 'Default Channel', 'Temp Variable', 'Server Variable', 'Global Variable']
	return `${channels[parseInt(data.channel)]}: ${data.varName}`;
},

//---------------------------------------------------------------------
// DBM Mods Manager Variables (Optional but nice to have!)
//
// These are variables that DBM Mods Manager uses to show information
// about the mods for people to see in the list.
//---------------------------------------------------------------------

// Who made the mod (If not set, defaults to "DBM Mods")
author: "DBM, General Wrex, Lasse & NetLuis",

// The version of the mod (Defaults to 1.0.0)
version: "1.9.4", //Added in 1.9.4

// A short description to show on the mod line for this mod (Must be on a single line)
short_description: "Added If Message Delivery Fails option.",

// If it depends on any other mods by name, ex: WrexMODS if the mod uses something from WrexMods


//---------------------------------------------------------------------

//---------------------------------------------------------------------
// Action Storage Function
//
// Stores the relevant variable info for the editor.
//---------------------------------------------------------------------

variableStorage: function(data, varType) {
	const type = parseInt(data.storage3);
	if(type !== varType) return;
	return ([data.varName3, 'Message']);
},

//---------------------------------------------------------------------
// Action Fields
//
// These are the fields for the action. These fields are customized
// by creating elements with corresponding IDs in the HTML. These
// are also the names of the fields stored in the action's JSON data.
//---------------------------------------------------------------------

fields: ["storage", "varName", "channel", "varName2", "storage3", "varName3"],

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
<div><p>This action has been modified by DBM Mods.</p></div><br>
<div>
	<div style="float: left; width: 35%;">
		Source Embed Object:<br>
		<select id="storage" class="round" onchange="glob.refreshVariableList(this)">
			${data.variables[1]}
		</select>
	</div>
	<div id="varNameContainer" style="float: right; width: 60%;">
		Variable Name:<br>
		<input id="varName" class="round" type="text" list="variableList"><br>
	</div>
</div><br><br><br>
<div style="padding-top: 8px; float: left; width: 35%;">
	Send To:<br>
	<select id="channel" class="round" onchange="glob.sendTargetChange(this, 'varNameContainer2')">
		${data.sendTargets[isEvent ? 1 : 0]}
	</select>
</div>
<div id="varNameContainer2" style="display: none; float: right; width: 60%;">
	Variable Name:<br>
	<input id="varName2" class="round" type="text" list="variableList"><br>
</div><br><br><br><br>
<div style="float: left; width: 35%;">
Store Message Object In:<br>
	<select id="storage3" class="round" onchange="glob.variableChange(this, 'varNameContainer3')">
		${data.variables[0]}
	</select>
</div>	
<div id="varNameContainer3" style="display: ; float: right; width: 60%;">
	Storage Variable Name:<br>
	<input id="varName3" class="round" type="text">
	</div><br><br><br>
	<div style="padding-top: 8px;">
			<div style="float: left; width: 35%;">
				If Message Delivery Fails:<br>
				<select id="iffalse" class="round" onchange="glob.onChangeFalse(this)">
					<option value="0" selected>Continue Actions</option>
					<option value="1">Stop Action Sequence</option>
					<option value="2">Jump To Action</option>
					<option value="3">Skip Next Actions</option>
			 </select>
			</div>
			<div id="iffalseContainer" style="display: none; float: right; width: 60%;"><span id="iffalseName">Action Number</span>:<br><input id="iffalseVal" class="round" type="text"></div>`;
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

	glob.sendTargetChange(document.getElementById('channel'), 'varNameContainer2');
	glob.variableChange(document.getElementById('storage3'), 'varNameContainer3');
	glob.onChangeFalse(document.getElementById('iffalse'));
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
	const server = cache.server;
	const storage = parseInt(data.storage);
	const varName = this.evalMessage(data.varName, cache);
	const embed = this.getVariable(storage, varName, cache);
	if(!embed) {
		this.callNextAction(cache);
		return;
	}

	const msg = cache.msg;
	const channel = parseInt(data.channel);
	const varName2 = this.evalMessage(data.varName2, cache);
	const varName3 = this.evalMessage(data.varName3, cache);
	const storage3 = parseInt(data.storage3);
	const target = this.getSendTarget(channel, varName2, cache);
	
	if(target && target.send) {
		try {
			target.send({embed}).then(function(message) {                 
				if(message && varName3) this.storeValue(message, storage3, varName3, cache);
				this.callNextAction(cache);
			}.bind(this)).catch(err => {
				if(err.message == ('Cannot send messages to this user')) {
					this.executeResults(false, data, cache);
				} else {
				this.displayError.bind(this, data, cache)}
			});
		} catch (e) {
			this.displayError(data, cache, e)
		}
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
