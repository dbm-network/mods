module.exports = {

  name: 'On Volume Change',

  isEvent: true,

  fields: ['Temp Variable Name (stores voice channel object)', 'Temp Variable Name (stores old volume [1 - 100])'],

  mod: function (DBM) {
    DBM.Events.onVolumeChange = function (guild, voiceChannel, oldVolume) {
      const { Bot, Actions } = DBM
      const events = Bot.$evts['On Volume Change']
      if (!events) return
      for (let i = 0; i < events.length; i++) {
        const event = events[i]
        const temp = {}
        if (event.temp) temp[event.temp] = voiceChannel
        if (event.temp2) temp[event.temp2] = oldVolume
        Actions.invokeEvent(event, guild, temp)
      };
    }
  }
}
