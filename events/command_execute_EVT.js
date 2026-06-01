module.exports = {
  name: 'Command Execute',
  isEvent: true,

  fields: ['Temp Variable Name (stores command name):', 'Temp Variable Name (stores user who executed the command):'],

  mod(DBM) {
    DBM.Events = DBM.Events || {};
    const { Actions, Bot } = DBM;

    DBM.Events.commandExecute = async function commandExecute(interaction) {
      if (!Bot.$evts['Command Execute']) return;
      if (!interaction.isCommand()) return;

      const server = interaction.guild;
      for (const event of Bot.$evts['Command Execute']) {
        const temp = {};
        if (event.temp) temp[event.temp] = interaction.commandName;
        if (event.temp2) temp[event.temp2] = interaction.user;
        Actions.invokeEvent(event, server, temp);
      }
    };

    const { onReady } = Bot;
    Bot.onReady = function commandExecuteOnReady(...params) {
      Bot.bot.on('interactionCreate', DBM.Events.commandExecute);
      onReady.apply(this, ...params);
    };
  },
};
