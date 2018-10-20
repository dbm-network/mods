module.exports = {

//---------------------------------------------------------------------
// Action Name
//
// This is the name of the action displayed in the editor.
//---------------------------------------------------------------------

name: "Set Member Voice Channel Perms",

//---------------------------------------------------------------------
// Action Section
//
// This is the section the action will fall into.
//---------------------------------------------------------------------

section: "Channel Control",

//---------------------------------------------------------------------
// Action Subtitle
//
// This function generates the subtitle displayed next to the name.
//---------------------------------------------------------------------

subtitle: function(data) {
	const names = ['Command Author\'s Voice Ch.', 'Mentioned User\'s Voice Ch.', 'Default Voice Channel', 'Temp Variable', 'Server Variable', 'Global Variable'];
	const index = parseInt(data.vchannel);
	return index < 3 ? `${names[index]}` : `${names[index]} - ${data.varName}`;
},

//---------------------------------------------------------------------
	 // DBM Mods Manager Variables (Optional but nice to have!)
	 //
	 // These are variables that DBM Mods Manager uses to show information
	 // about the mods for people to see in the list.
	 //---------------------------------------------------------------------

	 // Who made the mod (If not set, defaults to "DBM Mods")
	 author: "MrGold",

	 // The version of the mod (Defaults to 1.0.0)
	 version: "1.9.1", //Added in 1.9.1

	 // A short description to show on the mod line for this mod (Must be on a single line)
	 short_description: "Sets the Permission of a Member in a Voice Channel",

	 // If it depends on any other mods by name, ex: WrexMODS if the mod uses something from WrexMods
     

	 //---------------------------------------------------------------------

//---------------------------------------------------------------------
// Action Fields
//
// These are the fields for the action. These fields are customized
// by creating elements with corresponding IDs in the HTML. These
// are also the names of the fields stored in the action's JSON data.
//---------------------------------------------------------------------

fields: ["vchannel", "varName", "member", "varName2", "permission", "state"],

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
	 Created by MrGold!
    </p>
</div><br>
<div>
	<div style="float: left; width: 35%;">
		Source Voice Channel:<br>
		<select id="vchannel" class="round" onchange="glob.voiceChannelChange(this, 'varNameContainer')">
			${data.voiceChannels[isEvent ? 1 : 0]}
		</select>
	</div>
	<div id="varNameContainer" style="display: none; float: right; width: 60%;">
		Variable Name:<br>
		<input id="varName" class="round" type="text" list="variableList"><br>
	</div>
</div><br><br><br>
<div style="padding-top: 8px;">
	<div style="float: left; width: 35%;">
		Source Member:<br>
		<select id="member" name="second-list" class="round" onchange="glob.memberChange(this, 'varNameContainer2')">
			${data.members[isEvent ? 1 : 0]}
		</select>
	</div>
	<div id="varNameContainer2" style="display: none; float: right; width: 60%;">
		Variable Name:<br>
		<input id="varName2" class="round" type="text" list="variableList2"><br>
	</div>
</div><br><br><br>
<div style="padding-top: 8px;">
	<div style="float: left; width: 45%;">
		Permission:<br>
		<select id="permission" class="round">
			${data.permissions[1]}
		</select>
	</div>
	<div style="padding-left: 5%; float: left; width: 55%;">
		Change To:<br>
		<select id="state" class="round">
			<option value="0" selected>Allow</option>
			<option value="1">Inherit</option>
			<option value="2">Disallow</option>
		</select>
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

	glob.voiceChannelChange(document.getElementById('vchannel'), 'varNameContainer');
	glob.memberChange(document.getElementById('member'), 'varNameContainer2');
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
	const storage = parseInt(data.vchannel);
	const varName = this.evalMessage(data.varName, cache);
	const channel = this.getChannel(storage, varName, cache);

	const storage2 = parseInt(data.member);
	const varName2 = this.evalMessage(data.varName2, cache);
	const member = this.getMember(storage2, varName2, cache);

	const options = {};
	options[data.permission] = data.state === "0" ? true : (data.state === "2" ? false : null);
	if(member && member.id) {
		if(Array.isArray(channel)) {
			this.callListFunc(channel, 'overwritePermissions', [member.id, options]).then(function() {
				this.callNextAction(cache);
			}.bind(this));
		} else if(channel && channel.overwritePermissions) {
			channel.overwritePermissions(member.id, options).then(function() {
				this.callNextAction(cache);
			}.bind(this)).catch(this.displayError.bind(this, data, cache));
		} else {
			this.callNextAction(cache);
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
