module.exports = {

//---------------------------------------------------------------------
// Action Name
//
// This is the name of the action displayed in the editor.
//---------------------------------------------------------------------

name: "Find Category",

//---------------------------------------------------------------------
// Action Section
//
// This is the section the action will fall into.
//---------------------------------------------------------------------

section: "Channel Control",

//---------------------------------------------------------------------
// Action Subtitle
//
// This function generates the subtitle displayed next to the name.
//---------------------------------------------------------------------

subtitle: function(data) {
	const info = ['Category ID', 'Category Name', 'Category Topic'];
	return `Find Category by ${info[parseInt(data.info)]}`;
},

//---------------------------------------------------------------------
// DBM Mods Manager Variables (Optional but nice to have!)
//
// These are variables that DBM Mods Manager uses to show information
// about the mods for people to see in the list.
//---------------------------------------------------------------------

// Who made the mod (If not set, defaults to "DBM Mods")
author: "NetLuis",

// The version of the mod (Defaults to 1.0.0)
version: "1.9.1", //Added in 1.9.1

// A short description to show on the mod line for this mod (Must be on a single line)
short_description: "Finds category with ID or name.",

// If it depends on any other mods by name, ex: WrexMODS if the mod uses something from WrexMods


//---------------------------------------------------------------------
// Action Storage Function
//
// Stores the relevant variable info for the editor.
//---------------------------------------------------------------------

variableStorage: function(data, varType) {
	const type = parseInt(data.storage);
	if(type !== varType) return;
	return ([data.varName, 'Category']);
},

//---------------------------------------------------------------------
// Action Fields
//
// These are the fields for the action. These fields are customized
// by creating elements with corresponding IDs in the HTML. These
// are also the names of the fields stored in the action's JSON data.
//---------------------------------------------------------------------

fields: ["info", "find", "storage", "varName"],

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
		Created by NetLuis!<br>
		Idea from SAFAxSNIPER
	</p>
</div><br>
<div>
	<div style="float: left; width: 40%;">
		Source Field:<br>
		<select id="info" class="round">
			<option value="0" selected>Category ID</option>
			<option value="1">Category Name</option>
		</select>
	</div>
	<div style="float: right; width: 55%;">
		Search Value:<br>
		<input id="find" class="round" type="text">
	</div>
</div><br><br><br>
<div style="padding-top: 8px;">
	<div style="float: left; width: 35%;">
		Store In:<br>
		<select id="storage" class="round">
			${data.variables[1]}
		</select>
	</div>
	<div id="varNameContainer" style="float: right; width: 60%;">
		Variable Name:<br>
		<input id="varName" class="round" type="text">
	</div>
</div><br><br><br>
<p>You can store and edit a category using the channel actions "Store Channel Info", "Edit Channel" or "Set Channel Permission".</p>

<!-- Don't forget to copy the style below with the html above! 
This was made by EliteArtz!-->    
<style>  
  /* EliteArtz Embed CSS code */
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
	span.wrexlink {
	color: #99b3ff;
	text-decoration:underline;
	cursor:pointer;
	}
	span.wrexlink:hover { 
	color:#4676b9; 
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
},

//---------------------------------------------------------------------
// Action Bot Function
//
// This is the function for the action within the Bot's Action class.
// Keep in mind event calls won't have access to the "msg" parameter, 
// so be sure to provide checks for variable existance.
//---------------------------------------------------------------------

action: function(cache) {
	const server = cache.server;
	if(!server || !server.channels) {
		this.callNextAction(cache);
		return;
	}
	const data = cache.actions[cache.index];
	const info = parseInt(data.info);
	const find = this.evalMessage(data.find, cache);
	const channels = server.channels.filter(s=>s.type==="category")
	let result;
	switch(info) {
		case 0:
			result = channels.find(e => e.id === find);
			break;
		case 1:
			result = channels.find(e => e.name === find);
			break;
		default:
			break;
	}
	if(result !== undefined) {
		const storage = parseInt(data.storage);
		const varName = this.evalMessage(data.varName, cache);
		this.storeValue(result, storage, varName, cache);
		this.callNextAction(cache);
	} else {
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
