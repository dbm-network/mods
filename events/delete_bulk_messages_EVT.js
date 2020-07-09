module.exports = {

  name: 'Delete Bulk Messages',

  isEvent: true,

  fields: ['Temp Variable Name (stores list of messages):', 'Temp Variable Name (stores amount of messages):'],

  mod: function (DBM) {
    DBM.Events = DBM.Events || {}
    const { Bot, Actions } = DBM
    DBM.Events.messageDeleteBulk = function (messagesList) {
      const server = messagesList.first().guild
      if (!Bot.$evts['Delete Bulk Messages']) return
      for (const event of Bot.$evts['Delete Bulk Messages']) {
        const temp = {}
        if (event.temp) temp[event.temp] = messagesList.array()
        if (event.temp2) temp[event.temp2] = messagesList.size
        Actions.invokeEvent(event, server, temp)
      }
    }
    const onReady = Bot.onReady
    Bot.onReady = function (...params) {
      Bot.bot.on('messageDeleteBulk', DBM.Events.messageDeleteBulk)
      onReady.apply(this, ...params)
    }
  }
}
