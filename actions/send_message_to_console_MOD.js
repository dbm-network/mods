module.exports = {
	name: "Send Message to Console",
	section: "Other Stuff",

	subtitle: function(data) {
		if (data.tosend.length > 0) {
			return `<font color="${data.color}">${data.tosend}</font>`;
		} else {
			return "Please enter a message!";
		}
	},

	fields: ["tosend", "color"],

	html: function(isEvent, data) {
		return `
<div style="padding-top: 8px;">
	Message to send:<br>
	<textarea id="tosend" rows="4" style="width: 99%; font-family: monospace; white-space: nowrap; resize: none;"></textarea>
</div>`;
	},

	init: function() {},

	action: function(cache) {
		const Mods = this.getMods();
		const chalk = Mods.require("chalk");
		const data = cache.actions[cache.index];
		const send = this.evalMessage(data.tosend, cache);
		if (send.length > 0) {
			const color = this.evalMessage(data.color, cache);	// Default to #f2f2f2
			console.log(chalk.hex(color)(send));
			this.callNextAction(cache);
		} else {
			console.log(chalk.gray(`Please provide something to log: Action #${cache.index + 1}`));
			this.callNextAction(cache);
		}
	},

	mod: function(DBM) {
		DBM.Actions["Send Message to Console (Logs)"] = DBM.Actions["Send Message to Console"];
	}

};
