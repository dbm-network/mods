const myEvent = module.exports = {

//---------------------------------------------------------------------
// Event Name
//
// This is the name of the event displayed in the editor.
//---------------------------------------------------------------------

name: "Cron Scheduler",

displayName: "Scheduled Event",

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

fields: [`  
CRON String Input (<a onclick="require('child_process').execSync('start https://crontab.guru/)">https://crontab.guru/</a> | Examples <a onclick="require('child_process').execSync('start https://crontab.guru/examples.html)">https://crontab.guru/examples.html</a>)
`],

// these variables will be used by a custom installer (Optional, but nice to have)
authors: ["GeneralWrex"],
version: "1.0.1",
changeLog: "Initial Release",
shortDescription: "Adds cron functionality to DBM Bots.",
longDescription: "",
requiredNodeModules: [],

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

    const { Bot, Actions } = DBM;
    const wm = DBM.Actions.getWrexMods()
	const cron = wm.require('node-cron');

    DBM.Cron_Scheduler = DBM.Cron_Scheduler || {};
    DBM.Cron_Scheduler.Jobs = {};

	DBM.Cron_Scheduler.setupCrons = function() {

		const events = Bot.$evts[myEvent.name];
        if(!events) return;
               
        for (const event of events) {
            
            if(!event.temp) return;

            const cronString = event.temp;
  
            if(!cron.validate(cronString)) return console.log(`[Cron Scheduler] Invalid cron string for '${event.name}': '${cronString}'`);
      
            const job = cron.schedule(cronString, () =>{
                Actions.invokeEvent(event, null, {});   
            })

            DBM.Cron_Scheduler.Jobs[event.name] = job

            console.log(`[Cron Scheduler] Event Name '${event.name}' with the cron of '${cronString}' has been Scheduled.`)

            job.start();
        }
        if(Object.keys(DBM.Cron_Scheduler.Jobs)) console.log(`[Cron Scheduler] ${Object.keys(DBM.Cron_Scheduler.Jobs).length} Jobs Scheduled.`)

	};
      
    const onReady = DBM.Bot.onReady;
    DBM.Bot.onReady = function(...params) {
      DBM.Cron_Scheduler.setupCrons();
      onReady.apply(this, ...params);
    };
}

}; // End of module