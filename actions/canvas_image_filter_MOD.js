module.exports = {

//---------------------------------------------------------------------
// Action Name
//
// This is the name of the action displayed in the editor.
//---------------------------------------------------------------------

name: "Canvas Image Filter",

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
	const filter = ["Blur", "Hue Rotate", "Brightness", "Contrast", "Grayscale", "Invert" ,"Opacity", "Saturate", "Sepia"];
	return `${storeTypes[parseInt(data.storage)]} (${data.varName}) -> ${filter[parseInt(data.info)]} (${data.value})`;
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

fields: ["storage", "varName", "info", "value"],

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
		Filter:<br>
		<select id="info" class="round" onchange="glob.onChange1(this)">
			<option value="0" selected>Blur</option>
			<option value="1">Hue Rotate</option>
			<option value="2">Brightness</option>
			<option value="3">Contrast</option>
			<option value="4">Grayscale</option>
			<option value="5">Invert</option>
			<option value="6">Opacity</option>
			<option value="7">Saturate</option>
			<option value="8">Sepia</option>
		</select><br>
	</div>
	<div style="float: right; width: 50%;">
		<span id="valuetext">Value:</span><br>
		<input id="value" class="round" type="text" placeholder="0 = None filter"><br>
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

	glob.onChange1 = function(event) {
		const value = parseInt(event.value);
		const valuetext = document.getElementById("valuetext");
		if (value === 1) {
			valuetext.innerHTML = "Value (Degree):";
		} else {
			valuetext.innerHTML = "Value (Percent):";
		}
	};

	glob.onChange1(document.getElementById('info'));
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
	const Filter = require('imagedata-filters');
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
	const info = parseInt(data.info);
	let value = this.evalMessage(data.value, cache);
	const canvas = Canvas.createCanvas(image.width, image.height);
	const ctx = canvas.getContext('2d');
	ctx.drawImage(image, 0 ,0);
	const imgdata = ctx.getImageData(0,0,image.width,image.height);
	let imagedata2;
	switch(info) {
		case 0:
			value = (Number(value) / 100).toString();
			imagedata2 = Filter.blur(imgdata,{amount:value});
			break;
		case 1:
			value = (Number(value) / 180 * Math.PI).toString();
			imagedata2 = Filter.hueRotate(imgdata,{amount:value});
			break;
		case 2:
			value = ((100 - Number(value)) / 100).toString();
			imagedata2 = Filter.brightness(imgdata,{amount:value});
			break;
		case 3:
			value = ((100 - Number(value)) / 100).toString();
			imagedata2 = Filter.contrast(imgdata,{amount:value});
			break;
		case 4:
			value = (Number(value) / 100).toString();
			imagedata2 = Filter.grayscale(imgdata,{amount:value});
			break;
		case 5:
			value = (Number(value) / 100).toString();
			imagedata2 = Filter.invert(imgdata,{amount:value});
			break;
		case 6:
			value = ((100 - Number(value)) / 100).toString();
			imagedata2 = Filter.opacity(imgdata,{amount:value});
			break;
		case 7:
			value = ((100 - Number(value)) / 100).toString();
			imagedata2 = Filter.saturate(imgdata,{amount:value});
			break;
		case 8:
			value = (Number(value) / 100).toString();
			imagedata2 = Filter.sepia(imgdata,{amount:value});
	}
	ctx.putImageData(imagedata2, 0, 0)
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