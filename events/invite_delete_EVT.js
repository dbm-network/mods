module.exports = {
	name: "Invite Delete",

	isEvent: true,

	fields: ["Temp Variable Name (stores invite code that was deleted):"],

	mod: function(DBM) {
		DBM.LeonZ = DBM.LeonZ || {};
		DBM.LeonZ.inviteDelete = function(invite) {
			const { Bot, Actions } = DBM;
			const events = Bot.$evts["Invite Delete"];
			if(!events) return;
			const server = invite.guild;
			for (let i = 0; i < events.length; i++) {
				const temp = {};
				const event = events[i];
				if(event.temp) temp[event.temp] = invite.code;
				Actions.invokeEvent(event, server, temp);
			};
		};

		const onReady = DBM.Bot.onReady;
		DBM.Bot.onReady = function(...params) {
			DBM.Bot.bot.on("inviteDelete", DBM.LeonZ.inviteDelete);
			onReady.apply(this, ...params);
		};
	}
};