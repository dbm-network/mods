module.exports = {
  name: 'Find Member',
  section: 'Member Control',

  subtitle (data) {
    const op1 = ['Member', 'User']
    const info = [' ID', ' Username', ' Display Name', ' Tag', ' Color']
    return `Find ${op1[parseInt(data.find2)]} by ${op1[parseInt(data.find2)]}${info[parseInt(data.info)]}`
  },

  variableStorage (data, varType) {
    const type = parseInt(data.storage)
    const op1 = ['Member', 'User']
    if (type !== varType) return
    return ([data.varName, `Server ${op1[parseInt(data.find2)]}`])
  },

  fields: ['info', 'find', 'storage', 'varName', 'find2', 'iffalse', 'iffalseVal'],

  html (isEvent, data) {
    return `
<div><p>This action has been modified by DBM Mods.</p></div><br>
<div style="float: left;">
  <select id="find2" onchange="glob.change()">
    <option value="0" selected>Find Member (current server only)</option>
    <option value="1">Find User (all servers)</option>
  </select>
</div><br><br>
<div>
  <div style="float: left; width: 40%;">
    Source Field:<br>
    <select id="info" class="round">
      <option value="0" selected>Member ID</option>
      <option value="1">Member Username</option>
      <option value="3">Member Tag</option>
      <option value="2">Member Display Name</option>
      <option value="4">Member Color</option>
    </select>
  </div>
  <div style="float: right; width: 55%;">
    Search Value:<br>
    <input id="find" class="round" type="text">
  </div>
</div><br><br><br>
<div style="padding-top: 8px;">
  <div style="float: left; width: 35%;">
    Store In:<br>
    <select id="storage" class="round">
      ${data.variables[1]}
    </select>
  </div>
  <div id="varNameContainer" style="float: right; width: 60%;">
    Variable Name:<br>
    <input id="varName" class="round" type="text">
  </div>
  <div style="float: left; width: 35%; padding-top: 10px;">
    If Member Wasn't Found:<br>
    <select id="iffalse" class="round" onchange="glob.onChangeFalse(this)">
      <option value="0" selected>Continue Actions</option>
      <option value="1">Stop Action Sequence</option>
      <option value="2">Jump To Action</option>
      <option value="3">Skip Next Actions</option>
      <option value="4">Jump To Anchor</option>
    </select>
  </div>
  <div id="iffalseContainer" style="display: none; float: right; width: 60%; padding-top: 10px;">
    <span id="iffalseName">Action Number</span>:<br><input id="iffalseVal" class="round" type="text">
  </div>
</div>`
  },

  init () {
    const { glob, document } = this
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
    glob.change = function () {
      try {
        const sel = document.getElementById('find2').value
        const option = document.getElementById('info')
        if (sel === '0') {
          for (let i = 0; i < option.length; i++) {
            option[i].disabled = false
            option[i].innerHTML = option[i].innerHTML.replace(/[^\s]*/, 'Member')
          }
        } else if (sel === '1') {
          option[3].disabled = true
          option[4].disabled = true
          for (let i = 0; i < option.length; i++) {
            option[i].innerHTML = option[i].innerHTML.replace(/[^\s]*/, 'User')
          }
        }
      } catch (err) {
        // eslint-disable-next-line no-undef
        alert(err)
      }
    }
    glob.change()
    glob.onChangeFalse(document.getElementById('iffalse'))
  },

  action (cache) {
    const { server } = cache
    if (!server || !server.members) {
      this.callNextAction(cache)
      return
    }
    const data = cache.actions[cache.index]
    const info = parseInt(data.info)
    const find = this.evalMessage(data.find, cache)
    const find2 = parseInt(data.find2)
    if (server.memberCount !== server.members.cache.size) server.members.fetch()
    const members = server.members.cache
    const users = this.getDBM().Bot.bot.users.cache
    let result
    switch (info) {
      case 0:
        result = members.get(find)
        break
      case 1:
        result = find2 === 0
          ? members.find((m) => m.user.username === find)
          : users.find((u) => u.username === find)
        break
      case 2:
        result = find2 === 0
          ? members.find((m) => m.displayName === find)
          : users.find((u) => u.username === find)
        break
      case 3:
        result = find2 === 0
          ? members.find((m) => m.user.tag === find)
          : users.find((u) => u.tag === find)
        break
      case 4:
        result = members.find((m) => m.displayHexColor === find)
        break
      default:
        break
    }

    if (result !== null || result !== undefined) {
      const storage = parseInt(data.storage)
      const varName = this.evalMessage(data.varName, cache)
      this.storeValue(result, storage, varName, cache)
      this.callNextAction(cache)
    } else {
      this.executeResults(false, data, cache)
    }
  },

  mod () {}
}
