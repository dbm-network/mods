module.exports = {
  name: 'On Track Start',
  isEvent: true,

  fields: ['Temp Variable Name (stores the queue):', 'Temp Variable Name (stores the track):'],

  mod(DBM) {
    const { Bot, Actions, Events } = DBM;
    const Mods = Actions.getMods();

    // Require all the needed modules for discord-player
    const { Player } = Mods.require('discord-player');
    const { DefaultExtractors } = Mods.require('@discord-player/extractor');
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
      // Ensure bot is ready and has necessary properties before initializing Player
      if (!Bot.bot || !Bot.bot.readyAt) {
        console.warn('[OnTrackStart] Bot not ready, skipping Player initialization');
        return onReady.apply(this, ...params);
      }

      // Check if bot has voice adapter creator (required for Player)
      if (!Bot.bot.voice || typeof Bot.bot.voice === 'undefined') {
        console.warn('[OnTrackStart] Voice manager not available, skipping Player initialization');
        return onReady.apply(this, ...params);
      }

      // Check if Events property exists (discord.js v13+)
      if (!Bot.bot.voice || !Bot.bot.voice.client || !Bot.bot.voice.client.ws) {
        console.warn('[OnTrackStart] Voice WebSocket not available, skipping Player initialization');
        return onReady.apply(this, ...params);
      }

      try {
        // Initialize Player with error handling for VoiceStateUpdate
        const playerOptions = {
          ytdlOptions: {
            quality: 'highestaudio',
            highWaterMark: 1 << 25,
          },
        };

        // Check if we can safely create Player
        if (Bot.bot.voice && Bot.bot.voice.client && Bot.bot.voice.client.ws) {
          Bot.bot.player = new Player(Bot.bot, playerOptions);

          // Load the default extractors from the @discord-player/extractor package
          await Bot.bot.player.extractors.loadMulti(DefaultExtractors);
          console.log('[OnTrackStart] Player initialized successfully');
        } else {
          console.warn('[OnTrackStart] Voice client not properly initialized, skipping Player');
        }
      } catch (error) {
        console.error('[OnTrackStart] Failed to initialize Player:', error.message);
        console.error('[OnTrackStart] Error stack:', error.stack);
        // Continue without player if initialization fails
      }

      // Only set up player events if player was successfully initialized
      if (Bot.bot.player) {
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
      }

      onReady.apply(this, ...params);
    };
  },
};
