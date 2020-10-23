module.exports = {
  name: 'Create Server',
  section: 'Server Control',

  subtitle (data) {
    return `${data.serverName}`
  },

  variableStorage (data, varType) {
    const type = parseInt(data.storage)
    if (type !== varType) return
    return ([data.varName, 'Server'])
  },

  fields: ['serverName', 'serverRegion', 'storage', 'varName'],

  html (isEvent, data) {
    return `
<div style="padding-top: 8px;">
  <div style="float: left; width: 560px;">
    Server Name:<br>
    <input id="serverName" class="round" type="text">
  </div><br><br><br>
  <div style="padding-top: 8px;">
    <div style="float: left; width: 35%;">
      Server Region:<br>
      <select id="serverRegion" class="round">
        <option value="brazil">Brazil</option>
        <option value="eu-central">Central Europe</option>
        <option value="hongkong">Hong Kong</option>
        <option value="japan">Japan</option>
        <option value="russia">Russia</option>
        <option value="singapore">Singapora</option>
        <option value="southafrica">South Africa</option>
        <option value="sydney">Sydney</option>
        <option value="us-central">US Central</option>
        <option value="us-east">US East</option>
        <option value="us-south">US South</option>
        <option value="us-west">EU West</option>
        <option value="eu-west">Western Europe</option>
      </select>
    </div>
  </div><br><br><br>
  <div style="padding-top: 8px;">
    <div style="float: left; width: 35%;">
      Store In:<br>
      <select id="storage" class="round" onchange="glob.variableChange(this, 'varNameContainer')">
        ${data.variables[0]}
      </select>
    </div>
    <div id="varNameContainer" style="display: none; float: right; width: 60%;">
      Variable Name:<br>
      <input id="varName" class="round" type="text"><br>
    </div>
  </div><br><br><br><br>
  <div style="float: left; width: 88%; padding-top: 20px;">
    <p>
      <b>NOTE:</b> <span style="color:red">This is only available to bots in less than 10 servers!</span>
    </p>
  </div>
</div>`
  },

  init () {
    const { glob, document } = this

    glob.variableChange(document.getElementById('storage'), 'varNameContainer')
  },

  action (cache) {
    const data = cache.actions[cache.index]
    const serverName = this.evalMessage(data.serverName, cache)
    const botClient = this.getDBM().Bot.bot

    if (!serverName) {
      this.callNextAction(cache)
      return
    }

    const region = data.serverRegion

    botClient.guilds.create(serverName, { region }).then((server) => {
      const storage = parseInt(data.storage)
      const varName = this.evalMessage(data.varName, cache)
      this.storeValue(server, storage, varName, cache)
      this.callNextAction(cache)
    }).catch(this.displayError.bind(this, data, cache))
  },

  mod () {}
}
