module.exports = {

  name: 'On Blacklisted Command',

  isEvent: true,

  fields: ['User Who Used Command', 'Command Message'],

  mod: function (DBM) {
    DBM.Events = DBM.Events || {}
    const { Bot, Actions } = DBM
    DBM.Events.blacklistedUserUse = function (user, message) {
      const server = user.guild || null
      for (const event of Bot.$evts['On Blacklisted Command']) {
        const temp = {}

        if (event.temp) temp[event.temp] = user
        if (event.temp2) temp[event.temp2] = message

        Actions.invokeEvent(event, server, temp)
      }
    }

    const onReady = Bot.onReady

    Bot.onReady = function (...params) {
      Bot.bot.on('blacklistUserUse', DBM.Events.blacklistedUserUse)

      onReady.apply(this, ...params)
    }
  }

}
