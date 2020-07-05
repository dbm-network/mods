module.exports = {
  name: 'Store Role Info',
  section: 'Role Control',

  subtitle (data) {
    const roles = ['Mentioned Role', '1st Author Role', '1st Server Role', 'Temp Variable', 'Server Variable', 'Global Variable']
    const info = ['Role Object', 'Role ID', 'Role Name', 'Role Color', 'Role Position', 'Role Timestamp', 'Role Is Mentionable?', 'Role Is Separate From Others?', 'Role Is Managed?', 'Role Member List', 'Role Creation Date', 'Role Permissions', 'Role Members Amount', 'Role Permissions List']
    return `${roles[parseInt(data.role)]} - ${info[parseInt(data.info)]}`
  },

  variableStorage (data, varType) {
    const type = parseInt(data.storage)
    if (type !== varType) return
    const info = parseInt(data.info)
    let dataType = 'Unknown Type'
    switch (info) {
      case 0:
        dataType = 'Role'
        break
      case 1:
        dataType = 'Role ID'
        break
      case 2:
        dataType = 'Text'
        break
      case 3:
        dataType = 'Color'
        break
      case 4:
      case 5:
        dataType = 'Text'
        break
      case 6:
      case 7:
      case 8:
        dataType = 'Boolean'
        break
      case 9:
        dataType = 'Member List'
        break
      case 10:
        dataType = 'Date'
        break
      case 11:
      case 12:
        dataType = 'Number'
        break
    }
    return ([data.varName2, dataType])
  },

  fields: ['role', 'varName', 'info', 'storage', 'varName2'],

  html (isEvent, data) {
    return `
<div><p>This action has been modified by DBM Mods.</p></div><br>
<div>
  <div style="float: left; width: 35%;">
    Source Role:<br>
    <select id="role" class="round" onchange="glob.roleChange(this, 'varNameContainer')">
      ${data.roles[isEvent ? 1 : 0]}
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
      <option value="0" selected>Role Object</option>
      <option value="1">Role ID</option>
      <option value="2">Role Name</option>
      <option value="3">Role Color</option>
      <option value="4">Role Position</option>
      <option value="10">Role Creation Date</option>
      <option value="5">Role Timestamp</option>
      <option value="11">Role Permissions</option>
      <option value="9">Role Members</option>
      <option value="12">Role Members Amount</option>
      <option value="6">Role Is Mentionable?</option>
      <option value="7">Role Is Separate From Others?</option>
      <option value="8">Role Is Managed By Bot/Integration</option>
      <option value="13">Role Permissions List</option>
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

    glob.roleChange(document.getElementById('role'), 'varNameContainer')
  },

  action (cache) {
    const data = cache.actions[cache.index]
    const role = parseInt(data.role)
    const varName = this.evalMessage(data.varName, cache)
    const info = parseInt(data.info)
    const targetRole = this.getRole(role, varName, cache)
    if (!targetRole) {
      this.callNextAction(cache)
      return
    }
    let result
    switch (info) {
      case 0:
        result = targetRole
        break
      case 1:
        result = targetRole.id
        break
      case 2:
        result = targetRole.name
        break
      case 3:
        result = targetRole.hexColor
        break
      case 4:
        result = targetRole.position
        break
      case 5:
        result = targetRole.createdTimestamp
        break
      case 6:
        result = targetRole.mentionable
        break
      case 7:
        result = targetRole.hoist
        break
      case 8:
        result = targetRole.managed
        break
      case 9:
        result = targetRole.members.array()
        break
      case 10:
        result = targetRole.createdAt
        break
      case 11:
        result = targetRole.permissions.toArray()
        break
      case 12:
        result = targetRole.members.size
        break
      case 13:
        result = targetRole.permissions.toArray().join(', ').replace(/_/g, ' ').toLowerCase()
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
