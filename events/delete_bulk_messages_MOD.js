module.exports = {

//---------------------------------------------------------------------
// Event Name
//
// This is the name of the event displayed in the editor.
//---------------------------------------------------------------------

name: "Delete Bulk Messages MOD",

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

fields: ["Temp Variable Name (stores list of messages):", "Temp Variable Name (stores amount of messages):"],

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

mod: function(DBM) {

	// Let's make our own namespace like the chads we are.
	DBM.LeonZ = DBM.LeonZ || {};

	// This function calls all events that use this trigger.
	DBM.LeonZ.messageDeleteBulk = function(messagesList) {
		// Grab them classes from the DBM namespace.
		const { Bot, Actions } = DBM;

		// Get all events that use this custom event trigger.
		const events = Bot.$evts["Delete Bulk Messages MOD"];

		// Ensure there are any.
		// If the user did not create any events with this trigger, this will be null.
		if(!events) return;

		// Call each one.
		const temp = {}
		const server = messagesList.array()[0].guild;
		for(let i = 0; i < events.length; i++) {
			const event = events[i];
			if(event.temp) temp[event.temp] = messagesList.array();
			if(event.temp2) temp[event.temp2] = messagesList.size;
			Actions.invokeEvent(event, server, temp);
		}
	};

	// Call the function in some sort of callback.
	// For example:
	//
	// DBM.Bot.bot.on('messageReactionAdd', DBM.Test_Event.callAllEvents);
	// 
	// or:
	//
	// setTimeout(DBM.Test_Event.callAllEvents, 2000);
	
	const onReady = DBM.Bot.onReady;
	DBM.Bot.onReady = function(...params) {
		DBM.Bot.bot.on("messageDeleteBulk", DBM.LeonZ.messageDeleteBulk);
		onReady.apply(this, ...params);
	}
	// This message will appear in the console if this mod is installed successfully at runtime.
	// console.log("Test Event registered!");
}

}; // End of module
