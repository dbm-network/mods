module.exports = {
  name: 'Stop RSS Feed Watcher',
  section: 'Other Stuff',

  subtitle (data) {
    return `${data.url}`
  },

  variableStorage (data, varType) {
  },

  fields: ['storage', 'varName'],

  html (isEvent, data) {
    return `
<div>
  <div style="float: left; width: 35%;">
    RSS Feed Source:<br>
    <select id="storage" class="round" onchange="glob.refreshVariableList(this)">
      ${data.variables[1]}
    </select>
  </div>
  <div id="varNameContainer" style="float: right; width: 60%;">
    Variable Name:<br>
    <input id="varName" class="round" type="text" list="variableList"><br>
  </div>
</div>`
  },

  init () {},

  action (cache) {
    const data = cache.actions[cache.index]
    const varName = this.evalMessage(data.varName, cache)
    const storage = parseInt(data.storage)
    const stor = storage + varName
    const res = this.getVariable(storage, stor, cache)

    res.stop()

    this.callNextAction(cache)
  },

  mod () {}
}
