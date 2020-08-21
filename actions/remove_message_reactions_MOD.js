module.exports = {
  name: 'Clear reactions from message',
  section: 'Reaction Control',

  subtitle (data) {
    return 'Remove reactions from Message'
  },

  fields: ['storage', 'varName'],

  html (isEvent, data) {
    return `
<div>
  <div style="float: left; width: 35%;">
    Source Message:<br>
    <select id="storage" class="round" onchange="glob.messageChange(this, 'varNameContainer')">
      ${data.messages[isEvent ? 1 : 0]}
    </select>
  </div>
  <div id="varNameContainer" style="display: none; float: right; width: 60%;">
    Variable Name:<br>
    <input id="varName" class="round" type="text" list="variableList"><br>
  </div>
</div>`
  },

  init () {
    const { glob, document } = this

    glob.messageChange(document.getElementById('storage'), 'varNameContainer')
  },

  action (cache) {
    const data = cache.actions[cache.index]
    const storage = parseInt(data.storage)
    const varName = this.evalMessage(data.varName, cache)
    const message = this.getMessage(storage, varName, cache)
    if (Array.isArray(message)) {
      this.callListFunc(message.map((m) => m.reactions), 'removeAll', []).then(() => {
        this.callNextAction(cache)
      })
    } else if (this.dest(message, 'reactions', 'removeAll')) {
      message.reactions.removeAll().then(() => {
        this.callNextAction(cache)
      }).catch(this.displayError.bind(this, data, cache))
    } else {
      this.callNextAction(cache)
    }
  },

  mod () {}
}
