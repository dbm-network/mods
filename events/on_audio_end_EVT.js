module.exports = {
  name: 'On Audio End',
  isEvent: true,

  fields: ['Temp Variable Name (stores voice channel object)'],

  mod (DBM) {
    DBM.Events.onAudioEnd = function (guild, voiceChannel) {
      const { Bot, Actions } = DBM
      if (!Bot.$evts['On Audio End']) return
      for (const event of Bot.$evts['On Audio End']) {
        const temp = {}
        if (event.temp) temp[event.temp] = voiceChannel
        Actions.invokeEvent(event, guild, temp)
      };
    }
  }
}
