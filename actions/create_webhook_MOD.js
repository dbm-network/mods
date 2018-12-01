module.exports = {
 //---------------------------------------------------------------------
// Action Name
//
// This is the name of the action displayed in the editor.
//---------------------------------------------------------------------
 name: "Create Webhook",
 //---------------------------------------------------------------------
// Action Section
//
// This is the section the action will fall into.
//---------------------------------------------------------------------
 section: "Webhook Control",
 //---------------------------------------------------------------------
// Action Subtitle
//
// This function generates the subtitle displayed next to the name.
//---------------------------------------------------------------------
 subtitle: function(data) {
	return `${data.webhookName}`;
},
 //---------------------------------------------------------------------
	 // DBM Mods Manager Variables (Optional but nice to have!)
	 //
	 // These are variables that DBM Mods Manager uses to show information
	 // about the mods for people to see in the list.
	 //---------------------------------------------------------------------
 	 // Who made the mod (If not set, defaults to "DBM Mods")
	 author: "Lasse & MrGold",
 	 // The version of the mod (Defaults to 1.0.0)
	 version: "1.9.3", //Added in 1.9.2
 	 // A short description to show on the mod line for this mod (Must be on a single line)
	 short_description: "Creates a Webhook",
 	 // If it depends on any other mods by name, ex: WrexMODS if the mod uses something from WrexMods
 	 //---------------------------------------------------------------------
 //---------------------------------------------------------------------
// Action Storage Function
//
// Stores the relevant variable info for the editor.
//---------------------------------------------------------------------
 variableStorage: function(data, varType) {
	const type = parseInt(data.storage2);
	if(type !== varType) return;
	return ([data.varName2, 'Webhook']);
},
 //---------------------------------------------------------------------
// Action Fields
//
// These are the fields for the action. These fields are customized
// by creating elements with corresponding IDs in the HTML. These
// are also the names of the fields stored in the action's JSON data.
//---------------------------------------------------------------------
 fields: ["webhookName", "webhookIcon", "storage", "varName", "storage2", "varName2"],
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
			Created by Lasse & MrGold
		</p>
	</div><br>
<div style="width: 90%;">
	Webhook Name:<br>
	<input id="webhookName" class="round" type="text">
</div><br>
<div style="width: 90%;">
	Webhook Icon URL:<br>
	<input id="webhookIcon" class="round" type="text">
</div><br>
<div>
	<div style="float: left; width: 35%;">
		Source Channel:<br>
		<select id="storage" class="round" onchange="glob.channelChange(this, 'varNameContainer')">
			${data.channels[1]}
		</select>
	</div>
	<div id="varNameContainer" style="display: none; float: right; width: 60%;">
		Variable Name:<br>
		<input id="varName" class="round" type="text" list="variableList"><br>
	</div>
</div><br><br><br>
<div style="padding-top: 8px;">
	<div style="float: left; width: 35%;">
		Store In:<br>
		<select id="storage2" class="round" onchange="glob.variableChange(this, 'varNameContainer2')">
			${data.variables[0]}
		</select>
	</div>
	<div id="varNameContainer2" style="display: none; float: right; width: 60%;">
		Variable Name:<br>
		<input id="varName2" class="round" type="text">
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
 	glob.channelChange(document.getElementById('storage'), 'varNameContainer');
	glob.variableChange(document.getElementById('storage2'), 'varNameContainer2');
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
	if(channel && channel.createWebhook) {
		const avatar = this.evalMessage(data.webhookIcon, cache);
		const name = this.evalMessage(data.webhookName, cache);
		channel.createWebhook(name, avatar).then(function(webhook) {
		    const storage2 = parseInt(data.storage2);
			const varName2 = this.evalMessage(data.varName2, cache);
			this.storeValue(webhook, storage2, varName2, cache);
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