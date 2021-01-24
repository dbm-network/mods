module.exports = {
  name: 'On Top.gg Vote',
  isEvent: true,

  fields: ['Temp Variable Name (Stores users id)', 'Temp Variable Name (Stores vote object)'],

  mod (DBM) {
    DBM.Events.onTopggVote = function (user, vote) {
      const { Bot, Actions } = DBM
      if (!Bot.$evts['On Top.gg Vote']) return
      for (const event of Bot.$evts['On Top.gg Vote']) {
        const temp = {}
        if (event.temp) temp[event.temp] = user
        if (event.temp2) temp[event.temp2] = vote
        const servers = Bot.bot.guilds.cache.array()
        for (const server of servers) {
          if (server) {
            Actions.invokeEvent(event, server, temp)
          }
        }
      };
    }
  }
}
