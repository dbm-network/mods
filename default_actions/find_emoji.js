module.exports = {
	name: "Find Custom Emoji in Specified Server",
	section: "Emoji Control",

	subtitle: function(data) {
		const info = ["Emoji ID", "Emoji Name"];
		return `Find Emoji by ${info[parseInt(data.info)]}`;
	},

	variableStorage: function(data, varType) {
		const type = parseInt(data.storage);
		if(type !== varType) return;
		return ([data.varName, "Emoji"]);
	},

	fields: ["info", "find", "storage", "varName"],

	html: function(isEvent, data) {
		return `
<div>
	<div style="float: left; width: 40%;">
		Source Field:<br>
		<select id="info" class="round">
			<option value="0" selected>Emoji ID</option>
			<option value="1">Emoji Name</option>
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
		const data = cache.actions[cache.index];
		const bot = this.getDBM().Bot.bot;
		const info = parseInt(data.info);
		const find = this.evalMessage(data.find, cache);
		let result;
		switch(info) {
			case 0:
				result = bot.emojis.cache.find((element) => element.id === find);
				break;
			case 1:
				result = bot.emojis.cache.find((element) => element.name === find);
				break;
			default:
				break;
		}
		if(result !== undefined) {
			const storage = parseInt(data.storage);
			const varName = this.evalMessage(data.varName, cache);
			this.storeValue(result, storage, varName, cache);
		}
		this.callNextAction(cache);
	},

	mod: function() {}
};
