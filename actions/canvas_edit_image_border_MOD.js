module.exports = {

//---------------------------------------------------------------------
// Action Name
//
// This is the name of the action displayed in the editor.
//---------------------------------------------------------------------

name: "Canvas Edit Image Border",

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
	const storeTypes = ["", "Temp Variable", "Server Variable", "Global Variable"];
	return `${storeTypes[parseInt(data.storage)]} (${data.varName})`;
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

fields: ["storage", "varName", "circleinfo", "radius"],

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
	<div style="float: left; width: 45%;">
		Source Image:<br>
		<select id="storage" class="round" onchange="glob.refreshVariableList(this)">
			${data.variables[1]}
		</select><br>
	</div>
	<div id="varNameContainer" style="float: right; width: 50%;">
		Variable Name:<br>
		<input id="varName" class="round" type="text" list="variableList"><br>
	</div>
</div><br><br><br>
<div style="padding-top: 8px;">
	<div style="float: left; width: 45%;">
		Circle:<br>
		<select id="circleinfo" class="round">
			<option value="0" selected>No</option>
			<option value="1">Yes</option>
		</select><br>
	</div>
	<div style="float: right; width: 50%;">
		Round Corner Radius:<br>
		<input id="radius" class="round" type="text" value="0"><br>
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
	const data = cache.actions[cache.index];
	const storage = parseInt(data.storage);
	const varName = this.evalMessage(data.varName, cache);
	const imagedata = this.getVariable(storage, varName, cache);
	if(!imagedata) {
		this.callNextAction(cache);
		return;
	}
	const image = new Canvas.Image();
	image.src = imagedata;
	const circleinfo = parseInt(data.circleinfo);
	const radius = parseInt(data.radius);
	let imagew = image.width;
	let imageh = image.height;
	const canvas = Canvas.createCanvas(imagew,imageh);
	const ctx = canvas.getContext('2d');
	if (radius > 0) {
		corner(radius);
	}
	if (circleinfo == 1 && imagew == imageh) {
		circle();
	}
	ctx.drawImage(image, 0, 0);
	const result = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
	this.storeValue(result, storage, varName, cache);
	this.callNextAction(cache);

	function circle() {
		ctx.beginPath();
		ctx.arc(imagew/2, imageh/2, (imagew+imageh)/4 ,0, Math.PI * 2);
		ctx.closePath();
		ctx.clip();
	}
	function corner(r) {
		ctx.beginPath();
		ctx.moveTo(r,0);
		ctx.lineTo(imagew-r,0);
		ctx.quadraticCurveTo(imagew,0,imagew,r);
		ctx.lineTo(imagew,imageh-r);
		ctx.quadraticCurveTo(imagew,imageh,imagew-r,imageh);
		ctx.lineTo(r,imageh);
		ctx.quadraticCurveTo(0,imageh,0,imageh-r);
		ctx.lineTo(0,r);
		ctx.quadraticCurveTo(0,0,r,0);
		ctx.closePath();
		ctx.clip();
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