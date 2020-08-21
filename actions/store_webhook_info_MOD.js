module.exports = {
  name: 'Store Webhook Info',
  section: 'Webhook Control',

  subtitle (data) {
    const info = ['Webhook ', 'Webhook ', 'Webhook ', 'Webhook ', 'Webhook ', 'Webhook ', 'Webhook ', 'Webhook ']
    return `${info[parseInt(data.info)]}`
  },

  variableStorage (data, varType) {
    const type = parseInt(data.storage)
    if (type !== varType) return
    const info = parseInt(data.info)
    let dataType = 'Webhook Info'
    switch (info) {
      case 0:
        dataType = 'ID'
        break
      case 1:
        dataType = 'ID'
        break
      case 2:
        dataType = 'ID'
        break
      case 3:
        dataType = 'Username'
        break
      case 4:
        dataType = 'User'
        break
      case 5:
        dataType = 'Token'
        break
      case 6:
        dataType = 'URL'
        break
    }
    return ([data.varName2, dataType])
  },

  fields: ['webhook', 'varName', 'info', 'storage', 'varName2'],

  html (isEvent, data) {
    return `
<div>
  <div style="float: left; width: 35%;">
    Transfer Value From:<br>
    <select id="webhook" class="round" onchange="glob.refreshVariableList(this)">
      ${data.variables[1]}
    </select>
  </div>
  <div id="varNameContainer" style="float: right; width: 60%;">
    Variable Name:<br>
    <input id="varName" class="round" type="text" list="variableList"><br>
  </div>
</div><br><br><br>
<div style="float: left; width: 80%; padding-top: 8px;">
  Source Info:<br>
  <select id="info" class="round">
    <option value="6" selected>Webhook URL</option>
    <option value="2">Webhook ID</option>
    <option value="5">Webhook Token</option>
    <option value="3">Webhook Name</option>
    <option value="4">Webhook Owner</option>
    <option value="1">Webhook Guild ID</option>
    <option value="0">Webhook Channel ID</option>
  </select>
</div><br><br>
<div>
  <div style="float: left; width: 35%;">
    Store In:<br>
    <select id="storage" class="round">
      ${data.variables[1]}
    </select>
  </div>
  <div id="varNameContainer2" style="float: right; width: 60%;">
    Variable Name:<br>
    <input id="varName2" class="round" type="text"><br>
  </div>
</div>`
  },

  init () {
    const { glob, document } = this

    glob.refreshVariableList(document.getElementById('webhook'))
  },

  action (cache) {
    const data = cache.actions[cache.index]
    const webhook = parseInt(data.webhook)
    const varName = this.evalMessage(data.varName, cache)
    const info = parseInt(data.info)
    const Mods = this.getMods()
    const wh = Mods.getWebhook(webhook, varName, cache)
    let result
    switch (info) {
      case 0:
        result = wh.channelID
        break
      case 1:
        result = wh.guildID
        break
      case 2:
        result = wh.id
        break
      case 3:
        result = wh.name
        break
      case 4:
        result = wh.owner
        break
      case 5:
        result = wh.token
        break
      case 6:
        result = wh.url
        break
      default:
        break
    }
    if (result !== undefined) {
      const storage = parseInt(data.storage)
      const varName2 = this.evalMessage(data.varName2, cache)
      this.storeValue(result, storage, varName2, cache)
    }
    this.callNextAction(cache)
  },

  mod () {}
}
