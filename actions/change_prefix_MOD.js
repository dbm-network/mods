module.exports = {
  name: 'Change Global Prefix',
  section: 'Bot Client Control',

  subtitle () {
    return 'Change Prefix'
  },

  fields: ['pprefix'],

  html () {
    return `
<div>
  Change Prefix to:<br>
  <textarea id="pprefix" class="round" style="width: 40%; resize: none;" type="textarea" rows="1" cols="20"></textarea><br><br>
</div>`
  },

  init () {},

  action (cache) {
    const data = cache.actions[cache.index]

    try {
      const prefix = this.evalMessage(data.pprefix, cache)
      if (prefix) {
        this.getDBM().Files.data.settings.tag = prefix
        this.getDBM().Files.saveData('settings', () => console.log(`Prefix changed to ${prefix}`))
      } else {
        console.log(`${prefix} is not valid! Try again!`)
      }
    } catch (err) {
      console.log(`ERROR! ${err.stack || err}`)
    }
    this.callNextAction(cache)
  },

  mod () {}
}
