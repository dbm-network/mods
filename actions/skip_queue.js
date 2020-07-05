module.exports = {
  name: 'Skip Queue',
  section: 'Audio Control',

  subtitle (data) {
    return `Skip ${data.amount} Items`
  },

  fields: ['amount'],

  html () {
    return `
<div>
  <p>
    This action has been modified by DBM Mods.
  </p>
</div>
<div style="float: left; width: 95%;">
  <br>Amount to Skip:<br>
  <input id="amount" class="round" value="1">
</div>
<div style="width: 100%;">
  <p>
    <br><br><br><br><br>Please put the Welcome action into a Bot Initalization event to be able to store the current song!
  </p>
</div>`
  },

  init () {},

  action (cache) {
    const data = cache.actions[cache.index]
    const { Audio } = this.getDBM()
    const { server } = cache
    let queue
    let playingnow
    let loopQueue
    if (server) {
      queue = Audio.queue[server.id]
      if (Audio.playingnow !== undefined) {
        playingnow = Audio.playingnow[server.id]
        loopQueue = Audio.loopQueue[server.id] || false
      }
    }
    if (queue) {
      const amount = parseInt(this.evalMessage(data.amount, cache))
      let lastItem = playingnow
      let finalItem
      for (let i = 0; i < amount; i++) {
        if (queue.length > 0) {
          finalItem = queue.shift()
          if (loopQueue === true) {
            queue.push(lastItem)
            lastItem = finalItem
          }
        }
      }
      if (finalItem) {
        Audio.playItem(finalItem, server.id)
      }
    }
    this.callNextAction(cache)
  },

  mod () {}
}
