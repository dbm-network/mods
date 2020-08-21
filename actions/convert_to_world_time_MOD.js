module.exports = {
  name: 'Convert To World Time',
  section: 'Other Stuff',

  subtitle (data) {
    return 'Input a timezone and retrieve its current time.'
  },

  variableStorage (data, varType) {
    const type = parseInt(data.storage)
    if (type !== varType) return
    return ([data.varName, 'Time'])
  },

  fields: ['textbox', 'info', 'storage', 'varName'],

  html (isEvent, data) {
    return `
<div>
  <div style="width: 90%;">
    To Be Converted:<br>
    <input id="textbox" class="round" type="text">
  </div><br>
</div><br>
<div style="padding-top: 8px;">
  <div style="float: left; width: 35%;">
    Store Converted Time In:<br>
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
    const Mods = this.getMods()
    const moment = Mods.require('moment-timezone')
    const str = this.evalMessage(data.textbox, cache)
    const timec = moment().tz(str).format('dddd, MMMM Do YYYY, h:mm:ss a')
    const storage = parseInt(data.storage)
    const varName = this.evalMessage(data.varName, cache)
    this.storeValue(timec, storage, varName, cache)
    this.callNextAction(cache)
  },

  mod () {}
}
