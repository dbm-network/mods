module.exports = {
  name: 'Convert List to Text',
  section: 'Lists and Loops',

  subtitle (data) {
    const list = ['Server Members', 'Server Channels', 'Server Roles', 'Server Emojis', 'All Bot Servers', 'Mentioned User Roles', 'Command Author Roles', 'Temp Variable', 'Server Variable', 'Global Variable']
    return `Convert ${list[parseInt(data.list)]} to Text`
  },

  variableStorage (data, varType) {
    const type = parseInt(data.storage)
    if (type !== varType) return
    return ([data.varName2, 'Text'])
  },

  fields: ['list', 'varName', 'start', 'middle', 'end', 'storage', 'varName2', 'sort'],

  html (isEvent, data) {
    return `
<div><p>This action has been modified by DBM Mods.</p></div><br>
<div>
  <div style="float: left; width: 35%;">
    Source List:<br>
    <select id="list" class="round" onchange="glob.listChange(this, 'varNameContainer')">
      ${data.lists[isEvent ? 1 : 0]}
    </select>
  </div>
  <div id="varNameContainer" style="display: none; float: right; width: 60%;">
    Variable Name:<br>
    <input id="varName" class="round" type="text" list="variableList"><br>
  </div><br><br><br>
  <div>
    Sort List:<br>
    <select id="sort" class="round" style="width: 90%;">
      <option value="0">Sort By Name</option>
      <option value="1" selected>Don't Sort</option>
    </select>
  </div>
</div><br><br>
<div style="padding-top: 8px; display: table;">
  <div style="display: table-cell;">
    Start Characters:<br>
    <input id="start" class="round" type="text">
  </div>
  <div style="display: table-cell;">
    Middle Characters:<br>
    <input id="middle" class="round" type="text">
  </div>
  <div style="display: table-cell;">
    End Characters:<br>
    <input id="end" class="round" type="text" value="\\n">
  </div>
</div><br>
<div>
  <div style="float: left; width: 35%;">
    Store In:<br>
    <select id="storage" class="round">
      ${data.variables[1]}
    </select>
  </div>
  <div id="varNameContainer2" style="float: right; width: 60%;">
    Variable Name:<br>
    <input id="varName2" class="round" type="text">
  </div>
</div>`
  },

  init () {
    const { glob, document } = this

    glob.listChange(document.getElementById('list'), 'varNameContainer')
  },

  action (cache) {
    const data = cache.actions[cache.index]
    const storage = parseInt(data.list)
    const varName = this.evalMessage(data.varName, cache)
    let list = this.getList(storage, varName, cache)
    const sort = parseInt(data.sort)
    if (sort === 0) list = list.sort()

    const start = this.evalMessage(data.start, cache).replace('\\n', '\n')
    const middle = this.evalMessage(data.middle, cache).replace('\\n', '\n')
    const end = this.evalMessage(data.end, cache).replace('\\n', '\n')
    let result = ''

    for (let i = 0; i < list.length; i++) {
      if (i === 0) {
        result += start + String(list[i]) + end
      } else {
        result += start + middle + String(list[i]) + end
      }
    }

    if (result) {
      const varName2 = this.evalMessage(data.varName2, cache)
      const storage2 = parseInt(data.storage)
      this.storeValue(result, storage2, varName2, cache)
    }

    this.callNextAction(cache)
  },

  mod () {}
}
