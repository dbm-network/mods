module.exports = {
  name: 'Repeat String',
  section: 'Other Stuff',

  subtitle (data) {
    return `${data.xtimes || '0'}x "${data.girdi || 'None'}"`
  },

  variableStorage (data, varType) {
    const type = parseInt(data.storage)
    if (type !== varType) return
    return ([data.varName, 'Text'])
  },

  fields: ['storage', 'varName', 'girdi', 'xtimes'],

  html (isEvent, data) {
    return `
<div>
  <div>
    String:<br>
    <input placeholder="String or varible" id="girdi" class="round" type="text">
  </div><br>
  <div>
    Times:<br>
    <input placeholder="Number or varible" id="xtimes" class="round" type="text">
  </div>
</div><br>
<div>
  <div style="float: left; width: 35%;">
    Store In:<br>
    <select id="storage" class="round">
      ${data.variables[1]}
    </select>
  </div>
  <div id="varNameContainer" style="float: right; width: 60%;">
    Variable Name:<br>
    <input id="varName" class="round" type="text">
  </div>
</div>`
  },

  init () {},

  action (cache) {
    const data = cache.actions[cache.index]
    const type = parseInt(data.storage)
    const varName = this.evalMessage(data.varName, cache)
    const girdi = this.evalMessage(data.girdi, cache)
    const xtimes = this.evalMessage(data.xtimes, cache)

    const Mods = this.getMods()
    const repeat = Mods.require('repeat-string')
    const val = repeat(girdi, xtimes)
    this.storeValue(val, type, varName, cache)
    this.callNextAction(cache)
  },

  mod () {}
}
