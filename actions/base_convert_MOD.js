module.exports = {
  name: 'Base Convert MOD',
  section: 'Other Stuff',

  subtitle (data) {
    return `Base ${(data.basef)} to Base ${(data.baset)}`
  },

  variableStorage (data, varType) {
    const type = parseInt(data.storage)
    if (type !== varType) return
    const dataType = 'Number'
    return ([data.varName, dataType])
  },

  fields: ['num', 'basef', 'baset', 'storage', 'varName'],

  html (isEvent, data) {
    return `
<div style="float: left; width: 100%;">
  Number:<br>
  <input id="num" class="round" type="text">
</div><br><br><br>
<div>
  <div style="float: left; width: 40%;">
    Base From (2-36):<br>
    <input id="basef" class="round" type="number" min="2" max="36">
  </div>
  <div style="padding-left: 3%; float: left; width: 50%;">
    Base To (2-36):<br>
    <input id="baset" class="round" type="number" min="2" max="36">
  </div>
</div><br><br><br>
<div>
  <div style="float: left; width: 40%;">
    Store In:<br>
    <select id="storage" class="round">
      ${data.variables[1]}
    </select>
  </div>
  <div id="varNameContainer" style="padding-left: 3%; float: left; width: 55%;">
    Variable Name:<br>
    <input id="varName" class="round" type="text">
  </div>
</div>`
  },

  init () {},

  action (cache) {
    const data = cache.actions[cache.index]
    const num = this.evalMessage(data.num, cache)
    const basef = parseInt(data.basef)
    const baset = parseInt(data.baset)
    let result
    if (basef > 1 && basef <= 36 && baset > 1 && baset <= 36) {
      const base = parseInt(num, basef)
      if (!isNaN(base)) {
        result = base.toString(baset).toUpperCase()
      } else {
        console.log(`Invalid input, ${num} not Base-${basef}`)
      }
    }
    if (result !== undefined) {
      const storage = parseInt(data.storage)
      const varName = this.evalMessage(data.varName, cache)
      this.storeValue(result, storage, varName, cache)
    }
    this.callNextAction(cache)
  },

  mod () {}
}
