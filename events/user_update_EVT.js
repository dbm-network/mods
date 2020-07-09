module.exports = {

  name: 'User Update',

  isEvent: true,

  fields: ['User Before Update (Temp Variable Name):', 'User After Update (Temp Variable Name):'],

  mod: function (DBM) {
    DBM.Events = DBM.Events || {}
    const { Bot, Actions } = DBM

    DBM.Events.callUserUpdate = function (pre, post) {
      if (!Bot.$evts['User Update']) return
      for (const event of Bot.$evts['User Update']) {
        const temp = {}

        if (event.temp) temp[event.temp] = pre
        if (event.temp2) temp[event.temp2] = post

        Actions.invokeEvent(event, null, temp)
      }
    }

    const onReady = Bot.onReady
    Bot.onReady = function (...params) {
      Bot.bot.on('userUpdate', DBM.Events.callUserUpdate)
      onReady.apply(this, ...params)
    }
  }
}
