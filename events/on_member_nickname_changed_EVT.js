module.exports = {
  name: 'Member Nickname Changed MOD',
  isEvent: true,

  fields: ['Temp Variable Name (Stores new nickname):', 'Temp Variable Name (Stores member object):'],

  mod (DBM) {
    DBM.Events = DBM.Events || {}
    const { Bot, Actions } = DBM
    DBM.Events.nicknameChanged = async function (oldMember, newMember) {
      if (!Bot.$evts['Member Nickname Changed MOD']) return
      if (newMember.nickname === oldMember.nickname) return
      const server = newMember.guild
      for (const event of Bot.$evts['Member Nickname Changed MOD']) {
        const temp = {}
        if (event.temp) temp[event.temp] = newMember.nickname
        if (event.temp2) temp[event.temp2] = newMember
        Actions.invokeEvent(event, server, temp)
      }
    }

    const onReady = Bot.onReady
    Bot.onReady = function (...params) {
      Bot.bot.on('guildMemberUpdate', DBM.Events.nicknameChanged)
      onReady.apply(this, ...params)
    }
  }
}
