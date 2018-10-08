module.exports = {

	//---------------------------------------------------------------------
	// Action Name
	//
	// This is the name of the action displayed in the editor.
	//---------------------------------------------------------------------

	name: "Get Bot Stats From DBL",

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
		const info = ['Invite URL', 'GitHub Repository URL', 'Website URL', 'Long Description', 'Short Description', 'Prefix', 'Library', 'Avatar URL', 'Approved On', 'Support Server Invite URL', 'Server Count', 'Shard Count', 'Vanity URL', 'Guild ID(s)', 'Servers on Shards', 'Monthly Vote Count', 'Total Vote Count', 'Owner ID(s)', 'Tag(s)', 'Username', 'Discriminator'];
		return `Get Bot's ${info[parseInt(data.info)]}`;
	},

	//---------------------------------------------------------------------
	// DBM Mods Manager Variables (Optional but nice to have!)
	//
	// These are variables that DBM Mods Manager uses to show information
	// about the mods for people to see in the list.
	//---------------------------------------------------------------------

	// Who made the mod (If not set, defaults to "DBM Mods")
	author: "EGGSY",

	// The version of the mod (Defaults to 1.0.0)
	version: "1.8.9",

	// A short description to show on the mod line for this mod (Must be on a single line)
	short_description: "Get any bot stats from Discord Bot List!",

	// If it depends on any other mods by name, ex: WrexMODS if the mod uses something from WrexMods

	//---------------------------------------------------------------------
	// Action Storage Function
	//
	// Stores the relevant variable info for the editor.
	//---------------------------------------------------------------------

	variableStorage: function (data, varType) {
		const type = parseInt(data.storage);
		if (type !== varType) return;
		let dataType = 'A DBL Stat';
		const info = parseInt(data.info);
		switch (info) {
			case 0:
				dataType = "Invite URL";
				break;
			case 1:
				dataType = "GitHub Repository URL";
				break;
			case 2:
				dataType = "Website URL";
				break;
			case 3:
				dataType = "Long Description";
				break;
			case 4:
				dataType = "Short Description";
				break;
			case 5:
				dataType = "Prefix";
				break;
			case 6:
				dataType = "Library";
				break;
			case 7:
				dataType = "Avatar URL";
				break;
			case 8:
				dataType = "Approved On";
				break;
			case 9:
				dataType = "Support Server Invite URL";
				break;
			case 10:
				dataType = "Server Count";
				break;
			case 11:
				dataType = "Shard Count";
				break;
			case 12:
				dataType = "Vanity URL";
				break;
			case 13:
				dataType = "Guild ID(s)";
				break;
			case 14:
				dataType = "Servers on Shards";
				break;
			case 15:
				dataType = "Monthly Vote Count";
				break;
			case 16:
				dataType = "Total Vote Count";
				break;
			case 17:
				dataType = "Owner ID(s)";
				break;
			case 18:
				dataType = "Tag(s)";
				break;
			case 19:
				dataType = "Username";
				break;
			case 20:
				dataType = "Discriminator";
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

	fields: ["botID", "token", "info", "storage", "varName"],

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
	   Made by EGGSY!<br>
	</p>
	<div style="float: left; width: 99%; padding-top: 8px;">
	   Bot's ID (Must be ID):<br>
	   <input id="botID" class="round" type="text">
	</div><br>
	<div style="float: left; width: 99%; padding-top: 8px;">
	   Your DBL Token:<br>
	   <input id="token" class="round" type="text">
	</div><br>
	<div style="float: left; width: 90%; padding-top: 8px;">
	   Source Info:<br>
	   <select id="info" class="round">
		<option value="0">Invite URL</option>
		<option value="1">GitHub Repository URL</option>
		<option value="2">Website URL</option>
		<option value="3">Long Description</option>
		<option value="4">Short Description</option>
		<option value="5">Prefix</option>
		<option value="6">Library</option>
		<option value="7">Avatar URL</option>
		<option value="8">Approved On</option>
		<option value="9">Support Server Invite URL</option>
		<option value="10">Server Count</option>
		<option value="11">Shard Count</option>
		<option value="12">Vanity URL (Only If Certified)</option>
		<option value="13">Guild ID(s)</option>
		<option value="14">Servers on Shards (If Sending with Module)</option>
		<option value="15">Monthly Vote Count</option>
		<option value="16">Total Vote Count</option>
		<option value="17">Owner ID(s)</option>
		<option value="18">Tag(s)</option>
		<option value="19">Bot's Username</option>
		<option value="20">Bot's Discriminator</option>
	</select>
	</div><br>
	<div style="float: left; width: 35%; padding-top: 8px;">
		Store Result In:<br>
		<select id="storage" class="round" onchange="glob.variableChange(this, 'varNameContainer')">
			${data.variables[0]}
		</select>
	</div><br><br><br><br><br>
	<div id="varNameContainer" style="float: right; display: none; width: 60%; padding-top: 8px;">
		Variable Name:<br>
		<input id="varName" class="round" type="text">
	</div><br><br><br><br>
	<div id="commentSection" style="padding-top: 8px;">
		<p>
			Some options will only work for certified or special bots. You better use some check variables to check if they exist.
			<b>Note:</b> DBL is going to update the API and you'll need a token after the update!
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
		const dblToken = this.evalMessage(data.token, cache);

		var fetch = require("node-fetch")
		fetch('https://discordbots.org/api/bots/' + botID, {
			method: 'GET',
			headers: { 'Authorization': dblToken ? dblToken : "" },
		})
			.then(res => res.json())
			.then(r => {
				switch (info) {
					case 0:
						result = r.invite;
						break;
					case 1:
						result = r.github;
						break;
					case 2:
						result = r.website;
						break;
					case 3:
						result = r.longdesc;
						break;
					case 4:
						result = r.shortdesc;
						break;
					case 5:
						result = r.prefix;
						break;
					case 6:
						result = r.lib;
						break;
					case 7:
						result = "https://cdn.discordapp.com/avatars/" + botID + "/" + r.avatar + ".png";
						break;
					case 8:
						result = r.date;
						break;
					case 9:
						result = r.support;
						break;
					case 10:
						result = r.server_count;
						break;
					case 11:
						result = r.shard_count;
						break;
					case 12:
						result = r.vanity;
						break;
					case 13:
						result = r.guilds;
						break;
					case 14:
						result = r.shards;
						break;
					case 15:
						result = r.monthlyPoints;
						break;
					case 16:
						result = r.points;
						break;
					case 17:
						result = r.owners;
						break;
					case 18:
						result = r.tags;
						break;
					case 19:
						result = r.username;
						break;
					case 20:
						result = r.discriminator;
						break;
				}

				// Storing
				const storage = parseInt(data.storage);
				const varName = this.evalMessage(data.varName, cache);
				this.storeValue(result, storage, varName, cache);

				this.callNextAction(cache);
			});

		/*
		var sf = require("snekfetch")
		sf.get('https://discordbots.org/api/bots/' + botID)
			.then(r => {
				switch (info) {
					case 0:
						result = r.invite;
						break;
					case 1:
						result = r.github;
						break;
					case 2:
						result = r.website;
						break;
					case 3:
						result = r.longdesc;
						break;
					case 4:
						result = r.shortdesc;
						break;
					case 5:
						result = r.prefix;
						break;
					case 6:
						result = r.lib;
						break;
					case 7:
						result = "https://cdn.discordapp.com/avatars/" + botID + "/" + r.avatar + ".png";
						break;
					case 8:
						result = r.date;
						break;
					case 9:
						result = r.support;
						break;
					case 10:
						result = r.server_count;
						break;
					case 11:
						result = r.shard_count;
						break;
					case 12:
						result = r.vanity;
						break;
					case 13:
						result = r.guilds;
						break;
					case 14:
						result = r.shards;
						break;
					case 15:
						result = r.monthlyPoints;
						break;
					case 16:
						result = r.points;
						break;
					case 17:
						result = r.owners;
						break;
					case 18:
						result = r.tags;
						break;
					case 19:
						result = r.username;
						break;
					case 20:
						result = r.discriminator;
						break;
				}

				// Storing
				const storage = parseInt(data.storage);
				const varName = this.evalMessage(data.varName, cache);
				this.storeValue(result, storage, varName, cache);

				this.callNextAction(cache);
			})
			.catch(e => {
				this.callNextAction(cache);
			});
		*/
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
