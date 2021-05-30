module.exports = {
  name: 'Send Message to Console',
  section: 'Other Stuff',

  subtitle (data) {
    if (data.toSend.length > 0) {
      return `<font color="${data.color}">${data.toSend}</font>`
    }
    return 'Please enter a message!'
  },

  fields: ['toSend', 'color'],

  html () {
    return `
<div>
  Color:<br>
  <input type="color" id="color" value="#f2f2f2">
</div><br>
<div style="padding-top: 8px;">
  Message to send:<br>
  <textarea id="toSend" rows="4" style="width: 99%; font-family: monospace; white-space: nowrap; resize: none;"></textarea>
</div>`
  },

  init () {},

  action (cache) {
    const Mods = this.getMods()
    const chalk = Mods.require('chalk')
    const data = cache.actions[cache.index]
    const send = this.evalMessage(data.toSend, cache)

    if (!send || send.length < 1) {
      console.log(chalk.gray(`Please provide something to log: Action #${cache.index + 1}`))
      return this.callNextAction(cache)
    }

    const color = this.evalMessage(data.color, cache)
    console.log(chalk.hex(color)(send))
    this.callNextAction(cache)
  },

  mod (DBM) {
    DBM.Actions['Send Message to Console (Logs)'] = DBM.Actions['Send Message to Console']
  }
}
