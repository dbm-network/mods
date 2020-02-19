module.exports = {

//---------------------------------------------------------------------
// Action Name
//
// This is the name of the action displayed in the editor.
//---------------------------------------------------------------------

name: "Store Audit Log Info MOD",

//---------------------------------------------------------------------
// Action Section
//
// This is the section the action will fall into.
//---------------------------------------------------------------------

section: "Server Control",

//---------------------------------------------------------------------
// Action Subtitle
//
// This function generates the subtitle displayed next to the name.
//---------------------------------------------------------------------

subtitle: function(data) {
	const storage = ['', 'Temp Variable', 'Server Variable', 'Global Variable'];
	const info = ['Audit Log Id', 'Action', 'Executor', 'Target', 'Target Type', 'Creation Date', 'Creation Timestamp', 'Total Key Change', 'Key Change', 'Old Value', 'New Value', 'Reason', 'Extra Data'];
	return `${storage[parseInt(data.storage)]} ${data.varName} - ${info[parseInt(data.info)]}`;
},

//https://github.com/LeonZ2019/
author: "LeonZ",
version: "1.1.0",

//---------------------------------------------------------------------
// Action Storage Function
//
// Stores the relevant variable info for the editor.
//---------------------------------------------------------------------

variableStorage: function(data, varType) {
	const type = parseInt(data.storage2);
	if(type !== varType) return;
	const info = parseInt(data.info);
	let dataType = 'Unknown Type';
	switch(info) {
		case 0:
		case 6:
		case 7:
			dataType = "Number";
			break;
		case 1:
			dataType = "Audit Log Action";
			break;
		case 2:
		case 3:
		case 12:
			dataType = "Object";
			break;
		case 4:
		case 8:
		case 9:
		case 10:
		case 11:
			dataType = "Text";
			break;
		case 5:
			dataType = "Date";
			break;
	}
	return ([data.varName2, dataType]);
},

//---------------------------------------------------------------------
// Action Fields
//
// These are the fields for the action. These fields are customized
// by creating elements with corresponding IDs in the HTML. These
// are also the names of the fields stored in the action's JSON data.
//---------------------------------------------------------------------

fields: ["storage", "varName", "info", "position", "storage2", "varName2"],

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
		Audit Log Entry:<br>
		<select id="storage" class="round" onchange="glob.refreshVariableList(this)">
			${data.variables[1]}
		</select><br>
	</div>
	<div style="float: right; width: 60%;">
		Variable Name:<br>
		<input id="varName" class="round" type="text" list="variableList"><br>
	</div>
</div><br><br><br>
<div>
	<div style="float: left; width: 94%;">
		Source Info:<br>
		<select id="info" class="round" onchange="glob.onChange0(this)">
		<option value="0" selected>Audit Log Id</option>
		<option value="1">Action</option>
		<option value="2">Executor</option>
		<option value="3">Target</option>
		<option value="4">Target Type</option>
		<option value="5">Creation Date</option>
		<option value="6">Creation Timestamp</option>
		<option value="7">Total Key Change</option>
		<option value="8">Key Change</option>
		<option value="9">Old Value</option>
		<option value="10">New Value</option>
		<option value="11">Reason</option>
		<option value="12">Extra Data</option>
		</select><br>
	</div>
</div><br><br><br>
<div>
	<div id="keyholder" style="float: left; width: 104%; display: none;">
		Position of Key:<br>
		<input id="position" class="round" type="text" placeholder="Position start from 0"><br>
	</div>
</div>
<div style="padding-top: 8px;">
	<div style="float: left; width: 35%;">
		Store In:<br>
		<select id="storage2" class="round">
			${data.variables[1]}
		</select>
	</div>
	<div style="float: right; width: 60%;">
		Variable Name:<br>
		<input id="varName2" class="round" type="text">
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
	const keyholder = document.getElementById('keyholder');
	
	glob.onChange0 = function(info) {
		switch(parseInt(info.value)) {
			case 8:
			case 9:
			case 10:
				keyholder.style.display = null;
				break;
			default:
				keyholder.style.display = 'none';
				break;
		}
	}

	glob.onChange0(document.getElementById('info'));
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
	const server = cache.server;
	if (!server) {
		this.callNextAction(cache);
		return;
	}
	const storage = parseInt(data.storage);
	const varName = this.evalMessage(data.varName, cache);
	const auditLog = this.getVariable(storage, varName, cache);
	let result = false;
	let position;
	switch (parseInt(data.info)) {
		case 0:
			result = auditLog.id;
			break;
		case 1:
			result = auditLog.action;
			if (!result || typeof result == "undefined") {
				if (auditLog.target.bot && auditLog.targetType == "USER") {
					result = "ADD_BOT";
				} else if (auditLog.targetType == "MESSAGE"){
					result = "CHANNEL_MESSAGE_UPDATE";
				}
			}
			break;
		case 2:
			result = server.members.find(member => member.id == auditLog.executor.id);
			break;
		case 3:
			if (auditLog.target.constructor.name == "User") {
				result = server.members.find(member => member.id == auditLog.target.id);
			} else {
				result = auditLog.target;
			}
			break;
		case 4:
			result = auditLog.targetType;
			break;
		case 5:
			result = auditLog.createdAt;
			break;
		case 6:
			result = auditLog.createdTimestamp;
			break;
		case 7:
			if (auditLog.changes != null) {
				result = auditLog.changes.length;
			} else {
				result = undefined;
			}
			break;
		case 8:
			position = parseInt(this.evalMessage(data.position, cache));
			if (!isNaN(position) && auditLog.changes != null &&position <= auditLog.changes.length) {
				result = auditLog.changes[position].key;
			}
			break;
		case 9:
			position = parseInt(this.evalMessage(data.position, cache));
			if (!isNaN(position) && auditLog.changes != null &&position <= auditLog.changes.length) {
				result = auditLog.changes[position].old;
			}
			break;
		case 10:
			position = parseInt(this.evalMessage(data.position, cache));
			if (!isNaN(position) && auditLog.changes != null &&position <= auditLog.changes.length) {
				result = auditLog.changes[position].new;
			}
			break;
		case 11:
			if (auditLog.reason != null) {
				result = auditLog.reason;
			} else {
				result = undefined;
			}
			break;
		case 12:
			if (auditLog.reason != null) {
				result = auditLog.extra;
			} else {
				result = undefined;
			}
			break;
	}
	const storage2 = parseInt(data.storage2);
	const varName2 = this.evalMessage(data.varName2, cache);
	if (result && result != undefined) {
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