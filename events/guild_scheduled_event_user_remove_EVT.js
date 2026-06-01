module.exports = {
  name: 'Guild Scheduled Event User Remove',
  displayName: 'Guild Scheduled Event User Remove',
  isEvent: true,

  fields: ['Temp Variable Name (stores scheduled event):', 'Temp Variable Name (stores user who left):'],

  mod(DBM) {
    DBM.Events = DBM.Events || {};
    const { Actions, Bot } = DBM;

    DBM.Events.guildScheduledEventUserRemove = async function guildScheduledEventUserRemove(event, user) {
      if (!Bot.$evts['Guild Scheduled Event User Remove']) return;

      const server = event.guild;
      for (const ev of Bot.$evts['Guild Scheduled Event User Remove']) {
        const temp = {};
        if (ev.temp) temp[ev.temp] = event;
        if (ev.temp2) temp[ev.temp2] = user;
        Actions.invokeEvent(ev, server, temp);
      }
    };

    const { onReady } = Bot;
    Bot.onReady = function guildScheduledEventUserRemoveOnReady(...params) {
      Bot.bot.on('guildScheduledEventUserRemove', DBM.Events.guildScheduledEventUserRemove);
      onReady.apply(this, ...params);
    };
  },
};
