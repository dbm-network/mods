module.exports = {
  name: 'Add Embed Field',
  section: 'Embed Message',

  subtitle (data) {
    return `${data.name} - ${data.message}`
  },

  fields: ['storage', 'varName', 'fieldName', 'message', 'inline'],

  html (isEvent, data) {
    return `
<div><p>This action has been modified by DBM Mods. Use [Title](Link) to mask links here.</p></div><br>
<div>
  <div style="float: left; width: 35%;">
    Source Embed Object:<br>
    <select id="storage" class="round" onchange="glob.refreshVariableList(this)">
      ${data.variables[1]}
    </select>
  </div>
  <div id="varNameContainer" style="float: right; width: 60%;">
    Variable Name:<br>
    <input id="varName" class="round varSearcher" type="text" list="variableList"><br>
  </div>
</div><br><br><br>
<div style="padding-top: 8px;">
  <div style="float: left; width: 50%;">
    Field Name:<br>
    <input id="fieldName" placeholder="Optional" class="round" type="text">
  </div>
  <div style="float: left; width: 50%;">
    Display Inline:<br>
    <select id="inline" class="round">
      <option value="0">Yes</option>
      <option value="1" selected>No</option>
    </select>
  </div>
</div><br><br><br>
<div style="padding-top: 8px;">
  Field Description:<br>
  <textarea id="message" rows="7.5" placeholder="Insert message here... (Optional)" style="width: 99%; font-family: monospace; white-space: nowrap; resize: none;"></textarea>
</div>`
  },

  init () {},

  action (cache) {
    const data = cache.actions[cache.index]

    const storage = parseInt(data.storage)
    const varName = this.evalMessage(data.varName, cache)
    const embed = this.getVariable(storage, varName, cache)

    const name = this.evalMessage(data.fieldName, cache)
    const message = this.evalMessage(data.message, cache)

    const inline = Boolean(data.inline === '0')
    if (embed && embed.addField) {
      embed.addField(name || '\u200B', message || '\u200B', inline)
    }
    this.callNextAction(cache)
  },

  mod () {}
}
