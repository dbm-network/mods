//---------------------------------------------------------------------
// Created by General Wrex
// My Patreons have made creating this script possible @ https://www.patreon.com/generalwrex
// At the time of editing this script, they are:
// - MitchDaGamer
//
// Thanks so much guys, you allow me to continue to do what i love!
//---------------------------------------------------------------------

var dbmMod = {};
dbmMod.version = "1.0.1";
dbmMod.requiredDBMVersion = "2.0.0-beta.7";

//---------------------------------------------------------------------
// Action Name
//
// This is the name of the action displayed in the editor.
//---------------------------------------------------------------------
dbmMod.name = "Send Json to WebAPI";

//---------------------------------------------------------------------
// Action Section
//
// This is the section the action will fall into.
//---------------------------------------------------------------------

dbmMod.section = "JSON Things";

//---------------------------------------------------------------------
// DBM Mods Manager Variables (Optional but nice to have!)
//
// These are variables that DBM Mods Manager uses to show information
// about the mods for people to see in the list.
//---------------------------------------------------------------------

// Who made the mod (If not set, defaults to "DBM Mods")
dbmMod.author = "General Wrex";

// The version of the mod (Defaults to 1.0.0)
dbmMod.version = "1.8.2";

// A short description to show on the mod line for this mod (Must be on a single line)
dbmMod.short_description = "Allows it to push Json to the Web";

// If it depends on any other mods by name, ex: WrexMODS if the mod uses something from WrexMods
dbmMod.depends_on_mods = ["WrexMODS"];

//---------------------------------------------------------------------
// Dependencies Section
//
// If your action requires any node modules, add them here.
//---------------------------------------------------------------------

dbmMod.dependencies = ["request", "valid-url"];

//---------------------------------------------------------------------
// Action Subtitle
//
// This function generates the subtitle displayed next to the name.
//---------------------------------------------------------------------

dbmMod.subtitle = function(data) {
    return `Store: ${data.varName} DebugMode: ${data.debugMode === "1" ? "Enabled" : "Disabled"}`;
};

//---------------------------------------------------------------------
// Action Subtitle
//
// This function generates the subtitle displayed next to the name.
//---------------------------------------------------------------------

dbmMod.subtitle = function(data) {
    return `Store: ${data.varName} DebugMode: ${data.debugMode === "1" ? "Enabled" : "Disabled"}`;
};

//---------------------------------------------------------------------
// Action Storage Function
//
// Stores the relevant variable info for the editor.
//---------------------------------------------------------------------

dbmMod.variableStorage = function(data, varType) {
    const type = parseInt(data.storage);
    if (type !== varType) return;
    return ([data.varName, 'JSON Object']);
};

//---------------------------------------------------------------------
// Action Fields
//
// These are the fields for the action. These fields are customized
// by creating elements with corresponding IDs in the HTML. These
// are also the names of the fields stored in the action's JSON data.
//---------------------------------------------------------------------

dbmMod.fields = ["hideUrl", "debugMode", "postUrl", "postJson", "storage", "varName"];

//---------------------------------------------------------------------
// Command HTML
//
// This function returns a string containing the HTML used for
// editing actions.
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

dbmMod.html = function(isEvent, data) {

    return `
	<div id ="wrexdiv" style="width: 550px; height: 350px; overflow-y: scroll;">
	<div>
	   <p>
		  <u>Mod Info:</u><br>
		  Created by General Wrex!<br>
		  Scroll down for more action options!<br><br>
		  <u>Note:</u><br>
		  Once Hide Url is pressed, It becomes a password box. Save your url somewhere!<br><br>
	   </p>
	</div>
	<div>
	   WebAPI Url Accepting JSON:<br>
     <input id="hideUrl" type="hidden">
	   <input id="postUrl" class="round" type="text">
     <button id= "btnhideUrl" class="tiny compact ui labeled icon button" onclick="document.getElementById('postUrl').setAttribute('type', 'password'); this.disabled = true; document.getElementById('hideUrl').value = 1"><i class="plus icon"></i>Hide URL </button>(Cannot be undone from the editor.)
	</div>
	<div style="padding-top: 4px;">
	   Json To Post:<br>
	   <textarea id="postJson" rows="13" style="width: 99%; white-space: nowrap; resize: none;"></textarea>
	</div><br>
	<div>
	   <div style="float: left; width: 35%;">
		  Store Response In:
		  <br>
		  <select id="storage" class="round" onchange="glob.variableChange(this, 'varNameContainer')">
		  ${data.variables[0]}
		  </select>
	   </div>
	   <div id="varNameContainer" style="display: none; float: right; width: 60%;">
		  Response Variable Name: <br>
		  <input id="varName" class="round" type="text">
	   </div><br><br><br><br>
   <h3>Action Options</h3>
	   <div id="options">
			  Debug Mode (Print More Info To Console):<br>
		   <select id="debugMode" class="round" style="width: 45%">
			   <option value="0">Disabled</option>
			   <option value="1" selected>Enabled</option>
		   </select><br>
	   </div>
	   <div>
	   <p>
		  <u>Note:</u><br>
		  If Debug Mode is enabled, check the Bot Log or the Bot Console for the response data!<br>
		  Use <b>Parse From Stored Json</b> to parse the response into a variable!<br><br>
	   </p>
	</div>
     <div>
 </div>
	</div>
 </div>`
};

//---------------------------------------------------------------------
// Action Editor Init Code
//
// When the HTML is first applied to the action editor, this code
// is also run. This helps add modifications or setup reactionary
// functions for the DOM elements.
//---------------------------------------------------------------------

dbmMod.init = function() {
    const {
        glob,
        document
    } = this;
    glob.variableChange(document.getElementById('storage'), 'varNameContainer');

	glob.opn = function(url){
		var opn = require("opn");
		opn(url)
	}

	if(document.getElementById('hideUrl').value === '1'){
		document.getElementById('postUrl').setAttribute('type', 'password');
		document.getElementById('btnhideUrl').disabled = true;
	}
};

//---------------------------------------------------------------------
// Action Bot Function
//
// This is the function for the action within the Bot's Action class.
// Keep in mind event calls won't have access to the "msg" parameter,
// so be sure to provide checks for variable existance.
//---------------------------------------------------------------------

dbmMod.action = function(cache) {

	var WrexMODS = this.getWrexMods();

	WrexMODS.CheckAndInstallNodeModule("valid-url");
	WrexMODS.CheckAndInstallNodeModule("request");

    var data = cache.actions[cache.index];

    const varName = this.evalMessage(data.varName, cache);
    const storage = parseInt(data.storage);
    const debugMode = parseInt(data.debugMode);

    var url = this.evalMessage(data.postUrl, cache);

    var postJson = this.evalMessage(data.postJson, cache);

    if (!WrexMODS.checkURL(url)) {
        url = encodeURI(url);
    };

    if (WrexMODS.checkURL(url)) {

        if (postJson) {
            // Test the json
            try {
                var test = JSON.parse(JSON.stringify(postJson));
            } catch (error) {
                var errorJson = JSON.stringify({
                    error: error,
                    statusCode: statusCode,
                    success: false
                })
                this.storeValue(errorJson, storage, varName, cache);
                console.error(error.stack ? error.stack : error);
            }
        }

        WrexMODS.runPostJson(url, postJson, true, function(error, statusCode, jsonData) {

            try {
                if (error) {
                    var errorJson = JSON.stringify({
                        error,
                        statusCode
                    })
                    this.storeValue(errorJson, storage, varName, cache);

                    console.error("WebAPI: Error: " + errorJson + " stored to: [" + varName + "]");
                } else {
                    if (jsonData) {

			this.storeValue(jsonData, storage, varName, cache);

                        if (debugMode) {
			    console.log("WebAPI: JSON Data Response value stored to: [" + varName + "]");
                            console.log("Response (Disable DebugMode to stop printing the response data to the console):\r\n");
                            console.log(JSON.stringify(jsonData, null, 4));
                        }
                    } else {
                        var errorJson = JSON.stringify({
                            error,
                            statusCode
                        })
                        this.storeValue(errorJson, storage, varName, cache);

                        console.error("WebAPI: Error: " + errorJson + " stored to: [" + varName + "]");
                    }
                }

                this.callNextAction(cache);

            } catch (err) {
                console.error(err.stack ? err.stack : err);
            }
        }.bind(this));
    } else {
        console.error('URL [' + url + '] Is Not Valid');
    }
};


//---------------------------------------------------------------------
// Action Bot Mod
//
// Upon initialization of the bot, this code is run. Using the bot's
// DBM namespace, one can add/modify existing functions if necessary.
// In order to reduce conflictions between mods, be sure to alias
// functions you wish to overwrite.
//---------------------------------------------------------------------

dbmMod.mod = function(DBM) {

}

module.exports = dbmMod;
