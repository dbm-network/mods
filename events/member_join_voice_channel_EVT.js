module.exports = {
  name: 'Member Join Voice Channel',
  isEvent: true,

  fields: ['Temp Variable Name (stores member that entered the channel):', 'Temp Variable Name (stores channel that the member joined):'],

  mod (DBM) {
    DBM.Events = DBM.Events || {}
    const { Actions, Bot } = DBM
    DBM.Events.memberJoinVoiceChannel = function (oldVoiceState, newVoiceState) {
      if (!Bot.$evts['Member Join Voice Channel']) return
      const oldChannel = oldVoiceState.channel
      const newChannel = newVoiceState.channel
      const server = (oldChannel || newChannel).guild
      if (!(!oldChannel && newChannel)) return
      for (const event of Bot.$evts['Member Join Voice Channel']) {
        const temp = {}
        if (event.temp) temp[event.temp] = newVoiceState.member
        if (event.temp2) temp[event.temp2] = newChannel
        Actions.invokeEvent(event, server, temp)
      }
    }
    const onReady = Bot.onReady
    Bot.onReady = function (...params) {
      Bot.bot.on('voiceStateUpdate', DBM.Events.memberJoinVoiceChannel)
      onReady.apply(this, ...params)
    }
  }

}
