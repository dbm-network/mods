module.exports = {
	name: "Find Server",
	section: "Server Control",

	subtitle: function(data) {
		const info = ["Server ID", "Server Name", "Server Name Acronym", "Server Member Count", "Server Region", "Server Owner ID", "Server Verification Level", "Server Is Available"];
		return `Find Server by ${info[parseInt(data.info)]}`;
	},

	variableStorage: function(data, varType) {
		const type = parseInt(data.storage);
		if(type !== varType) return;
		return ([data.varName, "Server"]);
	},

	fields: ["info", "find", "storage", "varName"],

	html: function(isEvent, data) {
		return `
<div>
	<div style="float: left; width: 40%;">
		Source Field:<br>
		<select id="info" class="round">
			<option value="0" selected>Server ID</option>
			<option value="1">Server Name</option>
			<option value="2">Server Name Acronym</option>
			<option value="3">Server Member Count</option>
			<option value="4">Server Region</option>
			<option value="5">Server Owner ID</option>
			<option value="6">Server Verification Level</option>
			<option value="7">Server Is Available</option>
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
		const bot = this.getDBM().Bot.bot;
		const servers = bot.guilds;
		const data = cache.actions[cache.index];
		const info = parseInt(data.info);
		const find = this.evalMessage(data.find, cache);
		let result;
		switch(info) {
			case 0:
				result = servers.find(element => element.id === find);
				break;
			case 1:
				result = servers.find(element => element.name === find);
				break;
			case 2:
				result = servers.find(element => element.nameAcronym === find);
				break;
			case 3:
				result = servers.find(element => element.memberCount === parseInt(find));
				break;
			case 4:
				result = servers.find(element => element.region === find);
				break;
			case 5:
				result = servers.find(element => element.ownerID === find);
				break;
			case 6:
				result = servers.find(element => element.verificationLevel === parseInt(find));
				break;
			case 7:
				result = servers.find(element => element.available === Boolean(find === "true"));
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
