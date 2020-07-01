module.exports = {
	name: "Check If Command Exists",
	section: "Conditions",

	subtitle: function(data) {
		const results = ["Continue Actions", "Stop Action Sequence", "Jump To Action", "Jump Forward Actions"];
		return `If True: ${results[parseInt(data.iftrue)]} ~ If False: ${results[parseInt(data.iffalse)]}`;
	},

	fields: ["commandName", "iftrue", "iftrueVal", "iffalse", "iffalseVal"],

	html: function(isEvent, data) {
		return `
		<div style="width: 45%">
			Command Name:<br>
			<input id="commandName" type="text" class="round">
		</div><br>
		<div>
			${data.conditions[0]}
		</div>
		`;
	},

	init: function() {
		const { glob, document } = this;

		glob.onChangeTrue(document.getElementById("iftrue"));
		glob.onChangeFalse(document.getElementById("iffalse"));
	},

	action: function(cache) {
		const data = cache.actions[cache.index];

		const fs = require("fs");
		const jp = this.getMods().require("jsonpath");

		let commandName = this.evalMessage(data.commandName, cache);

		if (commandName.startsWith(cache.server.tag)) {
			commandName = commandName.slice(cache.server.tag.length).split(/ +/).shift();
		} else if (commandName.startsWith(this.getDBM().Files.data.settings.tag)) {
			commandName = commandName.slice(this.getDBM().Files.data.settings.tag.length).split(/ +/).shift();
		}

		const commandsFile = JSON.parse(fs.readFileSync("./data/commands.json", "utf-8"));
		const commands = jp.query(commandsFile, "$[*].name");
		const commandsAliases = jp.query(commandsFile, "$[*]._aliases");

		let result;

		if (commandName === "") {
			console.log("Please put something in 'Command Name' in the 'Check If Command Exists' action...");
			return;
		}

		const check = commands.indexOf(commandName);
		const check2 = commandsAliases.indexOf(commandName);

		if (check !== -1 || check2 !== -1) {
			result = true;
		} else {
			result = false;
		}

		this.executeResults(result, data, cache);
	},

	mod: function() {}
};
