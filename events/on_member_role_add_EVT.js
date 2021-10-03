module.exports = {
  name: 'Member Role Added MOD',
  displayName: 'Member Role Added',
  isEvent: true,

  fields: ['Temp Variable Name (Stores role object):', 'Temp Variable Name (Stores member object):'],

  mod(DBM) {
    DBM.Events = DBM.Events || {};
    const { Bot, Actions } = DBM;

    DBM.Events.roleAdded = async function roleAdded(oldMember, newMember) {
      if (!Bot.$evts['Member Role Added MOD']) return;
      if (newMember.roles.cache.size <= oldMember.roles.cache.size) return;
      const server = newMember.guild;

      const oldRoles = oldMember.roles.cache;
      const newRoles = newMember.roles.cache;
      const difference = newRoles.filter((role) => !oldRoles.has(role.id)).first();
      for (const event of Bot.$evts['Member Role Added MOD']) {
        const temp = {};

        if (event.temp) temp[event.temp] = difference;
        if (event.temp2) temp[event.temp2] = newMember;

        Actions.invokeEvent(event, server, temp);
      }
    };

    const { onReady } = Bot;
    Bot.onReady = function memberRoleAddOnReady(...params) {
      Bot.bot.on('guildMemberUpdate', DBM.Events.roleAdded);
      onReady.apply(this, ...params);
    };
  },
};
