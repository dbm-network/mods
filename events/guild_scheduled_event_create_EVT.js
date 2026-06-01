module.exports = {
  name: 'Guild Scheduled Event Create',
  displayName: 'Guild Scheduled Event Create',
  isEvent: true,

  fields: ['Temp Variable Name (stores scheduled event):', 'Temp Variable Name (stores guild):'],

  mod(DBM) {
    DBM.Events = DBM.Events || {};
    const { Actions, Bot } = DBM;

    DBM.Events.guildScheduledEventCreate = async function guildScheduledEventCreate(event) {
      if (!Bot.$evts['Guild Scheduled Event Create']) return;

      const server = event.guild;
      for (const ev of Bot.$evts['Guild Scheduled Event Create']) {
        const temp = {};
        if (ev.temp) temp[ev.temp] = event;
        if (ev.temp2) temp[ev.temp2] = server;
        Actions.invokeEvent(ev, server, temp);
      }
    };

    const { onReady } = Bot;
    Bot.onReady = function guildScheduledEventCreateOnReady(...params) {
      Bot.bot.on('guildScheduledEventCreate', DBM.Events.guildScheduledEventCreate);
      onReady.apply(this, ...params);
    };
  },
};
