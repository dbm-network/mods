module.exports = {
  name: 'Generate Random Emoji',
  section: 'Other Stuff',

  subtitle (data) {
    return "Generate emoji's"
  },

  variableStorage (data, varType) {
    const type = parseInt(data.storage)
    if (type !== varType) return
    const dataType = 'Text'
    return ([data.varName, dataType])
  },

  fields: ['storage', 'varName'],

  html (isEvent, data) {
    return `
<div style="padding-top: 8px;">
  <div id="varNameContainer" style="float: right; width: 60%;">
    Variable Name:<br>
    <input id="varName" class="round" type="text">
  </div>
  <div style="float: left; width: 35%;">
    Store In:<br>
    <select id="storage" class="round">
      ${data.variables[1]}
    </select>
  </div>
</div>`
  },

  init () {},

  action (cache) {
    const data = cache.actions[cache.index]
    const storage = parseInt(data.storage)
    const varName = this.evalMessage(data.varName, cache)

    const Mods = this.getMods()
    const emoji = Mods.require('node-emoji')
    const res = emoji.random()
    this.storeValue(res.emoji, storage, varName, cache)
    this.callNextAction(cache)
  },

  mod () {}
}
