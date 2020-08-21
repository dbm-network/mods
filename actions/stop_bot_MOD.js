module.exports = {
  name: 'Stop Bot',
  section: 'Bot Client Control',

  subtitle () {
    return 'Stops bot'
  },

  fields: [],

  html () {
    return `
<div>
  <p>
    <u>Warning:</u><br>
    This action stops the bot. You cannot restart it with a command after this action is ran!<br>
    Choose the permissions for this command/event carefully!
  </p>
</div>`
  },

  init () {},

  action () {
    console.log('Stopped bot!')
    this.getDBM().Bot.bot.destroy()
    process.exit()
  },

  mod () {}
}
