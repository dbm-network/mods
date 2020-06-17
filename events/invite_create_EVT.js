module.exports = {
	name: "Invite Create",

	isEvent: true,

	fields: ["Temp Variable Name (stores invite code):", "Temp Variable Name (stores creator of invite):"],

	mod: function(DBM) {
		DBM.LeonZ = DBM.LeonZ || {};
		DBM.LeonZ.inviteCreate = function(invite) {
			const { Bot, Actions } = DBM;
			const events = Bot.$evts["Invite Create"];
			if(!events) return;
			const server = invite.guild;
			for (let i = 0; i < events.length; i++) {
				const temp = {};
				const event = events[i];
				if(event.temp) temp[event.temp] = invite.code;
				if(event.temp2) temp[event.temp2] = invite.inviter;
				Actions.invokeEvent(event, server, temp);
			};
		};

		const onReady = DBM.Bot.onReady;
		DBM.Bot.onReady = function(...params) {
			DBM.Bot.bot.on("inviteCreate", DBM.LeonZ.inviteCreate);
			onReady.apply(this, ...params);
		};
	}
};