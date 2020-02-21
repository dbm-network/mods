module.exports = {
	
name: "Member Start Streaming MOD",

isEvent: true,

fields: ["Temp Variable Name (store voice channel object):", "Temp Variable Name (store streaming member object):"],

mod: function(DBM) {
	DBM.LeonZ = DBM.LeonZ || {};
	DBM.LeonZ.onStream = function(packet) {
		const { Bot, Actions } = DBM;
		const events = Bot.$evts["Member Start Streaming MOD"];
		if(!events) return;

		if (packet.t == "VOICE_STATE_UPDATE" && packet.d.self_stream && !!packet.d.channel_id) {
			const server = Bot.bot.guilds.get(packet.d.guild_id);
			const channel = server.channels.get(packet.d.channel_id);
			const member = server.members.get(packet.d.member.user.id);
			member.streaming = true;
			const temp = {};
			for (let i = 0; i < events.length; i++) {
				const event = events[i];
				if(event.temp) temp[event.temp] = channel;
				if(event.temp2) temp[event.temp2] = member;
				Actions.invokeEvent(event, server, temp);
			};
		};
	};
	
	const onReady = DBM.Bot.onReady;
	DBM.Bot.onReady = function(...params) {
		DBM.Bot.bot.on("raw", DBM.LeonZ.onStream);
		onReady.apply(this, ...params);
	}
}
};
