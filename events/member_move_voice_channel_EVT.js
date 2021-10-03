module.exports = {
  name: 'Member Move Voice Channel',
  isEvent: true,

  fields: [
    'Temp Variable Name (Stores member that entered the channel):',
    'Temp Variable Name (Stores channel that the member joined):',
  ],

  mod(DBM) {
    DBM.Events = DBM.Events || {};
    const { Actions, Bot } = DBM;

    DBM.Events.memberMoveVoiceChannel = function memberMoveVoiceChannel(oldVoiceState, newVoiceState) {
      if (!Bot.$evts['Member Move Voice Channel']) return;
      const oldChannel = oldVoiceState.channel;
      const newChannel = newVoiceState.channel;
      if (!oldChannel || !newChannel || !oldChannel.id || !newChannel.id || oldChannel.id === newChannel.id) return;
      const server = newChannel.guild;

      for (const event of Bot.$evts['Member Move Voice Channel']) {
        const temp = {};
        if (event.temp) temp[event.temp] = newVoiceState.member;
        if (event.temp2) temp[event.temp2] = newChannel;
        Actions.invokeEvent(event, server, temp);
      }
    };

    const { onReady } = Bot;
    Bot.onReady = function memberMoveVoiceChannelOnReady(...params) {
      Bot.bot.on('voiceStateUpdate', DBM.Events.memberMoveVoiceChannel);
      onReady.apply(this, ...params);
    };
  },
};
