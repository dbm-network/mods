module.exports = {

//---------------------------------------------------------------------
// Action Name
//
// This is the name of the action displayed in the editor.
//---------------------------------------------------------------------

name: "Save Image",

//---------------------------------------------------------------------
// Action Section
//
// This is the section the action will fall into.
//---------------------------------------------------------------------

	section: "Image Editing",

	// Who made the mod (If not set, defaults to "DBM Mods")
	author: "Aamon", //Original Idea by EliteArtz, hei eliteartz

	// The version of the mod (Defaults to 1.0.0)
	version: "1.0.0", //Not added yet

	// A short description to show on the mod line for this mod (Must be on a single line)
	short_description: "Allows a user to save image out of URLs",

  //---------------------------------------------------------------------
    // If it depends on any other mods by name, ex: WrexMODS if the mod uses something from WrexMods
  //---------------------------------------------------------------------


//---------------------------------------------------------------------
// Action Subtitle
//
// This function generates the subtitle displayed next to the name.
//---------------------------------------------------------------------

subtitle: function(data) {
	return `${data.url}`;
},

//---------------------------------------------------------------------
// Action Storage Function
//
// Stores the relevant variable info for the editor.
//---------------------------------------------------------------------

variableStorage: function(data, varType) {
	const type = parseInt(data.storage);
	if(type !== varType) return;
	return ([data.varName, 'url']);
},

//---------------------------------------------------------------------
// Action Fields
//
// These are the fields for the action. These fields are customized
// by creating elements with corresponding IDs in the HTML. These
// are also the names of the fields stored in the action's JSON data.
//---------------------------------------------------------------------

fields: ["url", "filename", "filepath",],

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
<div style="float: left; width: 95%; padding-top: 8px;">
		<p><u>Mod Info:</u><br>
		Created by <b>Aamon</b>! <br><br></p>
</div>
<div style= "padding-top: 8px;">
<br>
	Source Web URL:<br>
	<input id="url" class="round" type="text" placeholder = "Use URLs or Variables...">
</div>
<div style="float: left; padding-top: 8px; width:90%">

          File Name:<br>
          <input id="filename" placeholder="Empty for DEFAULT. Use With extension...eg: name.png" class="round" style="width: 100%;"></input>
</div><br>
 <div style="float: left; padding-top:8px; width:90%">
          File Path:<br>
          <input id="filepath" placeholder="Example Path = ./resources" class="round" style="width: 100%;"></input><br>
</div>
<div style=" float: left; width: 88%; padding-top: 8px;">
		<br>
		<p>
			For aditional information contact <b>Aamon#9130</b> on Discord or <a href ="https://twitter.com/44m0n"><b>@44m0n<b></a> on Twitter.
		</p>
</div>`;
},

//---------------------------------------------------------------------
// Action Editor Init Code
//
// When the HTML is first applied to the action editor, this code
// is also run. This helps add modifications or setup reactionary
// functions for the DOM elements.
//---------------------------------------------------------------------

init: function() {
},

//---------------------------------------------------------------------
// Action Bot Function
//
// This is the function for the action within the Bot's Action class.
// Keep in mind event calls won't have access to the "msg" parameter, 
// so be sure to provide checks for variable existance.
//---------------------------------------------------------------------

	action: function (cache) {
		const data = cache.actions[cache.index];
		const path = require('path');
		const WrexMODS = this.getWrexMods();
		const download = WrexMODS.require('image-downloader');
		

		var url = this.evalMessage(data.url, cache);
		var dirName = path.normalize(this.evalMessage(data.filepath, cache));
		var fileName = path.normalize(this.evalMessage(data.filename, cache));
		var fpath = path.join(dirName, fileName );

		options = {
			url: url,
			dest: fpath
		}

		download.image(options)
			.then(({ filename, image }) => {
				console.log('File saved to', filename)
			})
			.catch((err) => {
				console.error(err)
			})

		this.callNextAction(cache);

		//i'm hungry right now
		
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