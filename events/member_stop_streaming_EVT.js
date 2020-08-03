module.exports = {

  name: 'Member Stop Streaming',

  isEvent: true,

  fields: ['Temp Variable Name (Store voice channel):', 'Temp Variable Name (Store streaming member object):'],

  mod: function (DBM) {
    DBM.Events = DBM.Events || {}
    const { Bot, Actions } = DBM
    DBM.Events.offStream = function (oldVoiceState, newVoiceState) {
      const oldChannel = oldVoiceState.channel
      const newChannel = newVoiceState.channel
      if ((!oldChannel || !oldVoiceState.streaming) || (newChannel && newVoiceState.streaming)) return
      const server = (oldChannel || newChannel).guild
      if (!Bot.$evts['Member Stop Streaming']) return
      for (const event of Bot.$evts['Member Stop Streaming']) {
        const temp = {}
        if (event.temp) temp[event.temp] = oldChannel
        if (event.temp2) temp[event.temp2] = oldVoiceState.member
        Actions.invokeEvent(event, server, temp)
      }
    }

    const onReady = Bot.onReady
    Bot.onReady = function (...params) {
      Bot.bot.on('voiceStateUpdate', DBM.Events.offStream)
      onReady.apply(this, ...params)
    }
  }
}
