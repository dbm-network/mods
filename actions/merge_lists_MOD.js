module.exports = {
  name: 'Merge Lists',
  section: 'Lists and Loops',

  subtitle (data) {
    return 'Merge two lists together'
  },

  variableStorage (data, varType) {
    const type = parseInt(data.storage3)
    if (type !== varType) return
    return ([data.varName3, 'Unknown Type'])
  },

  fields: ['storage', 'varName', 'storage2', 'varName2', 'varName3', 'storage3'],

  html (isEvent, data) {
    return `
<div>
  <div style="float: left; width: 35%;">
    Source List:<br>
    <select id="storage" class="round" onchange="glob.variableChange(this, 'varNameContainer')">
      ${data.lists[isEvent ? 1 : 0]}
    </select>
  </div>
  <div id="varNameContainer" style="float: right; width: 60%;">
    Variable Name:<br>
    <input id="varName" class="round varSearcher" type="text" list="variableList">
  </div>
</div><br><br><br>
<div style="padding-top: 8px;">
  <div style="float: left; width: 35%;">
    Source List 2:<br>
    <select id="storage2" class="round" onchange="glob.variableChange(this, 'varNameContainer2')">
      ${data.lists[isEvent ? 1 : 0]}
    </select>
  </div>
  <div id="varNameContainer2" style="float: right; width: 60%;">
    Variable Name 2:<br>
    <input id="varName2" class="round varSearcher" type="text" list="variableList">
  </div>
</div>
</div><br><br><br>
<div>
  <div style="float: left; width: 35%;">
    Store In:<br>
    <select id="storage3" class="round" onchange="glob.variableChange(this, 'varNameContainer3')">
      ${data.variables[1]}
    </select>
  </div>
  <div id="varNameContainer3" style="display: none; float: right; width: 60%;">
    Variable Name:<br>
    <input id="varName3" class="round" type="text">
  </div>
</div>`
  },

  init () {
    const { glob, document } = this
    glob.listChange(document.getElementById('storage'), 'varNameContainer')
    glob.listChange(document.getElementById('storage2'), 'varNameContainer')
    glob.variableChange(document.getElementById('storage3'), 'varNameContainer3')
  },

  action (cache) {
    const data = cache.actions[cache.index]

    const varName = this.evalMessage(data.varName, cache)
    const storage = parseInt(data.storage)
    const list = this.getList(storage, varName, cache)

    const varName2 = this.evalMessage(data.varName2, cache)
    const storage2 = parseInt(data.storage2)
    const list2 = this.getList(storage2, varName2, cache)

    const result = list.concat(list2)

    if (result) {
      const varName3 = this.evalMessage(data.varName3, cache)
      const storage3 = parseInt(data.storage3)
      this.storeValue(result, storage3, varName3, cache)
      return this.callNextAction(cache)
    }
    console.log('Issue with merge lists mod!')
    return this.callNextAction(cache)
  },

  mod () {}
}
