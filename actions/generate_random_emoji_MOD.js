module.exports = {
	name: "Generate Random Emoji",
	section: "Other Stuff",

	subtitle: function(data) {
		return "Generate emoji's";
	},

	variableStorage: function(data, varType) {
		const type = parseInt(data.storage);
		if (type !== varType) return;
		let dataType = "Text";
		return ([data.varName, dataType]);
	},

	fields: ["storage", "varName"],

	html: function(isEvent, data) {
		return `
<div style="padding-top: 8px;">
<div id="varNameContainer" style="float: right; width: 60%;">
	Variable Name:<br>
	<input id="varName" class="round" type="text">
</div>
<div style="float: left; width: 35%;">
	Store In:<br>
	<select id="storage" class="round">
		${data.variables[1]}
	</select>
</div>
<div>
</div>
	`;
	},

	init: function() {},

	action: function(cache) {
		const data = cache.actions[cache.index];
		const storage = parseInt(data.storage);
		const varName = this.evalMessage(data.varName, cache);

		const emoji = require("node-emoji");
		let gg = emoji.random();
		const result = gg.emoji;
		this.storeValue(result, storage, varName, cache);
		this.callNextAction(cache);
	},

	mod: function() {}
};
