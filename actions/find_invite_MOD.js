module.exports = {
  name: 'Find Invite',
  section: 'Invite Control',

  subtitle (data) {
    return `${data.invite}`
  },

  variableStorage (data, varType) {
    const type = parseInt(data.storage)
    if (type !== varType) return
    return ([data.varName, 'Invite'])
  },

  fields: ['invite', 'storage', 'varName'],

  html (isEvent, data) {
    return `
<div>
  <div style="padding-top: 8px;">
    Source Invite:<br>
    <textarea class="round" id="invite" rows="1" placeholder="Code or URL | e.g abcdef or discord.gg/abcdef" style="width: 99%; font-family: monospace; white-space: nowrap; resize: none;"></textarea>
  </div><br>
</div>
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
</div>`
  },

  init () {},

  action (cache) {
    const data = cache.actions[cache.index]
    const invite = this.evalMessage(data.invite, cache)
    const client = this.getDBM().Bot.bot

    client.fetchInvite(invite).catch(console.error).then((invite) => {
      const storage = parseInt(data.storage)
      const varName = this.evalMessage(data.varName, cache)
      this.storeValue(invite, storage, varName, cache)
      this.callNextAction(cache)
    })
  },

  mod () {}
}
