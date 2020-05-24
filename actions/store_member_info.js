module.exports = {
	name: "Store Member Info",
	section: "Member Control",

	subtitle: function(data) {
		const members = ["Mentioned User", "Command Author", "Temp Variable", "Server Variable", "Global Variable"];
		const info = ["Member Object", "Member ID", "Member Username", "Member Display Name", "Member Color", "Member Server", "Member Last Message", "Member Highest Role", "Member Hoist Role", "Member Color Role", "Member Game", "Member Status", "Member Avatar URL", "Member Role List", "Member Join Date", "Member Voice Channel", "Member Discrim", "Member Account Creation Date", "Member Tag", "Member Last Message ID", "Member Roles Amount", "Member Permissions List", "Member Custom Status", "Member Account Creation Timestamp", "Member Join Timestamp"];
		return `${members[parseInt(data.member)]} - ${info[parseInt(data.info)]}`;
	},

	variableStorage: function(data, varType) {
		const type = parseInt(data.storage);
		if(type !== varType) return;
		const info = parseInt(data.info);
		let dataType = "Unknown Type";
		switch(info) {
			case 0:
				dataType = "Server Member";
				break;
			case 1:
				dataType = "Server Member ID";
				break;
			case 2:
			case 3:
			case 10:
			case 11:
			case 16:
			case 18:
			case 22:
				dataType = "Text";
				break;
			case 4:
				dataType = "Color";
				break;
			case 5:
				dataType = "Server";
				break;
			case 6:
				dataType = "Message";
				break;
			case 7:
			case 8:
			case 9:
				dataType = "Role";
				break;
			case 12:
				dataType = "Image URL";
				break;
			case 13:
			case 21:
				dataType = "List";
				break;
			case 14:
			case 17:
				dataType = "Date";
				break;
			case 15:
				dataType = "Voice Channel";
				break;
			case 19:
				dataType = "Message ID";
				break;
			case 20:
			case 23:
			case 24:
				dataType = "Number";
				break;
		}
		return ([data.varName2, dataType]);
	},

	fields: ["member", "varName", "info", "storage", "varName2"],

	html: function(isEvent, data) {
		return `
	<div><p>This action has been modified by DBM Mods.</p></div><br>
<div>
	<div style="float: left; width: 35%;">
		Source Member:<br>
		<select id="member" class="round" onchange="glob.memberChange(this, 'varNameContainer')">
			${data.members[isEvent ? 1 : 0]}
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
			<option value="0" selected>Member Object</option>
			<option value="1">Member ID</option>
			<option value="2">Member Username</option>
			<option value="3">Member Display Name</option>
			<option value="16">Member Discrim (#XXXX)</option>
			<option value="18">Member Tag (User#XXXX)</option>
			<option value="4">Member Color</option>
			<option value="10">Member Game</option>
			<option value="11">Member Status</option>
			<option value="22">Member Custom Status</option>
			<option value="12">Member Avatar URL</option>
			<option value="5">Member Server</option>
			<option value="21">Member Permissions List</option>
			<option value="14">Member Join Date</option>
			<option value="24">Member Join Timestamp</option>
			<option value="17">Member Account Creation Date</option>
			<option value="23">Member Account Creation Timestamp</option>
			<option value="15">Member Voice Channel</option>
			<option value="6">Member Last Message</option>
			<option value="19">Member Last Message ID</option>
			<option value="13">Member Role List</option>
			<option value="20">Member Roles Amount</option>
			<option value="7">Member Highest Role</option>
			<option value="8">Member Hoist Role</option>
			<option value="9">Member Color Role</option>
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
</div>`;
	},

	init: function() {
		const { glob, document } = this;

		glob.memberChange(document.getElementById("member"), "varNameContainer");
	},

	action: function(cache) {
		const data = cache.actions[cache.index];
		const member = parseInt(data.member);
		const varName = this.evalMessage(data.varName, cache);
		const info = parseInt(data.info);
		const mem = this.getMember(member, varName, cache);
		if(!mem) {
			this.callNextAction(cache);
			return;
		}
		const server = cache.server;
		let result;
		switch(info) {
			case 0:
				result = mem;
				break;
			case 1:
				result = mem.id;
				break;
			case 2:
				if(mem.user) {
					result = mem.user.username;
				}
				break;
			case 3:
				result = mem.displayName;
				break;
			case 4:
				result = mem.displayHexColor;
				break;
			case 5:
				result = mem.guild;
				break;
			case 6:
				result = mem.lastMessage;
				break;
			case 7:
				result = mem.highestRole;
				break;
			case 8:
				result = mem.hoistRole;
				break;
			case 9:
				result = mem.colorRole;
				break;
			case 10:
				if(mem.presence && mem.presence.game) {
					result = mem.presence.game.name;
				}
				break;
			case 11:
				if(mem.presence) {
					const status = mem.presence.status;
					if(status === "online") result = "Online";
					else if(status === "offline") result = "Offline";
					else if(status === "idle") result = "Idle";
					else if(status === "dnd") result = "Do Not Disturb";
				}
				break;
			case 12:
				if(mem.user) {
					result = mem.user.displayAvatarURL;
				}
				break;
			case 13:
				if(mem.roles) {
					result = mem.roles.array();
				}
				break;
			case 14:
				result = mem.joinedAt;
				break;
			case 15:
				result = mem.voiceChannel;
				break;
			case 16:
				if(mem.user) {
					result = mem.user.discriminator;
				}
				break;
			case 17:
				if (mem.user) {
					result = mem.user.createdAt;
				}
				break;
			case 18:
				if (mem.user) {
					result = mem.user.tag;
				}
				break;
			case 19:
				result = mem.lastMessageID;
				break;
			case 20:
				result = mem.roles.size;
				break;
			case 21:
				result = mem.permissions.toArray().join(", ").replace(/_/g, " ").toLowerCase();
				break;
			case 22:
				if (mem.presence.game && mem.presence.game.type == 4) {
					result = mem.presence.game.state;
				}
				break;
			case 23:
				if (mem.user) {
					result = mem.user.createdTimestamp;
				}
				break;
			case 24:
				result = mem.joinedTimestamp;
				break;
			default:
				break;
		}
		if(result !== undefined) {
			const storage = parseInt(data.storage);
			const varName2 = this.evalMessage(data.varName2, cache);
			this.storeValue(result, storage, varName2, cache);
		}
		this.callNextAction(cache);
	},

	mod: function() {}
};
