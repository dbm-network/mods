module.exports = {
  name: 'Find Webhook',
  section: 'Webhook Control',

  subtitle (data) {
    return `${data.id}`
  },

  variableStorage (data, varType) {
    const type = parseInt(data.storage)
    if (type !== varType) return
    return ([data.varName, 'Webhook'])
  },

  fields: ['id', 'token', 'storage', 'varName'],

  html (isEvent, data) {
    return `
<div>
  <div style="float: left; width: 40%;">
    Webhook ID:<br>
    <input id="id" class="round" type="text">
  </div>
  <div style="float: right; width: 55%;">
    Webhook Token:<br>
    <input id="token" class="round" type="text">
  </div>
</div><br><br><br>
<div style="padding-top: 8px;">
  <div style="float: left; width: 35%;">
    Store In:<br>
    <select id="storage" class="round">
      ${data.variables[1]}
    </select>
  </div>
  <div id="varNameContainer" style="float: right; width: 60%;">
    Variable Name:<br>
    <input id="varName" class="round" type="text">
  </div>
</div>`
  },

  init () {},

  action (cache) {
    const { DiscordJS } = this.getDBM()
    const data = cache.actions[cache.index]
    const id = this.evalMessage(data.id, cache)
    const token = this.evalMessage(data.token, cache)

    const result = new DiscordJS.WebhookClient(id, token)

    if (result !== undefined) {
      const storage = parseInt(data.storage)
      const varName = this.evalMessage(data.varName, cache)
      this.storeValue(result, storage, varName, cache)
      this.callNextAction(cache)
    } else {
      this.callNextAction(cache)
    }
  },

  mod () {}
}
