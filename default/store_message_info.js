module.exports = {
	name: "Store Message Info",
	section: "Messaging",

	subtitle: function(data) {
		const message = ["Command Message", "Temp Variable", "Server Variable", "Global Variable"];
		const info = ["Message Object", "Message ID", "Message Text", "Message Author", "Message Channel", "Message Timestamp", "", "", "Message Edited At", "Message Edits History", "", "", "Messages Different Reactions Count", "Mentioned Users List", "Mentioned Users Count", "Message URL", "Message Creation Date", "Message Length", "Message Attachments Count", "Message Guild", "Message Type", "Message Webhook ID", "Message Embed Object"];
		return `${message[parseInt(data.message)]} - ${info[parseInt(data.info)]}`;
	},

	variableStorage: function(data, varType) {
		const type = parseInt(data.storage);
		if(type !== varType) return;
		const info = parseInt(data.info);
		let dataType = "Unknown Type";
		switch(info) {
			case 0:
				dataType = "Message";
				break;
			case 1:
				dataType = "Message ID";
				break;
			case 2:
				dataType = "Text";
				break;
			case 3:
				dataType = "Server Member";
				break;
			case 4:
				dataType = "Channel";
				break;
			case 5:
				dataType = "Text";
				break;
			case 8:
			case 16:
				dataType = "Date";
				break;
			case 9:
			case 13:
				dataType = "Array";
				break;
			case 12:
			case 14:
			case 17:
			case 18:
				dataType = "Number";
				break;
			case 15:
				dataType = "URL";
				break;
			case 19:
				dataType = "Guild";
				break;
			case 20:
				dataType = "Message Type";
				break;
			case 21:
				dataType = "Webhook ID";
				break;
			case 22:
				dataType = "Embed Message";
				break;
		}
		return ([data.varName2, dataType]);
	},

	fields: ["message", "varName", "info", "storage", "varName2"],

	html: function(isEvent, data) {
		return `
		<div><p>This action has been modified by DBM Mods.</p></div><br>
	<div>
		<div style="float: left; width: 35%;">
			Source Message:<br>
			<select id="message" class="round" onchange="glob.messageChange(this, 'varNameContainer')">
				${data.messages[isEvent ? 1 : 0]}
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
			<optgroup label="Main">
				<option value="0" selected>Message Object</option>
				<option value="1">Message ID</option>
				<option value="2">Message Text</option>
				<option value="17">Message Length</option>
				<option value="3">Message Author</option>
				<option value="4">Message Channel</option>
				<option value="19">Message Guild</option>
				<option value="20">Message Type</option>
				<option value="16">Message Creation Date</option>
				<option value="5">Message Timestamp</option>
				<option value="15">Message URL</option>
				<option value="22">Message Embed Object</option>
			</optgroup>
			<optgroup label="Others">
				<option value="8">Message Edited At</option>
				<option value="9">Message Edit History</option>
				<option value="12">Messages Different Reactions Count</option>
				<option value="13">Messages Mentioned Users List</option>
				<option value="14">Messages Mentioned Users Count</option>
				<option value="18">Message Attachments Count</option>
				<option value="21">Message Webhook ID</option>
			</optgroup>
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

		glob.messageChange(document.getElementById("message"), "varNameContainer");
	},

	action: function(cache) {
		const data = cache.actions[cache.index];
		const message = parseInt(data.message);
		const DiscordJS = require("discord.js");
		const varName = this.evalMessage(data.varName, cache);
		const info = parseInt(data.info);
		const msg = this.getMessage(message, varName, cache);
		if(!msg) {
			this.callNextAction(cache);
			return;
		}
		let result;
		switch(info) {
			case 0:
				result = msg;
				break;
			case 1:
				result = msg.id;
				break;
			case 2:
				result = msg.content;
				break;
			case 3:
				if(msg.member) {
					result = msg.member;
				} else if (msg.recipient) {
					result = msg.recipient; // Used for DM Channels
				}
				break;
			case 4:
				result = msg.channel;
				break;
			case 5:
				result = msg.createdTimestamp;
				break;
			case 8:
				result = msg.editedAt;
				break;
			case 9:
				result = msg.edits;
				break;
			case 12:
				result = msg.reactions.array().length;
				break;
			case 13:
				result = msg.mentions.users.array();
				break;
			case 14:
				result = msg.mentions.users.array().length;
				break;
			case 15:
				result = msg.url;
				break;
			case 16:
				result = msg.createdAt;
				break;
			case 17:
				result = msg.content.length;
				break;
			case 18:
				result = msg.attachments.array().length;
				break;
			case 19:
				result = msg.guild;
				break;
			case 20:
				result = msg.type;
				break;
			case 21:
				result = msg.webhookID;
				break;
			case 22:
				if (msg.embeds.length != 0) {
					const embed = msg.embeds[0];
					delete embed.message;
					if (embed.author != null) {
						delete embed.author.embed;
					}
					if (embed.image != null) {
						delete embed.image.embed;
					}
					if (embed.thumbnail !== null) {
						delete embed.thumbnail.embed;
					}
					if (embed.footer != null) {
						delete embed.footer.embed;
					}
					result = new DiscordJS.RichEmbed(embed);
				}
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

