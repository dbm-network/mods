module.exports = {

//---------------------------------------------------------------------
// Action Name
//
// This is the name of the action displayed in the editor.
//---------------------------------------------------------------------

name: "Create Server",

//---------------------------------------------------------------------
// Action Section
//
// This is the section the action will fall into.
//---------------------------------------------------------------------

section: "Server Control",

//---------------------------------------------------------------------
// Action Subtitle
//
// This function generates the subtitle displayed next to the name.
//---------------------------------------------------------------------

subtitle: function(data) {
	return `${data.serverName}`;
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
	 version: "1.9.2", //Added in 1.9.2

	 // A short description to show on the mod line for this mod (Must be on a single line)
	 short_description: "Creates a Server",

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
	return ([data.varName, 'Server']);
},

//---------------------------------------------------------------------
// Action Fields
//
// These are the fields for the action. These fields are customized
// by creating elements with corresponding IDs in the HTML. These
// are also the names of the fields stored in the action's JSON data.
//---------------------------------------------------------------------

fields: ["serverName", "serverRegion", "storage", "varName"],

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
	    Created by MrGold
    </p>
</div><br>
<div style="padding-top: 8px;"> 
    <div style="float: left; width: 560px;">
        Server Name:<br>
	    <input id="serverName" class="round" type="text">
</div><br><br><br>
<div style="padding-top: 8px;"> 
    <div style="float: left; width: 35%;">
	    Server Region:<br>
	    <select id="serverRegion" class="round">
		<option value="brazil">Brazil</option>
		<option value="eu-central">Central Europe</option>
		<option value="hongkong">Hong Kong</option>
		<option value="japan">Japan</option>
		<option value="russia">Russia</option>
		<option value="singapore">Singapora</option>
		<option value="southafrica">South Africa</option>
		<option value="sydney">Sydney</option>
		<option value="us-central">US Central</option>
		<option value="us-east">US East</option>
		<option value="us-south">US South</option>
		<option value="us-west">EU West</option>
		<option value="eu-west">Western Europe</option>
	    </select>
	</div>
</div><br><br><br>
<div style="padding-top: 8px;"> 
	<div style="float: left; width: 35%;">
		Store In:<br>
		<select id="storage" class="round" onchange="glob.variableChange(this, 'varNameContainer')">
			${data.variables[0]}
		</select>
	</div>
	<div id="varNameContainer" style="display: none; float: right; width: 60%;">
		Variable Name:<br>
		<input id="varName" class="round" type="text"><br>
	</div>
</div><br><br><br><br>
<div style="float: left; width: 88%; padding-top: 20px;">
	<p>
	<b>NOTE:</b> <span style="color:red">This is only available to bots in less than 10 servers!
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
	const serverName = this.evalMessage(data.serverName, cache);
	const botClient = this.getDBM().Bot.bot.user;

	if(!serverName) {
		this.callNextAction(cache);
		return;
	}

	const serverRegion = data.serverRegion

	botClient.createGuild(serverName, serverRegion).then(function(server) {
    const storage = parseInt(data.storage);
	const varName = this.evalMessage(data.varName, cache);
	this.storeValue(server, storage, varName, cache);
	this.callNextAction(cache);
	}.bind(this)).catch(this.displayError.bind(this, data, cache));
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