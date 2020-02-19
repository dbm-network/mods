module.exports = {

	//---------------------------------------------------------------------
	// Action Name
	//
	// This is the name of the action displayed in the editor.
	//---------------------------------------------------------------------
	
	name: "Store Audit Log List MOD",
	
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
		const storage = ['All Member', 'Mentioned User', 'Command Author', 'tempVars', 'serverVars', 'globalVars'];
		const type = {"0":"All Type","1":"Update Server","10":"Create Channel","11":"Update Channel","12":"Delete Channel","13":"Create Channel Permission","14":"Update Channel Permission","15":"Delete Channel Permission","20":"Kick Member","21":"Prune Members","22":"Ban Member","23":"Unban Member","24":"Update Member","25":"Update Member Roles","26":"Move Member","27":"Disconnect Member","28":"Add Bot","30":"Create Role","31":"Update Role","32":"Delete Role","40":"Create Invite","41":"Update Invite","42":"Delete Invite","50":"Create Webhook","51":"Update Webhook","52":"Delete Webhook","60":"Create Emoji","61":"Update Emoji","62":"Delete Emoji","72":"Delete Messages","73":"Bulk Delete Messages","74":"Pin Message","75":"Unpin Message","76":"Create Integration","77":"Update Intergration","78":"Delete Integration"}
		if (data.storage == 0 || data.storage == 1 || data.storage == 2) {
			return `Store ${storage[parseInt(data.storage)]} - ${type[parseInt(data.type)]}`;
		} else {
			return `Store ${storage[parseInt(data.storage)]}("${data.varName}") - ${type[parseInt(data.type)]}`;
		};
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
		let dataType = 'Audit Log List';
		return ([data.varName2, dataType]);
	},
	
	//---------------------------------------------------------------------
	// Action Fields
	//
	// These are the fields for the action. These fields are customized
	// by creating elements with corresponding IDs in the HTML. These
	// are also the names of the fields stored in the action's JSON data.
	//---------------------------------------------------------------------
	
	fields: ["storage", "varName", "type", "before", "after", "limit", "storage2", "varName2"],
	
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
			Filter Member:<br>
			<select id="storage" class="round" onchange="glob.onChange0(this)">
				<option value="0" selected>All</option>
				<option value="1">Mentioned User</option>
				<option value="2">Command Author</option>
				<option value="3">Temp Variable</option>
				<option value="4">Server Variable</option>
				<option value="5">Global Variable</option>
			</select><br>
		</div>
		<div id="varNameContainer" style="display: none; float: right; width: 60%;">
			Variable Name:<br>
			<input id="varName" class="round" type="text"><br>
		</div>
	</div><br><br><br>
	<div>
		<div style="float: left; width: 94%;">
			Action Type:<br>
			<select id="type" class="round">
				<option value="0" selected>All</option>
				<option value="1">Update Server</option>
				<option value="10">Create Channel</option>
				<option value="11">Update Channel</option>
				<option value="12">Delete Channel</option>
				<option value="13">Create Channel Permission</option>
				<option value="14">Update Channel Permission</option>
				<option value="15">Delete Channel Permission</option>
				<option value="20">Kick Member</option>
				<option value="21">Prune Members</option>
				<option value="22">Ban Member</option>
				<option value="23">Unban Member</option>
				<option value="24">Update Member</option>
				<option value="25">Update Member Roles</option>
				<option value="26">Move Member</option>
				<option value="27">Disconnect Member</option>
				<option value="28">Add Bot</option>
				<option value="30">Create Role</option>
				<option value="31">Update Role</option>
				<option value="32">Delete Role</option>
				<option value="40">Create Invite</option>
				<option value="41">Update Invite</option>
				<option value="42">Delete Invite</option>
				<option value="50">Create Webhook</option>
				<option value="51">Update Webhook</option>
				<option value="52">Delete Webhook</option>
				<option value="60">Create Emoji</option>
				<option value="61">Update Emoji</option>
				<option value="62">Delete Emoji</option>
				<option value="72">Delete Messages</option>
				<option value="73">Bulk Delete Messages</option>
				<option value="74">Pin Message</option>
				<option value="75">Unpin Message</option>
				<option value="76">Create Integration</option>
				<option value="77">Update Integration</option>
				<option value="78">Delete Integration</option>
			</select><br>
		</div>
	</div><br><br><br>
	<div>
		<div style="float: left; width: 48%;">
			Before Entry / Timestamp:<br>
			<input id="before" class="round" type="text" placeholder="Leave it blank for None."><br>
		</div>
		<div style="float: left; width: 51%; padding-left: 3px">
			After Entry / Timestamp:<br>
			<input id="after" class="round" type="text" placeholder="Leave it blank for None."><br>
		</div>
	</div><br><br><br>
	<div>
		<div style="float: left; width: 104%;">
			Amount to Fetch:<br>
			<input id="limit" class="round" type="text" placeholder="Leave it blank for All."><br>
		</div>
	</div><br><br><br>
	<div>
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
		const varNameContainer = document.getElementById('varNameContainer');
		
		glob.onChange0 = function(storage) {
			switch(parseInt(storage.value)) {
				case 0:
				case 1:
				case 2:
					varNameContainer.style.display = 'none';
					break;
				default:
					varNameContainer.style.display = null;
					break;
			}
		}
	
		glob.onChange0(document.getElementById('storage'));
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
		const member = parseInt(data.storage);
		let mem;
		switch (member) {
			case 0:
				break;
			default:
				const varName = this.evalMessage(data.varName, cache);
				mem = this.getMember(member-1, varName, cache);
				break;
		}
		let before = this.evalMessage(data.before, cache);
		let after = this.evalMessage(data.after, cache);
		let limit = parseInt(this.evalMessage(data.limit, cache));
		let type = parseInt(data.type);
		const options = {};
		if (type != 0) {
			options.type = type;
		} else {
			options.type = null;
		}
		if (typeof before == "object" || !isNaN(before)) {
			options.before = before;
		}
		if (typeof after == "object" || !isNaN(after)) {
			options.after = after;
		}
		if (limit && !isNaN(limit)) {
			options.limit = limit;
		}
		if (mem) {
			options.user = mem;
		}
		let result = [];
		server.fetchAuditLogs(options).then(audits => {
  			audits.entries.forEach(function(entry) {
				result.push(entry)
			  })
			const storage2 = parseInt(data.storage2);
			const varName2 = this.evalMessage(data.varName2, cache);
			if (result.length != 0) {
				this.storeValue(result, storage2, varName2, cache);
			}
			this.callNextAction(cache);
		})
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