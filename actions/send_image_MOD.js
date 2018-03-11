module.exports = {

//---------------------------------------------------------------------
// Action Name
//
// This is the name of the action displayed in the editor.
//---------------------------------------------------------------------

name: "Send Image MOD",

//---------------------------------------------------------------------
// Action Section
//
// This is the section the action will fall into.
//---------------------------------------------------------------------

section: "Image Editing",

//---------------------------------------------------------------------
// Action Subtitle
//
// This function generates the subtitle displayed next to the name.
//---------------------------------------------------------------------

subtitle: function(data) {
	const channels = ['Same Channel', 'Command Author', 'Mentioned User', 'Mentioned Channel', 'Default Channel', 'Temp Variable', 'Server Variable', 'Global Variable'];
	return `${channels[parseInt(data.channel)]}`;
},

//---------------------------------------------------------------------
	// DBM Mods Manager Variables (Optional but nice to have!)
	//
	// These are variables that DBM Mods Manager uses to show information
	// about the mods for people to see in the list.
	//---------------------------------------------------------------------
		
	// Who made the mod (If not set, defaults to "DBM Mods")
	author: "EGGSY",
		
	// The version of the mod (Defaults to 1.0.0)
	version: "1.8.6",
		
	// A short description to show on the mod line for this mod (Must be on a single line)
	short_description: "You can rename DBM image names and image formats!",
	
// If it depends on any other mods by name, ex: WrexMODS if the mod uses something from WrexMods
	
	
//---------------------------------------------------------------------

//---------------------------------------------------------------------
// Action Fields
//
// These are the fields for the action. These fields are customized
// by creating elements with corresponding IDs in the HTML. These
// are also the names of the fields stored in the action's JSON data.
//---------------------------------------------------------------------

fields: ["storage", "varName", "channel", "varName2", "message", "imageName", "imageFormat"],

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
		Source Image:<br>
		<select id="storage" class="round" onchange="glob.refreshVariableList(this)">
			${data.variables[1]}
		</select>
	</div>
	<div id="varNameContainer" style="float: right; width: 60%;">
		Variable Name:<br>
		<input id="varName" class="round" type="text" list="variableList"><br>
	</div>
</div><br><br><br>
<div style="padding-top: 8px;">
	<div style="float: left; width: 35%;">
		Send To:<br>
		<select id="channel" class="round" onchange="glob.sendTargetChange(this, 'varNameContainer2')">
			${data.sendTargets[isEvent ? 1 : 0]}
		</select>
	</div>
	<div id="varNameContainer2" style="display: none; float: right; width: 60%;">
		Variable Name:<br>
		<input id="varName2" class="round" type="text"><br>
	</div>
</div><br><br><br>
<div style="padding-top: 8px;">
	Message: <div style="float:right"><u>Mod Info:</u> Created by EGGSY</div><br>
	<textarea id="message" rows="6" placeholder="Insert message here..." style="width: 99%; font-family: monospace; white-space: nowrap; resize: none;"></textarea>
</div><br>
	<div id="imageFormatField" style="float: left; width: 35%;">
		Image Format:<br>
		<select id="imageFormat" class="round">
			<option value=".jpg">JPG</option>
			<option value=".png">PNG</option>
		</select>
	</div>
	<div id="imageNameField" style="float: right; width: 60%;">
		Image Name:<br>
		<input id="imageName" class="round" type="text"><br>
	</div>
	`
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

	glob.refreshVariableList(document.getElementById('storage'));
	glob.sendTargetChange(document.getElementById('channel'), 'varNameContainer2');
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
	const image = this.getVariable(storage, varName, cache);
	if(!image) {
		this.callNextAction(cache);
		return;
	}
	const channel = parseInt(data.channel);
	const varName2 = this.evalMessage(data.varName2, cache);
	const target = this.getSendTarget(channel, varName2, cache);
	const fileName = this.evalMessage(data.imageName, cache);
	if(Array.isArray(target)) {
		const Images = this.getDBM().Images;
		Images.createBuffer(image).then(function(buffer) {
			this.callListFunc(target, 'send', [this.evalMessage(data.message, cache), {
				files: [
					{
						attachment: buffer,
						name: `${fileName}${data.imageFormat}`
					}
				]
			}]).then(function() {
				this.callNextAction(cache);
			}.bind(this));
		}.bind(this)).catch(this.displayError.bind(this, data, cache));
	} else if(target && target.send) {
		const Images = this.getDBM().Images;
		Images.createBuffer(image).then(function(buffer) {
			target.send(this.evalMessage(data.message, cache), {
				files: [
					{
						attachment: buffer,
						name: `${fileName}${data.imageFormat}`
					}
				]
			}).then(function() {
				this.callNextAction(cache);
			}.bind(this)).catch(this.displayError.bind(this, data, cache));
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