module.exports = {

name: "Invite Delete MOD",

isEvent: true,

fields: ["Temp Variable Name (stores invite code that was deleted):"],

mod: function(DBM) {
	DBM.LeonZ = DBM.LeonZ || {};
	DBM.LeonZ.inviteDelete = function(packet) {
		const { Bot, Actions } = DBM;
		const events = Bot.$evts["Invite Delete MOD"];
		if(!events) return;
		
		if (packet.t == "INVITE_DELETE") {
			const server = Bot.bot.guilds.get(packet.d.guild_id);
			const temp = {};
			for (let i = 0; i < events.length; i++) {
				const event = events[i];
				if(event.temp) temp[event.temp] = packet.d.code;
				Actions.invokeEvent(event, server, temp);
			};
		};
	};
	
	const onReady = DBM.Bot.onReady;
	DBM.Bot.onReady = function(...params) {
		DBM.Bot.bot.on("raw", DBM.LeonZ.inviteDelete);
		onReady.apply(this, ...params);
	}
}
}
