module.exports = {

//---------------------------------------------------------------------
// Action Name
//
// This is the name of the action displayed in the editor.
//---------------------------------------------------------------------

name: "Age Calculator",

//---------------------------------------------------------------------
// Action Section
//
// This is the section the action will fall into.
//---------------------------------------------------------------------

section: "Other Stuff",

	
//---------------------------------------------------------------------
// DBM Mods Manager Variables (Optional but nice to have!)
//
// These are variables that DBM Mods Manager uses to show information
// about the mods for people to see in the list.
//---------------------------------------------------------------------

//---------------------------------------------------------------------
// Action Subtitle
//
// This function generates the subtitle displayed next to the name.
//---------------------------------------------------------------------

subtitle: function(data) {
	//const info = ['Age', 'Format'];
	const info = ['MM/DD/YYYY','DD/MM/YYYY','MM/YYYY/DD','DD/YYYY/MM','YYYY/MM/DD','YYYY/DD/MM'];
	// What user sees when previewing actions box on bottom.
	return `Convert Age from format: ${info[data.info]}`;
},

// Who made the mod (If not set, defaults to "DBM Mods")
author: "CoolGuy",

// The version of the mod (Defaults to 1.0.0)
version: "1.0.0",

// A short description to show on the mod line for this mod (Must be on a single line)
short_description: "Calculates Age based on birthday input based on your selected date format.",

// If it depends on any other mods by name, ex: WrexMODS if the mod uses something from WrexMods

//---------------------------------------------------------------------
// Action Storage Function
//
// Stores the relevant variable info for the editor.
//---------------------------------------------------------------------

variableStorage: function (data, varType) {
	const type = parseInt(data.storage);
	if (type !== varType) return;
	let dataType = 'Number';
	return ([data.varName, dataType]);
},

//---------------------------------------------------------------------
// Action Fields
//
// These are the fields for the action. These fields are customized
// by creating elements with corresponding IDs in the HTML. These
// are also the names of the fields stored in the action's JSON data.
//---------------------------------------------------------------------

//fields: ["DateOfBirth", "format", "storage", "varName"],
fields: ["DOB", "info", "storage", "varName"],

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
			Created by CoolGuy
		</p>
	</div><br>
<div style="width: 90%;">
	Date Variable or String:<br>
	<input id="DOB" class="round" type="text">
</div><br>
<div style="padding-top: 8px; width: 60%;">
	Input Date Format:
	<select id="info" class="round">
			<option value="0" selected>MM/DD/YYYY</option>
			<option value="1">DD/MM/YYYY</option>
			<option value="2">MM/YYYY/DD</option>
			<option value="3">DD/YYYY/MM</option>
			<option value="4">YYYY/MM/DD</option>
			<option value="5">YYYY/DD/MM</option>
	</select>
</div><br>
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

init: function() {},

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
	const regex = /(\.)|(\-)|(\/)|(\\)|(\,)|(\:)|(\;)|(\')|(\°)/gi;
	const replDOB = this.evalMessage(data.DOB, cache).replace(regex, ' ');
		// ['12', '23', '1990']
	const dateArr = replDOB.split(" ");
	const monthsArr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	const INFO = parseInt(data.info);
	let result;
	switch(INFO) {
		case 0:		
		// MM/DD/YYYY selected format
			// convert to DD/MM/YYYY so calc can work
		//INPUT: ['12', '23', '1990']
		var converttoformat = dateArr[1] + " " +  monthsArr[parseInt(dateArr[0])-1] + " " + dateArr[2];
		var converttodateformat = new Date(converttoformat);
		
		var calcDOB = parseInt((new Date() - converttodateformat)/60/60/24/365.242214/1000); // Precise num of days in year, not 365 or 365.25
		
		if (calcDOB < 0) {
			result = "unborn";
		} else if (calcDOB == 0) {
			result = "newborn";
		} else {
			result = calcDOB;	
		}
			break;
		
		case 1:
		// DD/MM/YYYY selected format
			// convert to DD/MM/YYYY so calc can work
		//INPUT: ['12', '23', '1990']
		var converttoformat = dateArr[0] + " " +  monthsArr[parseInt(dateArr[1])-1] + " " + dateArr[2];
		var converttodateformat = new Date(converttoformat);
		
		var calcDOB = parseInt((new Date() - converttodateformat)/60/60/24/365.242214/1000); // Precise num of days in year, not 365 or 365.25
		
		if (calcDOB < 0) {
			result = "unborn";
		} else if (calcDOB == 0) {
			result = "newborn";
		} else {
			result = calcDOB;	
		}
			break;
			
		case 2:
			// MM/YYYY/DD selected format
			// convert to DD/MM/YYYY so calc can work
		//INPUT: ['12', '1990', '23']
		var converttoformat = dateArr[2] + " " +  monthsArr[parseInt(dateArr[0])-1] + " " + dateArr[1];
		var converttodateformat = new Date(converttoformat);
		
		var calcDOB = parseInt((new Date() - converttodateformat)/60/60/24/365.242214/1000); // Precise num of days in year, not 365 or 365.25
		
		if (calcDOB < 0) {
			result = "unborn";
		} else if (calcDOB == 0) {
			result = "newborn";
		} else {
			result = calcDOB;	
		}
			break;
		case 3:
			// DD/YYYY/MM selected format
			// convert to DD/MM/YYYY so calc can work
		//INPUT: ['12', '1990', '23']
		var converttoformat = dateArr[0] + " " +  monthsArr[parseInt(dateArr[2])-1] + " " + dateArr[1];
		var converttodateformat = new Date(converttoformat);
		
		var calcDOB = parseInt((new Date() - converttodateformat)/60/60/24/365.242214/1000); // Precise num of days in year, not 365 or 365.25
		
		if (calcDOB < 0) {
			result = "unborn";
		} else if (calcDOB == 0) {
			result = "newborn";
		} else {
			result = calcDOB;	
		}
			break;
			
		case 4:
			// YYYY/MM/DD selected format
			// convert to DD/MM/YYYY so calc can work
		//INPUT: ['1990', '12', '23']
		var converttoformat = dateArr[2] + " " +  monthsArr[parseInt(dateArr[1])-1] + " " + dateArr[0];
		var converttodateformat = new Date(converttoformat);
		
		var calcDOB = parseInt((new Date() - converttodateformat)/60/60/24/365.242214/1000); // Precise num of days in year, not 365 or 365.25
		
		if (calcDOB < 0) {
			result = "unborn";
		} else if (calcDOB == 0) {
			result = "newborn";
		} else {
			result = calcDOB;	
		}
			break;
			
		case 5:
			// YYYY/DD/MM selected format
			// convert to DD/MM/YYYY so calc can work
		//INPUT: ['1990', '23', '12']
		var converttoformat = dateArr[1] + " " +  monthsArr[parseInt(dateArr[2])-1] + " " + dateArr[0];
		var converttodateformat = new Date(converttoformat);
		
		var calcDOB = parseInt((new Date() - converttodateformat)/60/60/24/365.242214/1000); // Precise num of days in year, not 365 or 365.25
		
		if (calcDOB < 0) {
			result = "unborn";
		} else if (calcDOB == 0) {
			result = "newborn";
		} else {
			result = calcDOB;	
		}
			break;
			
		default:
			break;
	}
	
	if (result !== undefined) {
		const storage = parseInt(data.storage);
		const varName = this.evalMessage(data.varName, cache);
		this.storeValue(result, storage, varName, cache);
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
