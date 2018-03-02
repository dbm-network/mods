	// Created by General Wrex
	// My Patreons have made creating this script possible @ https://www.patreon.com/generalwrex
	// At the time of editing this script, they are:
	// - MitchDaGamer
	//
	// Thanks so much guys, you allow me to continue to do what i love!
	//---------------------------------------------------------------------

module.exports = {

	//---------------------------------------------------------------------
	// DBM Mods Manager Variables 
	//
	// These are variables that DBM Mods Manager uses to show information
	// about the mods for people to see in the list.
	//---------------------------------------------------------------------

	// Who made the mod (If not set, defaults to "DBM Mods")
	author: "General Wrex",

	// The version of the mod (Defaults to 1.0.0)
	version: "1.0.0",

    // A short description to show on the mod line for this mod (Must be on a single line)
	short_description: "Parses HTML to store variables",

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

	name: "Parse From Stored Webpage",

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
		return ` Var: ${data.varName} Path: ${data.xpath}`;
	},

	//---------------------------------------------------------------------
	// Action Storage Function
	//
	// Stores the relevant variable info for the editor.
	//---------------------------------------------------------------------

	variableStorage: function(data, varType) {
		const type = parseInt(data.storage);
		if(type !== varType) return;
		return ([data.varName, 'String']);
	},

	//---------------------------------------------------------------------
	// Action Fields
	//
	// These are the fields for the action. These fields are customized
	// by creating elements with corresponding IDs in the HTML. These
	// are also the names of the fields stored in the action's JSON data.
	//---------------------------------------------------------------------

	fields: ["debugMode", "xpath", "source", "sourceVarName", "storage", "varName"],

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
				This returns an array of values, be sure to read your Bot Log/Terminal<br> 
				while constructing command with <b>Debug Mode</b> Enabled. 
			<p>
				<u>Instructions:</u><br>
					1. Input a Path into the XPath textarea<br>
					2. Test Online: <span class="wrexlink" data-url="https://codebeautify.org/Xpath-Tester">X-Path Tester</span><br>
					3. How to get <span class="wrexlink" data-url="https://stackoverflow.com/a/46599584/1422928">XPath from Chrome.</span><br>
					
			</p>
		</div>	
		  <div style="float: left; width: 35%;">
       Source HTML:<br>
			 <select id="source" class="round" onchange="glob.variableChange(this, 'sourceVarNameContainer')">
				 ${data.variables[1]}
			 </select>
      </div>	
      <div id="sourceVarNameContainer" style="display: none; float: right; width: 60%;">
        Variable Name:<br>
        <input id="sourceVarName" class="round" type="text" list="variableList">
      </div><br><br><br>
		<div>			
			XPath: (Supports multiple, split with the <b>|</b> symbol) <br>
			<textarea id="xpath" class="round" style="width: 99%; resize: none;" type="textarea" rows="2" cols="20"></textarea><br>    
		</div>	
	  <div hidden="true">
		<button class="tiny compact ui labeled icon button" onclick="glob.checkPath(this)"><i class="plus icon"></i>Check XPath</button><br>
		Valid: <text id="valid" style="color: red">Input A Path</text>
	  </div><br>
		<div style="float: left; width: 35%;">
			Store In:<br>
			<select id="storage" class="round" onchange="glob.variableChange(this, 'varNameContainer')">
				${data.variables[0]}
			</select>
		</div>	
		<div id="varNameContainer" style="display: none; float: right; width: 60%;">
			Storage Variable Name:<br>
			<input id="varName" class="round" type="text">
		</div><br>	
		<div style="float: left; width: 30%;">
			<br>Debug Mode: (Enable to see verbose printing in the bot console)<br>
			<select id="debugMode" class="round">
		   		<option value="1" selected>Enabled</option>
		   		<option value="0" >Disabled</option>
			</select>
	 </div>
	</div>		
	<style>
	  span.wrexlink {
		color: #99b3ff;
		text-decoration:underline;
		cursor:pointer;
	  }
	  span.wrexlink:hover { 
		color:#4676b9; 
	  }
	</style>
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
			
			try {	
				var WrexMODS = require(require('path').join(__dirname,'aaa_wrexmods_dependencies_MOD.js')).getWrexMods();
								
				var wrexlinks = document.getElementsByClassName("wrexlink")
				for(var x = 0; x < wrexlinks.length; x++) {
				  
				  var wrexlink = wrexlinks[x];
				  var url = wrexlink.getAttribute('data-url');   
				  if(url){
					wrexlink.setAttribute("title", url);
					wrexlink.addEventListener("click", function(e){
					  e.stopImmediatePropagation();
					  console.log("Launching URL: [" + url + "] in your default browser.")
					  require('child_process').execSync('start ' + url);
					});
				  }   
				}  

			} catch (error) {
				// write any init errors to errors.txt in dbm's main directory
				require("fs").appendFile("errors.txt", error.stack ? error.stack : error + "\r\n"); 
			}
	

			glob.variableChange(document.getElementById('storage'), 'varNameContainer');
			glob.variableChange(document.getElementById('source'), 'sourceVarNameContainer')
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

			const sourceVarName = this.evalMessage(data.sourceVarName, cache);
			const source = parseInt(data.source);
			const varName = this.evalMessage(data.varName, cache);
			const storage = parseInt(data.storage);

			const DEBUG = parseInt(data.debugMode);

			const myXPath = this.evalMessage(data.xpath, cache);

			let html = this.getVariable(source, sourceVarName, cache);

			var xpath = WrexMODS.require('xpath')
			, dom = WrexMODS.require('xmldom').DOMParser
			, ent = WrexMODS.require('ent')

			let errors = [];

			if(myXPath){
			
				// check for errors
				let errored = false;			
				try {
					xpath.evaluate(myXPath, null, null, null);
				} catch (error) {
					errored = error;
					if(!error.toString().includes('nodeType')) console.error(`Invalid XPath: [${myXPath}] (${(error ? error : "")})`);
				}
				
				if(html){

					let mylocator = {};
					let parseLog = {errorLevel: 0};
					let doc = new dom({
						locator: mylocator,
						errorHandler: {
						   warning: (msg) => {manageXmlParseError(msg,1,parseLog)},
						   error: (msg) => {manageXmlParseError(msg,2,parseLog); ( DEBUG ? console.log("XMLDOMError: " + msg) : "")},
						   fatalError: (msg) => {manageXmlParseError(msg,3,parseLog); ( DEBUG ? console.log("FATAL XMLDOMError: " + msg) : "")},
						},
					}).parseFromString(ent.decode(html));


					function manageXmlParseError(msg,errorLevel,errorLog){
						if( (errorLog.errorLevel == null) || (errorLog.errorLevel < errorLevel)){
						   errorLog.errorLevel = errorLevel;
						}					 
						if(errorLog[errorLevel.toString()] == null){
						   errorLog[errorLevel.toString()] = [];
						}					 
						errorLog[errorLevel.toString()].push(msg);
					 }
					
					 let nodes = [];
					 try {
						 nodes = xpath.select(myXPath, doc);

						 if(nodes && nodes.length > 0){

							var out = [];
							nodes.forEach(node => {
	
								var name = node.name || "Text Value";
								var value = node.value ? node.value : node.toString();
	
	
								if(DEBUG) {
									console.log("====================================");
									console.log("Source String: " + node.toString());
									console.log("====================================");
									//console.log("Parent Node Name: " +  .name);
									console.log("Name: " + name);
									console.log("Line Number: " + node.lineNumber);
									console.log("Column Number: " + node.columnNumber);
									console.log("Parsed Value: " + value.trim());
									console.log("====================================\n");								
								}
	
								out.push(value.trim());
							  })
						  
							  if(out.length > 1 && DEBUG){
								console.log('Stored value(s);\r\n');
	
								for (i = 0; i < out.length; i++) {
									console.log('[' + i + '] = ' + out[i]);
								}
	  
								console.log('\r\nAppend the key that you want to store that value to the variable.');
	  
								const storageType = ['', 'tempVars', 'serverVars', 'globalVars'];
								var output = storageType[storage]
	  
								console.log('Example ${'+output+'("'+ varName +'")} to ${'+output+'("'+ varName +'")[key]}');
								console.log(''+ varName +'[key] if not using it as a template\r\n');
							  }
							

							   this.storeValue(out, storage, varName, cache);
							if(DEBUG) console.log(`Stored value(s) [${out}] to  [${varName}] `)
							   
	
							  this.callNextAction(cache);	 	
						}else{
							console.error(`Could not store a value from path ${myXPath}, Check that the path is valid!\n`);
							if(DEBUG) console.info("parsestatus ==> " + parseLog.errorLevel + "\nlocator:" +  mylocator.columnNumber + "/" + mylocator.lineNumber );
							
							this.storeValue(errored ? errored : undefined, storage, varName, cache);
							  this.callNextAction(cache);	 	
						} 		

					 } catch (error) {

						 this.storeValue(errored ? errored : undefined, storage, varName, cache);
						 this.callNextAction(cache);	 	
					 }
														
				
				}else{
					console.error(`HTML data Is Not Valid!`);
				}
								
			}else{
				console.error(`Path [${myXPath}] Is Not Valid`);
			}

		} catch (error) {
			console.error("Webpage Things:  Error: " + error.stack ? error.stack : error);
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
