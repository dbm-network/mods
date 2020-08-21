module.exports = {
  name: 'Replace Text',
  section: 'Other Stuff',

  subtitle (data) {
    const info = ['Replace the first result', 'Replace all results']
    return `${info[data.info]}`
  },

  variableStorage (data, varType) {
    const type = parseInt(data.storage)
    if (type !== varType) return
    const dataType = 'String'
    return ([data.varName, dataType])
  },

  fields: ['text', 'text2', 'text3', 'info', 'storage', 'varName'],

  html (isEvent, data) {
    return `
<div style="padding-top: 8px;">
  Source Text:
  <textarea id="text" rows="3" placeholder="Insert source text here..." style="width: 99%; font-family: monospace; white-space: nowrap; resize: none;"></textarea>
</div>
<div>
  <div style="float: left; padding-top: 8px; width: 50%;">
    Replace this:<br>
    <input id="text2" class="round" type="text">
  </div>
  <div style="float: right; padding-top: 8px; width: 50%;">
    To this:<br>
    <input id="text3" class="round" type="text">
  </div><br><br><br><br>
</div>
<div style="width: 40%;">
  Type:<br>
<select id="info" class="round">
  <option value="0" selected>Replace the first result</option>
  <option value="1">Replace all results</option>
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
    const text = this.evalMessage(data.text, cache)
    const text2 = this.evalMessage(data.text2, cache)
    const text3 = this.evalMessage(data.text3, cache)
    const info = parseInt(data.info)

    let result
    switch (info) {
      case 0:
        result = text.replace(text2, text3)
        break
      case 1:
        const Mods = this.getMods()
        const replacestr = Mods.require('replace-string')
        result = replacestr(text, text2, text3)
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
