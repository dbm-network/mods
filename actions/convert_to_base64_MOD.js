module.exports = {
  name: 'Convert to Base64',
  section: 'Other Stuff',

  subtitle () {
    return 'Convert To Base64'
  },

  variableStorage (data, varType) {
    if (parseInt(data.storage) !== varType) return
    return ([data.varName, 'String'])
  },

  fields: ['input', 'info', 'storage', 'varName'],

  html (isEvent, data) {
    return `
<div style="width: 90%;">
  Text or Morse Code:<br>
  <input id="input" class="round" type="text">
</div><br>
<div style="padding-top: 8px; width: 60%;">
  Options:
  <select id="info" class="round">
    <option value="0" selected>Encode</option>
    <option value="1">Decode</option>
  </select>
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
    const storage = parseInt(data.storage)
    const info = parseInt(data.info)
    const varName = this.evalMessage(data.varName, cache)
    const input = this.evalMessage(data.input, cache)
    let result
    switch (info) {
      case 0:
        result = Buffer.from(input).toString('base64')
        break
      case 1:
        result = Buffer.from(input, 'base64').toString()
        break
    }
    this.storeValue(result, storage, varName, cache)
    this.callNextAction(cache)
  },

  mod () {}
}
