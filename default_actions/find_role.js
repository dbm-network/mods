module.exports = {
	name: "Find Role",
	section: "Role Control",

	subtitle: function(data) {
		const info = ["Role ID", "Role Name", "Role Color", "Raw Position"];
		return `Find Role by ${info[parseInt(data.info)]}`;
	},

	variableStorage: function(data, varType) {
		const type = parseInt(data.storage);
		if(type !== varType) return;
		return ([data.varName, "Role"]);
	},

	fields: ["info", "find", "storage", "varName"],

	html: function(isEvent, data) {
		return `
<div>
	<div style="float: left; width: 40%;">
		Source Field:<br>
		<select id="info" class="round">
			<option value="0" selected>Role ID</option>
			<option value="1">Role Name</option>
			<option value="2">Role Color</option>
			<option value="3">Raw Position</option>
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
		if(!server || !server.roles) {
			this.callNextAction(cache);
			return;
		}
		const data = cache.actions[cache.index];
		const info = parseInt(data.info);
		const find = this.evalMessage(data.find, cache);
		const roles = server.roles.cache;
		let result;
		switch(info) {
			case 0:
				result = roles.find((element) => element.id === find);
				break;
			case 1:
				result = roles.find((element) => element.name === find);
				break;
			case 2:
				result = roles.find((element) => element.color === find);
				break;
			case 3:
				result = roles.find((element) => element.rawPosition === parseInt(find));
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
