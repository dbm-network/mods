module.exports = {

	//---------------------------------------------------------------------
	// Action Name
	//
	// This is the name of the action displayed in the editor.
	//---------------------------------------------------------------------

	name: "Twitch Authentication",

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

	subtitle: function (data) {
		if (data.client_id) {
			return `Authentication for client id : ${data.client_id}`
		} else {
			return `Authentication`;
		}
	},

	//---------------------------------------------------------------------
	// Action Storage Function
	//
	// Stores the relevant variable info for the editor.
	//---------------------------------------------------------------------

	variableStorage: function (data, varType) {
		const type = parseInt(data.storage);
		if (type !== varType) return;
		let dataType;
		switch (parseInt(data.info)) {
			case 0:
				dataType = "Access Token";
				break;
			case 1:
				dataType = "Expires in Seconds";
				break;
			case 2:
				dataType = "Authentication Object";
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

	fields: ["client_id", "client_secret", "info", "storage", "varName","debug"],

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

	html: function (isEvent, data) {
		return `
	<div style="padding-top: 8px;">
		<div style="float: left; width: 104%;">
			Client Id:<br>
			<input id="client_id" class="round" type="text">
		</div>
	</div><br><br><br>
	<div style="padding-top: 8px;">
		<div style="float: left; width: 104%;">
			Client Secret:<br>
			<input id="client_secret" class="round" type="text">
		</div>
	</div><br><br><br>
	<div style="padding-top: 8px;">
		<div style="float: left; width: 70%;">
			Info:<br>
			<select id="info" class="round"><br>
				<option value="0" selected>Access Token</option>
				<option value="1">Expires In</option>
				<option value="1">Authentication Object</option>
			</select>
		</div>
	<div><br><br><br>
	<div style="padding-top: 8px;">
		<div style="float: left; width: 35%;">
			Store In:<br>
			<select id="storage" class="round">
				${data.variables[1]}
			</select>
		</div>
		<div style="float: right; width: 60%;">
			Variable Name:<br>
			<input id="varName" class="round" type="text"><br>
		</div>
	</div>
	<input style="display: none" id="debug" value="true">`
	},

	//---------------------------------------------------------------------
	// Action Editor Init Code
	//
	// When the HTML is first applied to the action editor, this code
	// is also run. This helps add modifications or setup reactionary
	// functions for the DOM elements.
	//---------------------------------------------------------------------

	init: function () {
	},

	//---------------------------------------------------------------------
	// Action Bot Function
	//
	// This is the function for the action within the Bot's Action class.
	// Keep in mind event calls won't have access to the "msg" parameter,
	// so be sure to provide checks for variable existance.
	//---------------------------------------------------------------------

	action: async function (cache) {
		const data = cache.actions[cache.index];
		const Mods = this.getMods();
		const fetch = Mods.require('node-fetch');
		const client_id = this.evalMessage(data.client_id, cache);
		const client_secret = this.evalMessage(data.client_secret, cache);
		const info = parseInt(data.info);
		let url = `https://id.twitch.tv/oauth2/token?client_id=${client_id}&client_secret=${client_secret}&grant_type=client_credentials&scope=user:edit+user:read:email`;
		let oldUrl = this.getVariable(1, url + "_URL", cache);
		if (oldUrl && oldUrl == url) {
			let json = this.getVariable(1, url, cache);
			getInfo.call(this,json);
		} else {
			const res = await fetch(url,{method:"POST"});
			if (res.ok) {
				let json = await res.json();
				if (json.error) {
					console.error(json);
					return;
				} else {
					this.storeValue(json, 1, url, cache);
					this.storeValue(url, 1, url + "_URL", cache);
					getInfo.call(this,json);
				}
			} else {
				console.error("something wrong, please try again.");
				return;
			}
		}
		
		function getInfo(json) {
			let result;
			switch(info) {
				case 0:
					result = json.access_token;
					break;
				case 1:
					result = json.expires_in;
					break;
				case 2:
					result = json;
					break;
			}
			if (result) {
				const storage = parseInt(data.storage);
				const varName = this.evalMessage(data.varName, cache);
				this.storeValue(result, storage, varName, cache);
				if (data.debug) console.log("Reminder: Please do save variable, don't request access token too many times")
			}
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

	mod: function (DBM) {
	}

}; // End of module