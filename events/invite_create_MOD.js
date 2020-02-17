module.exports = {

name: "Invite Create MOD",

isEvent: true,

fields: ["Temp Variable Name (stores invite code):", "Temp Variable Name (stores creator of invite):"],

mod: function(DBM) {
	DBM.LeonZ = DBM.LeonZ || {};
	DBM.LeonZ.inviteCreate = function(packet) {
		const { Bot, Actions } = DBM;
		const events = Bot.$evts["Invite Create MOD"];
		if(!events) return;
		
		if (packet.t == "INVITE_CREATE") {
			const server = Bot.bot.guilds.get(packet.d.guild_id);
			const temp = {};
			const inviter = server.members.get(packet.d.inviter.id);
			for (let i = 0; i < events.length; i++) {
				const event = events[i];
				if(event.temp) temp[event.temp] = packet.d.code;
				if(event.temp2) temp[event.temp2] = inviter;
				Actions.invokeEvent(event, server, temp);
			};
		};
	};
	
	const onReady = DBM.Bot.onReady;
	DBM.Bot.onReady = function(...params) {
		DBM.Bot.bot.on("raw", DBM.LeonZ.inviteCreate);
		onReady.apply(this, ...params);
	}
}
}