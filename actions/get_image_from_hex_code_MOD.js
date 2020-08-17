module.exports = {
  name: 'Get Image from Hex Code',
  section: 'Other Stuff',

  subtitle (data) {
    return 'Get Image from Hex Code'
  },

  variableStorage (data, varType) {
    if (parseInt(data.storage) !== varType) return
    return ([data.varName, 'Image'])
  },

  fields: ['input', 'size', 'storage', 'varName'],

  html (isEvent, data) {
    return `
<div>
<div style="width: 90%;">
  Image Hex Code (Remove # from Hex code):<br>
  <input placeholder="ffffff" id="input" class="round" type="text">
</div><br>
  <div>
    Size of Image:<br>
    <input placeholder="1024x1024" id="size" class="round" type="text">
  </div>
</div><br>
<div style="padding-top: 8px;">
  <div style="float: left; width: 35%;">
    Store Image In:<br>
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
    const storage = parseInt(data.storage)
    const varName = this.evalMessage(data.varName, cache)
    const input = this.evalMessage(data.input, cache)
	const size = this.evalMessage(data.size, cache)
    const result = `https://singlecolorimage.com/get/${input}/${size}`
    this.storeValue(result, storage, varName, cache)
    this.callNextAction(cache)
  },

  mod () {}
}
