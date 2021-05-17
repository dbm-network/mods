module.exports = {
  name: 'Create Category Channel',
  section: 'Channel Control',

  subtitle (data) {
    return `${data.channelName}`
  },

  variableStorage (data, varType) {
    const type = parseInt(data.storage)
    if (type !== varType) return
    return ([data.varName, 'Channel'])
  },

  fields: ['channelName', 'position', 'storage', 'varName'],

  html (isEvent, data) {
    return `
Name:<br>
<input id="channelName" class="round" type="text"><br>
<div style="float: left; width: 50%;">
  Position:<br>
  <input id="position" class="round" type="text" placeholder="Leave blank for default!" style="width: 90%;"><br>
</div><br><br><br><br>
<div>
<div style="float: left; width: 45%;">
    Store In:<br>
    <select id="storage" class="round" onchange="glob.variableChange(this, 'varNameContainer')">
      ${data.variables[0]}
    </select>
  </div>
  <div id="varNameContainer" style="display: none; float: right; width: 50%;">
    Variable Name:<br>
    <input id="varName" class="round" type="text" style="width: 90%"><br>
  </div>
</div>`
  },

  init () {
    const { glob, document } = this

    glob.variableChange(document.getElementById('storage'), 'varNameContainer')
  },

  action (cache) {
    const data = cache.actions[cache.index]
    const { server } = cache
    if (this.dest(server, 'channels', 'create')) {
      const name = this.evalMessage(data.channelName, cache)
      const position = parseInt(data.position)
      const storage = parseInt(data.storage)
      server.channels.create(name, { type: 'category', position }).then((channel) => {
        const varName = this.evalMessage(data.varName, cache)
        this.storeValue(channel, storage, varName, cache)
        this.callNextAction(cache)
      }).catch(this.displayError.bind(this, data, cache))
    } else {
      this.callNextAction(cache)
    }
  },

  mod () {}

}
