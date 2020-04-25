module.exports = {

//---------------------------------------------------------------------
// Action Name
//
// This is the name of the action displayed in the editor.
//---------------------------------------------------------------------

name: "Set slowmode MOD",

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
	const names = ['Same Channel', 'Mentioned Channel', 'Default Channel', 'Temp Variable', 'Server Variable', 'Global Variable'];
	const index = parseInt(data.storage);
	return index < 3 ? `Set slowmode : ${names[index]}` : `Set slowmode : ${names[index]} - ${data.varName}`;
},

author: "JasperEdits",
version: "1.1.0",

//---------------------------------------------------------------------
// Action Storage Function
//
// Stores the relevant variable info for the editor.
//---------------------------------------------------------------------

variableStorage: function(data, varType) {
	const type = parseInt(data.storage2);
	if(type !== varType) return;
	return ([data.varName2, 'Channel']);
},

//---------------------------------------------------------------------
// Action Fields
//
// These are the fields for the action. These fields are customized
// by creating elements with corresponding IDs in the HTML. These
// are also the names of the fields stored in the action's JSON data.
//---------------------------------------------------------------------

fields: ["storage", "varName", "varName2", "amount", "reason"],

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
	<p style="font-size:15px">
		This action has been created by JasperEdits.
	</p>
</div>
<div style="padding-top: 8px;">
	<div style="float: left; width: 35%;" padding-top: 16px;">
		Source Channel:<br>
		<select id="storage" class="round" onchange="glob.channelChange(this, 'varNameContainer')">
			${data.channels[isEvent ? 1 : 0]}
		</select>
	</div>
	<div id="varNameContainer" style="display: none; padding-left: 5%; float: left; width: 65%;">
		Variable Name:<br>
		<input id="varName" class="round" type="text" list="variableList"><br>
	</div>
</div><br><br><br>
<div style="padding-top: 8px;">
	<div style="float: left; width: 50%;" padding-top: 16px;">
		Amount:<br>
		<input id="amount" class="round" type="text" steps="5" placeholder="In seconds..."><br>
		Reason:<br>
		<input id="reason" class="round" type="text" placeholder="Optional"><br>
	</div>
</div>
	<div id="varNameContainer2" style="display: none; padding-left: 5%; float: left; width: 65%;">
		Variable Name:<br>
		<input id="varName2" class="round" type="text">
	</div>`
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
        const channel = this.getChannel(storage, varName, cache);
        const name = channel.name;
        const amount = this.evalMessage(data.amount, cache);
        const reason = this.evalMessage(data.reason, cache);
        const type = channel.type;
        if (type == "text") {
            if (/5|10|15|30|60|120|300|600|900|1800|3600|21600/g.test(amount)) {
                if (reason !== null) {
                    channel.setRateLimitPerUser(amount, reason);
                } else {
                    channel.setRateLimitPerUser(amount);
                }
            } else {
                console.log("The amount is not valid.");
            }
        } else {
                this.callNextAction(cache);
                console.log("This channel isn't a channel.");
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