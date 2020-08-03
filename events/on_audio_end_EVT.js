module.exports = {

  name: 'On Audio End',

  isEvent: true,

  fields: ['Temp Variable Name (stores voice channel object)'],

  mod: function (DBM) {
    DBM.Events.onAudioEnd = function (guild, voiceChannel) {
      const { Bot, Actions } = DBM
      const events = Bot.$evts['On Audio End']
      if (!events) return
      for (let i = 0; i < events.length; i++) {
        const event = events[i]
        const temp = {}
        if (event.temp) temp[event.temp] = voiceChannel
        Actions.invokeEvent(event, guild, temp)
      };
    }
  }
}
