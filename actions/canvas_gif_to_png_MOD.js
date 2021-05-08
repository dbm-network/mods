module.exports = {

  name: 'Canvas Gif to Png',

  section: 'Image Editing',

  subtitle (data) {
    const storeTypes = ['', 'Temp Variable', 'Server Variable', 'Global Variable']
    return `Extract Frame ${data.frame} to ${storeTypes[parseInt(data.storage2)]} (${data.varName2})`
  },

  fields: ['storage', 'varName', 'frame', 'storage2', 'varName2'],

  html (isEvent, data) {
    return `
  <div>
    <div style="float: left; width: 45%;">
      Source Image:<br>
      <select id="storage" class="round" onchange="glob.refreshVariableList(this)">
        ${data.variables[1]}
      </select>
    </div>
    <div style="float: right; width: 50%;">
      Variable Name:<br>
      <input id="varName" class="round" type="text" list="variableList">
    </div>
  </div><br><br><br>
  <div style="padding-top: 8px;">
    <div style="float: left; width: 50%;">
      Extract Frame of:<br>
      <input id="frame" class="round" type="text" value="1" placeholder="frame start with 1">
    </div>
  </div><br><br><br>
  <div style="padding-top: 8px;">
    <div style="float: left; width: 35%;">
      Store In:<br>
      <select id="storage2" class="round">
        ${data.variables[1]}
      </select>
    </div>
    <div style="float: right; width: 60%;">
      Variable Name:<br>
      <input id="varName2" class="round" type="text">
    </div>
  </div>`
  },

  init () {
    const { glob, document } = this
    glob.refreshVariableList(document.getElementById('storage'))
  },

  action (cache) {
    const data = cache.actions[cache.index]
    const storage = parseInt(data.storage)
    const varName = this.evalMessage(data.varName, cache)
    const sourceImage = this.getVariable(storage, varName, cache)
    const frame = parseInt(this.evalMessage(data.frame, cache))
    if (!sourceImage) {
      this.Canvas.onError(data, cache, 'Image not exist!')
    } else if (!sourceImage.animated) {
      this.Canvas.onError(data, cache, 'Image is not a gif image.')
    } else if (isNaN(frame)) {
      this.Canvas.onError(data, cache, 'Frame is not a number!')
    } else if (frame > sourceImage.totalFrames) {
      this.Canvas.onError(data, cache, `Gif image ${sourceImage.totalFrames} frames is less than ${frame}`)
    } else if (frame <= 0) {
      this.Canvas.onError(data, cache, 'Frame value cant be negative')
    } else {
      const storage2 = parseInt(data.storage2)
      const varName2 = this.evalMessage(data.varName2, cache)
      this.storeValue(new this.Canvas.Image(sourceImage.images[frame - 1]), storage2, varName2, cache)
    }
    this.callNextAction(cache)
  },

  mod () {
  }

}
