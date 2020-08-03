module.exports = {

  name: 'Member Boosted Server',

  isEvent: true,

  fields: ['Member (Temp Variable Name):'],

  mod: function (DBM) {
    DBM.Events = DBM.Events || {}
    const { Bot, Actions } = DBM
    DBM.Events.boostedGuild = function (old, recent) {
      const server = recent.guild
      if (!(!old.premiumSince && recent.premiumSince)) return
      if (!Bot.$evts['Member Boosted Server']) return
      for (const event of Bot.$evts['Member Boosted Server']) {
        const temp = {}

        if (event.temp) temp[event.temp] = recent
        if (event.temp2) temp[event.temp2] = recent.guild

        Actions.invokeEvent(event, server, temp)
      }
    }

    const onReady = Bot.onReady
    Bot.onReady = function (...params) {
      Bot.bot.on('guildMemberUpdate', DBM.Events.boostedGuild)
      onReady.apply(this, ...params)
    }
  }
}
