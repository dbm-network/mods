module.exports = {
  name: 'Giveaway Auto End',
  isEvent: true,

  fields: ['Temp Variable Name (stores giveaway id):'],

  mod(DBM) {
    DBM.Events = DBM.Events || {};
    const { Bot, Actions } = DBM;

    DBM.Events.giveawayAutoEndEvent = function () {
      const events = Bot.$evts['Giveaway Auto End'];
      if (!events?.length) return;

      for (const event of events) {
        const tempVarName = event.temp || 'giveawayId';
        const loopTime = 5;

        const { GiveawayAutoEnd } = require('discord-giveaways-s');

        const giveawayChecker = GiveawayAutoEnd({
          storage: './data/giveaways.json',
          loopTime,
        });

        giveawayChecker.on('ended', (giveawayId) => {
          const server = Bot.bot.guilds.cache.first();

          const temp = {};
          temp[tempVarName] = giveawayId;

          Actions.invokeEvent(event, server, temp);
        });

        if (typeof giveawayChecker.checkGiveaways === 'function') {
          giveawayChecker.checkGiveaways();
        }

        giveawayChecker.on('error', (error) => {
          console.error(error);
        });
      }
    };

    const { onReady } = Bot;
    Bot.onReady = function (...params) {
      DBM.Events.giveawayAutoEndEvent();
      if (typeof onReady === 'function') onReady.apply(this, params);
    };
  },
};
