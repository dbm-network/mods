module.exports = {
  name: 'Interaction Create',
  isEvent: true,

  fields: ['Temp Variable Name (stores interaction type):', 'Temp Variable Name (stores user who interacted):'],

  mod(DBM) {
    DBM.Events = DBM.Events || {};
    const { Actions, Bot } = DBM;

    DBM.Events.interactionCreate = async function interactionCreate(interaction) {
      if (!Bot.$evts['Interaction Create']) return;

      const server = interaction.guild;
      for (const event of Bot.$evts['Interaction Create']) {
        const temp = {};

        if (event.temp) {
          if (interaction.isCommand()) {
            temp[event.temp] = 'slash command';
          } else if (interaction.isButton()) {
            temp[event.temp] = 'button';
          } else if (interaction.isStringSelectMenu()) {
            temp[event.temp] = 'string select menu';
          } else if (interaction.isUserSelectMenu()) {
            temp[event.temp] = 'user select menu';
          } else if (interaction.isRoleSelectMenu()) {
            temp[event.temp] = 'role select menu';
          } else if (interaction.isMentionableSelectMenu()) {
            temp[event.temp] = 'mentionable select menu';
          } else if (interaction.isChannelSelectMenu()) {
            temp[event.temp] = 'channel select menu';
          } else if (interaction.isMessageComponent()) {
            temp[event.temp] = 'text command';
          } else if (interaction.isModalSubmit()) {
            temp[event.temp] = 'modal';
          } else if (interaction.isUserContextMenu()) {
            temp[event.temp] = 'user context menu';
          } else if (interaction.isMessageContextMenu()) {
            temp[event.temp] = 'message context menu';
          } else {
            temp[event.temp] = interaction.type;
          }
        }

        if (event.temp2) temp[event.temp2] = interaction.user;

        Actions.invokeEvent(event, server, temp);
      }
    };

    const { onReady } = Bot;
    Bot.onReady = function interactionCreateOnReady(...params) {
      Bot.bot.on('interactionCreate', DBM.Events.interactionCreate);
      onReady.apply(this, ...params);
    };
  },
};
