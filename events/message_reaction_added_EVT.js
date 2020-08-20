module.exports = {
  name: 'Message Reaction Added MOD',
  isEvent: true,

  fields: ['Reaction (Temp Variable Name):', 'Member who Reacted (Temp Variable Name):'],

  mod (DBM) {
    DBM.Events = DBM.Events || {}
    const { Bot, Actions } = DBM
    DBM.Events.reactionAdded = function (reaction, member) {
      if (!Bot.$evts['Message Reaction Added MOD']) return
      const server = reaction.message.guild || null
      if (!server) return; // Stops the event since it's clearly being triggered in the DMs.
      const user = server.members.cache.get(member.id) || member
      for (const event of Bot.$evts['Message Reaction Added MOD']) {
        const temp = {}
        if (event.temp) temp[event.temp] = reaction
        if (event.temp2) temp[event.temp2] = user
        Actions.invokeEvent(event, server, temp)
      }
    }
    const onReady = Bot.onReady
    Bot.onReady = function (...params) {
      Bot.bot.on('messageReactionAdd', DBM.Events.reactionAdded)
      onReady.apply(this, ...params)
    }
  }

}
