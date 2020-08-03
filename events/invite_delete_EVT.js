module.exports = {
  name: 'Invite Delete',

  isEvent: true,

  fields: ['Temp Variable Name (Stores invite code that was deleted):'],

  mod: function (DBM) {
    DBM.Events = DBM.Events || {}
    const { Bot, Actions } = DBM
    DBM.Events.inviteDelete = function (invite) {
      const server = invite.guild
	  if (!Bot.$evts['Invite Delete']) return
      for (const event of Bot.$evts['Invite Delete']) {
        const temp = {}
        if (event.temp) temp[event.temp] = invite.code
        Actions.invokeEvent(event, server, temp)
      }
    }
    const onReady = Bot.onReady
    Bot.onReady = function (...params) {
      Bot.bot.on('inviteDelete', DBM.Events.inviteDelete)
      onReady.apply(this, ...params)
    }
  }
}
