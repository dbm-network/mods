module.exports = {
  name: 'Hex to RGB',
  section: 'Other Stuff',

  subtitle (data) {
    return `${data.varName} - Hex to RGB`
  },

  fields: ['storage', 'varName', 'hexToConvert'],

  html (isEvent, data) {
    return `
    </div>
  <div id="hexToConvert" style="float: right; width: 60%;">
    Hex Code To Convert:<br>
    <input id="varName" class="round" type="text">
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
    const hexToConvert = this.evalMessage(data.hexToConvert, cache)
    const storage = parseInt(data.storage)
    const varName = this.evalMessage(data.varName, cache)
      if (hexToConvert.length === 7) {
        /* eslint-disable no-unused-vars */
        const r = parseInt(hexToConvert.substr(1, 2), 16)
        const g = parseInt(hexToConvert.substr(3, 2), 16)
        const b = parseInt(hexToConvert.substr(5, 2), 16)
        /* eslint no-template-curly-in-string: "error" */
        return `${r}, ${g}, ${b}`
      } else {
        console.log('Enter a correct value!')
      }
    }

    const rgbFinished = getRGB(hexToConvert)
    this.storeValue(rgbFinished, storage, varName, cache)
    this.callNextAction(cache)
  },
  mod () {}
}
