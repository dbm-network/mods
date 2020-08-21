module.exports = {
  name: 'Ban Member',
  section: 'Member Control',

  subtitle (data) {
    const users = ['Mentioned User', 'Command Author', 'Temp Variable', 'Server Variable', 'Global Variable', 'By ID']
    const guilds = ['Current Server', 'Temp Variable', 'Server Variable', 'Global Variable']
    return `${users[parseInt(data.member)]} - ${guilds[parseInt(data.guild)]}`
  },

  fields: ['member', 'varName', 'reason', 'guild', 'varName2', 'days'],

  html (isEvent, data) {
    return `
This action has been modified by DBM Mods.<br>
<div>
  <div style="float: left; width: 35%;">
    Member:<br>
    <select id="member" class="round" onchange="glob.user(this, 'varNameContainer')">
      ${data.members[isEvent ? 1 : 0]}
      <option value="5">By ID</option>
    </select>
  </div>
  <div id="varNameContainer" style="display: none; float: right; width: 60%;">
    Variable Name:<br>
    <input id="varName" class="round" type="text" list="variableList"><br>
  </div><br><br><br>
  <div style="float: left; width: 35%;">
    Server:<br>
    <select id="guild" class="round" onchange="glob.serverChange(this, 'varNameContainer2')">
      ${data.servers[isEvent ? 1 : 0]}
    </select>
  </div>
  <div id="varNameContainer2" style="display: none; float: right; width: 60%;">
    Variable Name:<br>
    <input id="varName2" class="round" type="text" list="variableList"><br>
  </div>
</div>
<br><br><br>
<div style="padding-top: 8px;">
  Reason:<br>
  <textarea id="reason" rows="5" placeholder="Insert reason here..." style="width: 99%; font-family: monospace; white-space: nowrap; resize: none;"></textarea><br>
</div>
<div style="padding-top: 8px;">
  Days of Messages to Delete:<br>
  <textarea id="days" rows="1" style="width: 99%; font-family: monospace; white-space: nowrap; resize: none;"></textarea>
</div>`
  },

  init () {
    const { glob, document } = this

    glob.user = function (element, container) {
      if (element.value === '5') {
        document.getElementById(container).childNodes[0].nodeValue = 'User ID:'
      } else {
        document.getElementById(container).childNodes[0].nodeValue = 'Variable Name:'
      }
      glob.memberChange(element, container)
    }

    glob.user(document.getElementById('member'), 'varNameContainer')
    glob.serverChange(document.getElementById('guild'), 'varNameContainer2')
  },

  action (cache) {
    const data = cache.actions[cache.index]
    const type = parseInt(data.member)
    const varName = this.evalMessage(data.varName, cache)
    const varName2 = this.evalMessage(data.varName2, cache)
    const guildType = parseInt(data.guild)
    const server = this.getServer(guildType, varName2, cache)
    const reason = this.evalMessage(data.reason, cache) || ''
    const days = parseInt(this.evalMessage(data.days, cache))
    const member = type === 5 ? this.evalMessage(varName) : this.getMember(type, varName, cache)
    if (guildType !== 0) {
      cache.server = server
    }
    if (Array.isArray(member)) {
      this.callListFunc(member, 'ban', [{ days, reason }]).then(() => this.callNextAction(cache))
    } else if (member) {
      server.members.ban(member, { days, reason })
        .then(() => this.callNextAction(cache))
        .catch(this.displayError.bind(this, data, cache))
    } else {
      this.callNextAction(cache)
    }
  },

  mod () {}
}
