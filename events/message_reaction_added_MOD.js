module.exports = {

name: "Message Reaction Added MOD",

isEvent: true,

fields: ["Reaction","Member who Reacted"],

mod: function(DBM) {
	DBM.RigidKeK = DBM.RigidKeK || {};
	DBM.RigidKeK.reactionAdded = function(reaction, member) {
			const { Bot, Actions } = DBM;
			const events = Bot.$evts["Message Reaction Added MOD"];
			if(!events) return;
				for (let i = 0; i < events.length; i++) {
					const server = reaction.message.guild;
					const event = events[i];
					const temp = {};
					if(event.temp) temp[event.temp] = reaction;
					if(event.temp2) temp[event.temp2] = member; // if people struggle to get guild member here:
				//if(event.temp2) temp[event.temp2] = server.members.get(member.id);
					Actions.invokeEvent(event, server, temp);
			}
		};
		const onReady = DBM.Bot.onReady;
			DBM.Bot.onReady = function(...params) {
					DBM.Bot.bot.on("messageReactionAdd", DBM.RigidKeK.reactionAdded);
					onReady.apply(this, ...params);
		}
	}
};
