module.exports = {
  name: 'Set Permissions',

  section: 'Permission Control',

  subtitle (data) {
    const roles = ['Mentioned Role', '1st Author Role', '1st Server Role', 'Temp Variable', 'Server Variable', 'Global Variable']
    const way = ['Update', 'Set']
    return `${way[data.way]} ${roles[data.storage]} ${!data.reason ? '' : `with Reason: <i>${data.reason}<i>`}`
  },

  fields: ['way', 'storage', 'varName', 'storage2', 'varName2', 'reason'],

  html (isEvent, data) {
    return `
<div style="padding-top: 8px;">
  <div style="float: left; width: 60%;">
    Permission Way:<br>
    <select id="way" class="round">
      <option value="0" selected>Update</option>
      <option value="1">Set</option>
    </select>
  </div>
</div><br><br><br>
<div style="padding-top: 8px;">
  <div style="float: left; width: 35%;">
    Source Role:<br>
    <select id="storage" class="round" onchange="glob.roleChange(this, 'varNameContainer')">
      ${data.roles[isEvent ? 1 : 0]}
    </select>
  </div>
  <div id="varNameContainer" style="display: none; float: right; width: 60%;">
    Variable Name:<br>
    <input id="varName" class="round" type="text" list="variableList"><br>
  </div>
</div><br><br><br>
<div style="padding-top: 8px;">
  <div style="float: left; width: 35%;">
    Source Permissions:<br>
    <select id="storage2" class="round" onchange="glob.refreshVariableList(this)">
      ${data.variables[1]}
    </select><br>
  </div>
  <div style="float: right; width: 60%;">
    Variable Name:<br>
    <input id="varName2" class="round" type="text" list="variableList"><br>
  </div>
</div><br><br><br>
<div style="padding-top: 8px;">
  Reason:<br>
  <textarea id="reason" rows="2" placeholder="Insert reason here... (optional)" style="width: 99%; font-family: monospace; white-space: nowrap; resize: none;"></textarea>
</div>`
  },

  init () {
    const { glob, document } = this

    glob.roleChange(document.getElementById('storage'), 'varNameContainer')
    glob.refreshVariableList(document.getElementById('storage2'))
  },

  action (cache) {
    const data = cache.actions[cache.index]
    const storage = parseInt(data.storage)
    const varName = this.evalMessage(data.varName, cache)
    const storage2 = parseInt(data.storage2)
    const varName2 = this.evalMessage(data.varName2, cache)

    const role = this.getRole(storage, varName, cache)
    let permissions = this.getVariable(storage2, varName2, cache)
    const reason = this.evalMessage(data.reason, cache)
    const way = parseInt(data.way)

    if (way === 0) {
      const { Permissions } = this.getDBM().DiscordJS
      const tempPermissions = new Permissions()
      tempPermissions.add(role.permissions)
      if (permissions.allow) {
        tempPermissions.add(permissions.allow)
      }
      if (permissions.disallow) {
        tempPermissions.remove(permissions.disallow)
      }
      permissions = tempPermissions
    } else {
      permissions = permissions.allow
    }

    role.setPermissions(permissions, reason).then(() => {
      this.callNextAction(cache)
    }).catch(this.displayError.bind(this, data, cache))
  },

  mod () {}
}
