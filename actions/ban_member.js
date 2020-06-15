module.exports = {

//---------------------------------------------------------------------
// Action Name
//
// This is the name of the action displayed in the editor.
//---------------------------------------------------------------------

name: "Ban Member",

//---------------------------------------------------------------------
// Action Section
//
// This is the section the action will fall into.
//---------------------------------------------------------------------

section: "Member Control",

//---------------------------------------------------------------------
// Action Subtitle
//
// This function generates the subtitle displayed next to the name.
//---------------------------------------------------------------------

subtitle: function(data) {
	const users = ['Mentioned User', 'Command Author', 'Temp Variable', 'Server Variable', 'Global Variable', 'By ID'];
	const guilds = ['Current Server', 'Temp Variable', 'Server Variable', 'Global Variable'];
	return `${users[parseInt(data.member)]} - ${guilds[parseInt(data.guild)]}`;
},

//---------------------------------------------------------------------
// Action Fields
//
// These are the fields for the action. These fields are customized
// by creating elements with corresponding IDs in the HTML. These
// are also the names of the fields stored in the action's JSON data.
//---------------------------------------------------------------------

fields: ["member", "varName", "reason", "guild", "varName2", "days"],

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
	This action has been modified by DBM Mods.<br>
<div>
	<div style="float: left; width: 35%;">
		Member:<br>
		<select id="member" class="round" onchange="glob.memberChange(this, 'varNameContainer')">
			${data.members[isEvent ? 1 : 0]}
			<option value="5">By ID</option>
		</select>
	</div>
	<div id="varNameContainer" style="display: none; float: right; width: 60%;">
		Variable Name:<br>
		<input id="varName" class="round" type="text" list="variableList"><br>
	</div><br><br><br>
	<div style="float: left; width: 35%;">
		Server:<br>
		<select id="guild" class="round" onchange="glob.serverChange(this, 'varNameContainer2')">
			${data.servers[isEvent ? 1 : 0]}
		</select>
	</div>
	<div id="varNameContainer2" style="display: none; float: right; width: 60%;">
		Variable Name:<br>
		<input id="varName2" class="round" type="text" list="variableList"><br>
	</div>
</div>
<br><br><br>
<div style="padding-top: 8px;">
	Reason:<br>
	<textarea id="reason" rows="5" placeholder="Insert reason here..." style="width: 99%; font-family: monospace; white-space: nowrap; resize: none;"></textarea><br>
</div>
<div style="padding-top: 8px;">
	Days of Messages to Delete:<br>
	<textarea id="days" rows="1" style="width: 99%; font-family: monospace; white-space: nowrap; resize: none;"></textarea>
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

	glob.memberChange(document.getElementById('member'), 'varNameContainer')
	glob.serverChange(document.getElementById('guild'), 'varNameContainer2')
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
	const type = parseInt(data.member);
	const varName = this.evalMessage(data.varName, cache);
	const varName2 = this.evalMessage(data.varName2, cache);
	const guildType = parseInt(data.guild);
	const server = this.getServer(guildType, varName2, cache);
	const reason = this.evalMessage(data.reason, cache);
	const days = parseInt(this.evalMessage(data.days, cache));
	const member = type == 5 ? this.evalMessage(varName) : this.getMember(type, varName, cache)
	if (guildType !== 0) {
		cache.server = server;
	}
	if (Array.isArray(member)) {
		this.callListFunc(member, 'ban', [this.evalMessage(data.reason, cache)]).then(function() {
			this.callNextAction(cache);
		}.bind(this));
	} else if (member) {
		server.ban(member, {days: days, reason: reason || ""}).then(function() {
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

mod: function(DBM) {}

}; // End of module
