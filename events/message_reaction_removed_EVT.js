module.exports = {
  name: 'Message Reaction Removed MOD',
  isEvent: true,

  fields: ['Reaction (Temp Variable Name):', 'Member who Reacted (Temp Variable Name):'],

  mod (DBM) {
    DBM.Events = DBM.Events || {}
    const { Bot, Actions } = DBM
    DBM.Events.reactionRemoved = function (reaction, member) {
      if (!Bot.$evts['Message Reaction Removed MOD']) return
      const server = reaction.message.guild || null
      let user = member
      if (server) {
        user = server.members.cache.get(member.id)
      }
      for (const event of Bot.$evts['Message Reaction Removed MOD']) {
        const temp = {}
        if (event.temp) temp[event.temp] = reaction
        if (event.temp2) temp[event.temp2] = user
        Actions.invokeEvent(event, server, temp)
      }
    }
    const onReady = DBM.Bot.onReady
    Bot.onReady = function (...params) {
      Bot.bot.on('messageReactionRemove', DBM.Events.reactionRemoved)
      onReady.apply(this, ...params)
    }
  }
}
