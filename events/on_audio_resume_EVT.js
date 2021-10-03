module.exports = {
  name: 'On Audio Resume',
  isEvent: true,

  fields: ['Temp Variable Name (stores voice channel object):'],

  mod(DBM) {
    DBM.Events.onAudioResume = function onAudioResume(guild, voiceChannel) {
      const { Bot, Actions } = DBM;
      if (!Bot.$evts['On Audio Resume']) return;
      for (const event of Bot.$evts['On Audio Resume']) {
        const temp = {};
        if (event.temp) temp[event.temp] = voiceChannel;
        Actions.invokeEvent(event, guild, temp);
      }
    };
  },
};
