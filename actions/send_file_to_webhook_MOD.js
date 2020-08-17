module.exports = {
  name: 'Send File To Webhook',
  section: 'Webhook Control',

  subtitle (data) {
    return 'Send a file to a webhook'
  },

  variableStorage (data, varType) {
    const type = parseInt(data.storage)
    if (type !== varType) return
    const dataType = 'Number'
    return ([data.varName, dataType])
  },

  fields: ['storage', 'varName', 'file'],

  html (isEvent, data) {
    return `
<div style="padding-top: 8px;">
  <div style="float: left; width: 35%;">
    Source Webhook:<br>
    <select id="storage" class="round" onchange="glob.refreshVariableList(this)">
      ${data.variables[1]}
    </select>
  </div>
  <div id="varNameContainer" style="float: right; width: 60%;">
    Variable Name:<br>
    <input id="varName" class="round" type="text" list="variableList"><br>
  </div>
</div><br><br><br>
<div style="padding-top: 8px;">
  Local File URL:<br>
  <input id="file" class="round" type="text" value="resources/"><br>
</div>`
  },

  init () {
    const { glob, document } = this

    glob.refreshVariableList(document.getElementById('storage'))
  },

  action (cache) {
    const data = cache.actions[cache.index]
    const storage = parseInt(data.storage)
    const varName = this.evalMessage(data.varName, cache)
    //const filename = this.evalMessage(data.filename, cache)
    const Mods = this.getMods()
    const webhook = Mods.getWebhook(storage, varName, cache)
    const options = {
        files: [
            this.getLocalFile(this.evalMessage(data.file, cache))
		]
	}
    if (!webhook) {
        this.callNextAction(cache)
    return
    }
    webhook.send(options)
    this.callNextAction(cache)
  },

  mod () {}
}
