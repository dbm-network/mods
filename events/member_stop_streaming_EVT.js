module.exports = {
  name: 'Member Stop Streaming',
  isEvent: true,

  fields: ['Temp Variable Name (Store voice channel):', 'Temp Variable Name (Store streaming member object):'],

  mod(DBM) {
    DBM.Events = DBM.Events || {};
    const { Bot, Actions } = DBM;

    DBM.Events.offStream = function offStream(oldVoiceState, newVoiceState) {
      if (!Bot.$evts['Member Stop Streaming']) return;
      const oldChannel = oldVoiceState.channel;
      const newChannel = newVoiceState.channel;
      if (!oldChannel || !oldVoiceState.streaming || (newChannel && newVoiceState.streaming)) return;
      const server = (oldChannel || newChannel).guild;

      for (const event of Bot.$evts['Member Stop Streaming']) {
        const temp = {};
        if (event.temp) temp[event.temp] = oldChannel;
        if (event.temp2) temp[event.temp2] = oldVoiceState.member;
        Actions.invokeEvent(event, server, temp);
      }
    };

    const { onReady } = Bot;
    Bot.onReady = function memberStopStreamingOnReady(...params) {
      Bot.bot.on('voiceStateUpdate', DBM.Events.offStream);
      onReady.apply(this, ...params);
    };
  },
};
