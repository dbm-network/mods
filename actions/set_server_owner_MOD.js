module.exports = {
  name: 'Set Server Owner',
  section: 'Server Control',

  subtitle (data) {
    const members = ['Mentioned User', 'Command Author', 'Temp Variable', 'Server Variable', 'Global Variable']
    return `${members[data.member]} ${data.member < 2 ? '' : `- ${data.varName2}`} ${!data.reason ? '' : `with Reason: <i>${data.reason}<i>`}`
  },

  fields: ['server', 'varName', 'member', 'varName2', 'reason'],

  html (isEvent, data) {
    return `
<div>
  <div style="float: left; width: 35%;">
    Source Server:<br>
    <select id="server" class="round" onchange="glob.serverChange(this, 'varNameContainer')">
      ${data.servers[isEvent ? 1 : 0]}
    </select>
  </div>
  <div id="varNameContainer" style="display: none; float: right; width: 60%;">
    Variable Name:<br>
    <input id="varName" class="round" type="text" list="variableList">
  </div>
</div><br><br><br>
<div style="padding-top: 8px;">
  <div style="float: left; width: 35%;">
    Source Member:<br>
    <select id="member" class="round" onchange="glob.memberChange(this, 'varNameContainer2')">
      ${data.members[isEvent ? 1 : 0]}
    </select>
  </div>
  <div id="varNameContainer2" style="display: none; float: right; width: 60%;">
    Variable Name:<br>
    <input id="varName2" class="round" type="text" list="variableList2"><br>
  </div>
</div><br><br><br>
<div style="padding-top: 8px;">
  Reason:<br>
  <textarea id="reason" rows="2" placeholder="Insert reason here... (optional)" style="width: 99%; font-family: monospace; white-space: nowrap; resize: none;"></textarea>
</div>`
  },

  init () {
    const { glob, document } = this

    glob.serverChange(document.getElementById('server'), 'varNameContainer')
    glob.memberChange(document.getElementById('member'), 'varNameContainer2')
  },

  action (cache) {
    const data = cache.actions[cache.index]

    const type = parseInt(data.server)
    const varName = this.evalMessage(data.varName, cache)
    const server = this.getServer(type, varName, cache)

    const member = parseInt(data.member)
    const varName2 = this.evalMessage(data.varName2, cache)
    const mem = this.getMember(member, varName2, cache)

    const reason = this.evalMessage(data.reason, cache)

    if (Array.isArray(server)) {
      this.callListFunc(server, 'setOwner', [mem]).then(() => {
        this.callNextAction(cache)
      })
    } else if (server && server.setOwner) {
      server.setOwner(mem, reason).then(() => {
        this.callNextAction(cache)
      }).catch(this.displayError.bind(this, data, cache))
    } else {
      this.callNextAction(cache)
    }
  },

  mod () {}
}
