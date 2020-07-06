module.exports = {
  name: 'Set Embed Description',
  section: 'Embed Message',

  subtitle: function (data) {
    return `${data.message}`
  },

  fields: ['storage', 'varName', 'message'],

  html: function (isEvent, data) {
    return `
<div>
  <div style="float: left; width: 35%;">
    Source Embed Object:<br>
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
  Description:<br>
  <textarea id="message" rows="10" placeholder="Insert message here..." style="width: 99%; font-family: monospace; white-space: nowrap; resize: none;"></textarea>
</div>`
  },

  init: function () {
    const { glob, document } = this

    glob.refreshVariableList(document.getElementById('storage'))
  },

  action: function (cache) {
    const data = cache.actions[cache.index]
    const storage = parseInt(data.storage)
    const varName = this.evalMessage(data.varName, cache)
    const embed = this.getVariable(storage, varName, cache)
    if (embed && embed.setDescription) {
      embed.setDescription(this.evalMessage(data.message, cache))
    }
    this.callNextAction(cache)
  },

  mod: function () {}
}
