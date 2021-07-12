module.exports = {
  name: 'On Volume Change',
  isEvent: true,

  fields: ['Temp Variable Name (stores voice channel object)', 'Temp Variable Name (stores old volume [1 - 100])'],

  mod(DBM) {
    DBM.Events.onVolumeChange = function onVolumeChange(guild, voiceChannel, oldVolume) {
      const { Bot, Actions } = DBM;
      if (!Bot.$evts['On Volume Change']) return;
      for (const event of Bot.$evts['On Volume Change']) {
        const temp = {};
        if (event.temp) temp[event.temp] = voiceChannel;
        if (event.temp2) temp[event.temp2] = oldVolume;
        Actions.invokeEvent(event, guild, temp);
      }
    };
  },
};
