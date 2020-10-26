module.exports = {
  name: 'Invite Used',
  isEvent: true,

  fields: ['Temp Variable Name (Stores invite code that was used):', 'Temp Variable Name (Stores guild):'],

  mod (DBM) {
    DBM.Events = DBM.Events || {}
    const { Bot, Actions } = DBM
    const guildInvites = {}
    DBM.Events.inviteUsed = function (member) {
      if (!Bot.$evts['Invite Used']) return
      const server = member.guild
      server.fetchInvites().then(invites => {
        const prior = guildInvites[server.id]
        const used = prior.filter((c) => c.uses < invites.get(c.code).uses).first()
        for (const event of Bot.$evts['Invite Delete']) {
          const temp = {}
          if (event.temp) temp[event.temp] = used.code
          if (event.temp2) temp[event.temp2] = used.guild
          Actions.invokeEvent(event, server, temp)
        }
      })
    }
    const onReady = Bot.onReady
    Bot.onReady = function (...params) {
      // To not over-consume memory.
      if (Bot.$evts['Invite Used']) {
        setTimeout(() => {
          Bot.bot.guilds.cache.forEach(g => {
            g.fetchInvites().then(invites => {
              guildInvites[g.id] = invites
            })
          })
        }, 1000)
        Bot.bot.on('guildMemberAdd', DBM.Events.inviteUsed)
        Bot.bot.on('inviteDelete', inv => {
          inv.guild.fetchInvites().then(invites => {
            guildInvites[inv.guild.id] = invites
          })
        })
        Bot.bot.on('inviteCreate', inv => {
          inv.guild.fetchInvites().then(invites => {
            guildInvites[inv.guild.id] = invites
          })
        })
      }
      onReady.apply(this, ...params)
    }
  }
}
