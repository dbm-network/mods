module.exports = {
  name: 'Color',
  section: 'Tools',

  subtitle (data) {
    return `${data.color}`
  },

  variableStorage (data, varType) {
    const type = parseInt(data.storage)
    if (type !== varType) return
    return ([data.varName, 'Color'])
  },

  fields: ['color', 'storage', 'varName'],

  html (isEvent, data) {
    return `
Color:<br>
<input type="color" id="color"><br><br>
<div>
  <div style="float: left; width: 35%;">
    Store In:<br>
    <select id="storage" class="round">
      ${data.variables[1]}
    </select>
  </div>
  <div id="varNameContainer" style="float: right; width: 60%;">
    Variable Name:<br>
    <input id="varName" class="round" type="text"><br>
  </div>
</div>`
  },

  init () {},

  action (cache) {
    const data = cache.actions[cache.index]
    const color = this.evalMessage(data.color, cache)

    if (color !== undefined) {
      const storage = parseInt(data.storage)
      const varName = this.evalMessage(data.varName, cache)
      this.storeValue(color, storage, varName, cache)
    }
    this.callNextAction(cache)
  },

  mod () {}
}
