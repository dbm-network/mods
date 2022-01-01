module.exports = {
  name: 'Cron Scheduler',
  displayName: 'Scheduled Event',
  isEvent: true,

  fields: [
    'CRON String Input (<a href="#" onclick="require(\'child_process\').execSync(\'start https://crontab.guru\')">crontab.guru</a> | <a href="#" onclick="require(\'child_process\').execSync(\'start https://crontab.guru/examples.html\')">Examples</a>',
    'Timezone (<a href="#" onclick="require(\'child_process\').execSync(\'start https://en.wikipedia.org/wiki/List_of_tz_database_time_zones\')">TZ Database names</a> | Example: America/New_York )',
  ],

  mod(DBM) {
    const { Bot, Actions } = DBM;
    const Mods = Actions.getMods();
    const cron = Mods.require('node-cron');
    DBM.Events = DBM.Events || {};
    const cronScheduler = {};
    DBM.Events.cronScheduler = {};
    cronScheduler.Jobs = {};

    cronScheduler.isValidTimeZone = function isValidTimeZone(tz) {
      if (!tz) return true;
      if (!Intl || !Intl.DateTimeFormat().resolvedOptions().timeZone) {
        throw new Error('Time zones are not available in this environment');
      }

      try {
        Intl.DateTimeFormat(undefined, {
          timeZone: tz,
        });
        return true;
      } catch (ex) {
        return false;
      }
    };

    cronScheduler.setupCrons = function setupCrons() {
      if (!Bot.$evts['Cron Scheduler']) return;

      for (const event of Bot.$evts['Cron Scheduler']) {
        try {
          if (!event.temp) return;
          const eventName = event.name;
          const cronString = event.temp;
          const timeZone = event.temp2 || Intl.DateTimeFormat().resolvedOptions().timeZone;

          if (!cron.validate(cronString))
            return console.error(`[Cron Scheduler] Invalid cron string for '${eventName}': '${cronString}'`);
          if (!cronScheduler.isValidTimeZone(timeZone))
            return console.error(`[Cron Scheduler] Invalid Timezone for '${eventName}': '${timeZone}'`);

          const job = cron.schedule(
            cronString,
            () => {
              Actions.invokeEvent(event, null, {});
            },
            {
              timezone: timeZone,
            },
          );

          cronScheduler.Jobs[eventName] = job;
          console.log(
            `[Cron Scheduler] Event '${eventName}' has been Scheduled. Timezone:${timeZone}|Cron:${cronString}`,
          );
          job.start();

          if (Object.keys(cronScheduler.Jobs))
            console.log(`[Cron Scheduler] ${Object.keys(cronScheduler.Jobs).length} Jobs Scheduled.`);
        } catch (error) {
          console.error(`Event error: ${error}`);
        }
      }
    };

    const { onReady } = DBM.Bot;
    DBM.Bot.onReady = function cronSchedulerOnReady(...params) {
      cronScheduler.setupCrons();
      onReady.apply(this, ...params);
    };
  },
};
