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
CRON String Input (<a href='#' onclick="require('child_process').execSync('start https://crontab.guru/')">https://crontab.guru/</a> | <a href='#' onclick="require('child_process').execSync('start https://crontab.guru/examples.html')">Examples</a> | By General Wrex. <a href='#' onclick="require('child_process').execSync('start https://donorbox.org/generalwrex')">Buy me a coffee?</a>	)
`,
`
Timezone (<a href='#' onclick="require('child_process').execSync('start https://en.wikipedia.org/wiki/List_of_tz_database_time_zones')">TZ Database names</a>| Example: America/New_York )
`],

// these variables will be used by a custom installer (Optional, but nice to have)
authors: ["GeneralWrex"],
version: "1.2.0",
changeLog: "It now functions for server objects, aka find channel",
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

    DBM.Cron_Scheduler.isValidTimeZone = function(tz) {
 
        if(!tz) return true;

        if (!Intl || !Intl.DateTimeFormat().resolvedOptions().timeZone) {
            throw 'Time zones are not available in this environment';
        }

        try {
            Intl.DateTimeFormat(undefined, {timeZone: tz});
            return true;
        }
        catch (ex) {
            return false;
        }
    }

	DBM.Cron_Scheduler.setupCrons = function() {

		const events = Bot.$evts[myEvent.name];
        if(!events) return;
               
        for (const event of events) {

            try {
                if(!event.temp) return;

                const eventName  = event.name;
                const cronString = event.temp;
                const timeZone   = event.temp2 || Intl.DateTimeFormat().resolvedOptions().timeZone;
      
                if(!cron.validate(cronString)) return console.log(`[Cron Scheduler] Invalid cron string for '${eventName}': '${cronString}'`);
    
                if(!DBM.Cron_Scheduler.isValidTimeZone(timeZone)) return console.log(`[Cron Scheduler] Invalid Timezone for '${eventName}': '${timeZone}'`);
          
                const job = cron.schedule(cronString, () =>{
                    const servers = Bot.bot.guilds.array();
                    for(const server of servers) {
                        if(server) {
                            Actions.invokeEvent(event, server, {});
                        }
                    }
                },{
                    timezone: timeZone
                })
    
                DBM.Cron_Scheduler.Jobs[eventName] = job
    
                console.log(`[Cron Scheduler] Event '${eventName}' has been Scheduled. Timezone:${timeZone}|Cron:${cronString}`)
    
                job.start();
            
                if(Object.keys(DBM.Cron_Scheduler.Jobs)) console.log(`[Cron Scheduler] ${Object.keys(DBM.Cron_Scheduler.Jobs).length} Jobs Scheduled.`)
    
            } catch (error) {
                console.log(`Event error: ${error}`)
            }
        }
	};
      
    const onReady = DBM.Bot.onReady;
    DBM.Bot.onReady = function(...params) {
      DBM.Cron_Scheduler.setupCrons();
      onReady.apply(this, ...params);
    };
}

}; // End of module