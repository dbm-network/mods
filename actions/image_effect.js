module.exports = {

//---------------------------------------------------------------------
// Action Name
//
// This is the name of the action displayed in the editor.
//---------------------------------------------------------------------

name: "Apply Image Effect",

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
	const effect = ["Greyscale", "Invert", "Normalize", "Remove Transparency", "Apply Minor Blur", "Apply Major Blur", "Apply Sepia", "Dither"];
	return `${storeTypes[parseInt(data.storage)]} (${data.varName}) -> ${effect[parseInt(data.effect)]}`;
},

//---------------------------------------------------------------------
// Action Fields
//
// These are the fields for the action. These fields are customized
// by creating elements with corresponding IDs in the HTML. These
// are also the names of the fields stored in the action's JSON data.
//---------------------------------------------------------------------

fields: ["storage", "varName", "effect"],

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
		Base Image:<br>
		<select id="storage" class="round" onchange="glob.refreshVariableList(this)">
			${data.variables[1]}
		</select>
	</div>
	<div id="varNameContainer" style="float: right; width: 50%;">
		Variable Name:<br>
		<input id="varName" class="round" type="text" list="variableList"><br>
	</div>
</div><br><br><br>
<div style="padding-top: 8px;">
	<div style="float: left; width: 90%;">
		Effect:<br>
		<select id="effect" class="round">
			<option value="0" selected>Greyscale</option>
			<option value="1">Invert</option>
			<option value="2">Normalize</option>
			<option value="3">Remove Transparency</option>
			<option value="4">Apply Minor Blur</option>
			<option value="5">Apply Major Blur</option>
			<option value="6">Apply Sepia</option>
			<option value="7">Dither</option>
		</select><br>
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
	const data = cache.actions[cache.index];
	const storage = parseInt(data.storage);
	const msg = cache.msg;
	const varName = this.evalMessage(data.varName, cache);
	const image = this.getVariable(storage, varName, cache);

	if(!image) {
		this.callNextAction(cache);
		return;
	}
	const effect = parseInt(data.effect);
	module.exports = this.storeValue
	let image1;
	var _this = this;
	let image2;
	let result2;
	let store2 = this.getVariable(storage, varName, cache);
	var Jimp = require("jimp");
	var store = this.storeValue
    Jimp.read(image, function (err, image1) {
	switch(effect) {

 
		case 0:
			image1.greyscale()
						image1.getBuffer(Jimp.MIME_PNG, (error, image2) => {
			_this.storeValue(image2, storage, varName, cache)
			_this.callNextAction(cache);
			})
			break;
		case 1:
			image1.invert()
			
						image1.getBuffer(Jimp.MIME_PNG, (error, image2) => {
			_this.storeValue(image2, storage, varName, cache)
			_this.callNextAction(cache);
			})
			break;
		case 2:
			image1.normalize();
						image1.getBuffer(Jimp.MIME_PNG, (error, image2) => {
			_this.storeValue(image2, storage, varName, cache)
			_this.callNextAction(cache);
			})
			break;
		case 3:
			image1.opaque();
						image1.getBuffer(Jimp.MIME_PNG, (error, image2) => {
			_this.storeValue(image2, storage, varName, cache)
			_this.callNextAction(cache);
			})
			break;
		case 4:
			image1.blur(2);
						image1.getBuffer(Jimp.MIME_PNG, (error, image2) => {
			_this.storeValue(image2, storage, varName, cache)
			_this.callNextAction(cache);
			})
			break;
		case 5:
			image1.blur(10);
						image1.getBuffer(Jimp.MIME_PNG, (error, image2) => {
			_this.storeValue(image2, storage, varName, cache)
			_this.callNextAction(cache);
			})
			break;
		case 6:
			image1.sepia();
						image1.getBuffer(Jimp.MIME_PNG, (error, image2) => {
			_this.storeValue(image2, storage, varName, cache)
			_this.callNextAction(cache);
			})
			break;
		case 7:
			image1.dither565();
						image1.getBuffer(Jimp.MIME_PNG, (error, image2) => {
			_this.storeValue(image2, storage, varName, cache)
			_this.callNextAction(cache);
			})
			break;
	}
		
		
	})
	  
		

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