module.exports = {
  name: 'Sends Stats to DBL',
  section: 'Other Stuff',

  subtitle (data) {
    const info = ['Only Server Count', 'Shard & Server Count']
    return `Send ${info[parseInt(data.info)]} to DBL!`
  },

  fields: ['dblToken', 'info'],

  html () {
    return `
<div id="modinfo">
  <div style="float: left; width: 99%; padding-top: 8px;">
    Your DBL Token:<br>
    <input id="dblToken" class="round" type="text">
  </div><br>
  <div style="float: left; width: 90%; padding-top: 8px;">
    Info to Send:<br>
    <select id="info" class="round">
    <option value="0">Send Server Count Only</option>
    <option value="1">Send Shard & Server Count</option>
  </select><br>
  <p>
    • Do not send anything about shards if you don't shard your bot, otherwise it'll crash your bot!
  </p>
  </div>
</div>`
  },

  init () {},

  async action (cache) {
    const data = cache.actions[cache.index]
    const token = this.evalMessage(data.dblToken, cache)
    const info = parseInt(data.info)
    const Mods = this.getMods()
    const fetch = Mods.require('node-fetch')
    const client = this.getDBM().Bot.bot

    const body = [
      { server_count: client.guilds.cache.size },
      { server_count: client.guilds.cache.size, shard_id: client.shard.ids[0], shard_count: client.shard.count }
    ][info]
    if (!body) return console.error(`#${cache.index + 1} ${this.name}: Invalid option selected`)

    await fetch(`https://top.gg/api/bots/${client.user.id}/stats`, {
      body,
      headers: { Authorization: token },
      method: 'POST'
    }).catch((err) => console.error(`#${cache.index + 1} ${this.name}: ${err.stack}`))

    this.callNextAction(cache)
  },

  mod () {}
}
