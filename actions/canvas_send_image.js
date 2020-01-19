module.exports = {

//———————————————————————
// Action Name
//
// This is the name of the action displayed in the editor.
//———————————————————————

name: "Canvas Send Image",

//———————————————————————
// Action Section
//
// This is the section the action will fall into.
//———————————————————————

section: "Image Editing",

//———————————————————————
// Action Subtitle
//
// This function generates the subtitle displayed next to the name.
//———————————————————————

subtitle: function(data) {
	const channels = ['Same Channel', 'Command Author', 'Mentioned User', 'Mentioned Channel', 'Default Channel', 'Temp Variable', 'Server Variable', 'Global Variable'];
	return `${channels[parseInt(data.channel)]}`;
},

//https://github.com/LeonZ2019/
author: "LeonZ",
version: "1.1.0",

//———————————————————————
// Action Storage Function
//
// Stores the relevant variable info for the editor.
//———————————————————————

variableStorage: function(data, varType) {
	const type = parseInt(data.storage2);
	if(type !== varType) return;
	return ([data.varName3, 'Message']);
},

//———————————————————————
// Action Fields
//
// These are the fields for the action. These fields are customized
// by creating elements with corresponding IDs in the HTML. These
// are also the names of the fields stored in the action's JSON data.
//———————————————————————

fields: ["storage", "varName", "channel", "varName2", "message", "compress", "spoiler", "storage2", "varName3"],

//———————————————————————
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
//———————————————————————

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
		<input id="varName2" class="round" type="text" list="variableList"><br>
	</div>
</div><br><br><br>
<div style="padding-top: 8px;">
	Message:<br>
	<textarea id="message" rows="2" placeholder="Insert message here..." style="width: 94%"></textarea>
</div><br>
<div style="padding-top: 8px;">
	<div style="float: left; width: 44%;">
		Image Spoiler:<br>
		<select id="spoiler" class="round">
			<option value="0" selected>No</option>
			<option value="1">Yes</option>
		</select><br>
	</div>
	<div style="padding-left: 5%; float: left; width: 50%;">
		Compression Level:<br>
		<select id="compress" class="round">
			<option value="0">1</option>
			<option value="1">2</option>
			<option value="2">3</option>
			<option value="3">4</option>
			<option value="4">5</option>
			<option value="5">6</option>
			<option value="6">7</option>
			<option value="7">8</option>
			<option value="8">9</option>
			<option value="9" selected>10</option>
		</select><br>
	</div>
</div><br><br>
<div>
	<div style="float: left; width: 35%;">
		Store In:<br>
		<select id="storage2" class="round" onchange="glob.variableChange(this, 'varNameContainer3')">
			${data.variables[0]}
		</select>
	</div>
	<div id="varNameContainer3" style="display: none; float: right; width: 60%;">
		Variable Name:<br>
		<input id="varName3" class="round" type="text">
	</div>
</div>`
},

//———————————————————————
// Action Editor Init Code
//
// When the HTML is first applied to the action editor, this code
// is also run. This helps add modifications or setup reactionary
// functions for the DOM elements.
//———————————————————————

init: function() {
	const {glob, document} = this;

	glob.refreshVariableList(document.getElementById('storage'));
	glob.sendTargetChange(document.getElementById('channel'), 'varNameContainer2');
	glob.variableChange(document.getElementById('storage2'), 'varNameContainer3');
},

//———————————————————————
// Action Bot Function
//
// This is the function for the action within the Bot's Action class.
// Keep in mind event calls won't have access to the "msg" parameter, 
// so be sure to provide checks for variable existance.
//———————————————————————

action: function(cache) {
	const Discord = require('discord.js');
	const Canvas = require('canvas');
	const data = cache.actions[cache.index];
	const storage = parseInt(data.storage);
	const varName = this.evalMessage(data.varName, cache);
	const imagedata = this.getVariable(storage, varName, cache);
	if(!imagedata) {
		this.callNextAction(cache);
		return;
	}
	const channel = parseInt(data.channel);
	const varName2 = this.evalMessage(data.varName2, cache);
	const target = this.getSendTarget(channel, varName2, cache);	
	let compress = parseInt(data.compress);
	const image = new Canvas.Image();
	image.src = imagedata;
	const canvas = Canvas.createCanvas(image.width,image.height);
	const ctx = canvas.getContext('2d');
	ctx.drawImage(image, 0, 0, image.width, image.height)
	var fs = require("fs");
	let name;
	const spoiler = parseInt(data.spoiler);
	switch(spoiler) {
		case 0:
			name = 'image.png';
			break;
		case 1:
			name = 'SPOILER_image.png';
	}
	const buffer = canvas.toBuffer('image/png',{compressionLevel:compress});
	const attachment = new Discord.Attachment(buffer, name);
	const _this = this;
	if(target && target.send) {
		target.send(this.evalMessage(data.message, cache), attachment).then(function(msgobject) {
			const varName3 = _this.evalMessage(data.varName3, cache);
			const storage2 = parseInt(data.storage2);
			_this.storeValue(msgobject, storage2, varName3, cache);
			_this.callNextAction(cache);
		})
	} else {
		this.callNextAction(cache);
	}
},

//———————————————————————
// Action Bot Mod
//
// Upon initialization of the bot, this code is run. Using the bot's
// DBM namespace, one can add/modify existing functions if necessary.
// In order to reduce conflictions between mods, be sure to alias
// functions you wish to overwrite.
//———————————————————————

mod: function(DBM) {
}

}; // End of module