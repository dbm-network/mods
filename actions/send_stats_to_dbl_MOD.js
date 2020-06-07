module.exports = {
	name: "Sends Stats to DBL",
	section: "Other Stuff",

	subtitle: function(data) {
		const info = ["Only Server Count", "Shard & Server Count"];
		return `Send ${info[parseInt(data.info)]} to DBL!`;
	},

	fields: ["dblToken", "info"],

	html: function(isEvent, data) {
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
		• Use this mod inside events or commands<br>
		• Do not send anything about shards if you don't shard your bot, otherwise it'll crash your bot!
	</p>
	</div>
</div>`;
	},

	init: function() {
	},

	action: function(cache) {
		const data = cache.actions[cache.index],
			token = this.evalMessage(data.dblToken, cache),
			info = parseInt(data.info),
			snek = require("snekfetch");

		switch (info) {
			case 0:
				snek.post(`https://top.gg/api/bots/${this.getDBM().Bot.bot.user.id}/stats`)
					.set("Authorization", token)
					.send({ server_count: this.getDBM().Bot.bot.guilds.size })
					.catch(() => { });
				break;
			case 1:
				snek.post(`https://top.gg/api/bots/${this.getDBM().Bot.bot.user.id}/stats`)
					.set("Authorization", token)
					.send({ server_count: this.getDBM().Bot.bot.guilds.size, shard_id: this.getDBM().Bot.bot.shard.id })
					.catch(() => { });
				break;
		}

		this.callNextAction(cache);
	},

	mod: function() {}

};
