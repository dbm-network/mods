module.exports = {
	name: "Stop Bot",
	section: "Bot Client Control",

	subtitle: function(data) {
		return "Stops bot";
	},

	fields: [],

	html: function(isEvent, data) {
		return `
<div>
	<p>
		<u>Warning:</u><br>
		This action stops the bot. You cannot restart it with a command!<br>
		Choose the permissions for this command/event carefully!
	</p>
</div>`;
	},

	init: function() {},

	action: function(cache) {
		const data = cache.actions[cache.index];
		console.log("Stopped bot!");
		this.getDBM().Bot.bot.destroy();
	},

	mod: function() {}
};
