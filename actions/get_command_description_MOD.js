class GetCommandDescription {
  constructor (params) {
    this.name = 'Get Command Description'
    this.displayName = 'Get Command Description'
    this.section = 'Other Stuff'
    this.fields = ['findBy', 'commandData', 'saveTo', 'varName']
  }

  subtitle () {
    return 'Get Command Description'
  }

  html (isEvent, data) {
    return `
<div width="540" style="height: auto;" overflow-y="scroll">
  <div style="float: left; width: 35%;">
    Find By:<br>
    <select id="findBy" class="round">
      <option value="id">Command ID</option>
      <option value="name">Command Name</option>
    </select>
  </div>
  <div style="float: right; width: 60%;">
    Value:<br>
    <input type="text" id="commandData" class="round" placeholder="Value"></input>
  </div><br>
  <div style="float: left; width: 35%;">
    Save To:<br>
    <select id="saveTo" class="round">
      <option value="1">Temp Variable</option>
      <option value="2">Server Variable</option>
      <option value="3">Global Variable</option>
    </select>
  </div>
  <div style="float: right; width: 60%;">
    Variable Name:<br>
    <input type="text" id="varName" class="round" placeholder="Variable Name"></input>
  </div>
</div>`
  }

  init () {}

  action (cache) {
    const data = cache.actions[cache.index]
    const { findBy, saveTo } = data

    const findByValue = data.commandData
    const saveToName = data.varName

    const { Files } = this.getDBM()
    const { commands } = Files.data

    if (findBy === 'id') {
      let cmd

      for (let i = 0; i < commands.length; i++) {
        cmd = commands[i]
        if (!cmd) { continue }
        if (cmd && cmd._id === findByValue) {
          for (let j = 0; j < cmd.actions.length; j++) {
            const action = cmd.actions[j]
            if (action.name === 'Command Description') {
              this.storeValue(action.description, Number(saveTo), saveToName, cache)
              this.callNextAction(cache)
              return
            }
            console.log(action.name)
          }
        }
      }

      this.storeValue(null, Number(saveTo), saveToName, cache)
      this.callNextAction(cache)
    } else if (findBy === 'name') {
      let cmd

      for (let i = 0; i < commands.length; i++) {
        cmd = commands[i]
        if (!cmd) { continue }
        if (cmd && cmd.name === findByValue) {
          for (let j = 0; j < cmd.actions.length; j++) {
            const action = cmd.actions[j]
            if (action.name === 'Command Description') {
              this.storeValue(action.description, Number(saveTo), saveToName, cache)
              this.callNextAction(cache)
              return
            }
            console.log(action.name)
          }
        }
      }

      this.storeValue(null, Number(saveTo), saveToName, cache)
      this.callNextAction(cache)
    }

    this.callNextAction(cache)
  }

  mod () {}
}

module.exports = new GetCommandDescription()
