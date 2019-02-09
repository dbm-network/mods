module.exports = {

//---------------------------------------------------------------------
// Action Name
//
// This is the name of the action displayed in the editor.
//---------------------------------------------------------------------

name: "Download File",

//---------------------------------------------------------------------
// Action Section
//
// This is the section the action will fall into.
//---------------------------------------------------------------------

section: "File Stuff",

//---------------------------------------------------------------------
// Action Subtitle
//
// This function generates the subtitle displayed next to the name.
//---------------------------------------------------------------------

subtitle: function(data) {
	return `${data.url}`;
},

//---------------------------------------------------------------------
// DBM Mods Manager Variables (Optional but nice to have!)
//
// These are variables that DBM Mods Manager uses to show information
// about the mods for people to see in the list.
//---------------------------------------------------------------------

// Who made the mod (If not set, defaults to "DBM Mods")
author: "MrGold", //Save Image by Aamon merged with this mod

// The version of the mod (Defaults to 1.0.0)
version: "1.9.4", //Added in 1.9.4

// A short description to show on the mod line for this mod (Must be on a single line)
short_description: "Downloads a file",

// If it depends on any other mods by name, ex: WrexMODS if the mod uses something from WrexMods
depends_on_mods: [{name:'WrexMods',path:'aaa_wrexmods_dependencies_MOD.js'}],

//---------------------------------------------------------------------

//---------------------------------------------------------------------
// Action Fields
//
// These are the fields for the action. These fields are customized
// by creating elements with corresponding IDs in the HTML. These
// are also the names of the fields stored in the action's JSON data.
//---------------------------------------------------------------------

fields: ["url", "fileName", "fileFormat", "filePath"],

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
		Created by MrGold<br>
		<span style="opacity:0.5">(Save Image by Aamon merged with this mod)</span>
    </p>
</div><br>
<div style="float: left;">
	Web URL:<br>
	<input id="url" class="round" type="text" style="width: 522px" oninput="glob.onInput1(this)"><br>
</div><br><br><br>
<div style="float: left;">
  <div style="float: left; width: 60%;">
	File Name:<br>
	<input id="fileName" class="round" type="text" style="width: 400px"><br>
  </div>
  <div style="float: left; width: 35%; padding-left: 100px;">
  File Format:<br>
	<input id="fileFormat" class="round" type="text" style="width: 100px"><br>
  </div>
</div><br><br><br><br>
<div style="float: left;">
	File Path:<br>
	<input id="filePath" class="round" type="text" style="width: 522px" value="./downloads"><br>
</div><br><br><br><br>
<p>
  <u><b><span style="color: white;">NOTE:</span></b></u><br>
  In File Path, "./" represents the path to your bot folder<br>
  File Name and File Format are automatic but you can change them
</p>
`
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
	
	glob.onInput1 = function() {
		var x = document.getElementById("url").value.replace(/(\/|\\)+$/, "").split("/");
		var y = x[x.length-1];
		
		let arrayy = [];
        var regex = new RegExp(/\./, "g");
        while (rE = regex.exec(y)) {
	        arrayy.push(rE);
		}
		
        if(arrayy.length == 0 || !y.substring(arrayy[arrayy.length-1].index+1)) {
			document.getElementById("fileName").placeholder = "";
			document.getElementById("fileFormat").placeholder = "";
        } else {
			var fN = y.substring(0, arrayy[arrayy.length-1].index);
	    	var fF = y.substring(arrayy[arrayy.length-1].index+1);

    		document.getElementById("fileName").placeholder = fN;
    		document.getElementById("fileFormat").placeholder = fF;
        }
	}

	glob.onInput1(document.getElementById('url'));
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

	var url = this.evalMessage(data.url, cache);
	var fileName = this.evalMessage(data.fileName, cache);
	var fileFormat = this.evalMessage(data.fileFormat, cache);
	var filePath = this.evalMessage(data.filePath, cache);

	if(!url) {
		console.log(`Action: #${cache.index + 1} | Download File ERROR: Web URL has nothing`);
		this.callNextAction(cache);
		return;
	}

	if(!fileName || !fileFormat) {
		var x = url.replace(/(\/|\\)+$/, "").split("/");
		var y = x[x.length-1];
		
		let arrayy = [];
        var regex = new RegExp(/\./, "g");
        while (rE = regex.exec(y)) {
	        arrayy.push(rE);
		}
		
        if(arrayy.length == 0 || !y.substring(arrayy[arrayy.length-1].index+1)) {
			if(!fileName && !fileFormat) {
				console.log(`Action: #${cache.index + 1} | Download File ERROR: File Name and File Format has nothing`);
				this.callNextAction(cache);
				return;
			} else if(!fileName) {
				console.log(`Action: #${cache.index + 1} | Download File ERROR: File Name has nothing`);
				this.callNextAction(cache);
				return;
			} else if(!fileFormat) {
				console.log(`Action: #${cache.index + 1} | Download File ERROR: File Format has nothing`);
				this.callNextAction(cache);
				return;
			}
        } else {
			var fN = y.substring(0, arrayy[arrayy.length-1].index);
	    	var fF = y.substring(arrayy[arrayy.length-1].index+1);

    		if(!fileName && !fileFormat) {
				fileName = fN;
				fileFormat = fF;
			} else if(!fileName) {
				fileName = fN;
			} else if(!fileFormat) {
				fileFormat = fF;
			}
        }
	}

	if(!filePath) {
		console.log(`Action: #${cache.index + 1} | Download File ERROR: File Path has nothing`);
		this.callNextAction(cache);
		return;
	}

	function gR(input) {
		var illegalRe = /[\/\?<>\\:\*\|":]/g;
		var controlRe = /[\x00-\x1f\x80-\x9f]/g;
		var reservedRe = /^\.+$/;
		var windowsReservedRe = /^(con|prn|aux|nul|com[0-9]|lpt[0-9])(\..*)?$/i;
		var windowsTrailingRe = /[\. ]+$/;
		var rG = input
		    .replace(illegalRe, "")
		    .replace(controlRe, "")
		    .replace(reservedRe, "")
		    .replace(windowsReservedRe, "")
		    .replace(windowsTrailingRe, "");
		return rG;
	}
	fileName = gR(fileName);
	fileFormat = gR(fileFormat);

	var WrexMODS = this.getWrexMods();
	var request = WrexMODS.require('request');
	var fs = WrexMODS.require('fs');
	var path = WrexMODS.require('path');

    if (!fs.existsSync(filePath)){
    fs.mkdirSync(filePath);
	}
	
	request.get(url).on('error', function(err) {console.log(`Action: #${cache.index + 1} | Download File ERROR: Web URL not found...`);}).pipe(fs.createWriteStream(path.resolve(filePath, fileName + '.' + fileFormat)));
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