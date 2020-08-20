module.exports = {
  name: 'Store Game Info',
  section: 'Member Control',

  subtitle (data) {
    const members = ['Mentioned User', 'Command Author', 'Temp Variable', 'Server Variable', 'Global Variable']
    const info = ['Game Application ID', 'Game Details', 'Game Name', 'Game State', 'Game Is Being Streamed?', 'Game Stream URL', 'Game Status Type', 'Game Large Image ID', 'Game Large Image URL', 'Game Large Image Text', 'Game Small Image ID', 'Game Small Image URL', 'Game Small Image Text', 'Game Timestamp Start', 'Game Party ID', 'Game Timestamp End', 'Game Party Size']
    return `${members[parseInt(data.member)]} - ${info[parseInt(data.info)]}`
  },

  variableStorage (data, varType) {
    const type = parseInt(data.storage)
    if (type !== varType) return
    const info = parseInt(data.info)
    let dataType = 'Unknown Type'
    switch (info) {
      case 0:
        dataType = 'Application ID'
        break
      case 1:
        dataType = 'Text'
        break
      case 2:
        dataType = 'Text'
        break
      case 3:
        dataType = 'Text'
        break
      case 4:
        dataType = 'Boolean'
        break
      case 5:
        dataType = 'Stream URL'
        break
      case 6:
        dataType = 'Number'
        break
      case 7:
        dataType = 'Large Image ID'
        break
      case 8:
        dataType = 'Large Image URL'
        break
      case 9:
        dataType = 'Large Image Text'
        break
      case 10:
        dataType = 'Small Image ID'
        break
      case 11:
        dataType = 'Small Image URL'
        break
      case 12:
        dataType = 'Small Image Text'
        break
      case 13:
        dataType = 'Date'
        break
      case 14:
        dataType = 'Party ID'
        break
      case 15:
        dataType = 'Date'
        break
      case 16:
        dataType = 'Number'
        break
    }
    return ([data.varName2, dataType])
  },

  fields: ['member', 'varName', 'info', 'storage', 'varName2'],

  html (isEvent, data) {
    return `
<div>
  <div style="float: left; width: 35%;">
    Source Member:<br>
    <select id="member" class="round" onchange="glob.memberChange(this, 'varNameContainer')">
      ${data.members[isEvent ? 1 : 0]}
    </select>
  </div>
  <div id="varNameContainer" style="display: none; float: right; width: 60%;">
    Variable Name:<br>
    <input id="varName" class="round" type="text" list="variableList"><br>
  </div>
</div><br><br><br>
<div>
  <div style="padding-top: 8px; width: 70%;">
    Source Info:<br>
    <select id="info" class="round">
      <option value="0">Game Application ID</option>
      <option value="1">Game Details</option>
      <option value="2" selected>Game Name</option>
      <option value="3">Game State</option>
      <option value="4">Game Is Being Streamed?</option>
      <option value="5">Game Stream URL</option>
      <option value="6">Game Status Type</option>
      <optgroup label="Timestamps">
        <option value="13">Game Timestamp Start</option>
        <option value="15">Game Timestamp End</option>
      </optgroup>
      <optgroup label="Party">
        <option value="14">Game Party ID</option>
        <option value="16">Game Party Size</option>
      </optgroup>
      <optgroup label="Assets Large Image">
        <option value="7">Game Large Image ID</option>
        <option value="8">Game Large Image URL</option>
      <option value="9">Game Large Image Text</option>
      </optgroup>
      <optgroup label="Assets Small Image">
        <option value="10">Game Small Image ID</option>
        <option value="11">Game Small Image URL</option>
        <option value="12">Game Small Image Text</option>
      </optgroup>
    </select>
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
    <input id="varName2" class="round" type="text"><br>
  </div>
</div>`
  },

  init () {
    const { glob, document } = this

    glob.memberChange(document.getElementById('member'), 'varNameContainer')
  },

  action (cache) {
    const data = cache.actions[cache.index]
    const info = parseInt(data.info)

    const member = parseInt(data.member)
    const varName = this.evalMessage(data.varName, cache)
    const mem = this.getMember(member, varName, cache)

    if (!mem || !mem.presence.activities[0]) {
      this.callNextAction(cache)
      return
    }

    let result = null
    switch (info) {
      case 0:
        result = mem.presence.activities[0].applicationID
        break
      case 1:
        result = mem.presence.activities[0].details
        break
      case 2:
        result = mem.presence.activities[0].name
        break
      case 3:
        result = mem.presence.activities[0].state
        break
      case 4:
        result = mem.presence.activities[0].streaming
        break
      case 5:
        result = mem.presence.activities[0].url
        break
      case 6:
        result = mem.presence.activities[0].type
        break
      case 7:
        result = mem.presence.activities[0].assets.largeImage || null
        break
      case 8:
        result = mem.presence.activities[0].assets.largeImageURL || null
        break
      case 9:
        result = mem.presence.activities[0].assets.largeText || null
        break
      case 10:
        result = mem.presence.activities[0].assets.smallImage || null
        break
      case 11:
        result = mem.presence.activities[0].assets.smallImageURL || null
        break
      case 12:
        result = mem.presence.activities[0].assets.smallText || null
        break
      case 13:
        result = mem.presence.activities[0].timestamps.start || null
        break
      case 14:
        result = mem.presence.activities[0].party.id || null
        break
      case 15:
        result = mem.presence.activities[0].timestamps.end || null
        break
      case 16:
        result = mem.presence.activities[0].party.size || null
        break
      default:
        break
    }

    if (result !== undefined) {
      const storage = parseInt(data.storage)
      const varName2 = this.evalMessage(data.varName2, cache)
      this.storeValue(result, storage, varName2, cache)
    }
    this.callNextAction(cache)
  },

  mod () {}
}
