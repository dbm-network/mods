module.exports = {

	name: "Member Stop Streaming",

	isEvent: true,

	fields: ["Temp Variable Name (store voice channel):", "Temp Variable Name (store streaming member object):"],

	mod: function(DBM) {
		DBM.LeonZ = DBM.LeonZ || {};
		DBM.LeonZ.offStream = function(oldVoiceState, newVoiceState) {
			const { Bot, Actions } = DBM;
			const events = Bot.$evts["Member Stop Streaming"];
			if(!events) return;

			const oldChannel = oldVoiceState.channel;
			const newChannel = newVoiceState.channel;
			if ((!oldChannel || !oldVoiceState.streaming) || (newChannel && newVoiceState.streaming)) return;
			const server = (oldChannel || newChannel).guild;

			for (const event of events) {
				const temp = {};
				if (event.temp) temp[event.temp] = oldChannel;
				if (event.temp2) temp[event.temp2] = oldVoiceState.member;
				Actions.invokeEvent(event, server, temp);
			}
		};

		const onReady = DBM.Bot.onReady;
		DBM.Bot.onReady = function(...params) {
			DBM.Bot.bot.on("voiceStateUpdate", DBM.LeonZ.offStream);
			onReady.apply(this, ...params);
		};
	}
};
