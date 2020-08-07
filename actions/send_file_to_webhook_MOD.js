module.exports = {

  name: 'Send File To Webhook',
  section: 'Webhook Control',

  subtitle (data) {
    return 'Send a file to a webhook.'
  },

  variableStorage (data, varType) {
    const type = parseInt(data.storage)
    if (type !== varType) return
    const dataType = 'Number'
    return ([data.varName, dataType])
  },

  fields: ['url', 'filename'],

  html (isEvent, data) {
    return `
<div style="width: 90%;">
  Webhook URL:<br>
  <input id="url" class="round" type="text">
</div><br>
<div style="width: 65%;">
  File Name:<br>
  <input id="filename" class="round" placeholder="../yourfilename.png" type="text">
</div><br>
</div>`
  },

  init () {},

  action (cache) {
    const data = cache.actions[cache.index]
    const url = this.evalMessage(data.url, cache)
    const filename = this.evalMessage(data.filename, cache)
    const Mods = this.getMods()

    const { Webhook } = Mods.require('discord-webhook-node')
    const hook = new Webhook(url)

    hook.sendFile(filename)

    this.callNextAction(cache)
  },

  mod (DBM) {}
}
