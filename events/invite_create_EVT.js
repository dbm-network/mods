module.exports = {
  name: 'Invite Create',
  isEvent: true,

  fields: ['Temp Variable Name (stores invite code):', 'Temp Variable Name (stores creator of invite):'],

  mod(DBM) {
    DBM.Events = DBM.Events || {};
    const { Bot, Actions } = DBM;
    DBM.Events.inviteCreate = function inviteCreate(invite) {
      if (!Bot.$evts['Invite Create']) return;
      const server = invite.guild;
      for (const event of Bot.$evts['Invite Create']) {
        const temp = {};
        if (event.temp) temp[event.temp] = invite.code;
        if (event.temp2) temp[event.temp2] = invite.inviter;
        Actions.invokeEvent(event, server, temp);
      }
    };
    const { onReady } = Bot;
    Bot.onReady = function inviteCreateOnReady(...params) {
      Bot.bot.on('inviteCreate', DBM.Events.inviteCreate);
      onReady.apply(this, ...params);
    };
  },
};
