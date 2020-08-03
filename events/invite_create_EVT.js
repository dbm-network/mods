module.exports = {
  name: 'Invite Create',

  isEvent: true,

  fields: ['Temp Variable Name (stores invite code):', 'Temp Variable Name (stores creator of invite):'],

  mod: function (DBM) {
    DBM.Events = DBM.Events || {}
    const { Bot, Actions } = DBM
    DBM.Events.inviteCreate = function (invite) {
      const server = invite.guild
	  if (!Bot.$evts['Invite Create']) return
      for (const event of Bot.$evts['Invite Create']) {
        const temp = {}
        if (event.temp) temp[event.temp] = invite.code
        if (event.temp2) temp[event.temp2] = invite.inviter
        Actions.invokeEvent(event, server, temp)
      }
    }
    const onReady = Bot.onReady
    Bot.onReady = function (...params) {
      Bot.bot.on('inviteCreate', DBM.Events.inviteCreate)
      onReady.apply(this, ...params)
    }
  }
}
