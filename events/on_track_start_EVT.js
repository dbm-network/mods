module.exports = {
  name: 'On Track Start',
  isEvent: true,

  fields: ['Temp Variable Name (stores the queue):', 'Temp Variable Name (stores the track):'],

  mod(DBM) {
    const { Bot, Actions, Events } = DBM;
    const Mods = Actions.getMods();

    // Require all the needed modules for discord-player
    const { Player } = Mods.require('discord-player');
    Mods.require('@discord-player/extractor');
    Mods.require('play-dl');

    DBM.Events.onTrackStart = function onTrackStart(queue, track) {
      if (!Bot.$evts['On Track Start']) return;

      for (const event of Bot.$evts['On Track Start']) {
        const temp = {};
        if (event.temp) temp[event.temp] = queue;
        if (event.temp2) temp[event.temp2] = track;
        Actions.invokeEvent(event, queue.metadata.guild, temp);
      }
    };

    const { onReady } = Bot;
    Bot.onReady = async function onTrackStartOnReady(...params) {
      Bot.bot.player = new Player(Bot.bot);

      // This method will load all the extractors from the @discord-player/extractor package
      await Bot.bot.player.extractors.loadDefault();

      Bot.bot.on('onTrackStart', DBM.Events.onTrackStart);
      Bot.bot.player.events
        .on('playerStart', async (queue, track) => {
          Events.onTrackStart(queue, track);
        })
        .on('audioTrackAdd', async (queue, track) => {
          Events.onTrackAdd(queue, track);
        })
        .on('audioTracksAdd', async (queue, track) => {
          Events.onTracksAdd(queue, track);
        })
        .on('emptyQueue', async (queue) => {
          Events.onQueueEnd(queue);
        })
        .on('error', async (queue, error) => {
          Events.onPlayerError(queue, error);
        })
        .on('playerError', async (queue, error) => {
          Events.onPlayerConnectionError(queue, error);
        });

      onReady.apply(this, ...params);
    };
  },
};
