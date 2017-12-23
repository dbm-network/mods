module.exports = {
	//---------------------------------------------------------------------
	// Created by General Wrex
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

	name: "Parse From Stored Json",

	//---------------------------------------------------------------------
	// Action Section
	//
	// This is the section the action will fall into.
	//---------------------------------------------------------------------

	section: "JSON Things",

	//---------------------------------------------------------------------
		 // DBM Mods Manager Variables (Optional but nice to have!)
		 //
		 // These are variables that DBM Mods Manager uses to show information
		 // about the mods for people to see in the list.
		 //---------------------------------------------------------------------

		 // Who made the mod (If not set, defaults to "DBM Mods")
		 author: "General Wrex",

		 // The version of the mod (Defaults to 1.0.0)
		 version: "1.8.2",

		 // A short description to show on the mod line for this mod (Must be on a single line)
		 short_description: "INSERT DESCRIPTION HERE",

		 // If it depends on any other mods by name, ex: WrexMODS if the mod uses something from WrexMods
		 depends_on_mods: ["WrexMODS"],

		 //---------------------------------------------------------------------

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

        if(varType == typeof(object))
        return ([data.varName, 'JSON Object']);
        else{
            return ([data.varName, 'JSON ' + varType + ' Value']);
        }
	},

	//---------------------------------------------------------------------
	// Action Fields
	//
	// These are the fields for the action. These fields are customized
	// by creating elements with corresponding IDs in the HTML. These
	// are also the names of the fields stored in the action's JSON data.
	//---------------------------------------------------------------------

	fields: ["behavior", "jsonObjectVarName", "path", "storage", "varName"],

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
		<div id ="wrexdiv" style="width: 550px; height: 350px; overflow-y: scroll;">
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
			<div><br><br>
				Stored JSON Variable Name: <br>
				<input id="jsonObjectVarName" class="round"  style="width: 90%;" type="text"><br>
			</div>
			</div><br>
				JSON Path: (supports the usage of <a href="http://goessner.net/articles/JsonPath/index.html#e2" target="_blank">JSON Path (Regex)</a>))<br>
				<input id="path" class="round"; style="width: 75%;" type="text"><br>
			<div><br>
			<div style="float: left; width: 35%;">
				Store In:<br>
				<select id="storage" class="round" onchange="glob.variableChange(this, 'varNameContainer')">
					${data.variables[0]}
				</select>
			</div>
			<div id="varNameContainer" style="display: ; float: right; width: 60%;">
				Variable Name:<br>
				<input id="varName" class="round" type="text">
			</div>
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

		var WrexMODS = this.getWrexMods();

		const data = cache.actions[cache.index];
		let result;
		const varName = this.evalMessage(data.varName, cache);
		const storage = parseInt(data.storage);
		const jsonObjectVarName = this.evalMessage(data.jsonObjectVarName, cache);
        const path = this.evalMessage(data.path, cache);

        const jsonData = this.getVariable(storage, jsonObjectVarName, cache);

		try
		{

			if(path && jsonData){


				var outData = WrexMODS.jsonPath(jsonData, path);

				// if it dont work, try to go backwards one path
				if(outData == false){
					outData = WrexMODS.jsonPath(jsonData, "$." + path);
				}

				// if it still dont work, try to go backwards two paths
				if(outData == false){
					outData = WrexMODS.jsonPath(jsonData, "$.." + path);
				}

				console.log(outData);

				try {
					var test = JSON.parse(JSON.stringify(outData));
				} catch (error) {
					var errorJson = JSON.stringify({error: error, success: false})
					this.storeValue(errorJson, storage, varName, cache);
					console.error(error.stack ? error.stack : error);
				}

				var outValue = eval(JSON.stringify(outData), cache);


				if(outData.success != null || outValue.success != null){
					var errorJson = JSON.stringify({error: "error", statusCode: 0, success: false})
					this.storeValue(errorJson, storage, varName, cache);
					console.log("WebAPI Parser: Error Invalid JSON, is the Path set correctly? [" + path + "]");
				}else{
					if(outValue.success != null || !outValue){
						var errorJson = JSON.stringify({error: error, statusCode: statusCode, success: false})
						this.storeValue(errorJson, storage, varName, cache);
						console.log("WebAPI Parser: Error Invalid JSON, is the Path set correctly? [" + path + "]");
					}else{
						this.storeValue(outValue, storage, varName, cache);
						console.log("WebAPI Parser: JSON Data values starting from ["+ path +"] stored to: ["+ varName+"]");
					}

				}
			}

		} catch (error) {
			var errorJson = JSON.stringify({error: error, statusCode : 0, success: false})
			this.storeValue(errorJson, storage, varName, cache);

			console.error("WebAPI Parser: Error: " + errorJson + " stored to: ["+ varName+"]");
		}

		if(data.behavior === "0") {
			this.callNextAction(cache);
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
