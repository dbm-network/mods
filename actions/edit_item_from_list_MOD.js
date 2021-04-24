module.exports = {
  name: 'Edit Item from List MOD',
  section: 'Lists and Loops',

  subtitle (data) {
    return `Edit "${data.value}" at position ${data.position}`
  },

  fields: ['storage', 'varName', 'position', 'value'],

  html (isEvent, data) {
    return `
<div>
  <div style="float: left; width: 35%;">
    Source List:<br>
    <select id="storage" class="round" onchange="glob.refreshVariableList(this)">
      ${data.variables[1]}
    </select><br>
  </div>
  <div id="varNameContainer" style="float: right; width: 60%;">
    Variable Name:<br>
    <input id="varName" class="round varSearcher" type="text" list="variableList"><br>
  </div>
</div><br><br><br>
<div>
  <div style="float: left; width: 39%;">
    Position:<br>
    <input id="position" class="round" type="text"><br>
  </div>
  <div style="padding-left: 8px; float: left; width: 61%;">
    Value:<br>
    <input id="value" class="round" type="text">
  </div>
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
    const list = this.getVariable(storage, varName, cache)
    const position = parseInt(this.evalMessage(data.position, cache))
    const val = this.evalMessage(data.value, cache)
    if (list.length > position) {
      list[position] = val
    }
    this.callNextAction(cache)
  },

  mod () {}
}
