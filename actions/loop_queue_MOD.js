module.exports = {
  name: 'Loop Queue',
  section: 'Audio Control',

  subtitle (data) {
    const actions = ['Loop Whole Queue', 'Loop Current Item']
    return `${actions[parseInt(data.loop)]}`
  },

  fields: ['status', 'loop'],

  html (isEvent, data) {
    return `
<div style="float: left; width: 45%; padding-top: 8px;">
  Loop Setting:<br>
  <select id="status" class="round" onchange="glob.onChange(this)">
    <option value="0" selected>Enable</option>
    <option value="1">Disable</option>
  </select>
</div>
<div style="float: right; width: 50%; padding-top: 8px;">
  Loop Operation:<br>
  <select id="loop" class="round">
    <option value="0" selected>Loop Whole Queue</option>
    <option value="1">Loop Current Item</option>
  </select><br>
</div>
<div style="float: left; width: 100%; padding-top: 8px;">
  <p>
    Please put the Welcome action into a Bot Initalization event to be able to store the current song!
  </p>
</div>`
  },

  init () {},

  action (cache) {
    const data = cache.actions[cache.index]
    const { Audio } = this.getDBM()
    const { server } = cache
    const status = parseInt(data.status)
    const loop = parseInt(data.loop)

    switch (status) {
      case 0:// Enable
        switch (loop) {
          case 0:// Loop Queue
            Audio.loopQueue[server.id] = true
            break
          case 1:// Loop Item
            Audio.loopItem[server.id] = true
            break
        }
        break
      case 1:// Disable
        switch (loop) {
          case 0:// Loop Queue
            Audio.loopQueue[server.id] = false
            break
          case 1:// Loop Item
            Audio.loopItem[server.id] = false
            break
        }
        break
    }

    this.callNextAction(cache)
  },

  mod (DBM) {
    const Mods = DBM.Actions.getMods()
    Mods.setupMusic(DBM)
  }
}
