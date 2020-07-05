module.exports = {
  name: 'Edit Emoji',
  section: 'Emoji Control',

  subtitle (data) {
    const emoji = ['You cheater!', 'Temp Variable', 'Server Variable', 'Global Variable']
    return `${emoji[parseInt(data.storage)]}`
  },

  fields: ['storage', 'varName', 'emojiName'],

  html (isEvent, data) {
    return `
<div>
  <div style="float: left; width: 35%;">
    Source Emoji:<br>
    <select id="storage" class="round" onchange="glob.refreshVariableList(this)">
      ${data.variables[1]}
    </select>
  </div>
  <div id="varNameContainer" style="float: right; width: 60%;">
    Variable Name:<br>
    <input id="varName" class="round" type="text" list="variableList"><br>
  </div>
</div><br><br><br>
<div style="padding-top: 8px;">
  Emoji Name:<br>
  <input id="emojiName" placeholder="Leave blank to not edit!" class="round" type="text">
</div>`
  },

  init () {
    const { glob, document } = this

    glob.emojiChange(document.getElementById('storage'))
  },

  action (cache) {
    const data = cache.actions[cache.index]
    const emojiData = {}
    if (data.emojiName) {
      emojiData.name = this.evalMessage(data.emojiName, cache)
    }
    const storage = parseInt(data.storage)
    const varName = this.evalMessage(data.varName, cache)
    const Mods = this.getMods()
    const emoji = Mods.getEmoji(storage, varName, cache)
    if (Array.isArray(emoji)) {
      this.callListFunc(emoji, 'edit', [emojiData]).then(() => {
        this.callNextAction(cache)
      })
    } else if (emoji && emoji.edit) {
      emoji.edit(emojiData).then((emoji) => {
        this.callNextAction(cache)
      }).catch(this.displayError.bind(this, data, cache))
    } else {
      this.callNextAction(cache)
    }
  },

  mod () {}
}
