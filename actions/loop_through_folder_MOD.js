module.exports = {
  name: 'Loop through Folder',
  section: 'Lists and Loops',

  subtitle () {
    return 'Loops through folder, and turns filenames into array'
  },

  variableStorage (data, varType) {
    const type = parseInt(data.storage)
    if (type !== varType) return
    return ([data.varName2, 'Array'])
  },

  fields: ['filename', 'storage', 'varName2'],

  html (isEvent, data) {
    return `
<div>
  <p>
    <u>Notice:</u><br>
    - The folder needs to be in the bot folder!<br>
    - This is a good path: ./resources/images<br>
    - This will turn all filenames in the folder into an array.<br>
  </p>
  <div style="float: left; width: 60%">
    Folder Path:
    <input id="filename" class="round" type="text">
  </div><br>
</div><br><br><br>
<div>
  <div style="float: left; width: 35%;">
    Store In:<br>
    <select id="storage" class="round">
        ${data.variables[1]}
    </select>
  </div>
  <div id="varNameContainer2" style="float: right; width: 60%;">
    Variable Name:<br>
    <input id="varName2" class="round" type="text"><br>
  </div>
</div>`
  },

  init () {},

  action (cache) {
    const data = cache.actions[cache.index]
    const path = this.evalMessage(data.filename, cache)
    const { readdirSync } = require('fs')
    let output = {}
    try {
      if (path) {
        output = readdirSync(path)
        this.storeValue(output, parseInt(data.storage), this.evalMessage(data.varName2, cache), cache)
      } else {
        console.log('Path is missing.')
      }
    } catch (err) {
      console.error(`ERROR!${err.stack}` ? err.stack : err)
    }
    this.callNextAction(cache)
  },

  mod () {}
}
