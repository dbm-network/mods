module.exports = {

	//---------------------------------------------------------------------
	// Event Name
	//
	// This is the name of the event displayed in the editor.
	//---------------------------------------------------------------------

	name: "Invite Create",

	//---------------------------------------------------------------------
	// Is Event
	//
	// Must be true for this to be an event.
	//---------------------------------------------------------------------

	isEvent: true,

	//---------------------------------------------------------------------
	// Event Variables
	//
	// The variables associated with this event. Can only have 0, 1, or 2.
	//---------------------------------------------------------------------

	fields: ["Invite Created"],

	//---------------------------------------------------------------------
	// Action Bot Mod
	//
	// Upon initialization of the bot, this code is run. Using the bot's
	// DBM namespace, one can add/modify existing functions if necessary.
	// In order to reduce conflictions between mods, be sure to alias
	// functions you wish to overwrite.
	//
	// This is absolutely necessary for custom event triggers since it
	// allows us to setup callbacks for the necessary events we would
	// like to be notified about.
	//
	// The client object can be retrieved from: `const bot = DBM.Bot.bot;`
	// Classes can be retrieved also using it: `const { Actions, Event } = DBM;`
	//---------------------------------------------------------------------

	mod: function (DBM) {

		DBM.InviteCreate = DBM.InviteCreate || {};

		const { Bot, Actions } = DBM;

		DBM.InviteCreate.callAllEvents = function (invite) {

			const events = Bot.$evts["Invite Create"];

			if (!events) return;

			for (let i = 0; i < events.length; i++) {
				const event = events[i];

				const temp = {};

				if (event.temp) temp[event.temp] = invite;

				Actions.invokeEvent(event, invite.guild, temp);
			}
		};


		const onReady = Bot.onReady;

		Bot.onReady = function (...params) {
			Bot.bot.on('inviteCreate', DBM.InviteCreate.callAllEvents);
			onReady.apply(this, ...params);
		};


	}

};
