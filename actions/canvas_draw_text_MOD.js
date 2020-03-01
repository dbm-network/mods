module.exports = {

//---------------------------------------------------------------------
// Action Name
//
// This is the name of the action displayed in the editor.
//---------------------------------------------------------------------

name: "Canvas Draw Text on Image",

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
	return `${data.text}`;
},

//https://github.com/LeonZ2019/
author: "LeonZ",
version: "1.1.0",

//---------------------------------------------------------------------
// Action Fields
//
// These are the fields for the action. These fields are customized
// by creating elements with corresponding IDs in the HTML. These
// are also the names of the fields stored in the action's JSON data.
//---------------------------------------------------------------------

fields: ["storage", "varName", "x", "y", "fontPath", "fontColor", "fontSize", "align", "text"],

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
<div style="float: left; width: 50%;">
	Source Image:<br>
	<select id="storage" class="round" style="width: 90%" onchange="glob.refreshVariableList(this)">
		${data.variables[1]}
	</select><br>
	Local Font URL:<br>
	<input id="fontPath" class="round" type="text" value="fonts/"><br>
	Alignment:<br>
	<select id="align" class="round" style="width: 90%;">
		<option value="0" selected>Top Left</option>
		<option value="1">Top Center</option>
		<option value="2">Top Right</option>
		<option value="3">Middle Left</option>
		<option value="4">Middle Center</option>
		<option value="5">Middle Right</option>
		<option value="6">Bottom Left</option>
		<option value="7">Bottom Center</option>
		<option value="8">Bottom Right</option>
	</select><br>
	X Position:<br>
	<input id="x" class="round" type="text" value="0"><br>
</div>
<div style="float: right; width: 50%;">
	Variable Name:<br>
	<input id="varName" class="round" type="text" list="variableList"><br>
	Font Color (Hex):<br>
	<input id="fontColor" class="round" type="text" value="FFFFFF"><br>
	Font Size:<br>
	<input id="fontSize" class="round" type="text" placeholder="Default size 10px"><br>
	Y Position:<br>
	<input id="y" class="round" type="text" value="0"><br>
</div><br><br><br><br>
<div>
	Text:<br>
	<textarea id="text" rows="2" placeholder="Insert text here..." style="width: 95%; white-space: nowrap; resize: none;"></textarea>
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

	glob.refreshVariableList(document.getElementById('storage'));
},

//---------------------------------------------------------------------
// Action Bot Function
//
// This is the function for the action within the Bot's Action class.
// Keep in mind event calls won't have access to the "msg" parameter, 
// so be sure to provide checks for variable existance.
//---------------------------------------------------------------------

action: function(cache) {
	const Canvas = require('canvas');
	const opentype = require('opentype.js');
	const data = cache.actions[cache.index];
	const storage = parseInt(data.storage);
	const varName = this.evalMessage(data.varName, cache);
	const imagedata = this.getVariable(storage, varName, cache);
	if(!imagedata) {
		this.callNextAction(cache);
		return;
	}
	const fontPath = this.evalMessage(data.fontPath, cache);
	let fontColor = this.evalMessage(data.fontColor, cache);
	if (fontColor.startsWith("#") == false) {
		fontColor = "#"+fontColor;
	}
	let fontSize = parseInt(this.evalMessage(data.fontSize, cache));
	if (isNaN(fontSize)) {
		fontSize = 10;
	}
	const align = parseInt(data.align);
	let x = parseFloat(this.evalMessage(data.x, cache));
	let y = parseFloat(this.evalMessage(data.y, cache));
	const text = this.evalMessage(data.text, cache);
	const image = new Canvas.Image();
	image.src = imagedata;
	const canvas = Canvas.createCanvas(image.width,image.height);
	const ctx = canvas.getContext('2d');
	ctx.drawImage(image, 0, 0, image.width, image.height);
	const font = opentype.loadSync(fontPath);
	let textpath = font.getPath(text, 0, 0, fontSize);
	var bounder = textpath.getBoundingBox();
	let width = bounder.x2 - bounder.x1;
	let height = bounder.y2 - bounder.y1;
	switch(align) {
		case 1:
			x -= width / 2;
			break;
		case 2:
			x -= width;
			break;
		case 3:
			y -= height / 2;
			break;
		case 4:
			x -= width / 2;
			y -= height / 2;
			break;
		case 5:
			x -= width;
			y -= height / 2;
			break;
		case 6:
			y -= height;
			break;
		case 7:
			x -= width / 2;
			y -= height;
			break;
		case 8:
			x -= width;
			y -= height;
	}
	x -= bounder.x1;
	y -= bounder.y1;
	const Path = font.getPath(text, x, y, fontSize);
	Path.fill = fontColor;
	Path.draw(ctx);
	const result = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
	this.storeValue(result, storage, varName, cache);
	this.callNextAction(cache);
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