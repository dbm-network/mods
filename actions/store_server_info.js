module.exports = {
	//---------------------------------------------------------------------
	// Notes Section
	//
	// More Than 250 Members is deprecated please keep in mind its the #20 vaule. (do NOT remove) ~ Danno
	// given the large amount of Infos here PLEASE document everything properly so the next person that adds onto it will know whats going on. thanks ~ Danno
	//
	// 1.8.9:
	// - Added fetchMembers to probably fix the membercount cause users weren't cached ~ Lasse
	//
	// 1.9.1: Change Log: ~ Danno3817 10/03/2018 - 
	// - Scraped store_server_info_MOD, every thing is moved here to store_server_info
	// - Added Is Server Verified ~ Danno3817
	//---------------------------------------------------------------------

	//---------------------------------------------------------------------
	// Action Name
	//
	// This is the name of the action displayed in the editor.
	//---------------------------------------------------------------------

	name: "Store Server Info",

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

	subtitle: function (data) {
		const servers = [
			'Current Server', 'Temp Variable', 'Server Variable', 'Global Variable'
		];
		const info = ['Server Object', 'Server ID', 'Server Name', 'Server Name Acronym', 'Server Region', 'Server Icon URL', 'Server Verification Level', 'Server Default Channel', 'Server AFK Channel', 'Server System Channel', 'Server Default Role', 'Server Owner Member', 'Server Bot Member Object', 'Server Channel List', 'Server Role List', 'Server Member List', 'Server Emoji List', 'Server Member Count', 'Creation Date', 'Time To AFK', 'Is Server Available?', 'More than 250 members?', 'Date Bot Joined Server', 'Channel Amount', 'Emoji Amount', 'Embed Links', 'DND Members Count', 'Online Members Count (fixed)', 'Offline Members Count', 'Idle Members Count', 'Total Bots Count In Server', 'Server Channel IDs', 'Server Role IDs', 'Server Member IDs', 'Server Bot Member Count', 'Server Human Member Count', 'Server Member Count', 'Role Count', 'Text Channel Count', 'Voice Channel Count', 'Is Server Verified?', 'Banned Users List', 'Invite List'];
		return `${servers[parseInt(data.server)]} - ${info[parseInt(data.info)]}`;
	},

	//---------------------------------------------------------------------
	// DBM Mods Manager Variables (Optional but nice to have!)
	//
	// These are variables that DBM Mods Manager uses to show information
	// about the mods for people to see in the list.
	//---------------------------------------------------------------------

	// Who made the mod (If not set, defaults to "DBM Mods")
	author: "Lasse, EGGSY, EliteArtz, Danno3817 & ZockerNico",

	// The version of the mod (Defaults to 1.0.0)
	version: "1.9.5", // added in 1.9.1

	// A short description to show on the mod line for this mod (Must be on a single line)
	short_description: "Stores Server Information",

	// If it depends on any other mods by name, ex: WrexMODS if the mod uses something from WrexMods

	//---------------------------------------------------------------------

	//---------------------------------------------------------------------
	// Action Storage Function
	//
	// Stores the relevant variable info for the editor.
	//---------------------------------------------------------------------

	variableStorage: function (data, varType) {
		const type = parseInt(data.storage);
		if (type !== varType) return;
		const info = parseInt(data.info);
		let dataType = 'Unknown Type';
		switch (info) {
			case 0: // Object
				dataType = 'Guild Object';
				break;
			case 1: // ID
				dataType = 'Guild ID';
				break;
			case 2: // Name
			case 3: // Name Acronym
			case 4: // Region
				dataType = 'Text';
				break;
			case 5: // Icon URL
				dataType = 'Image URL';
				break;
			case 6: // Verification Level
			case 17: // Server Member Count
			case 19: // Time To AFK
			case 23: // Channel Amount.
			case 24: // Emoji Amount.
			case 26: // DND Members Count.
			case 27: // Online Members Count. (fixed)
			case 28: // Offline Members Count.
			case 29: // Idle Members Count.
			case 30: // Total Bots Count In Server.
			case 34: // Server Bot Member Count.
			case 35: // Server Human Member Count.
			case 36: // Server Member Count. //Added by Lasse in 
			case 37: // Role Count.
			case 38: // Text Channel
			case 39: // Voice Channel
				dataType = 'Number';
				break;
			case 7: // Default Channel
			case 8: // AFK Channel
			case 9: // System Channel
				dataType = 'Channel';
				break;
			case 10: // Default Role
				dataType = 'Role';
				break;
			case 11: // Owner Member
			case 12: // Bot Member Object
				dataType = 'Guild Member';
				break;
			case 13: // Channel List
				dataType = 'List';
				break;
			case 14: // Role List
				dataType = 'List';
				break;
			case 15: // Member List
				dataType = 'List';
				break;
			case 16: // Emoji List
				dataType = 'List';
				break;
			case 18: // Creation Date
			case 22: // Date bot Joined Server.
				dataType = "Date";
				break;
			case 20: // Is Server Avilable?
			case 21: // More Than 250 Members? //Deprecated in v1.8.5
			case 25: // Embed Links.
				dataType = "Boolean";
				break;
			case 31: // Server Channel IDs.
				dataType = 'List';
				break;
			case 32: // Server Roles IDs.
				dataType = 'List';
				break;
			case 33: // Server Member IDs.
				dataType = 'List';
				break;
			case 40: // Verified?
				dataType = 'Boolean';
				break;
			case 41: //	Collection of banned users
			case 42: //	Collection of guild invites
				dataType = 'List';
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

	fields: ["server", "varName", "info", "storage", "varName2"],

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
		<div><p>This action has been modified by DBM Mods.</p></div><br>
		<div>
			<div style="float: left; width: 35%;">
				Source Server:<br>
				<select id="server" class="round" onchange="glob.serverChange(this, 'varNameContainer')">
					${data.servers[isEvent ? 1 : 0]}
				</select>
			</div>
			<div id="varNameContainer" style="display: none; float: right; width: 60%;">
				Variable Name:<br>
				<input id="varName" class="round" type="text" list="variableList"><br>
			</div>
		</div><br><br><br>
		<div>
			<div style="padding-top: 8px; width: 70%;">
				Source Info:<br>
				<select id="info" class="round">
					<optgroup label="Standard DBM">
						<option value="0" selected>Server Object</option>
						<option value="1">Server ID</option>
						<option value="2">Server Name</option>
						<option value="3">Server Name Acronym</option>
						<option value="4">Server Region</option>
						<option value="5">Server Icon URL</option>
						<option value="6">Server Verification Level</option>
						<!--<option value="7">Server Default Channel</option>-->
						<option value="8">Server AFK Channel</option>
						<option value="9">Server System Channel</option>
						<option value="10">Server Default Role</option>
						<option value="11">Server Owner Member</option>
						<option value="12">Server Bot Member Object</option>
						<option value="13">Server Channel List</option>
						<option value="14">Server Role List</option>
						<option value="15">Server Member List</option>
						<option value="16">Server Emoji List</option>
					</optgroup>
					<optgroup label="Creation/Join Dates">
						<option value="18" selected>Servers Creation Date</option>
						<option value="22">Date Bot Joined</option>
					</optgroup>
					<optgroup label="Member Infos">
						<!--<option value="17">Server Member Count</option>-->
						<option value="30">Total Bots in Servers</option>
						<option value="34">Bot Count (Same as Total Bots In Servers)</option>
						<option value="35">Human Member Count</option>
						<option value="36">Member Count</option>
						<option value="41">Banned Member List</option>
					</optgroup>
					<optgroup label="Member Status Infos">
						<option value="27">Online Members Count</option>
						<option value="29">Idle Members Count</option>
						<option value="26">DND Members Count</option>
						<option value="28">Offline Members Count</option>
					</optgroup>
					<optgroup label="ID Infos">
						<option value="31">Server Channel IDs</option>
						<option value="32">Server Role IDs</option>
						<option value="33">Server Member IDs</option>
					</optgroup>
					<optgroup label="Channel Infos">
						<option value="23">Channel Amount</option>
						<option value="38">Text Channel Count</option>
						<option value="39">Voice Channel Count</option>
					</optgroup>			
					<optgroup label="Other">
						<option value="40">Is Server Verified?</option>
						<option value="19">Time User gets AFK</option>
						<option value="20">Is Server available?</option>
						<option value="24">Emoji Amount</option>
						<option value="25">Embeds links?</option>
						<option value="37">Role Count</option>
						<option value="42">Invite List</option>
					</optgroup>				
					<!--<option value="21">More Than 250 Members?</option>-->				
				</select>
			</div>
		</div><br>
		<div>
			<div style="float: left; width: 35%;">
				Store In:<br>
				<select id="storage" class="round">
					${data.variables[1]}
				</select>
			</div>
			<div id="varNameContainer2" style="float: right; width: 60%;">
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

	init: function () {
		const { glob, document } = this;

		glob.serverChange(document.getElementById('server'), 'varNameContainer')
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
		const server = parseInt(data.server);
		const varName = this.evalMessage(data.varName, cache);
		const info = parseInt(data.info);
		const targetServer = this.getServer(server, varName, cache);
		if (!targetServer) {
			this.callNextAction(cache);
			return;
		}
		let result;
		switch (info) {
			case 0: // Object
				result = targetServer;
				break;
			case 1: // ID
				result = targetServer.id;
				break;
			case 2: // Name
				result = targetServer.name;
				break;
			case 3: // Name Acronym
				result = targetServer.nameAcronym;
				break;
			case 4: // Region
				result = targetServer.region;
				break;
			case 5: // Icon URL
				result = targetServer.iconURL;
				break;
			case 6: // Verification Level
				result = targetServer.verificationLevel;
				break;
			case 7: // Default Channel
				result = targetServer.defaultChannel;
				break;
			case 8: // AFK Channel
				result = targetServer.afkChannel;
				break;
			case 9: // System Channel
				result = targetServer.systemChannel;
				break;
			case 10: // Default Role
				result = targetServer.defaultRole;
				break;
			case 11: // Owner Member
				result = targetServer.owner;
				break;
			case 12: // Bot Member
				result = targetServer.me;
				break;
			case 13: // Channel List
				result = targetServer.channels.array();
				break;
			case 14: // Role List
				result = targetServer.roles.array();
				break;
			case 15: // Member List
				result = targetServer.members.array();
				break;
			case 16: // Emoji List
				result = targetServer.emojis.array();
				break;
			case 17: // Member Count
				result = targetServer.members.size;
				break;
			case 18: // Creation Date.
				result = targetServer.createdAt;
				break;
			case 19: // Time To AFK.
				result = targetServer.afkTimeout;
				break;
			case 20: // Is Server Avilable?
				result = targetServer.available;
				break;
			case 21: // More Than 250 Members? //Deprecated in v1.8.5
				result = targetServer.large;
				break;
			case 22: // Date bot Joined Server.
				result = targetServer.joinedAt;
				break;
			case 23: // Channel Amount.
				result = targetServer.channels.array().length;
				break;
			case 24: // Emoji Amount.
				result = targetServer.emojis.array().length;
				break;
			case 25: // Embed Links.
				result = targetServer.embedEnabled;
				break;
			case 26: // DND Members Count.
				if (targetServer.large == true) {
					targetServer.fetchMembers();
				}
				result = targetServer.members.filter(m => m.user.presence.status == "dnd").size;
				break;
			case 27: // Online Members Count.
				if (targetServer.large == true) {
					targetServer.fetchMembers();
				}
				result = targetServer.members.filter(m => m.user.presence.status == "online").size;
				break;
			case 28: // Offline Members Count.
				if (targetServer.large == true) {
					targetServer.fetchMembers();
				}
				result = targetServer.members.filter(m => m.user.presence.status == "offline").size;
				break;
			case 29: // Idle Members Count.
				if (targetServer.large == true) {
					targetServer.fetchMembers();
				}
				result = targetServer.members.filter(m => m.user.presence.status == "idle").size;
				break;
			case 30: // Total Bots Count In Server.
				if (targetServer.large == true) {
					targetServer.fetchMembers();
				}
				result = targetServer.members.filter(m => m.user.bot).size;
				break;
			case 31: // Server Channel IDs.
				result = targetServer.channels.map(channels => channels.id);
				break;
			case 32: // Server Roles IDs.
				result = targetServer.roles.map(roles => roles.id);
				break;
			case 33: // Server Member IDs.
				if (targetServer.large == true) {
					targetServer.fetchMembers();
				}
				result = targetServer.members.map(members => members.id);
				break;
			case 34: // Server Bot Member Count.
				if (targetServer.large == true) {
					targetServer.fetchMembers();
				}
				result = targetServer.members.filter(m => m.user.bot == true).size;
				break;
			case 35: // Server Human Member Count.
				if (targetServer.large == true) {
					targetServer.fetchMembers();
				}
				result = targetServer.members.filter(m => m.user.bot == false).size;
				break;
			case 36: // Server Member Count. //Added by Lasse in 1.8.7
				if (targetServer.large == true) {
					targetServer.fetchMembers();
				}
				result = targetServer.memberCount;
				break;
			case 37: // Role Count.
				result = targetServer.roles.size;
				break;
			case 38: // Text Channel Count.
				result = targetServer.channels.filter(c => c.type == "text").size;
				break;
			case 39: // Voice Channel Count.
				result = targetServer.channels.filter(c => c.type == "voice").size;
				break;
			case 40: // Is Server Verified?
				result = targetServer.verified;
				break;
			case 41://	Collection of banned users
				targetServer.fetchBans()
				.then(bans => {
					result = bans.array();
					const storage = parseInt(data.storage);
					const varName2 = this.evalMessage(data.varName2, cache);
					this.storeValue(result, storage, varName2, cache);
				});
				break;
			case 42://	Collection of guild invites
				targetServer.fetchInvites()
				.then(invites => {
					result = invites.array();
					const storage = parseInt(data.storage);
					const varName2 = this.evalMessage(data.varName2, cache);
					this.storeValue(result, storage, varName2, cache);
				});
				break;
			default:
				break;
		};
		if (result !== undefined) {
			const storage = parseInt(data.storage);
			const varName2 = this.evalMessage(data.varName2, cache);
			this.storeValue(result, storage, varName2, cache);
		};
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

	mod: function (DBM) {
	}

}; // End of module
