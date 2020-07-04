module.exports = {
	name: "Sends Stats to DBL",
	section: "Other Stuff",

	subtitle: function(data) {
		const info = ["Only Server Count", "Shard & Server Count"];
		return `Send ${info[parseInt(data.info)]} to DBL!`;
	},

	fields: ["dblToken", "info"],

	html: function() {
		return `
<div id="modinfo">
	<div style="float: left; width: 99%; padding-top: 8px;">
	   Your DBL Token:<br>
	   <input id="dblToken" class="round" type="text">
	</div><br>
	<div style="float: left; width: 90%; padding-top: 8px;">
		Info to Send:<br>
		<select id="info" class="round">
		<option value="0">Send Server Count Only</option>
		<option value="1">Send Shard & Server Count</option>
	</select><br>
	<p>
		• Do not send anything about shards if you don't shard your bot, otherwise it'll crash your bot!
	</p>
	</div>
</div>`;
	},

	init: function() {},

	action: function(cache) {
		const data = cache.actions[cache.index],
			token = this.evalMessage(data.dblToken, cache),
			info = parseInt(data.info),
			Mods = this.getMods(),
			fetch = Mods.require("node-fetch"),
			client = this.getDBM().Bot.bot;

		const errorHandler = (err) => console.error(`#${cache.index + 1} ${this.name}: ${err.stack}`);

		let body;
		switch (info) {
			case 0:
				body = { server_count: client.guilds.cache.size };
				fetch(`https://top.gg/api/bots/${client.user.id}/stats`, {
					body,
					headers: { Authorization: token },
					method: "POST",
				}).catch(errorHandler);
				break;
			case 1:
				body = { server_count: client.guilds.cache.size, shard_id: client.shard.id };
				fetch(`https://top.gg/api/bots/${client.user.id}/stats`, {
					body,
					headers: { Authorization: token },
					method: "POST",
				}).catch(errorHandler);
				break;
		}

		this.callNextAction(cache);
	},

	mod: function() {}
};
