module.exports = {

	//---------------------------------------------------------------------
	// Action Name
	//
	// This is the name of the action displayed in the editor.
	//---------------------------------------------------------------------
	
	name: "Convert Variable",
	
	//---------------------------------------------------------------------
	// Action Section
	//
	// This is the section the action will fall into.
	//---------------------------------------------------------------------
	
	section: "Variable Things",
	
	//---------------------------------------------------------------------
	// Action Subtitle
	//
	// This function generates the subtitle displayed next to the name.
	//---------------------------------------------------------------------
	
	subtitle: function(data) {
		const info = ['Number (Int)', 'Number (Float)', 'String', 'Uppercased String', 'Lowercased String'];
		return `Conversion Type: ${info[parseInt(data.conversion)]}`;
	},
	
	//---------------------------------------------------------------------
	// DBM Mods Manager Variables (Optional but nice to have!)
	//
	// These are variables that DBM Mods Manager uses to show information
	// about the mods for people to see in the list.
	//---------------------------------------------------------------------
	
	// Who made the mod (If not set, defaults to "DBM Mods")
	author: "EliteArtz, MrGold & ZockerNico", //UI and Code updated by MrGold
	
	// The version of the mod (Defaults to 1.0.0)
	version: "1.9.5", //Added in 1.8.9
	
	// A short description to show on the mod line for this mod (Must be on a single line)
	short_description: "This allows you to convert a Variable into a String or Number",
	
	// If it depends on any other mods by name, ex: WrexMODS if the mod uses something from WrexMods
	
	//---------------------------------------------------------------------
	
	//---------------------------------------------------------------------
	// Action Storage Function
	//
	// Stores the relevant variable info for the editor.
	//---------------------------------------------------------------------
	
	variableStorage: function(data, varType) {
		const type = parseInt(data.storage2);
		const prse2 = parseInt(data.conversion);
		const info2 = ['Number', 'Number', 'String', 'String', 'String'];
		if(type !== varType) return;
		return ([data.varName2, info2[prse2]]);
	},
	
	
	//---------------------------------------------------------------------
	// Action Fields
	//
	// These are the fields for the action. These fields are customized
	// by creating elements with corresponding IDs in the HTML. These
	// are also the names of the fields stored in the action's JSON data.
	//---------------------------------------------------------------------
	
	fields: ["storage", "varName", "conversion", "storage2", "varName2"],
	
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
		<div class="embed" style="width:98%;">
			<embedleftline></embedleftline><div class="embedinfo">
				<span class="embed-auth"><u>Mod Info</u><br>
				Made by ${this.author}</span><br>
				<span class="embed-desc">${this.short_description}<br>
				Mod Version: ${this.version} | Added in: 1.8.9</span>
			</div>
		</div>
	</div><br>
	<div>
		<div style="float: left; width: 35%;">
			Source Variable:<br>
			<select id="storage" class="round" onchange="glob.refreshVariableList(this)">
				${data.variables[1]}
			</select>
		</div>
		<div id="varNameContainer" style="float: right; width: 60%;">
			Variable Name:<br>
			<input id="varName" class="round" type="text" list="variableList">
		</div>
	</div><br><br><br>
	<div>
		<div style="padding-top: 8px; width: 35%;">
			Conversion Type:<br>
			<select id="conversion" class="round">
				<option value="0" selected>Number (Int)</option>
				<option value="1">Number (Float)</option>
				<option value="2">String</option>
				<option value="3">Uppercased String</option>
				<option value="4">Lowercased String</option>
			</select>
		</div>
	</div><br>
	<div>
		<div style="float: left; width: 35%;">
			Store In:<br>
			<select id="storage2" class="round">
				${data.variables[1]}
			</select>
		</div>
		<div id="varNameContainer2" style="float: right; width: 60%;">
			Variable Name:<br>
			<input id="varName2" class="round" type="text"><br>
		</div>
	</div>
	<style>
		/* My Embed CSS code */
		.embed {
			position: relative;
		}
		.embedinfo {
			background: rgba(46,48,54,.45) fixed;
			border: 1px solid hsla(0,0%,80%,.3);
			padding: 10px;
			margin:0 4px 0 7px;
			border-radius: 0 3px 3px 0;
		}
		embedleftline {
			background-color: #eee;
			width: 4px;
			border-radius: 3px 0 0 3px;
			border: 0;
			height: 100%;
			margin-left: 4px;
			position: absolute;
		}
		span {
			font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
		}
		span.embed-auth {
			color: rgb(255, 255, 255);
		
		}
		span.embed-desc {
			color: rgb(128, 128, 128);
		}
	</style>`
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
		const varName = this.evalMessage(data.varName, cache);
		const variable = this.getVariable(storage, varName, cache);
		const conversion = parseInt(data.conversion);
	
		let result;
	
		switch (conversion) {
			case 0:
				result = parseInt(variable);
				break;
			case 1:
				result = parseFloat(variable);
				break;
			case 2:
				result = variable.toString();
				break;
			case 3:
				result = variable.toString().toUpperCase();
				break;
			case 4:
				result = variable.toString().toLowerCase();
				break;
		}
		if(result !== undefined) {
			const storage2 = parseInt(data.storage2);
			const varName2 = this.evalMessage(data.varName2, cache);
			this.storeValue(result, storage2, varName2, cache);
		}
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