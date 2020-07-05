module.exports = {
  name: 'Add Blank Embed Field',
  section: 'Embed Message',

  subtitle (data) {
    const info = ['.', 'Temp Variable', 'Server Variable', 'Global Variable']
    return `${info[parseInt(data.storage)]}: ${data.varName}`
  },

  fields: ['storage', 'varName'],

  html (isEvent, data) {
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
    <input id="varName" class="round varSearcher" type="text" list="variableList"><br>
  </div>
</div>`
  },

  init () {},

  action (cache) {
    const data = cache.actions[cache.index]
    const storage = parseInt(data.storage)
    const varName = this.evalMessage(data.varName, cache)
    const embed = this.getVariable(storage, varName, cache)
    if (embed && embed.addField) {
      embed.addField('\u200B', '\u200B')
    }
    this.callNextAction(cache)
  },

  mod () {}
}
