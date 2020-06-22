module.exports = {
	name: "Find Voice Channel",
	section: "Channel Control",

	subtitle: function(data) {
		const info = ["Voice Channel ID", "Voice Channel Name", "Voice Channel Position", "Voice Channel User Limit", "Voice Channel Bitrate"];
		return `Find Voice Channel by ${info[parseInt(data.info)]}`;
	},

	variableStorage: function(data, varType) {
		const type = parseInt(data.storage);
		if(type !== varType) return;
		return ([data.varName, "Voice Channel"]);
	},

	fields: ["info", "find", "storage", "varName"],

	html: function(isEvent, data) {
		return `
<div>
	<div style="float: left; width: 40%;">
		Source Field:<br>
		<select id="info" class="round">
			<option value="0" selected>Voice Channel ID</option>
			<option value="1">Voice Channel Name</option>
			<option value="2">Voice Channel Position</option>
			<option value="3">Voice Channel User Limit</option>
			<option value="4">Voice Channel Bitrate</option>
		</select>
	</div>
	<div style="float: right; width: 55%;">
		Search Value:<br>
		<input id="find" class="round" type="text">
	</div>
</div><br><br><br>
<div style="padding-top: 8px;">
	<div style="float: left; width: 35%;">
		Store In:<br>
		<select id="storage" class="round">
			${data.variables[1]}
		</select>
	</div>
	<div id="varNameContainer" style="float: right; width: 60%;">
		Variable Name:<br>
		<input id="varName" class="round" type="text">
	</div>
</div>`;
	},

	init: function() {},

	action: function(cache) {
		const server = cache.server;
		if(!server || !server.channels) {
			this.callNextAction(cache);
			return;
		}
		const data = cache.actions[cache.index];
		const info = parseInt(data.info);
		const find = this.evalMessage(data.find, cache);
		const channels = server.channels.filter(function(channel) {
			return channel.type === "voice";
		});
		let result;
		switch(info) {
			case 0:
				result = channels.find((element) => element.id === find);
				break;
			case 1:
				result = channels.find((element) => element.name === find);
				break;
			case 2:
				result = channels.find((element) => element.position === find);
				break;
			case 3:
				result = channels.find((element) => element.userLimit === find);
				break;
			case 4:
				result = channels.find((element) => element.bitrate === find);
				break;
			default:
				break;
		}
		if(result !== undefined) {
			const storage = parseInt(data.storage);
			const varName = this.evalMessage(data.varName, cache);
			this.storeValue(result, storage, varName, cache);
			this.callNextAction(cache);
		} else {
			this.callNextAction(cache);
		}
	},

	mod: function() {}
};
