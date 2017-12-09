module.exports = {
	//---------------------------------------------------------------------
	// Created by General Wrex
	// My Patreons have made creating this script possible @ https://www.patreon.com/generalwrex
	// At the time of editing this script, they are:
	// - MitchDaGamer
	//
	// Thanks so much guys, you allow me to continue to do what i love!
	// Add URL to json object,
	// add path to the object you want from the json
	// set your variable type and name
	// example URL: https://api.github.com/repos/HellionCommunity/HellionExtendedServer/releases/latest
	// example Path: name
	// will return object.name
	// in this example the variable would contain "[DEV] Version 1.2.2.3"
	//---------------------------------------------------------------------



	//---------------------------------------------------------------------
	// Action Name
	//
	// This is the name of the action displayed in the editor.
	//---------------------------------------------------------------------

	name: "Store Json From WebAPI",

	//---------------------------------------------------------------------
	// Action Section
	//
	// This is the section the action will fall into.
	//---------------------------------------------------------------------

	section: "JSON Things",

	//---------------------------------------------------------------------
    // Dependencies Section
    //
    // If your action requires any node modules, add them here.
    //---------------------------------------------------------------------

    dependencies: ["request", "valid-url"],


	//---------------------------------------------------------------------
	// Action Subtitle
	//
	// This function generates the subtitle displayed next to the name.
	//---------------------------------------------------------------------

	subtitle: function(data) {
		return `${data.varName}`;
	},

	//---------------------------------------------------------------------
	// Action Storage Function
	//
	// Stores the relevant variable info for the editor.
	//---------------------------------------------------------------------

	variableStorage: function(data, varType) {
		const type = parseInt(data.storage);
		if(type !== varType) return;
		return ([data.varName, 'JSON Object']);
	},

	//---------------------------------------------------------------------
	// Action Fields
	//
	// These are the fields for the action. These fields are customized
	// by creating elements with corresponding IDs in the HTML. These
	// are also the names of the fields stored in the action's JSON data.
	//---------------------------------------------------------------------

	fields: ["behavior", "url", "path", "storage", "varName"],

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

	html: function(isEvent, data) {
		return `
		<div>
			<p>
				<u>Mod Info:</u><br>
				Created by General Wrex!
			</p>
		</div>
	<div>
	<div style="float: left; width: 75%;">
	<div>
		End Behavior:<br>
		<select id="behavior" class="round">
			<option value="0" selected>Call Next Action Automatically</option>
			<option value="1">Do Not Call Next Action</option>
		</select>
	<div><br>
		WebAPI URL: <br>
		<input id="url" class="round"  style="width: 90%; type="text";><br>
	</div>
	</div><br>
		Initial JSON Path: (Leave blank to store everything, supports the usage of <a href="http://goessner.net/articles/JsonPath/index.html#e2" target="_blank">JSON Path (Regex)</a>)<br>
		<input id="path" class="round"; style="width: 75%; type="text";>
	<div><br>
	<div style="float: left; width: 35%;">
		Store In:<br>
		<select id="storage" class="round" onchange="glob.variableChange(this, 'varNameContainer')">
			${data.variables[0]}
		</select>
	</div>
	<div id="varNameContainer" style="display: ; float: right; width: 60%;">
		JSON Storage Variable Name:<br>
		<input id="varName" class="round" type="text">
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
		glob.variableChange(document.getElementById('storage'), 'varNameContainer');
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

		var WrexMODS = require("../js/WrexMods.js");
		WrexMODS.DBM = this.getDBM();

		const data = cache.actions[cache.index];
		const varName = this.evalMessage(data.varName, cache);
		const storage = parseInt(data.storage);
		var url = this.evalMessage(data.url, cache);
		const path = this.evalMessage(data.path, cache);

		if(!WrexMODS.checkURL(url)){
			url = encodeURI(url);
		};

		if(WrexMODS.checkURL(url)){

			WrexMODS.runPublicRequest(url,true, function(error, statusCode, jsonData){

				try {

					if(error){
						var errorJson = JSON.stringify({error, statusCode})
						_this.storeValue(errorJson, storage, varName, cache);

						console.error("WebAPI: Error: " + errorJson + " stored to: ["+ varName+"]");
					}
					else{
						if(path){
							var outData = WrexMODS.jsonPath(jsonData, path);

							console.log(outData);

							try {
								var test = JSON.parse(JSON.stringify(outData));
							} catch (error) {
								var errorJson = JSON.stringify({error: error, statusCode: statusCode, success: false})
								_this.storeValue(errorJson, storage, varName, cache);
								console.error(error.stack ? error.stack : error);
							}

							var outValue = eval(JSON.stringify(outData), cache);

							if(outData.success != null){
								var errorJson = JSON.stringify({error: error, statusCode: statusCode, success: false})
								_this.storeValue(errorJson, storage, varName, cache);
								console.log("WebAPI: Error Invalid JSON, is the Path set correctly? [" + path + "]");
							}else{
								if(outValue.success != null || !outValue){
									var errorJson = JSON.stringify({error: error, statusCode: statusCode, success: false})
									_this.storeValue(errorJson, storage, varName, cache);
									console.log("WebAPI: Error Invalid JSON, is the Path set correctly? [" + path + "]");
								}else{
									_this.storeValue(outValue, storage, varName, cache);
									console.log("WebAPI: JSON Data values starting from ["+ path +"] stored to: ["+ varName+"]");
								}

							}

						}else{
							_this.storeValue(jsonData, storage, varName, cache);
							console.log("WebAPI: JSON Data Object stored to: ["+ varName+"]");
						}
					}

					if(data.behavior === "0") {
						_this.callNextAction(cache);
					}
				} catch (err) {
					console.error(err.stack ? err.stack : err);
				}


			});
		}
		else{
			console.error('URL ['+url+'] Is Not Valid');
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
		var WrexMODS = require("../js/WrexMods.js");
		WrexMODS.DBM = DBM;

		WrexMODS.CheckAndInstallNodeModule("valid-url");
		WrexMODS.CheckAndInstallNodeModule("request");
		WrexMODS.CheckAndInstallNodeModule("valid-url");
	}

	}; // End of module
