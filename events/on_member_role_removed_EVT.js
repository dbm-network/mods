module.exports = {
  name: 'Member Role Removed MOD',

  isEvent: true,

  fields: ['Temp Variable Name (Stores role object):', 'Temp Variable Name (Stores member object):'],

  mod: function (DBM) {
    DBM.Events = DBM.Events || {}
    const { Bot, Actions } = DBM
    DBM.Events.roleRemoved = async function (oldMember, newMember) {
      if (newMember.roles.cache.size > oldMember.roles.cache.size) return
      const oldRoles = oldMember.roles.cache
      const newRoles = newMember.roles.cache

      const difference = oldRoles.filter((role) => !newRoles.has(role.id)).first()
      const server = newMember.guild
      if (!Bot.$evts['Member Role Removed MOD']) return
      for (const event of Bot.$evts['Member Role Removed MOD']) {
        const temp = {}

        if (event.temp) temp[event.temp] = difference
        if (event.temp2) temp[event.temp2] = newMember

        Actions.invokeEvent(event, server, temp)
      }
    }

    const onReady = Bot.onReady
    Bot.onReady = function (...params) {
      Bot.bot.on('guildMemberUpdate', DBM.Events.roleRemoved)
      onReady.apply(this, ...params)
    }
  }
}
