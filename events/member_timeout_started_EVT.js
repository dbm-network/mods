module.exports = {
  name: 'Member Timeout Started',
  isEvent: true,

  fields: [
    'Temp Variable Name (stores member that was timed out):',
    'Temp Variable Name (stores timeout duration in milliseconds):',
    'Temp Variable Name (stores reason if provided):',
  ],

  mod(DBM) {
    DBM.Events = DBM.Events || {};
    const { Actions, Bot } = DBM;

    DBM.Events.memberTimeoutStarted = function memberTimeoutStarted(oldMember, newMember) {
      if (!Bot.$evts['Member Timeout Started']) return;

      // Check if member was timed out (communicationDisabledUntil changed from null to a future date)
      const oldTimeout = oldMember.communicationDisabledUntil;
      const newTimeout = newMember.communicationDisabledUntil;

      // Timeout started if old was null/expired and new is in the future
      const wasTimedOut =
        (!oldTimeout || oldTimeout.getTime() <= Date.now()) && newTimeout && newTimeout.getTime() > Date.now();

      if (!wasTimedOut) return;

      const server = newMember.guild;
      const timeoutDuration = newTimeout.getTime() - Date.now();
      const reason = newMember.guild.members.cache.get(newMember.id)?.pending ? 'Auto-moderation' : null;

      for (const event of Bot.$evts['Member Timeout Started']) {
        const temp = {};
        if (event.temp) temp[event.temp] = newMember;
        if (event.temp2) temp[event.temp2] = timeoutDuration;
        if (event.temp3) temp[event.temp3] = reason;
        Actions.invokeEvent(event, server, temp);
      }
    };

    const { onReady } = Bot;
    Bot.onReady = function memberTimeoutStartedOnReady(...params) {
      Bot.bot.on('guildMemberUpdate', DBM.Events.memberTimeoutStarted);
      if (typeof onReady === 'function') {
        onReady.apply(this, params);
      }
    };
  },
};
