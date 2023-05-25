module.exports = {
  name: 'Member Role Removed',
  isEvent: true,

  fields: ['Temp Variable Name (Stores role object):', 'Temp Variable Name (Stores member object):'],

  mod(DBM) {
    DBM.Events = DBM.Events || {};
    const { Bot, Actions } = DBM;

    DBM.Events.roleRemoved = async function roleRemoved(oldMember, newMember) {
      if (!Bot.$evts['Member Role Removed']) return;
      if (newMember.roles.cache.size >= oldMember.roles.cache.size) return;
      const oldRoles = oldMember.roles.cache;
      const newRoles = newMember.roles.cache;

      const difference = oldRoles.filter((role) => !newRoles.has(role.id)).first();
      const server = newMember.guild;
      for (const event of Bot.$evts['Member Role Removed']) {
        const temp = {};

        if (event.temp) temp[event.temp] = difference;
        if (event.temp2) temp[event.temp2] = newMember;

        Actions.invokeEvent(event, server, temp);
      }
    };

    const { onReady } = Bot;
    Bot.onReady = function memberRoleRemovedOnReady(...params) {
      Bot.bot.on('guildMemberUpdate', DBM.Events.roleRemoved);
      onReady.apply(this, ...params);
    };
  },
};
