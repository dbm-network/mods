module.exports = {

//---------------------------------------------------------------------
// Action Name
//
// This is the name of the action displayed in the editor.
//---------------------------------------------------------------------

name: "Canvas Create Background",

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
	if (parseInt(data.info) == 0) {
		return !!data.color ? `Create with Color ${data.color}` : `No color background has create`;
	} else if (parseInt(data.info) == 1) {
		return !!data.gradient ? `Create with Gradient ${data.gradient}` : `No gradient background has create`;
	}
	
},

//https://github.com/LeonZ2019/
author: "LeonZ",
version: "1.1.0",

//---------------------------------------------------------------------
// Action Storage Function
//
// Stores the relevant variable info for the editor.
//---------------------------------------------------------------------

variableStorage: function(data, varType) {
	const type = parseInt(data.storage);
	if(type !== varType) return;
	return ([data.varName, 'Image']);
},

//---------------------------------------------------------------------
// Action Fields
//
// These are the fields for the action. These fields are customized
// by creating elements with corresponding IDs in the HTML. These
// are also the names of the fields stored in the action's JSON data.
//---------------------------------------------------------------------

fields: ["width", "height", "info", "gradient", "color", "storage", "varName"],

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
	<div style="float: left; width: 46%;">
		Width(px)	:<br>
		<input id="width" class="round" type="text"><br>
	</div>
	<div style="padding-left: 3px; float: left; width: 49%;">
		Height(px):<br>
		<input id="height" class="round" type="text"><br>
	</div>
</div><br><br><br>
<div>
	<div style="float: left; width: 92%;">
		Fill:
		<select id="info" class="round" onchange="glob.onChange0(this)">
			<option value="0" selected>Solid Color</option>
			<option value="1">Gradient Color</option>
		</select>
	<div>
<div><br>
	<div id="Gradient" style="display: none; float: left; width: 109%;">
		Gradient:<br>
		<textarea id="gradient" rows="5" placeholder="Insert var lingrad = ctx.createLinearGradient()... here" style="width: 92%; white-space: nowrap;"></textarea><br>
	</div>
	<div id="Solid" style="float: left; width: 111%;">
		Color:<br>
		<input id="color" class="round" type="text" placeholder="Insert Color Hex code here"><br>
	</div>
<div><br><br><br>
<div>
	<div style="float: left; width: 35%;">
		Store In:<br>
		<select id="storage" class="round">
			${data.variables[1]}
		</select>
	</div>
	<div style="float: right; width: 60%;">
		Variable Name:<br>
		<input id="varName" class="round" type="text"><br>
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
	
	const gradient = document.getElementById('Gradient');
	const solid = document.getElementById('Solid');
	
	glob.onChange0 = function(event) {
		switch(parseInt(event.value)) {
			case 0:
				gradient.style.display = "none";
				solid.style.display = null;
				break;
			case 1:
				gradient.style.display = null;
				solid.style.display = "none";
				break;
		}
	};
	glob.onChange0(document.getElementById('info'));
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
	const Canvas = require('canvas');
	const width = parseInt(this.evalMessage(data.width, cache));
	const height = parseInt(this.evalMessage(data.height, cache));
	const info = parseInt(data.info);
	const canvas = Canvas.createCanvas(width, height);
	const ctx = canvas.getContext('2d');
	switch(info) {
		case 0:
			let color = this.evalMessage(data.color, cache);
			if (!color.startsWith('#')) {
				color = color.slice(1);
			}
			ctx.fillStyle = color;
			ctx.rect(0, 0, width, height);
			ctx.fill();
			break;
		case 1:
			let gradient = String(this.evalMessage(data.gradient, cache));
			eval(gradient);
			break;
	}
	const result = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
	const varName = this.evalMessage(data.varName, cache);
	const storage = parseInt(data.storage);
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