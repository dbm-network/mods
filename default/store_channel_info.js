module.exports = {
	name: "Store Channel Info",
	section: "Channel Control",

	subtitle: function(data) {
		const channels = ["Same Channel", "Mentioned Channel", "1st Server Channel", "Temp Variable", "Server Variable", "Global Variable"];
		const info = ["Channel Object", "Channel ID", "Channel Name", "Channel Topic", "Channel Last Message", "Channel Position", "Channel Is NSFW?", "Channel Is DM?", "Channel Is Deleteable?", "Channel Creation Date", "Channel Category Name", "Created At", "Created At Timestamp"];
		return `${channels[parseInt(data.channel)]} - ${info[parseInt(data.info)]}`;
	},

	variableStorage: function(data, varType) {
		const type = parseInt(data.storage);
		if(type !== varType) return;
		const info = parseInt(data.info);
		let dataType = "Unknown Type";
		switch(info) {
			case 0:
				dataType = "Channel";
				break;
			case 1:
				dataType = "Channel ID";
				break;
			case 2:
			case 3:
				dataType = "Text";
				break;
			case 4:
				dataType = "Message";
				break;
			case 5:
				dataType = "Number";
				break;
			case 6:
			case 7:
			case 8:
				dataType = "Boolean";
				break;
			case 9:
				dataType = "Date";
				break;
			case 10:
				dataType = "Text";
				break;
			case 11:
				dataType = "Created At";
				break;
			case 12:
				dataType = "Created At Timestamp";
				break;
		}
		return ([data.varName2, dataType]);
	},

	fields: ["channel", "varName", "info", "storage", "varName2"],

	html: function(isEvent, data) {
		return `
<div><p>This action has been modified by DBM Mods.</p></div><br>
<div>
	<div style="float: left; width: 35%;">
		Source Channel:<br>
		<select id="channel" class="round" onchange="glob.channelChange(this, 'varNameContainer')">
			${data.channels[isEvent ? 1 : 0]}
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
			<option value="0" selected>Channel Object</option>
			<option value="1">Channel ID</option>
			<option value="2">Channel Name</option>
			<option value="3">Channel Topic</option>
			<option value="4">Channel Last Message</option>
			<option value="5">Channel Position</option>
			<option value="6">Channel Is NSFW?</option>
			<option value="7">Channel Is DM?</option>
			<option value="8">Channel Is Deleteable?</option>
			<option value="9">Channel Creation Date</option>
			<option value="10">Channel Category Name</option>
			<option value="11">Created At</option>
			<option value="12">Created At Timestamp</option>
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

		glob.channelChange(document.getElementById("channel"), "varNameContainer");
	},

	action: function(cache) {
		const data = cache.actions[cache.index];
		const DiscordJS = this.getDBM().DiscordJS;
		const channel = parseInt(data.channel);
		const varName = this.evalMessage(data.varName, cache);
		const info = parseInt(data.info);
		const targetChannel = this.getChannel(channel, varName, cache);
		if(!targetChannel) {
			this.callNextAction(cache);
			return;
		}
		let result;
		switch(info) {
			case 0:
				result = targetChannel;
				break;
			case 1:
				result = targetChannel.id;
				break;
			case 2:
				result = targetChannel.name;
				break;
			case 3:
				result = targetChannel.topic;
				break;
			case 5:
				result = targetChannel.position;
				break;
			case 6:
				result = targetChannel.nsfw;
				break;
			case 7:
				result = (targetChannel instanceof DiscordJS.GroupDMChannel || targetChannel instanceof DiscordJS.DMChannel);
				break;
			case 8:
				result = targetChannel.deletable;
				break;
			case 9:
				result = targetChannel.createdAt;
				break;
			case 10:
				result = targetChannel.parent.name;
				break;
			case 11:
				result = targetChannel.createdAt;
				break;
			case 12:
				result = targetChannel.createdTimestamp;
				break;
			default:
				break;
		}
		if(info === 4) {
			targetChannel.fetchMessage(targetChannel.lastMessageID).then(function(resultMessage) {
				const storage = parseInt(data.storage);
				const varName2 = this.evalMessage(data.varName2, cache);
				this.storeValue(resultMessage, storage, varName2, cache);
				this.callNextAction(cache);
			}.bind(this)).catch(this.displayError.bind(this, data, cache));
		} else if(result !== undefined) {
			const storage = parseInt(data.storage);
			const varName2 = this.evalMessage(data.varName2, cache);
			this.storeValue(result, storage, varName2, cache);
			this.callNextAction(cache);
		} else {
			this.callNextAction(cache);
		}
	},

	mod: function() {}
};
