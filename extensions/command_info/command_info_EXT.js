module.exports = {

//---------------------------------------------------------------------
// Editor Extension Name
//
// This is the name of the editor extension displayed in the editor.
//---------------------------------------------------------------------

name: "Command Info",

//---------------------------------------------------------------------
// Is Command Extension
//
// Must be true to appear in "command" context menu.
// This means each "command" will hold its own copy of this data.
//---------------------------------------------------------------------

isCommandExtension: true,

//---------------------------------------------------------------------
// Is Event Extension
//
// Must be true to appear in "event" context menu.
// This means each "event" will hold its own copy of this data.
//---------------------------------------------------------------------

isEventExtension: false,

//---------------------------------------------------------------------
// Is Editor Extension
//
// Must be true to appear in the main editor context menu.
// This means there will only be one copy of this data per project.
//---------------------------------------------------------------------

isEditorExtension: false,

//---------------------------------------------------------------------
// Extension Fields
//
// These are the fields for the extension. These fields are customized
// by creating elements with corresponding IDs in the HTML. These
// are also the names of the fields stored in the command's/event's JSON data.
//---------------------------------------------------------------------

fields: ["category", "description", "include"],

//---------------------------------------------------------------------
// Default Fields
//
// The default values of the fields.
//---------------------------------------------------------------------

defaultFields: {
	category: 'None',
	description: 'No Description',
	include: 'No'
},

//---------------------------------------------------------------------
// Extension Dialog Size
//
// Returns the size of the extension dialog.
//---------------------------------------------------------------------

size: function() {
	return { width: 500, height: 425 };
},

//---------------------------------------------------------------------
// Extension HTML
//
// This function returns a string containing the HTML used for
// the context menu dialog.
//---------------------------------------------------------------------

html: function(data) {
	if (data.include == "No") {
		var options = '<option value="No">No</option><option value="Yes">Yes</option>';
	} else {
		var options = '<option value="Yes">Yes</option><option value="No">No</option>';
	};
	
	return `
		<div style="float: left; width: 99%; margin-left: auto; margin-right: auto; padding:10px;">
			<h2 style="text-align: center;">Command Info</h2>
			<p>
				<u>Extention Info:</u> - Created by Silversunset<br>
				This will add an additional field to your raw data for use in an automatic help command<br>
				<a href="https://www.silversunset.net/paste/raw/231" target="_blank">This RAW DATA</a> is <b>required</b> to use this extention.<br>
			</p>
			
			Category: <input id="category" class="round" type="text" value=${data.category} style="width:99%"><br>
			Description: <textarea id="description" rows="3" placeholder="Insert description here..."  style="width: 99%; font-family: monospace; white-space: nowrap; resize: none;">${data.description}</textarea><br>
			Include in Auto Help: <select style="width:33%;" id="include" class="round">
				${options}
			</select>
		</div>`

},

//---------------------------------------------------------------------
// Extension Dialog Init Code
//
// When the HTML is first applied to the extension dialog, this code
// is also run. This helps add modifications or setup reactionary
// functions for the DOM elements.
//---------------------------------------------------------------------

init: function(document, data) {
	//try {
		
	//	alert(data.category);		
		//document.getElementById('include').value = data.include;		
	//}
	//catch(err) {
	//	alert(err.message);
	//}
	
},

//---------------------------------------------------------------------
// Extension Dialog Close Code
//
// When the dialog is closed, this is called. Use it to save the data.
//---------------------------------------------------------------------

close: function(document, data) {
	data.category = document.getElementById('category').value;
	data.description = document.getElementById('description').value;
	data.include = document.getElementById('include').value;
},

//---------------------------------------------------------------------
// Extension On Load
//
// If an extension has a function for "load", it will be called
// whenever the editor loads data.
//
// The "DBM" parameter is the global variable. Store loaded data within it.
//---------------------------------------------------------------------

//load: function(DBM, projectLoc) {
//	let txt = "{}";
//	const filepath = require('path').join(projectLoc, 'data', 'thisistest.json');
//	if(require('fs').existsSync(filepath)) {
//		txt = require('fs').readFileSync(filepath).toString();
//	}
//	DBM.__myCustomData = JSON.parse(txt);
//},

//---------------------------------------------------------------------
// Extension On Save
//
// If an extension has a function for "save", it will be called
// whenever the editor saves data.
//
// The "data" parameter contains all data. Use this to modify
// the data that is saved. The properties correspond to the
// data file names:
//
//  - data.commands
//  - data.settings
// etc...
//---------------------------------------------------------------------

//save: function(DBM, data, projectLoc) {
//	if(!DBM.__myCustomData) return;
//	if(!DBM.__myCustomData.number) DBM.__myCustomData.number = 0;
//	DBM.__myCustomData.number++;
//	data.thisistest = DBM.__myCustomData;
//},

//---------------------------------------------------------------------
// Editor Extension Bot Mod
//
// Upon initialization of the bot, this code is run. Using the bot's
// DBM namespace, one can add/modify existing functions if necessary.
// In order to reduce conflictions between mods, be sure to alias
// functions you wish to overwrite.
//
// This is absolutely necessary for editor extensions since it
// allows us to setup modifications for the necessary functions
// we want to change.
//
// The client object can be retrieved from: `const bot = DBM.Bot.bot;`
// Classes can be retrieved also using it: `const { Actions, Event } = DBM;`
//---------------------------------------------------------------------

mod: function(DBM) {

	
}

}; // End of module
