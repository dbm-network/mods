module.exports = {
  name: 'Get Dominant Color',
  section: 'Image Editing',

  subtitle (data) {
    return 'Get dominant color from URL'
  },

  variableStorage (data, varType) {
    const type = parseInt(data.storage)
    if (type !== varType) return
    return ([data.varName, 'String'])
  },

  fields: ['info', 'find', 'storage', 'varName'],

  html (isEvent, data) {
    return `
<div>
  <div>
  <div style="float: left; width: 40%;">
    Source Field:<br>
    <select id="info" class="round">
      <option value="0" selected>Image URL</option>
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
</div>`
  },

  init () {},

  async action (cache) {
    const Mods = this.getMods()
    const { getColorFromURL } = Mods.require('color-thief-node')
    const rgbToHex = Mods.require('rgb-hex')
    const data = cache.actions[cache.index]
    const info = parseInt(data.info)
    const url = this.evalMessage(data.find, cache)
    let result
    switch (info) {
      case 0:
        try {
          const RGB = await getColorFromURL(url)
          result = `#${rgbToHex(RGB.join(', '))}`
        } catch (error) {
          result = undefined
        }
        break
      default:
        break
    }
    if (result !== undefined) {
      const storage = parseInt(data.storage)
      const varName = this.evalMessage(data.varName, cache)
      this.storeValue(result, storage, varName, cache)
    }
    this.callNextAction(cache)
  },

  mod () {}
}
