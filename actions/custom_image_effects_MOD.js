module.exports = {

//---------------------------------------------------------------------
// Action Name
//
// This is the name of the action displayed in the editor.
//---------------------------------------------------------------------

name: "Custom Image Effects",

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
	const effect = ["Custom Blur", "Custom Pixelate"];
	return `${storeTypes[parseInt(data.storage)]} (${data.varName}) -> ${effect[parseInt(data.effect)]} ${data.intensity}`;
},

//---------------------------------------------------------------------
	 // DBM Mods Manager Variables (Optional but nice to have!)
	 //
	 // These are variables that DBM Mods Manager uses to show information
	 // about the mods for people to see in the list.
	 //---------------------------------------------------------------------

	 // Who made the mod (If not set, defaults to "DBM Mods")
	 author: "Lasse",

	 // The version of the mod (Defaults to 1.0.0)
	 version: "1.9.2", //Added in 1.8.2

	 // A short description to show on the mod line for this mod (Must be on a single line)
	 short_description: "Adds image effects with a custom Intensity",

	 // If it depends on any other mods by name, ex: WrexMODS if the mod uses something from WrexMods


	 //---------------------------------------------------------------------

//---------------------------------------------------------------------
// Action Fields
//
// These are the fields for the action. These fields are customized
// by creating elements with corresponding IDs in the HTML. These
// are also the names of the fields stored in the action's JSON data.
//---------------------------------------------------------------------

fields: ["storage", "varName", "effect", "intensity"],

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
			Created by Lasse!
		</p>
	</div><br>
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
			<option value="0" selected>Custom Blur</option>
			<option value="1">Custom Pixelate</option>
		</select><br>
	</div>
	<div id="intensityContainer" style="float: left; width: 50%;">
		Intensity:<br>
		<input id="intensity" class="round" type="text"><br>
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
	var _this = this;
	const data = cache.actions[cache.index];
	
	var storage = parseInt(data.storage);
	var varName = this.evalMessage(data.varName, cache);
	const image = this.getVariable(storage, varName, cache);
	const intensity= parseInt(data.intensity);
	
	var Jimp = require("jimp");
	
	
	if(!image) {
		this.callNextAction(cache);
		return;
	}
	Jimp.read(image, function (err, image1) {
	const effect = parseInt(data.effect);
	switch(effect) {
		case 0:
			image1.blur(intensity);
			
			image1.getBuffer(Jimp.MIME_PNG, (error, image2) => {
			_this.storeValue(image2, storage, varName, cache)
			_this.callNextAction(cache);
			})
			
			break;
		case 1:
			image1.pixelate(intensity);
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
