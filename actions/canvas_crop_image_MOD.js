module.exports = {
  name: 'Canvas Crop Image',
  section: 'Image Editing',

  subtitle (data) {
    const storeTypes = ['', 'Temp Variable', 'Server Variable', 'Global Variable']
    return `${storeTypes[parseInt(data.storage)]} (${data.varName})`
  },

  fields: ['storage', 'varName', 'align', 'align2', 'width', 'height', 'positionx', 'positiony'],

  html (isEvent, data) {
    return `
<div>
  <div style="float: left; width: 45%;">
    Source Image:<br>
    <select id="storage" class="round" onchange="glob.refreshVariableList(this)">
      ${data.variables[1]}
    </select><br>
  </div>
  <div id="varNameContainer" style="float: right; width: 50%;">
    Variable Name:<br>
    <input id="varName" class="round" type="text" list="variableList"><br>
  </div>
</div><br><br><br>
<div>
  <div style="float: left; width: 50%;">
    Crop Width (direct size or percent):<br>
    <input id="width" class="round" type="text" value="100%"><br>
  </div>
  <div style="float: right; width: 50%;">
    Crop Height (direct size or percent):<br>
    <input id="height" class="round" type="text" value="100%"><br>
  </div>
</div><br><br><br>
  <div style="float: left; width: 45%;">
    Alignment:<br>
    <select id="align" class="round" onchange="glob.onChange0(this)">
      <option value="0" selected>Top Left</option>
      <option value="1">Top Center</option>
      <option value="2">Top Right</option>
      <option value="3">Middle Left</option>
      <option value="4">Middle Center</option>
      <option value="5">Middle Right</option>
      <option value="6">Bottom Left</option>
      <option value="7">Bottom Center</option>
      <option value="8">Bottom Right</option>
      <option value="9">Specific Position</option>
    </select><br>
  </div>
  <div id="specific" style="display: none; padding-left: 5%; float: left; width: 50%;">
    Custom Alignment:<br>
    <select id="align2" class="round">
      <option value="0" selected>Top Left</option>
      <option value="1">Top Center</option>
      <option value="2">Top Right</option>
      <option value="3">Middle Left</option>
      <option value="4">Middle Center</option>
      <option value="5">Middle Right</option>
      <option value="6">Bottom Left</option>
      <option value="7">Bottom Center</option>
      <option value="8">Bottom Right</option>
    </select><br>
  </div>
</div><br><br>
<div id="position" style="display: none">
  <div style="float: left; width: 50%;">
    Position X:<br>
    <input id="positionx" class="round" type="text" value="0"><br>
  </div>
  <div style="float: right; width: 50%;">
    Position Y:<br>
    <input id="positiony" class="round" type="text" value="0"><br>
  </div>
</div>`
  },

  init () {
    const { glob, document } = this

    const position = document.getElementById('position')
    const specific = document.getElementById('specific')

    glob.onChange0 = function (event) {
      if (parseInt(event.value) === 9) {
        position.style.display = null
        specific.style.display = null
      } else {
        position.style.display = 'none'
        specific.style.display = 'none'
      }
    }

    glob.refreshVariableList(document.getElementById('storage'))
    glob.onChange0(document.getElementById('align'))
  },

  action (cache) {
    const Canvas = require('canvas')
    const data = cache.actions[cache.index]
    const storage = parseInt(data.storage)
    const varName = this.evalMessage(data.varName, cache)
    const imagedata = this.getVariable(storage, varName, cache)
    if (!imagedata) {
      this.callNextAction(cache)
      return
    }
    const image = new Canvas.Image()
    image.src = imagedata
    let cropw = this.evalMessage(data.width, cache)
    let croph = this.evalMessage(data.height, cache)
    if (cropw.endsWith('%')) {
      cropw = image.width * parseFloat(cropw) / 100
    } else {
      cropw = parseFloat(cropw)
    }
    if (croph.endsWith('%')) {
      croph = image.height * parseFloat(croph) / 100
    } else {
      croph = parseFloat(croph)
    }
    const align = parseInt(data.align)
    let positionx
    let positiony
    switch (align) {
      case 0:
        positionx = 0
        positiony = 0
        break
      case 1:
        positionx = (cropw / 2) - (image.width / 2)
        positiony = 0
        break
      case 2:
        positionx = cropw - image.width
        positiony = 0
        break
      case 3:
        positionx = 0
        positiony = (croph / 2) - (image.height / 2)
        break
      case 4:
        positionx = (cropw / 2) - (image.width / 2)
        positiony = (croph / 2) - (image.height / 2)
        break
      case 5:
        positionx = cropw - image.width
        positiony = (croph / 2) - (image.height / 2)
        break
      case 6:
        positionx = 0
        positiony = croph - image.height
        break
      case 7:
        positionx = (cropw / 2) - (image.width / 2)
        positiony = croph - image.height
        break
      case 8:
        positionx = cropw - image.width
        positiony = croph - image.height
        break
      case 9:
        const align2 = parseInt(data.align2)
        const pX = parseFloat(this.evalMessage(data.positionx, cache))
        const pY = parseFloat(this.evalMessage(data.positiony, cache))
        switch (align2) {
          case 0:
            positionx = -pX
            positiony = -pY
            break
          case 1:
            positionx = -(pX - (cropw / 2))
            positiony = -pY
            break
          case 2:
            positionx = -(pX - cropw)
            positiony = -pY
            break
          case 3:
            positionx = -pX
            positiony = -(pY - (croph / 2))
            break
          case 4:
            positionx = -(pX - (cropw / 2))
            positiony = -(pY - (croph / 2))
            break
          case 5:
            positionx = -(pX - cropw)
            positiony = -(pY - (croph / 2))
            break
          case 6:
            positionx = -pX
            positiony = -(pY - croph)
            break
          case 7:
            positionx = -(pX - (cropw / 2))
            positiony = -(pY - croph)
            break
          case 8:
            positionx = -(pX - cropw)
            positiony = -(pY - croph)
            break
        }
        break
    }
    const canvas = Canvas.createCanvas(cropw, croph)
    const ctx = canvas.getContext('2d')
    ctx.drawImage(image, positionx, positiony)
    const result = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream')
    this.storeValue(result, storage, varName, cache)
    this.callNextAction(cache)
  },

  mod () {}
}
