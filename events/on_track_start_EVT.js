module.exports = {
  name: 'On Track Start',
  isEvent: true,

  fields: ['Temp Variable Name (stores the queue):', 'Temp Variable Name (stores the track):'],

  mod(DBM) {
    const { Bot, Actions, Events } = DBM;
    const Mods = Actions.getMods();
    const { Player } = Mods.require('@themondon/discord-player-v13');

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
    Bot.onReady = function onTrackStartOnReady(...params) {
      Bot.bot.player = new Player(Bot.bot);

      Bot.bot.on('onTrackStart', DBM.Events.onTrackStart);
      Bot.bot.player
        .on('trackStart', async (queue, track) => {
          Events.onTrackStart(queue, track);
        })
        .on('trackAdd', async (queue, track) => {
          Events.onTrackAdd(queue, track);
        })
        .on('tracksAdd', async (queue, track) => {
          Events.onTracksAdd(queue, track);
        })
        .on('noResults', async (queue, track) => {
          Events.onPlayerNoResults(queue, track);
        })
        .on('queueEnd', async (queue) => {
          Events.onQueueEnd(queue);
        })
        .on('error', async (queue, error) => {
          Events.onPlayerError(queue, error);
        })
        .on('connectionError', async (queue, error) => {
          Events.onPlayerConnectionError(queue, error);
        });

      onReady.apply(this, ...params);
    };
  },
};
