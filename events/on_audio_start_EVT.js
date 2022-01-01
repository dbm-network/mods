module.exports = {
  name: 'On Audio Start',
  isEvent: true,

  fields: ['Temp Variable Name (stores voice channel object)'],

  mod(DBM) {
    const { playItem } = DBM.Audio;
    DBM.Audio.playItem = function onAudioStartPlayItem(item, id) {
      playItem.bind(this)(...arguments);
      if (this.connections[id]) {
        const { guild } = this.connections[id].channel;
        const voiceChannel = this.connections[id].channel;
        const dispatcher = this.dispatchers[id];
        const { pause } = dispatcher;
        dispatcher.pause = function onAudioStartPause() {
          if (!dispatcher.pausedSince) {
            pause.bind(this)(...arguments);
            DBM.Events.onAudioPause(guild, voiceChannel);
          }
        };
        const { resume } = dispatcher;
        dispatcher.resume = function onAudioStartResume() {
          if (dispatcher.pausedSince) {
            resume.bind(this)(...arguments);
            DBM.Events.onAudioResume(guild, voiceChannel);
          }
        };
        dispatcher.on('volumeChange', (oldVolume) => {
          DBM.Events.onVolumeChange(guild, voiceChannel, oldVolume);
        });
        DBM.Events.onAudioStart(guild, voiceChannel);
        dispatcher.on('finish', () => {
          DBM.Events.onAudioEnd(guild, voiceChannel);
        });
      }
    };

    DBM.Events.onAudioStart = function onAudioStart(server, voiceChannel) {
      const { Bot, Actions } = DBM;
      if (!Bot.$evts['On Audio Start']) return;
      for (const event of Bot.$evts['On Audio Start']) {
        const temp = {};
        if (event.temp) temp[event.temp] = voiceChannel;
        Actions.invokeEvent(event, server, temp);
      }
    };
  },
};
