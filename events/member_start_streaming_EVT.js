module.exports = {

  name: 'Member Start Streaming',

  isEvent: true,

  fields: ['Temp Variable Name (Store voice channel):', 'Temp Variable Name (Store streaming member object):'],

  mod: function (DBM) {
    DBM.Events = DBM.Events || {}
    const { Bot, Actions } = DBM

    DBM.Events.onStream = function (oldVoiceState, newVoiceState) {
      const oldChannel = oldVoiceState.channel
      const newChannel = newVoiceState.channel
      if ((!oldChannel || !newChannel) || (oldVoiceState.streaming && !newVoiceState.streaming)) return
      const server = (oldChannel || newChannel).guild
      if (!Bot.$evts['Member Start Streaming']) return
      for (const event of Bot.$evts['Member Start Streaming']) {
        const temp = {}

        if (event.temp) temp[event.temp] = newChannel
        if (event.temp2) temp[event.temp2] = newVoiceState.member

        Actions.invokeEvent(event, server, temp)
      }
    }

    const onReady = Bot.onReady
    Bot.onReady = function (...params) {
      Bot.bot.on('voiceStateUpdate', DBM.Events.onStream)
      onReady.apply(this, ...params)
    }
  }
}
