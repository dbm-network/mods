module.exports = {
  name: 'Member Start Streaming',
  isEvent: true,

  fields: ['Temp Variable Name (Store voice channel):', 'Temp Variable Name (Store streaming member object):'],

  mod(DBM) {
    DBM.Events = DBM.Events || {};
    const { Bot, Actions } = DBM;

    DBM.Events.onStream = function onStream(oldVoiceState, newVoiceState) {
      if (!Bot.$evts['Member Start Streaming']) return;
      const oldChannel = oldVoiceState.channel;
      const newChannel = newVoiceState.channel;
      if (!oldChannel || !newChannel || (oldVoiceState.streaming && !newVoiceState.streaming)) return;
      const server = (oldChannel || newChannel).guild;

      for (const event of Bot.$evts['Member Start Streaming']) {
        const temp = {};
        if (event.temp) temp[event.temp] = newChannel;
        if (event.temp2) temp[event.temp2] = newVoiceState.member;
        Actions.invokeEvent(event, server, temp);
      }
    };

    const { onReady } = Bot;
    Bot.onReady = function memberStartStreamingOnReady(...params) {
      Bot.bot.on('voiceStateUpdate', DBM.Events.onStream);
      onReady.apply(this, ...params);
    };
  },
};
