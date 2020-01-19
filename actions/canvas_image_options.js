module.exports = {

//---------------------------------------------------------------------
// Action Name
//
// This is the name of the action displayed in the editor.
//---------------------------------------------------------------------

name: "Canvas Image Options",

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

fields: ["storage", "varName", "mirror", "rotation", "width", "height"],

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
		Mirror:<br>
		<select id="mirror" class="round">
			<option value="0" selected>None</option>
			<option value="1">Horizontal Mirror</option>
			<option value="2">Vertical Mirror</option>
			<option value="3">Diagonal Mirror</option>
		</select><br>
	</div>
	<div style="float: right; width: 50%;">
		Rotation (degrees):<br>
		<input id="rotation" class="round" type="text" value="0"><br>
	</div>
</div><br><br><br>
<div style="padding-top: 8px;">
	<div style="float: left; width: 50%;">
		Scale Width (direct size or percent):<br>
		<input id="width" class="round" type="text" value="100%"><br>
	</div>
	<div style="float: right; width: 50%;">
		Scale Height (direct size or percent):<br>
		<input id="height" class="round" type="text" value="100%"><br>
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
	const minfo = parseInt(data.mirror);
	const degrees = parseInt(data.rotation);
	const radian = Math.PI / 180 * degrees;
	const scalex = this.evalMessage(data.width, cache);
	const scaley = this.evalMessage(data.height, cache);
	let imagew = image.width;
	let imageh = image.height;
	let scalew = 1;
	let scaleh = 1;
	let mirrorw = 1;
	let mirrorh = 1;
	rotate(radian);
	mirror(minfo);
	scale(scalex,scaley);
	scalew *= mirrorw;
	scaleh *= mirrorh;
	const canvas = Canvas.createCanvas(imagew,imageh);
	const ctx = canvas.getContext('2d');
	ctx.clearRect(0,0,imagew,imageh);
	ctx.save();
	ctx.translate(imagew / 2, imageh / 2);
	ctx.rotate(radian);
	ctx.scale(scalew, scaleh);
	ctx.drawImage(image, -image.width/2, -image.height/2);
	ctx.restore();
	const result = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
	this.storeValue(result, storage, varName, cache);
	this.callNextAction(cache);

	function rotate(r) {
		let imagex = imagew * Math.abs(Math.cos(r)) + imageh * Math.abs(Math.sin(r));
		let imagey = imageh * Math.abs(Math.cos(r)) + imagew * Math.abs(Math.sin(r));
		imagew = imagex;
		imageh = imagey;
	}
	function scale(w,h) {
		if(w.endsWith('%')) {
			let percent = w.replace('%', '');
			scalew = parseInt(percent) / 100;
		} else {
			scalew = parseInt(w) / imagew;
		}
		if(h.endsWith('%')) {
			let percent = h.replace('%', '');
			scaleh = parseInt(percent) / 100;
		} else {
			scaleh = parseInt(h) / imageh;
		}
		imagew *= scalew;
		imageh *= scaleh;
	}
	function mirror(m) {
		switch(m) {
			case 0:
				mirrorw = 1;
				mirrorh = 1;
				break
			case 1:
				mirrorw = -1;
				mirrorh = 1;
				break
			case 2:
				mirrorw = 1;
				mirrorh = -1;
				break
			case 3:
				mirrorw = -1;
				mirrorh = -1;
		}
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