module.exports = {
  name: 'Convert Seconds To D/H/M/S',
  section: 'Other Stuff',

  subtitle (data) {
    return `Convert ${data.time}`
  },

  variableStorage (data, varType) {
    const type = parseInt(data.storage)
    if (type !== varType) return
    return ([data.varName, 'Date'])
  },

  fields: ['time', 'storage', 'varName'],

  html (isEvent, data) {
    return `
<div style="float: left; width: 70%; padding-top: 8px;">
  Seconds to Convert:
  <input id="time" class="round" type="text" placeholder="e.g. 1522672056 or use Variables">
</div>
<div style="float: left; width: 35%; padding-top: 8px;">
  Store Result In:<br>
  <select id="storage" class="round" onchange="glob.variableChange(this, 'varNameContainer')">
  ${data.variables[0]}
  </select>
</div>
<div id="varNameContainer" style="float: right; display: none; width: 60%; padding-top: 8px;">
  Variable Name:<br>
  <input id="varName" class="round" type="text">
</div><br><br>`
  },

  init () {
    const { glob, document } = this

    glob.variableChange(document.getElementById('storage'), 'varNameContainer')
  },

  action (cache) {
    const data = cache.actions[cache.index]
    const time = this.evalMessage(data.time, cache)
    let d
    let h
    let m
    let s
    let result

    if (isNaN(time)) {
      console.log('Please insert a number')
    } else {
      s = time

      m = Math.floor(s / 60)
      s %= 60
      h = Math.floor(m / 60)
      m %= 60
      d = Math.floor(h / 24)
      h %= 24

      result = `${d}d ${h}h ${m}m ${s}s`
    }

    if (result.toString() === 'Invalid Date') result = undefined

    if (result !== undefined) {
      const storage = parseInt(data.storage)
      const varName = this.evalMessage(data.varName, cache)
      this.storeValue(result, storage, varName, cache)
    }
    this.callNextAction(cache)
  },

  mod () {}
}
