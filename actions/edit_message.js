module.exports = {
  name: 'Edit Message',
  section: 'Messaging',

  subtitle (data) {
    const names = ['Temp Variable', 'Server Variable', 'Global Variable']
    return data.storage === '0' ? `${names[parseInt(data.storage) - 1]}` : `${names[parseInt(data.storage) - 1]} (${data.varName})`
  },

  fields: ['storage', 'varName', 'message', 'storage2', 'varName2'],

  html (isEvent, data) {
    return `
<div><p>This action has been modified by DBM Mods</p></div><br>
<div>
  <div style="float: left; width: 35%;">
    Source Message:<br>
    <select id="storage" class="round" onchange="glob.messageChange(this, 'varNameContainer')">
      ${data.messages[1]}
    </select>
  </div>
  <div id="varNameContainer" style="display: none; float: right; width: 60%;">
    Variable Name:<br>
    <input id="varName" class="round" type="text" list="variableList"><br>
  </div>
</div><br><br><br>
<div style="padding-top: 8px;">
  Edited Message Content:<br>
  <textarea id="message" rows="7" placeholder="Insert message here... (Optional)" style="width: 94%; font-family: monospace; white-space: nowrap; resize: none;"></textarea>
</div><br>
<div>
  <div style="float: left; width: 35%;">
    Source Embed Object:<br>
    <select id="storage2" class="round" onchange="glob.refreshVariableList(this, 'varNameContainer2')">
      ${data.variables[1]}
    </select>
  </div>
  <div id="varNameContainer2" style="float: right; width: 60%;">
    Variable Name:<br>
    <input id="varName2" placeholder="Optional" class="round" type="text" list="variableList"><br>
  </div>
</div>`
  },

  init () {
    const { glob, document } = this

    glob.messageChange(document.getElementById('storage'), 'varNameContainer')
    glob.refreshVariableList(document.getElementById('storage2'), 'varNameContainer2')
  },

  action (cache) {
    const data = cache.actions[cache.index]

    const storage = parseInt(data.storage)
    const varName = this.evalMessage(data.varName, cache)
    const message = this.getMessage(storage, varName, cache)

    const content = this.evalMessage(data.message, cache)

    const storage2 = parseInt(data.storage2)
    const varName2 = this.evalMessage(data.varName2, cache)
    const embed = this.getVariable(storage2, varName2, cache)

    if (Array.isArray(message)) {
      this.callListFunc(message, 'edit', [content, embed]).then(() => {
        this.callNextAction(cache)
      })
    } else if (message && message.edit && !message.deleted) {
      message.edit(content, embed).then(() => {
        this.callNextAction(cache)
      }).catch(this.displayError.bind(this, data, cache))
    } else {
      this.callNextAction(cache)
    }
  },

  mod () {}
}
