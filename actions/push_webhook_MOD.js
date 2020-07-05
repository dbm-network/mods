module.exports = {
  name: 'Send Message To Webhook',
  section: 'Webhook Control',

  subtitle (data) {
    return `${data.message}`
  },

  fields: ['webhook', 'varName', 'message'],

  html (isEvent, data) {
    return `
<div>
  <div style="float: left; width: 35%;">
    Source Webhook:<br>
    <select id="webhook" class="round" onchange="glob.refreshVariableList(this)">
      ${data.variables[1]}
    </select>
  </div>
  <div id="varNameContainer" style="float: right; width: 60%;">
    Variable Name:<br>
    <input id="varName" class="round" type="text" list="variableList"><br>
  </div>
</div><br><br><br>
<div style="padding-top: 8px;">
  Message:<br>
  <textarea id="message" rows="9" placeholder="Insert message here..." style="width: 99%; font-family: monospace; white-space: nowrap; resize: none;"></textarea>
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
    const Mods = this.getMods()
    const wh = Mods.getWebhook(webhook, varName, cache)
    const message = this.evalMessage(data.message, cache)
    if (!wh) {
      console.log('Push Webhook ERROR: idk...')
      this.callNextAction(cache)
    } else {
      wh.send(message)
      this.callNextAction(cache)
    }
  },

  mod () {}
}
