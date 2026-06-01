module.exports = {
  name: 'Message Create',
  isEvent: true,

  fields: ['Temp Variable Name (stores message):', 'Temp Variable Name (stores message author):'],

  mod(DBM) {
    DBM.Events = DBM.Events || {};
    const { Actions, Bot } = DBM;

    DBM.Events.messageCreate = async function messageCreate(message) {
      if (!Bot.$evts['Message Create']) return;
      if (message.author.bot) return; // Ignore bot messages
      if (!message.guild) return; // Ignore DMs

      const server = message.guild;
      for (const event of Bot.$evts['Message Create']) {
        const temp = {};
        if (event.temp) temp[event.temp] = message;
        if (event.temp2) temp[event.temp2] = message.author;
        Actions.invokeEvent(event, server, temp);
      }
    };

    const { onReady } = Bot;
    Bot.onReady = function messageCreateOnReady(...params) {
      Bot.bot.on('messageCreate', DBM.Events.messageCreate);
      onReady.apply(this, params);
    };
  },
};
