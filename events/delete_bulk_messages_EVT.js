module.exports = {

	name: "Delete Bulk Messages",

	isEvent: true,

	fields: ["Temp Variable Name (stores list of messages):", "Temp Variable Name (stores amount of messages):"],

	mod: function(DBM) {
		DBM.LeonZ = DBM.LeonZ || {};

		DBM.LeonZ.messageDeleteBulk = function(messagesList) {
			const { Bot, Actions } = DBM;
			const events = Bot.$evts["Delete Bulk Messages"];
			if(!events) return;
			const server = messagesList.first().guild;
			for(let i = 0; i < events.length; i++) {
				const temp = {};
				const event = events[i];
				if(event.temp) temp[event.temp] = messagesList.array();
				if(event.temp2) temp[event.temp2] = messagesList.size;
				Actions.invokeEvent(event, server, temp);
			}
		};

		const onReady = DBM.Bot.onReady;
		DBM.Bot.onReady = function(...params) {
			DBM.Bot.bot.on("messageDeleteBulk", DBM.LeonZ.messageDeleteBulk);
			onReady.apply(this, ...params);
		};
	}
};
