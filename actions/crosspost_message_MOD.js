module.exports = {
  name: 'Crosspost Message',
  section: 'Messaging',

  subtitle (data) {
    const message = ['Command Message', 'Temp Variable', 'Server Variable', 'Global Variable']
    return `${message[parseInt(data.message)]}`
  },

  variableStorage (data, varType) {
    if (parseInt(data.storage) !== varType) return
    return [data.varName2, 'Message']
  },

  fields: ['message', 'varName', 'storage', 'varName2'],

  html (isEvent, data) {
    return `
<div>
 <div style="float: left; width: 35%;">
  Source Message:<br>
  <select id="message" class="round" onchange="glob.messageChange(this, 'varNameContainer')">
   ${data.messages[isEvent ? 1 : 0]}
  </select>
 </div>
 <div id="varNameContainer" style="display: none; float: right; width: 60%;">
  Variable Name:<br>
  <input id="varName" class="round" type="text" list="variableList"><br>
 </div>
</div><br><br><br>
<div>
 <div style="float: left; width: 35%;">
  Store In:<br>
  <select id="storage" class="round" onchange="glob.variableChange(this, 'varNameContainer2')">
   ${data.variables[0]}
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

    glob.sendTargetChange(document.getElementById('message'), 'varNameContainer')
    glob.variableChange(document.getElementById('storage'), 'varNameContainer2')
  },

  action (cache) {
    const data = cache.actions[cache.index]
    const varName = this.evalMessage(data.varName, cache)
    const message = this.getMessage(parseInt(data.message), varName, cache)

    if (!message) throw new Error('No message found to crosspost.')
    if (!message.crosspost) throw new Error('You need at least Discord.js version 12.4.0 to use this mod.')

    message.crosspost().then((msg) => {
      const varName2 = this.evalMessage(data.varName2, cache)
      const storage = parseInt(data.storage)
      this.storeValue(msg, storage, varName2, cache)
      this.callNextAction(cache)
    }).catch(console.error)
  },

  mod () {}
}
