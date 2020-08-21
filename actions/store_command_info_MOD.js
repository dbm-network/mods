module.exports = {
  name: 'Store Command Info',
  section: 'Bot Client Control',

  subtitle (data) {
    const info = ['Command Name', 'Command ID', 'Command Type', 'Command Restriction', 'Command User Required Permission', 'Command Aliases', 'Command Time Restriction', 'Command Actions Length']
    const storage = ['', 'Temp Variable', 'Server Variable', 'Global Variable']
    return `${info[parseInt(data.info)]} - ${storage[parseInt(data.storage)]}`
  },

  variableStorage (data, varType) {
    const type = parseInt(data.storage)
    if (type !== varType) return
    let dataType = 'Unknown Type'
    switch (parseInt(data.info)) {
      case 0:
      case 1:
      case 2:
      case 3:
      case 4:
        dataType = 'Text'
        break
      case 5:
        dataType = 'List'
        break
      case 6:
      case 7:
        dataType = 'Number'
        break
    }
    return ([data.varName, dataType])
  },

  fields: ['searchCommandBy', 'valueToSearch', 'info', 'storage', 'varName'],

  html (isEvent, data) {
    return `
<div style="float: left; width: 40%">
  Search Command By:<br>
  <select id="searchCommandBy" class="round" onchange="glob.onChangeSame(this)">
    <option value="0">Name</option>
    <option value="1">ID</option>
    <option value="2" selected>None (Same Command)</option>
  </select>
</div>
<div id="vtsContainer" style="display: none; float: right; width: 55%">
  Value To Search:<br>
  <input id="valueToSearch" type="text" class="round">
</div><br><br><br>
<div style="float: left; width: 48%; padding-top: 8px">
  Source Info:<br>
  <select id="info" class="round">
    <option value="0" selected>Command Name</option>
    <option value="1">Command ID</option>
    <option value="2">Command Type</option>
    <option value="3">Command Restriction</option>
    <option value="4">Command User Required Permission</option>
    <option value="5">Command Aliases</option>
    <option value="6">Command Time Restriction</option>
    <option value="7">Command Actions Length</option>
  </select>
</div><br><br><br>
<div style="float: left; width: 35%; padding-top: 12px">
  Store In:<br>
  <select id="storage" class="round">
    ${data.variables[1]}
  </select>
</div>
<div id="varNameContainer" style="float: right; width: 60%; padding-top: 12px">
  Variable Name:<br>
  <input id="varName" class="round" type="text">
</div>`
  },

  init () {
    const { glob, document } = this

    glob.onChangeSame = function (searchCommandBy) {
      if (parseInt(searchCommandBy.value) === 2) {
        document.getElementById('vtsContainer').style.display = 'none'
      } else {
        document.getElementById('vtsContainer').style.display = null
      }
    }

    glob.onChangeSame(document.getElementById('searchCommandBy'))
  },

  action (cache) {
    const data = cache.actions[cache.index]
    const jp = this.getMods().require('jsonpath')

    const command = parseInt(data.searchCommandBy) === 0 ? jp.query(this.getDBM().Files.data.commands, `$..[?(@.name=="${this.evalMessage(data.valueToSearch, cache)}")]`) : parseInt(data.searchCommandBy) === 1 ? jp.query(this.getDBM().Files.data.commands, `$..[?(@._id=="${this.evalMessage(data.valueToSearch, cache)}")]`) : jp.query(this.getDBM().Files.data.commands, `$..[?(@.name=="${cache.msg.content.slice(this.getDBM().Files.data.settings.tag.length || cache.server.tag.length).split(/ +/).shift()}")]`)

    let result
    switch (parseInt(data.info)) {
      case 0:
        result = jp.query(command, '$..name').length > 1 ? jp.query(command, '$..name')[0] : jp.query(command, '$..name')
        break
      case 1:
        result = jp.query(command, '$.._id')
        break
      case 2:
        result = jp.query(command, '$..comType') === 0 || '' ? 'Normal Command' : jp.query(command, '$..comType') === 1 ? 'Includes Word' : jp.query(command, '$..comType') === 2 ? 'Matches Regular Expression' : 'Any Message'
        break
      case 3:
        result = jp.query(command, '$..restriction') === 0 ? 'none' : jp.query(command, '$..restriction') === 1 ? 'Server Only' : jp.query(command, '$..restriction') === 2 ? 'Owner Only' : jp.query(command, '$..restriction') === 3 ? 'DMs Only' : 'Bot Owner Only'
        break
      case 4:
        result = JSON.stringify(jp.query(command, '$..permissions')).slice(2, -2).replace('_', ' ').toLowerCase()
        break
      case 5:
        result = jp.query(command, '$.._aliases') === '' ? 'none' : jp.query(command, '$.._aliases')
        break
      case 6:
        result = jp.query(command, '$.._timeRestriction') === '' ? 'none' : parseInt(jp.query(command, '$.._timeRestriction'))
        break
      case 7:
        result = parseInt(jp.query(command, '$..name').length) - 1 === '' ? 'none' : parseInt(jp.query(command, '$..name').length) - 1
        break
    }

    if (!result) {
      result = 'invalid'
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
