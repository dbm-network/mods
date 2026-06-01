module.exports = {
  name: 'Guild Scheduled Event Delete',
  displayName: 'Guild Scheduled Event Delete',
  isEvent: true,

  fields: ['Temp Variable Name (stores scheduled event):', 'Temp Variable Name (stores guild):'],

  mod(DBM) {
    DBM.Events = DBM.Events || {};
    const { Actions, Bot } = DBM;

    DBM.Events.guildScheduledEventDelete = async function guildScheduledEventDelete(event) {
      if (!Bot.$evts['Guild Scheduled Event Delete']) return;

      const server = event.guild;
      for (const ev of Bot.$evts['Guild Scheduled Event Delete']) {
        const temp = {};
        if (ev.temp) temp[ev.temp] = event;
        if (ev.temp2) temp[ev.temp2] = server;
        Actions.invokeEvent(ev, server, temp);
      }
    };

    const { onReady } = Bot;
    Bot.onReady = function guildScheduledEventDeleteOnReady(...params) {
      Bot.bot.on('guildScheduledEventDelete', DBM.Events.guildScheduledEventDelete);
      onReady.apply(this, ...params);
    };
  },
};
