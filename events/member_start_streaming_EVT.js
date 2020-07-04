module.exports = {

	name: "Member Start Streaming",

	isEvent: true,

	fields: ["Temp Variable Name (store voice channel):", "Temp Variable Name (store streaming member object):"],

	mod: function(DBM) {
		DBM.LeonZ = DBM.LeonZ || {};
		DBM.LeonZ.onStream = function(oldVoiceState, newVoiceState) {
			const { Bot, Actions } = DBM;
			const events = Bot.$evts["Member Start Streaming"];
			if(!events) return;

			const oldChannel = oldVoiceState.channel;
			const newChannel = newVoiceState.channel;
			if ((!oldChannel || !newChannel) || (oldVoiceState.streaming && !newVoiceState.streaming)) return;
			const server = (oldChannel || newChannel).guild;

			for (const event of events) {
				const temp = {};
				if (event.temp) temp[event.temp] = newChannel;
				if (event.temp2) temp[event.temp2] = newVoiceState.member;
				Actions.invokeEvent(event, server, temp);
			}
		};

		const onReady = DBM.Bot.onReady;
		DBM.Bot.onReady = function(...params) {
			DBM.Bot.bot.on("voiceStateUpdate", DBM.LeonZ.onStream);
			onReady.apply(this, ...params);
		};
	}
};
