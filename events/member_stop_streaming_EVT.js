module.exports = {

name: "Member Stop Streaming MOD",

isEvent: true,

fields: ["Temp Variable Name (store streaming member object):"],

mod: function(DBM) {
	DBM.LeonZ = DBM.LeonZ || {};
	DBM.LeonZ.offStream = function(packet) {
		const { Bot, Actions } = DBM;
		const events = Bot.$evts["Member Stop Streaming MOD"];
		if(!events) return;

		if (packet.t == "VOICE_STATE_UPDATE") {
			const server = Bot.bot.guilds.get(packet.d.guild_id);
			const member = server.members.get(packet.d.member.user.id);
			if ((!packet.d.self_stream && !!packet.d.channel_id && member.streaming) || (packet.d.self_stream && !packet.d.channel_id && member.streaming)) {
				member.streaming = false;
				const temp = {};
				for (let i = 0; i < events.length; i++) {
					const event = events[i];
					if(event.temp) temp[event.temp] = member;
					Actions.invokeEvent(event, server, temp);
				};
			};
		};
	};
	
	const onReady = DBM.Bot.onReady;
	DBM.Bot.onReady = function(...params) {
		DBM.Bot.bot.on("raw", DBM.LeonZ.offStream);
		onReady.apply(this, ...params);
	}
}
};
