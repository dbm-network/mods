module.exports = {
  name: 'Set Channel Permissions',

  section: 'Permission Control',

  subtitle (data) {
    const channels = ['Same Channel', 'Mentioned Channel', 'Default Channel', 'Temp Variable', 'Server Variable', 'Global Variable']
    const variables = ['', 'Temp Variable', 'Server Variable', 'Global Variable']
    if (data.storage < 3) {
      return `Channel ${channels[data.storage]} -> Permissions ${variables[data.storage3]} (${data.varName4})`
    }
    return `Channel ${channels[data.storage]} (${data.varName3}) -> Permissions ${variables[data.storage3]} (${data.varName4})`
  },

  fields: ['target', 'way', 'storage', 'varName3', 'role', 'varName', 'member', 'varName2', 'storage3', 'varName4', 'iftrue', 'iftrueVal', 'iffalse', 'iffalseVal'],

  html (isEvent, data) {
    data.conditions[0] = data.conditions[0].replace(/If True/g, 'If Set Success').replace(/If False/g, 'If Set Failed')
    return `
<div style="width: 550px; height: 350px; overflow-y: scroll;">
  <div style="padding-top: 8px;">
    <div style="float: left; width: 35%;">
      Target Type:<br>
      <select id="target" class="round" onchange="glob.targetChange(this)">
        <option value="0" selected>Role</option>
        <option value="1">Member</option>
      </select>
    </div>
    <div style="padding-left: 5%; float: left; width: 60%;">
      Permission Way:<br>
      <select id="way" class="round">
        <option value="0" selected>Update</option>
        <option value="1">Set</option>
      </select>
    </div>
  </div><br><br><br>
  <div style="padding-top: 8px;">
    <div style="float: left; width: 35%;">
      Source Channel:<br>
      <select id="storage" class="round" onchange="glob.channelChange(this, 'varNameContainer')">
        ${data.channels[isEvent ? 1 : 0]}
      </select>
    </div>
    <div id="varNameContainer" style="display: none; float: right; width: 60%;">
      Variable Name:<br>
      <input id="varName3" class="round" type="text" list="variableList">
    </div>
  </div><br><br><br>
  <div id="roleHolder" style="padding-top: 8px;">
    <div style="float: left; width: 35%;">
      Source Role:<br>
      <select id="role" class="round" onchange="glob.roleChange(this, 'varNameContainer2')">
        ${data.roles[isEvent ? 1 : 0]}
      </select>
    </div>
    <div id="varNameContainer2" style="display: none; float: right; width: 60%;">
      Variable Name:<br>
      <input id="varName" class="round" type="text" list="variableList">
    </div>
  </div>
  <div id="memberHolder" style="display: none; padding-top: 8px;">
    <div style="float: left; width: 35%;">
      Source Member:<br>
      <select id="member" class="round" onchange="glob.memberChange(this, 'varNameContainer3')">
        ${data.members[isEvent ? 1 : 0]}
      </select>
    </div>
    <div id="varNameContainer3" style="display: none; float: right; width: 60%;">
      Variable Name:<br>
      <input id="varName2" class="round" type="text" list="variableList">
    </div>
  </div><br><br><br>
  <div style="padding-top: 8px;">
    <div style="float: left; width: 35%;">
      Source Permissions:<br>
      <select id="storage3" class="round" onchange="glob.refreshVariableList(this)">
        ${data.variables[1]}
      </select>
    </div>
    <div style="float: right; width: 60%;">
      Variable Name:<br>
      <input id="varName4" class="round" type="text" list="variableList">
    </div>
  </div><br><br><br>
  <div style="padding-top: 8px;">
    ${data.conditions[0]}
  </div>
</div>`
  },

  init () {
    const { glob, document } = this

    glob.roleChange(document.getElementById('role'), 'varNameContainer2')
    glob.memberChange(document.getElementById('member'), 'varNameContainer3')

    glob.channelChange(document.getElementById('storage'), 'varNameContainer')
    glob.refreshVariableList(document.getElementById('storage3'))

    const roleHolder = document.getElementById('roleHolder')
    const memberHolder = document.getElementById('memberHolder')
    glob.targetChange = function (target) {
      if (target.value === '0') {
        roleHolder.style.display = null
        memberHolder.style.display = 'none'
      } else if (target.value === '1') {
        roleHolder.style.display = 'none'
        memberHolder.style.display = null
      }
    }
    glob.targetChange(document.getElementById('target'))
    const option = document.createElement('OPTION')
    option.value = '4'
    option.text = 'Jump to Anchor'
    const iffalse = document.getElementById('iffalse')
    if (iffalse.length === 4) {
      iffalse.add(option)
    }
    const option2 = document.createElement('OPTION')
    option2.value = '4'
    option2.text = 'Jump to Anchor'
    const iftrue = document.getElementById('iftrue')
    if (iftrue.length === 4) {
      iftrue.add(option2)
    }
    glob.onChangeTrue = function (event) {
      switch (parseInt(event.value)) {
        case 0:
        case 1:
          document.getElementById('iftrueContainer').style.display = 'none'
          break
        case 2:
          document.getElementById('iftrueName').innerHTML = 'Action Number'
          document.getElementById('iftrueContainer').style.display = null
          break
        case 3:
          document.getElementById('iftrueName').innerHTML = 'Number of Actions to Skip'
          document.getElementById('iftrueContainer').style.display = null
          break
        case 4:
          document.getElementById('iftrueName').innerHTML = 'Anchor ID'
          document.getElementById('iftrueContainer').style.display = null
          break
      }
    }
    glob.onChangeFalse = function (event) {
      switch (parseInt(event.value)) {
        case 0:
        case 1:
          document.getElementById('iffalseContainer').style.display = 'none'
          break
        case 2:
          document.getElementById('iffalseName').innerHTML = 'Action Number'
          document.getElementById('iffalseContainer').style.display = null
          break
        case 3:
          document.getElementById('iffalseName').innerHTML = 'Number of Actions to Skip'
          document.getElementById('iffalseContainer').style.display = null
          break
        case 4:
          document.getElementById('iffalseName').innerHTML = 'Anchor ID'
          document.getElementById('iffalseContainer').style.display = null
          break
      }
    }
    glob.onChangeFalse(document.getElementById('iffalse'))
    glob.onChangeTrue(document.getElementById('iftrue'))
  },

  action (cache) {
    const data = cache.actions[cache.index]
    const way = parseInt(data.way)

    const type = parseInt(data.target)
    let target
    if (type === 0) {
      const role = parseInt(data.role)
      const varName = this.evalMessage(data.varName, cache)
      target = this.getRole(role, varName, cache)
    } else {
      const member = parseInt(data.member)
      const varName2 = this.evalMessage(data.varName2, cache)
      target = this.getMember(member, varName2, cache)
    }

    const storage = parseInt(data.storage)
    const varName3 = this.evalMessage(data.varName3, cache)
    const targetChannel = this.getChannel(storage, varName3, cache)

    const storage3 = parseInt(data.storage3)
    const varName4 = this.evalMessage(data.varName4, cache)
    let permissions = this.getVariable(storage3, varName4, cache)

    const perms = {}
    if (permissions.bitfield) {
      const temp = permissions
      permissions = { allow: temp }
    }
    if (permissions.allow) {
      permissions.allow.toArray().forEach((perm) => {
        perms[perm] = true
      })
    }
    if (permissions.disallow) {
      permissions.disallow.toArray().forEach((perm) => {
        perms[perm] = false
      })
    }
    if (permissions.inherit) {
      permissions.inherit.forEach((perm) => {
        perms[perm] = null
      })
    }

    if (way === 0) {
      targetChannel.updateOverwrite(target, perms).then(() => {
        this.executeResults(true, data, cache)
      }).catch((error) => {
        console.error(error)
        this.executeResults(false, data, cache)
      })
    } else {
      targetChannel.createOverwrite(target, perms).then(() => {
        this.executeResults(true, data, cache)
      }).catch((error) => {
        console.error(error)
        this.executeResults(false, data, cache)
      })
    }
  },

  mod () {}
}
