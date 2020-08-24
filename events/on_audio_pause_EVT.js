module.exports = {
  name: 'On Audio Pause',
  isEvent: true,

  fields: ['Temp Variable Name (stores voice channel object)'],

  mod (DBM) {
    DBM.Events.onAudioPause = function (guild, voiceChannel) {
      const { Bot, Actions } = DBM
      if (!Bot.$evts['On Audio Pause']) return
      for (const event of Bot.$evts['On Audio Pause']) {
        const temp = {}
        if (event.temp) temp[event.temp] = voiceChannel
        Actions.invokeEvent(event, guild, temp)
      };
    }
  }
}
