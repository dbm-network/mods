module.exports = {
  name: 'Guild Scheduled Event User Add',
  displayName: 'Guild Scheduled Event User Add',
  isEvent: true,

  fields: ['Temp Variable Name (stores scheduled event):', 'Temp Variable Name (stores user who joined):'],

  mod(DBM) {
    DBM.Events = DBM.Events || {};
    const { Actions, Bot } = DBM;

    DBM.Events.guildScheduledEventUserAdd = async function guildScheduledEventUserAdd(event, user) {
      if (!Bot.$evts['Guild Scheduled Event User Add']) return;

      const server = event.guild;
      for (const ev of Bot.$evts['Guild Scheduled Event User Add']) {
        const temp = {};
        if (ev.temp) temp[ev.temp] = event;
        if (ev.temp2) temp[ev.temp2] = user;
        Actions.invokeEvent(ev, server, temp);
      }
    };

    const { onReady } = Bot;
    Bot.onReady = function guildScheduledEventUserAddOnReady(...params) {
      Bot.bot.on('guildScheduledEventUserAdd', DBM.Events.guildScheduledEventUserAdd);
      onReady.apply(this, ...params);
    };
  },
};
