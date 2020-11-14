export const name = 'Edit Webhook'
export const section = 'Webhook Control'
export function subtitle (data) {
  return `${data.webhookName}`
}
export const fields = ['webhookName', 'webhookIcon', 'webhook', 'varName']
export function html (isEvent, data) {
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
    </div>
  </div><br><br><br>
  <div style="width: 90%;">
    Webhook Name:<br>
    <input id="webhookName" class="round" type="text">
  </div><br>
  <div style="width: 90%;">

    Webhook Icon URL:<br>
    <input id="webhookIcon" class="round" type="text">
  </div><br>
  <div>
  </div>`
}
export function init () {
  const {
    glob,
    document
  } = this
  glob.channelChange(document.getElementById('webhook'))
}
export function action (cache) {
  const data = cache.actions[cache.index]
  const webhook = parseInt(data.webhook)
  const varName = this.evalMessage(data.varName, cache)
  const Mods = this.getMods()
  const wh = Mods.getWebhook(webhook, varName, cache)
  if (wh) {
    const avatar = this.evalMessage(data.webhookIcon, cache)
    const name = this.evalMessage(data.webhookName, cache)
    wh.send('', {
      avatarURL: avatar
    })
    wh.name = name
    this.callNextAction(cache)
  } else {
    this.callNextAction(cache)
  }
}
export function mod () {}