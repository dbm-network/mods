module.exports = {

//---------------------------------------------------------------------
// Action Name
//
// This is the name of the action displayed in the editor.
//---------------------------------------------------------------------

name: "Variable Pattern MOD",

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
	const storage = ['', 'Temp Variable', 'Server Variable', 'Global Variable'];
	return `${storage[parseInt(data.storage)]} (${data.varName})`
},

//---------------------------------------------------------------------
// Action Storage Function
//
// Stores the relevant variable info for the editor.
//---------------------------------------------------------------------

variableStorage: function (data, varType) {
	const type = parseInt(data.storage2);
	if (type !== varType) return;
	let dataType = 'String';
	return ([data.varName2, dataType]);
},


//---------------------------------------------------------------------
// Action Fields
//
// These are the fields for the action. These fields are customized
// by creating elements with corresponding IDs in the HTML. These
// are also the names of the fields stored in the action's JSON data.
//---------------------------------------------------------------------

fields: ["storage", "varName", "info", "info2", "value", "storage2", "varName2"],

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
	<div style="float: left; width: 35%;">
		Variable:<br>
		<select id="storage" class="round" onchange="glob.refreshVariableList(this)">
			${data.variables[1]}
		</select>
	</div>
	<div id="varNameContainer" style="float: right; width: 60%;">
		Variable Name:<br>
		<input id="varName" class="round" type="text" list="variableList">
	</div>
</div><br><br><br>
<div style="padding-top: 8px;">
	<div style="float: left; width: 45%;">
		Pattern Type:<br>
		<select id="info" class="round" onchange="glob.onChange1(this)">
			<option value="0">Repeat</option>
			<option value="1">Change</option>
			<option value="2">Add To Front</option>
			<option value="3">Add To End</option>
			<option value="4">Add To Specific Position</option>
			<option value="5">Store From Front</option>
			<option value="6">Store From End</option>
			<option value="7">Store One Character</option>
		</select>
	</div>
	<div style="float: right; width: 50%;" id="info2box">
		<div id="info2text">Character:</div>
		<input id="info2" class="round" type="text">
	</div>
</div><br><br><br>
<div style="padding-top: 8px;">
	<div id="info3text">Character:</div>
	<input id="value" class="round" type="text">
</div><br>
<div style="padding-top: 8px;">
	<div style="float: left; width: 35%;">
		Store In:<br>
		<select id="storage2" class="round">
			${data.variables[1]}
		</select>
	</div>
	<div id="varNameContainer" style="float: right; width: 60%;">
		Variable Name:<br>
		<input id="varName2" class="round" type="text"><br>
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

	glob.onChange1 = function(event) {
		const info3text = document.getElementById("info3text");
		if((event.value === "0" || event.value === "1" || event.value === "4") == true) {
			const info2text = document.getElementById("info2text");
			document.getElementById("info2box").style.display = null;
			if (event.value === "0") {
				info2text.innerHTML = 'Repeat Every Character';
				info3text.innerHTML = 'Repeat Character';
			} else if (event.value === "1") {
				info2text.innerHTML = 'Change From Character';
				info3text.innerHTML = 'Change To Character';
			} else if (event.value === "4") {
				info2text.innerHTML = 'Position Character';
				info3text.innerHTML = 'Add Character';
			}
		} else {
			document.getElementById("info2box").style.display = 'none';
			if ((event.value === "2" || event.value === "3") == true ) {
				info3text.innerHTML = 'Add Character';
			} else if ((event.value === "5" || event.value === "6" || event.value === "7")== true) {
				info3text.innerHTML = 'Store Number Character';
			}
		}
	};

	glob.onChange1(document.getElementById('info'));
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
	const info = parseInt(data.info);
	const value = this.evalMessage(data.value, cache);
	let result;
	if ((info == 0 || info == 1 || info == 4) == true) {
		var info2 = this.evalMessage(data.info2, cache);
	}
	switch(info) {
		case 0:
			function separators(str, length, separate) {
				var parts = str.toString().split(".");
				var replace = "\\B(?=(.{"+length+"})+(?!.))"
				var reg = new RegExp(replace,"g")
				parts[0] = parts[0].replace(new RegExp(replace,"g"), separate);
				return parts.join(".");
			}
			result = separators(variable, info2, value)
			break;
		case 1:
			function replace(str, find, replace) {
				return str.replace(new RegExp(find, 'g'), replace);
			}
			result = replace(variable, info2, value)
			break;
		case 2:
			result = value+""+variable
			break;
		case 3:
			result = variable+""+value
			break;
		case 4:
			var front = variable.slice(0,parseInt(info2));
			var end = variable.slice(parseInt(info2));
			result = front+value+end
			break;
		case 5:
			result = variable.slice(0,value)
			break;
		case 6:
			result = variable.slice(-1*parseInt(value))
			break;
		case 7:
			result = variable.slice(value,1+parseInt(value))
			break;
	}
	if (result) {
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