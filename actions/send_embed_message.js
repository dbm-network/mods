module.exports = {
  name: 'Send Embed Message',
  section: 'Embed Message',

  subtitle (data) {
    const channels = ['Same Channel', 'Command Author', 'Mentioned User', 'Mentioned Channel', 'Default Channel (Top Channel)', 'Temp Variable', 'Server Variable', 'Global Variable']
    return `${channels[parseInt(data.channel)]}: ${data.varName}`
  },

  variableStorage (data, varType) {
    const type = parseInt(data.storage3)
    if (type !== varType) return
    return ([data.varName3, 'Message'])
  },

  fields: ['storage', 'varName', 'channel', 'varName2', 'storage3', 'varName3', 'iffalse', 'iffalseVal', 'messageContent'],

  html (isEvent, data) {
    return `
<div><p>This action has been modified by DBM Mods.</p></div><br>
<div>
  <div style="float: left; width: 35%;">
    Source Embed Object:<br>
    <select id="storage" class="round" onchange="glob.refreshVariableList(this)">
      ${data.variables[1]}
    </select>
  </div>
  <div id="varNameContainer" style="float: right; width: 60%;">
    Variable Name:<br>
    <input id="varName" class="round" type="text" list="variableList">
  </div><br><br><br>
  <div style="float: left; padding-top: 4px; width: 42%; height: 30px">
    Message Content:<br>
    <input id="messageContent" class="round" type="text" placeholder="Leave blank to ignore...">
  </div><br><br><br>
  <div style="padding-top: 8px; float: left; width: 35%;">
    Send To:<br>
    <select id="channel" class="round" onchange="glob.sendTargetChange(this, 'varNameContainer2')">
      ${data.sendTargets[isEvent ? 1 : 0]}
    </select>
  </div>
  <div id="varNameContainer2" style="display: none; float: right; width: 60%; padding-top: 8px">
    Variable Name:<br>
    <input id="varName2" class="round" type="text" list="variableList"><br>
  </div><br><br><br><br>
  <div style="float: left; width: 35%;">
    Store Message Object In:<br>
    <select id="storage3" class="round" onchange="glob.variableChange(this, 'varNameContainer3')">
      ${data.variables[0]}
    </select>
  </div>
  <div id="varNameContainer3" style="display: ; float: right; width: 60%;">
    Storage Variable Name:<br>
    <input id="varName3" class="round" type="text">
  </div><br><br><br>
  <div style="padding-top: 8px;">
    <div style="float: left; width: 35%;">
      If Message Delivery Fails:<br>
      <select id="iffalse" class="round" onchange="glob.onChangeFalse(this)">
        <option value="0" selected>Continue Actions</option>
        <option value="1">Stop Action Sequence</option>
        <option value="2">Jump To Action</option>
        <option value="3">Skip Next Actions</option>
        <option value="4">Jump To Anchor</option>
      </select>
    </div>
    <div id="iffalseContainer" style="display: none; float: right; width: 60%;">
      <span id="iffalseName">Action Number</span>:<br><input id="iffalseVal" class="round" type="text">
    </div>
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
    glob.sendTargetChange(document.getElementById('channel'), 'varNameContainer2')
    glob.variableChange(document.getElementById('storage3'), 'varNameContainer3')
    glob.onChangeFalse(document.getElementById('iffalse'))
  },

  action (cache) {
    const data = cache.actions[cache.index]
    const storage = parseInt(data.storage)
    const varName = this.evalMessage(data.varName, cache)
    const embed = this.getVariable(storage, varName, cache)
    if (!embed) {
      this.callNextAction(cache)
      return
    }

    const messageContent = this.evalMessage(data.messageContent, cache)
    const channel = parseInt(data.channel)
    const varName2 = this.evalMessage(data.varName2, cache)
    const varName3 = this.evalMessage(data.varName3, cache)
    const storage3 = parseInt(data.storage3)
    const target = this.getSendTarget(channel, varName2, cache)

    if (target && target.send) {
      target.send(messageContent, { embed })
        .then((msg) => {
          if (msg && varName3) this.storeValue(msg, storage3, varName3, cache)
          this.callNextAction(cache)
        })
        .catch((err) => {
          if (err.message === 'Cannot send messages to this user') {
            this.executeResults(false, data, cache)
          } else {
            this.displayError.bind(this, data, cache)
          }
        })
    } else {
      this.callNextAction(cache)
    }
  },

  mod () {}
}
