module.exports = {
  name: 'Basic Math Operation',
  section: 'Other Stuff',

  subtitle (data) {
    const info = ['Addition', 'Subtraction', 'Multiplication', 'Division']
    return `${info[data.info]}`
  },

  variableStorage (data, varType) {
    const type = parseInt(data.storage)
    if (type !== varType) return
    const dataType = 'Number'
    return ([data.varName, dataType])
  },

  fields: ['FirstNumber', 'info', 'SecondNumber', 'storage', 'varName'],

  html (isEvent, data) {
    return `
<div style="width: 90%;">
  First Number:<br>
  <input id="FirstNumber" class="round" type="text">
</div><br>
<div style="padding-top: 8px; width: 60%;">
  Math Operation:
  <select id="info" class="round">
      <option value="0" selected>Addition</option>
      <option value="1">Subtraction</option>
      <option value="2">Multiplication</option>
      <option value="3">Division</option>
  </select>
</div><br>
<div style="width: 90%;">
  Second Number:<br>
  <input id="SecondNumber" class="round" type="text">
</div><br>
<div style="padding-top: 8px;">
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
    const FN = parseFloat(this.evalMessage(data.FirstNumber, cache).replace(/,/g, ''))
    const SN = parseFloat(this.evalMessage(data.SecondNumber, cache).replace(/,/g, ''))
    const info = parseInt(data.info)

    let result
    switch (info) {
      case 0:
        result = FN + SN
        break
      case 1:
        result = FN - SN
        break
      case 2:
        result = FN * SN
        break
      case 3:
        result = FN / SN
        break
      default:
        break
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
