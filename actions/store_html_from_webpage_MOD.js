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

module.exports = {

	//---------------------------------------------------------------------
	// DBM Mods Manager Variables (Optional but nice to have!)
	//
	// These are variables that DBM Mods Manager uses to show information
	// about the mods for people to see in the list.
	//---------------------------------------------------------------------

	// Who made the mod (If not set, defaults to "DBM Mods")
	author: "General Wrex",

	// The version of the mod (Defaults to 1.0.0)
	version: "1.0.0",

    // A short description to show on the mod line for this mod (Must be on a single line)
	short_description: "Stores HTML data into a variable to be parsed.",

	// If it depends on any other mods by name, ex: WrexMODS if the mod uses something from WrexMods
	// {name:'WrexMods',path:'aaa_wrexmods_dependencies_MOD.js'}
	depends_on_mods: [
		{name:'WrexMODS',path:'aaa_wrexmods_dependencies_MOD.js'}
	],

	//---------------------------------------------------------------------
	
	//---------------------------------------------------------------------
	// Action Name
	//
	// This is the name of the action displayed in the editor.
	//---------------------------------------------------------------------

	name: "Store HTML From Webpage",


	//---------------------------------------------------------------------
	// Action Section
	//
	// This is the section the action will fall into.
	//---------------------------------------------------------------------

	section: "HTML/XML Things",

	//---------------------------------------------------------------------
	// Action Subtitle
	//
	// This function generates the subtitle displayed next to the name.
	//---------------------------------------------------------------------

	subtitle: function(data) {
		return `URL: ${data.url}`;
	},

	//---------------------------------------------------------------------
	// Action Storage Function
	//
	// Stores the relevant variable info for the editor.
	//---------------------------------------------------------------------

	variableStorage: function(data, varType) {
		const type = parseInt(data.storage);
		if(type !== varType) return;
		return ([data.varName, 'HTML Webpage']);
	},

	//---------------------------------------------------------------------
	// Action Fields
	//
	// These are the fields for the action. These fields are customized
	// by creating elements with corresponding IDs in the HTML. These
	// are also the names of the fields stored in the action's JSON data.
	//---------------------------------------------------------------------

	fields: ["url","storage", "varName"],

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
				Created by General Wrex!<br>
				This can also be used to save any website data (except images and files) to a variable.
			</p>
			<p>
				<u>Instructions:</u><br>
					1. Input a url into the Webpage URL textarea<br>
					2. Click valid URL to check if the url is valid!
			</p>
		</div>	
		<div style="float: left; width: 95%;">
			Webpage URL: <br>
			<textarea id="url" class="round" style="width: 99%; resize: none;" type="textarea" rows="4" cols="20"></textarea><br>    
		</div>	
	  <div>
		<button class="tiny compact ui labeled icon button" onclick="glob.checkURL(this)"><i class="plus icon"></i>Check URL</button><br>
		Valid: <text id="valid" style="color: red">Input A Url</text>
	  </div><br>
		<div style="float: left; width: 35%;">
			Store In:<br>
			<select id="storage" class="round" onchange="glob.variableChange(this, 'varNameContainer')">
				${data.variables[0]}
			</select>
		</div>	
		<div id="varNameContainer" style="display: ; float: right; width: 60%;">
			Storage Variable Name:<br>
			<input id="varName" class="round" type="text">
		</div>	
	</div>	
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
		
	
			function evalMessage(content) {
				if(!content) return '';
				if(!content.match(/\$\{.*\}/im)) return content;
				return content.replace(/\$\{.*\}/im,"CUSTOMVALUE");
			}
	
			try {
	
				var WrexMODS = require(require("path").join(__dirname, 'aaa_wrexmods_dependencies_MOD.js')).getWrexMods();
							
				var valid = document.getElementById("valid");
				var url = document.getElementById("url");
	
				glob.checkURL = function(element){
	
					const pUrl = url.value;
	
					const checkedUrl = WrexMODS.checkURL(encodeURI(evalMessage(pUrl)));
					
					if(checkedUrl && pUrl){
						valid.innerHTML = "Valid URL Format!";
						valid.style.color = "green";
					}else{
						valid.innerHTML = "Invalid URL Format!";
						valid.style.color = "red";
					}
					
				}
	
																												
			} catch (error) {
				// write any init errors to errors.txt in dbm's main directory
				require("fs").appendFile("errors.txt", error.stack ? error.stack : error + "\r\n"); 
			}
	
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

		try {

			var WrexMODS = this.getWrexMods();

			const data = cache.actions[cache.index];

			const varName = this.evalMessage(data.varName, cache);
			const storage = parseInt(data.storage);

			var url = this.evalMessage(data.url, cache);

			if(!WrexMODS.checkURL(url)){
				url = encodeURI(url);
			}

			if(WrexMODS.checkURL(url)){
			
			    // making sure all the required node modules are installed
				var request = WrexMODS.require('request')
											
				request(url, function(err, res, html) { 	
					
					if(err) throw err;
					
					this.storeValue(html.trim(), storage, varName, cache)	;	
					this.callNextAction(cache);	 	

				}.bind(this));
							
			}else{
				throw Error('HTML Parser - URL ['+url+'] Is Not Valid');
			}

		} catch (error) {
			console.error("API Things:  Error: " + error.stack ? error.stack : error);
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
