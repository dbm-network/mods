module.exports = {

  name: 'On Audio Resume',

  isEvent: true,

  fields: ['Temp Variable Name (stores voice channel object):'],

  mod: function (DBM) {
    DBM.Events.onAudioResume = function (guild, voiceChannel) {
      const { Bot, Actions } = DBM
      const events = Bot.$evts['On Audio Resume']
      if (!events) return
      const temp = {}
      for (let i = 0; i < events.length; i++) {
        const event = events[i]
        if (event.temp) temp[event.temp] = voiceChannel
        Actions.invokeEvent(event, guild, temp)
      };
    }
  }
}
