module.exports = {

name: "Member Boosted Server",

isEvent: true,

fields: ["Member","Guild"],

mod: function(DBM) {
	DBM.RigidKeK = DBM.RigidKeK || {};

	DBM.RigidKeK.boostedGuild = function(old, recent) {
			const { Bot, Actions } = DBM;

			const events = Bot.$evts["Member Boosted Server"];
			if(!events) return;

			if (!old.premiumSince && recent.premiumSince) {
				for (let i = 0; i < events.length; i++) {
					const event = events[i];
					const temp = {};
					if(event.temp) temp[event.temp] = recent;
					if(event.temp2) temp[event.temp2] = recent.guild;

					const server = null;

					Actions.invokeEvent(event, server, temp);
				}
			}


		};

		const onReady = DBM.Bot.onReady;
			DBM.Bot.onReady = function(...params) {
					DBM.Bot.bot.on("guildMemberUpdate", DBM.RigidKeK.boostedGuild);
					onReady.apply(this, ...params);
		}
	}
};
