module.exports = {
  name: 'Store Channel Permissions',

  section: 'Permission Control',

  subtitle (data) {
    const roles = ['Mentioned Role', '1st Author Role', '1st Server Role', 'Temp Variable', 'Server Variable', 'Global Variable']
    const index = ['Granted', 'Denied']
    const perm = ['Administrator', 'Manage Guild', 'Manage Nicknames', 'Manage Roles', 'Manage Emojis', 'Kick Members', 'Ban Members', 'View Audit Log', 'Change Nickname', 'Create Instant Invite', 'Priority Speaker', 'Manage Channel', 'Manage Webhooks', 'Read Messages', 'Send Messages', 'Send TTS Messages', 'Manage Messages', 'Embed Links', 'Attach Files', 'Read Message History', 'Mention Everyone', 'Use External Emojis', 'Add Reactions', 'Connect to Voice', 'Speak in Voice', 'Mute Members', 'Deafen Members', 'Move Members', 'Use Voice Activity', 'All Permissions']
    return `${roles[data.role]} - ${perm[data.permission]} - ${index[data.state]} ${!data.reason ? '' : `with Reason: <i>${data.reason}<i>`}`
  },

  fields: ['storage', 'varName', 'target', 'role', 'varName2', 'member', 'varName3', 'storage3', 'varName4'],

  html (isEvent, data) {
    return `
<div style="padding-top: 8px;">
  <div style="float: left; width: 35%;">
    Source Channel:<br>
    <select id="storage" class="round" onchange="glob.channelChange(this, 'varNameContainer')">
      ${data.channels[isEvent ? 1 : 0]}
    </select>
  </div>
  <div id="varNameContainer" style="display: none; float: right; width: 60%;">
    Variable Name:<br>
    <input id="varName" class="round" type="text" list="variableList">
  </div>
</div><br><br><br>
<div style="padding-top: 8px;">
  <div style="float: left; width: 35%;">
    Target Type:<br>
    <select id="target" class="round" onchange="glob.targetChange(this)">
      <option value="0" selected>Role</option>
      <option value="1">Member</option>
    </select>
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
    <input id="varName2" class="round" type="text" list="variableList"><br>
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
    <input id="varName3" class="round" type="text" list="variableList">
  </div>
</div><br><br><br>
<div style="padding-top: 8px;">
  <div style="float: left; width: 35%;">
    Store In:<br>
    <select id="storage2" class="round">
      ${data.variables[1]}
    </select>
  </div>
  <div style="float: right; width: 60%;">
    Variable Name:<br>
    <input id="varName4" class="round" type="text">
  </div>
</div>`
  },

  init () {
    const { glob, document } = this

    glob.channelChange(document.getElementById('storage'), 'varNameContainer')

    glob.roleChange(document.getElementById('role'), 'varNameContainer2')
    glob.memberChange(document.getElementById('member'), 'varNameContainer3')

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
  },

  action (cache) {
    const data = cache.actions[cache.index]

    const type = parseInt(data.target)
    let target
    if (type === 0) {
      const role = parseInt(data.role)
      const varName2 = this.evalMessage(data.varName2, cache)
      target = this.getRole(role, varName2, cache)
    } else {
      const member = parseInt(data.member)
      const varName3 = this.evalMessage(data.varName3, cache)
      target = this.getMember(member, varName3, cache)
    }

    const storage = parseInt(data.storage)
    const varName = this.evalMessage(data.varName, cache)
    const targetChannel = this.getChannel(storage, varName, cache)

    const allow = target.permissionsIn(targetChannel)
    const permissions = {}
    permissions.allow = allow

    const { Permissions } = this.getDBM().DiscordJS
    const disallow = new Permissions()
    disallow.add(target.permissions)
    disallow.remove(allow)
    permissions.disallow = disallow

    const varName4 = this.evalMessage(data.varName4, cache)
    const storage2 = parseInt(data.storage2)
    this.storeValue(permissions, storage2, varName4, cache)
    this.callNextAction(cache)
  },

  mod () {}
}
