module.exports = {
  name: 'Guild Scheduled Event Update',
  displayName: 'Guild Scheduled Event Update',
  isEvent: true,

  fields: ['Temp Variable Name (stores old scheduled event):', 'Temp Variable Name (stores new scheduled event):'],

  mod(DBM) {
    DBM.Events = DBM.Events || {};
    const { Actions, Bot } = DBM;

    DBM.Events.guildScheduledEventUpdate = async function guildScheduledEventUpdate(oldEvent, newEvent) {
      if (!Bot.$evts['Guild Scheduled Event Update']) return;

      const server = newEvent.guild;
      for (const ev of Bot.$evts['Guild Scheduled Event Update']) {
        const temp = {};
        if (ev.temp) temp[ev.temp] = oldEvent;
        if (ev.temp2) temp[ev.temp2] = newEvent;
        Actions.invokeEvent(ev, server, temp);
      }
    };

    const { onReady } = Bot;
    Bot.onReady = function guildScheduledEventUpdateOnReady(...params) {
      Bot.bot.on('guildScheduledEventUpdate', DBM.Events.guildScheduledEventUpdate);
      onReady.apply(this, ...params);
    };
  },
};
