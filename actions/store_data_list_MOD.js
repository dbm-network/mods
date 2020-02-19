module.exports = {

//---------------------------------------------------------------------
// Action Name
//
// This is the name of the action displayed in the editor.
//---------------------------------------------------------------------

name: "Store Data List MOD",

//---------------------------------------------------------------------
// Action Section
//
// This is the section the action will fall into.
//---------------------------------------------------------------------

section: "Other Stuff",

//---------------------------------------------------------------------
// Action Subtitle
//
// This function generates the subtitle displayed next to the name.
//---------------------------------------------------------------------

subtitle: function(data) {
	const files = ['players.json', 'servers.json'];
	return `${files[parseInt(data.File)]} - ${(data.dataName)}`;
},

//https://github.com/LeonZ2019/
author: "LeonZ",
version: "1.1.0",

variableStorage: function (data, varType) {
	const type = parseInt(data.storage);
	if (type !== varType) return;
	const resultInfo = parseInt(data.resultInfo);
	let dataType = 'Unknown Type';
	switch(resultInfo) {
		case 0:
			dataType = 'List';
			break;
		case 1:
			dataType = "Number";
			break;
	}
	return ([data.varName, dataType]);
},

//---------------------------------------------------------------------
// Action Fields
//
// These are the fields for the action. These fields are customized
// by creating elements with corresponding IDs in the HTML. These
// are also the names of the fields stored in the action's JSON data.
//---------------------------------------------------------------------

fields: ["File", "serverType", "dataName", "sort", "numberBoolean", "resultFormat", "resultInfo", "rank", "resultType", "resultFrom", "resultTo", "varName", "storage"],

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
<div style="width: 550px; height: 350px; overflow-y: scroll;">
	<div>
		<div style="float: left; width: 35%;">
			Data File:<br>
			<select id="File" class="round" onchange="glob.onChange0(this)">
				<option value="0" selected>players.json</option>
				<option value="1">servers.json</option>
			</select>
		</div>
		<div id="Input0" style="padding-left: 5%; display: none; float: left; width: 60%;">
			Store by server type:<br>
			<select id="serverType" class="round">
				<option value="0" selected>Current Server</option>
				<option value="1">All Servers</option>
			</select>
		</div>
	</div><br><br><br>
	<div>
		<div style="float: left; width: 39%;">
			Data Name:<br>
			<input id="dataName" class="round" type="text" placeholder="Must fill in"><br>
		</div>
		<div style="padding-left: 1%; float: left; width: 56%;">
			Sort By:<br>
			<select id="sort" class="round">
				<option value="0" selected>Sort from Descending</option>
				<option value="1">Sort from Ascending</option>
			</select><br>
		</div>
	</div><br>
	<div>
		<div style="float: left; width: 35%;">
			Store Result Info:<br>
			<select id="resultInfo" class="round" onchange="glob.onChange1(this)">
				<option value="0" selected>Results List</option>
				<option value="1">Ranking</option>
			</select><br>
		</div>
		<div id="Result0" style="padding-left: 5%; display: null; float: left; width: 60%;">
			Store Result List:<br>
			<select id="resultType" class="round" onchange="glob.onChange2(this)">
				<option value="0" selected>All Results</option>
				<option value="1">Result From Begin</option>
				<option value="2">Result To End</option>
				<option value="3">Result From Specific</option>
			</select><br>
		</div>
		<div id="Result1" style="padding-left: 5%; display: none; float: left; width: 62%;">
			Store Ranking:<br>
			<input id="rank" class="round" type="text" placeholder="Input Member ID here"><br>
		</div>
	</div><br>
	<div>
		<div id="Input1" style="display: null; float: left; width: 35%;">
			Number Before Start:<br>
			<select id="numberBoolean" class="round">
				<option value="0"selected>No</option>
				<option value="1" >Yes</option>
			</select><br>
		</div>
		<div id="Input2" style="display: null; padding-left: 5%; float: left; width: 65%;">
			Result Format (Javascript String):<br>
			<input id="resultFormat" class="round" type="text" placeholder="Name + 'DataName' + DataValue"><br>
		</div>
	</div><br>
	<div>
		<div id="Input3" style="display: none; float: left; width: 50%;">
			Result From:<br>
			<input id="resultFrom" class="round" type="text"><br>
		</div>
		<div id="Input4" style="display: none; float: left; width: 50%;">
			Result To:<br>
			<input id="resultTo" class="round" type="text"><br>
		</div>
	</div>
	<div style="padding-top: 5px;">
		<div style="float: left; width: 35%;">
			Store In:<br>
			<select id="storage" class="round">
				${data.variables[1]}
			</select>
		</div>
		<div style="float: right; width: 61%;">
			Variable Name:<br>
			<input id="varName" class="round" type="text">
		</div>
	</div>
</div>`;
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
	const Input0 = document.getElementById('Input0');
	const Input1 = document.getElementById('Input1');
	const Input2 = document.getElementById('Input2');
	const Input3 = document.getElementById('Input3');
	const Input4 = document.getElementById('Input4');
	const Result0 = document.getElementById('Result0');
	const Result1 = document.getElementById('Result1');
	const resultType = document.getElementById('resultType');
	const rank = document.getElementById('rank');
	
	glob.onChange0 = function(File) {
		switch(parseInt(File.value)) {
			case 0:
				Input0.style.display = null;
				rank.placeholder = "Input Member ID here"
				break;
			case 1:
				Input0.style.display = 'none';
				rank.placeholder = "Input Server ID here"
				break;
		}
	}
	
	glob.onChange1 = function(resultInfo) {
		switch(parseInt(resultInfo.value)) {
			case 0:
				Result0.style.display = null;
				Result1.style.display = 'none';
				Input1.style.display = null;
				Input2.style.display = null;
				break;
			case 1:
				Result0.style.display = 'none';
				Result1.style.display = null;
				Input1.style.display = 'none';
				Input2.style.display = 'none';
				Input3.style.display = 'none';
				Input4.style.display = 'none';
				break;
		}
	}
	
	glob.onChange2 = function(resultType) {
		switch(parseInt(resultType.value)) {
			case 0:
				Input3.style.display = 'none';
				Input4.style.display = 'none';
				break;
			case 1:
				Input3.style.display = 'none';
				Input4.style.display = null;
				Input3.style.width = '0%';
				Input4.style.width = '100%';
				break;
			case 2:
				Input3.style.display = null;
				Input4.style.display = 'none';
				Input3.style.width = '100%';
				Input4.style.width = '0%';
				break;
			case 3:
				Input3.style.display = null;
				Input4.style.display = null;
				Input3.style.width = '50%';
				Input4.style.width = '50%';
				break;
		}
	}
	
	glob.onChange0(document.getElementById('File'));
	glob.onChange1(document.getElementById('resultInfo'));
	glob.onChange2(document.getElementById('resultType'));
},

//---------------------------------------------------------------------
// Action Bot Function
//
// This is the function for the action within the Bot's Action class.
// Keep in mind event calls won't have access to the "msg" parameter, 
// so be sure to provide checks for variable existance.
//---------------------------------------------------------------------

action: function(cache) {
	const Discord = require('discord.js');
	const fastsort = require('fast-sort');
	const fs = require('fs');
	const data = cache.actions[cache.index];
	const File = parseInt(data.File);
	let file, serverType;
	if (File == 0) {
		serverType = parseInt(data.serverType);
		file = JSON.parse(fs.readFileSync("./data/players.json", 'utf8'));
	} else {
		file = JSON.parse(fs.readFileSync("./data/servers.json", 'utf8'));
	}
	let array0 = [];
	let result = [];
	const dataName = this.evalMessage(data.dataName, cache);
	const sort = parseInt(data.sort);
	const numberBoolean = parseInt(data.numberBoolean);
	const resultInfo = parseInt(data.resultInfo);
	let resultFormat = String(this.evalMessage(data.resultFormat, cache));
	if (resultInfo == 0) {
		if (!resultFormat) {
			resultFormat = String('Name + " " + DataValue');
		}
	}
	const resultType = parseInt(data.resultType);
	const rank = this.evalMessage(data.rank, cache);
	const storage = parseInt(data.storage);
	const varName = this.evalMessage(data.varName, cache);
	
	let objectid, value, name;
	for (id in file) {
		if (file[id][dataName] || typeof file[id][dataName] === "number") {
			switch (File) {
				case 0:
					switch (serverType) {
						case 0:
							object = cache.msg.guild.members.get(id);
							break;
						case 1:
							object = this.getDBM().Bot.bot.users.find(element => element.id === id);
							break;
					}

					if (object) {
						objectid = object.id;
						value = file[id][dataName];
						name = (object.tag || object.user.tag);
						array0.push({id:objectid,data:value,name:name});
					}
					break;
				case 1:
					object = this.getDBM().Bot.bot.guilds.find(element => element.id === id);
					if (object) {
						objectid = object.guild.id;
						value = file[id][dataName];
						name = object.guild.name;
						array0.push({id:objectid,data:value,name:name});
					}
					break;
			}
		}
	}
	switch (sort) {
		case 0:
			result = fastsort(array0).desc(u => parseInt(u.data));
			break;
		case 1:
			result = fastsort(array0).asc(u => parseInt(u.data));
			break;
	}
	for (var i = 0; i < result.length; i++) {
		result[i].rank = i + 1;
	}
	switch (resultInfo) {
		case 0:
			let result0, Name, DataValue;
			let array1 = [];
			let resultFrom, resultTo;
			switch (resultType) {
				case 0:
					resultFrom = 0;
					resultTo = result.length;
					break;
				case 1:
					resultFrom = 0;
					resultTo = parseInt(this.evalMessage(data.resultTo, cache));
					break;
				case 2:
					resultFrom = parseInt(this.evalMessage(data.resultFrom, cache));
					resultTo = parseInt(this.evalMessage(data.resultTo, cache));
					break;
		
			}
			if (result.length < resultTo) {
				resultTo = result.length
			}
			for (; resultFrom < resultTo; resultFrom++) {
				Name = result[resultFrom].name;
				DataValue = result[resultFrom].data;
				if (numberBoolean == 0) {
					array1.push(eval(resultFormat) + '\n');
				} else {
					array1.push(result[resultFrom].rank + eval(resultFormat) + '\n');
				}
			}
			array1 = array1.join("");
			this.storeValue(array1, storage, varName, cache);
			break;
		case 1:
			if (rank) {
				for (var i = 0; i < result.length; i++) {
					if (result[i].id == rank) {
						var result1 = result[i].rank;
						this.storeValue(result1, storage, varName, cache);
						break;
					}
				}
			}
			break;
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