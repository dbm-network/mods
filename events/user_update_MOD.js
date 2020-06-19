module.exports = {
name: "User Update",
isEvent: true,
fields: ["User Before Update", "User After Update"],
mod: function(DBM) {
	DBM.RigidKeK = DBM.RigidKeK || {};
	DBM.RigidKeK.callUserUpdate = function(pre, post) {
		const { Bot, Actions } = DBM;
		const events = Bot.$evts["User Update"];
		if(!events) return;
		for(let i = 0; i < events.length; i++) {
			const event = events[i];
			const temp = {};
			if(event.temp) temp[event.temp] = pre;
			if(event.temp2) temp[event.temp2] = post;
			const server = null;
			Actions.invokeEvent(event, server, temp);
		}
	};
	const onReady = DBM.Bot.onReady;
	DBM.Bot.onReady = function(...params) {
		DBM.Bot.bot.on('userUpdate', DBM.RigidKeK.callUserUpdate);
		onReady.apply(this, ...params);
	}
	
}
};
