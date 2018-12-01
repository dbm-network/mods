module.exports = {

	//---------------------------------------------------------------------
	// Action Name
	//
	// This is the name of the action displayed in the editor.
	//---------------------------------------------------------------------

	name: "Get Bot Stats From DBXYZ",

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
		const info = ['Bot ID', 'Bot Name', 'Prefix', 'Bots Lib', 'Server Count', 'Short Description', 'Description', 'Avatar', 'Owner ID', 'Owner Name', 'Invite', 'Support Server', 'Website', 'Waiting For Review', 'Certified?', 'Vanity Url'];
		return `Get Bot's ${info[parseInt(data.info)]}`;
	},

	//---------------------------------------------------------------------
	// DBM Mods Manager Variables (Optional but nice to have!)
	//
	// These are variables that DBM Mods Manager uses to show information
	// about the mods for people to see in the list.
	//---------------------------------------------------------------------

	// Who made the mod (If not set, defaults to "DBM Mods")
	author: "Ohhlookitsrazorr",

	// The version of the mod (Defaults to 1.0.0)
	version: "1.9.1", //Added in 1.9.1

	// A short description to show on the mod line for this mod (Must be on a single line)
	short_description: "Get any bot stats from Discord Boats!",

	// If it depends on any other mods by name, ex: WrexMODS if the mod uses something from WrexMods

	//---------------------------------------------------------------------
	// Action Storage Function
	//
	// Stores the relevant variable info for the editor.
	//---------------------------------------------------------------------

	variableStorage: function (data, varType) {
		const type = parseInt(data.storage);
		if (type !== varType) return;
		let dataType = 'A DBXYZ Stat';
		const info = parseInt(data.info);
		switch (info) {
			case 0:
				dataType = "Bot ID";
				break;
			case 1:
				dataType = "Bot Name";
				break;
			case 2:
				dataType = "Bot Prefix";
				break;
			case 3:
				dataType = "Library";
				break;
			case 4:
				dataType = "Server Count";
				break;
			case 5:
				dataType = "Short Description";
				break;
			case 6:
				dataType = "Long Description";
				break;
			case 7:
				dataType = "Avatar";
				break;
			case 8:
				dataType = "Bot Owner ID";
				break;
			case 9:
				dataType = "Bot Owner Name";
				break;
			case 10:
				dataType = "Bot Invite";
				break;
			case 11:
				dataType = "Support Server";
				break;
			case 12:
				dataType = "Website";
				break;
			case 13:
				dataType = "Waiting For Approval?";
				break;
			case 14:
				dataType = "Certified?";
				break;
			case 15:
				dataType = "Vanity Url";
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

	fields: ["botID", "info", "storage", "varName"],

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
<div id="modinfo">
	<p>
	   <u>Mod Info:</u><br>
	   Made by Ohhlookitsrazorr!<br>
	</p>
	<div style="float: left; width: 99%; padding-top: 8px;">
	   Bot's ID (Must be ID):<br>
	   <input id="botID" class="round" type="text">
	</div><br>
	<div style="float: left; width: 90%; padding-top: 8px;">
	   Source Info:<br>
	   <select id="info" class="round">
		<option value="0">Bot ID</option>
		<option value="1">Bot Name</option>
		<option value="2">Bot Prefix</option>
		<option value="3">Library</option>
		<option value="4">Server Count</option>
		<option value="5">Short Description</option>
		<option value="6">Long Description</option>
		<option value="7">Avatar</option>
		<option value="8">Owner ID</option>
		<option value="9">Owner Name</option>
		<option value="10">Bots Invite</option>
		<option value="11">Support Url</option>
		<option value="12">Website</option>
		<option value="13">Waiting For Approval?</option>
		<option value="14">Certified?</option>
		<option value="15">Vanity Url (Only if certified)</option>
	</select>
	</div><br>
	<div style="float: left; width: 35%; padding-top: 8px;">
		Store Result In:<br>
		<select id="storage" class="round" onchange="glob.variableChange(this, 'varNameContainer')">
			${data.variables[0]}
		</select>
	</div><br><br><br>
	<div id="varNameContainer" style="float: right; display: none; width: 60%; padding-top: 8px;">
		Variable Name:<br>
		<input id="varName" class="round" type="text">
	</div><br><br><br><br>
	<div id="commentSection" style="padding-top: 8px;">
		<p>
		Some options will only work for certified or special bots. You better use some check variables to check if they exist.
		</p>
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

	init: function () {
		const { glob, document } = this;

		glob.variableChange(document.getElementById('storage'), 'varNameContainer');
	},

	//---------------------------------------------------------------------
	// Action Bot Function
	//
	// This is the function for the action within the Bot's Action class.
	// Keep in mind event calls won't have access to the "msg" parameter, 
	// so be sure to provide checks for variable existance.
	//---------------------------------------------------------------------

	action: function (cache) {

		const data = cache.actions[cache.index];
		const botID = this.evalMessage(data.botID, cache);
		const info = parseInt(data.info);
		var sf = require("snekfetch")

		sf.get('https://discordboats.xyz/api/bot/' + botID)
			.then(r => {
				switch (info) {
					case 0:
						result = r.body.id;
						break;
					case 1:
						result = r.body.name;
						break;
					case 2:
						result = r.body.prefix;
						break;
					case 3:
						result = r.body.lib;
						break;
					case 4:
						result = r.body.server_count;
						break;
					case 5:
						result = r.body.shortDesc;
						break;
					case 6:
						result = r.body.desc;
						break;
					case 7:
						result = "https://cdn.discordapp.com/avatars/" + botID + "/" + r.body.avatar + ".png";
						break;
					case 8:
						result = r.body.ownerid;
						break;
					case 9:
						result = r.body.ownername;
						break;
					case 10:
						result = r.body.invite;
						break;
					case 11:
						result = r.body.discord;
						break;
					case 12:
						result = r.body.website;
						break;
					case 13:
						result = r.body.inQueue;
						break;
					case 14:
						result = r.body.certified;
						break;
					case 15:
						result = r.body.vanity_url;
						break;
				}

				// Storing
				if (result !== undefined) {
					const storage = parseInt(data.storage);
					const varName = this.evalMessage(data.varName, cache);
					this.storeValue(result, storage, varName, cache);
				}
				this.callNextAction(cache);
			})
			.catch(e => {
				console.log('Get Stats From DBXYZ Error:'+ '\n' + e.stack)
			});
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
