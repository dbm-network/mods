module.exports = {
  name: 'Delete Webhook',
  section: 'Webhook Control',

  subtitle (data) {
    const names = ['You cheater!', 'Temp Variable', 'Server Variable', 'Global Variable']
    return `${names[parseInt(data.webhook)]} - ${data.varName}`
  },

  fields: ['webhook', 'varName'],

  html (isEvent, data) {
    return `
<div style="float: left; width: 35%;">
  Source Webhook:<br>
  <select id="webhook" class="round" onchange="glob.refreshVariableList(this)">
    ${data.variables[1]}
  </select>
</div>
<div id="varNameContainer" style="float: right; width: 60%;">
  Variable Name:<br>
  <input id="varName" class="round" type="text" list="variableList"><br>
</div>`
  },

  init () {
    const { glob, document } = this

    glob.refreshVariableList(document.getElementById('webhook'))
  },

  action (cache) {
    const data = cache.actions[cache.index]
    const storage = parseInt(data.webhook)
    const varName = this.evalMessage(data.varName, cache)
    const Mods = this.getMods()
    const webhook = Mods.getWebhook(storage, varName, cache)
    if (Array.isArray(webhook)) {
      this.callListFunc(webhook, 'delete', []).then(() => {
        this.callNextAction(cache)
      })
    } else if (webhook && webhook.delete) {
      webhook.delete().then((webhook) => {
        this.callNextAction(cache)
      }).catch(this.displayError.bind(this, data, cache))
    } else {
      this.callNextAction(cache)
    }
  },

  mod () {}
}
