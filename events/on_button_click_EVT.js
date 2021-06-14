module.exports = {
  name: 'Button click',
  displayName: 'On button clicked',
  isEvent: true,

  fields: ['Temp Variable Name (Stores the Member who clicked Variable)','Temp Variable Name (Stores the Message Variable)'],

  mod (DBM) {
    DBM.Events = DBM.Events || {}
    const { Bot, Actions } = DBM
    const onReady = Bot.onReady
    Bot.onReady = function (...params) {

      Bot.bot.on('clickButton', function (button) {
        const { Bot, Actions } = DBM
        if (!Bot.$evts['Button click']) return
        for (const event of Bot.$evts['Button click']) {
          const temp = {}
          button.clicker.fetch().then(()=> {
            var user = !button.clicker.member ? button.clicker.user : button.clicker.member
            if (event.temp) temp[event.temp] = user
            if (event.temp2) temp[event.temp2] = button.message
            button.defer();
            Actions.invokeEvent(event, null, temp)
          })
        }
      })
      onReady.apply(this, ...params)

    }
  }
}
