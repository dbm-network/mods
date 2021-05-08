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
    const data = cache.actions[cache.index]
    const storage = parseInt(data.storage)
    const varName = this.evalMessage(data.varName, cache)
    const sourceImage = this.getVariable(storage, varName, cache)
    if (!sourceImage) {
      this.Canvas.onError(data, cache, 'Image not exist!')
      this.callNextAction(cache)
      return
    }
    const options = {}
    options.width = this.evalMessage(data.width, cache)
    options.height = this.evalMessage(data.height, cache)
    options.align = parseInt(data.align)
    if (options.align === 9) {
      options.align2 = parseInt(data.align2)
      options.x = parseFloat(this.evalMessage(data.positionx, cache))
      options.y = parseFloat(this.evalMessage(data.positiony, cache))
    }
    try {
      const result = this.Canvas.cropImage(sourceImage, options)
      this.storeValue(result, storage, varName, cache)
      this.callNextAction(cache)
    } catch (err) {
      this.Canvas.onError(data, cache, err)
    }
  },

  mod (DBM) {
    DBM.Actions.Canvas.cropImage = function (sourceImage, options) {
      let image = this.loadImage(sourceImage)
      let images
      if (sourceImage.animated) {
        images = image
        image = images[0]
      }
      if (!options.width || (isNaN(options.width) && !options.width.endsWith('%'))) {
        options.width = image.width
      } else if (isNaN(options.width) && options.width.endsWith('%')) {
        options.width = image.width * parseFloat(options.width) / 100
      }
      if (!options.height || (isNaN(options.height) && !options.height.endsWith('%'))) {
        options.height = image.height
      } else if (isNaN(options.height) && options.height.endsWith('%')) {
        options.height = image.height * parseFloat(options.height) / 100
      }
      let x, y
      switch (options.align) {
        case 1: case 'TC':
          x = (options.width / 2) - (image.width / 2)
          y = 0
          break
        case 2: case 'TR':
          x = options.width - image.width
          y = 0
          break
        case 3: case 'ML':
          x = 0
          y = (options.height / 2) - (image.height / 2)
          break
        case 4: case 'MC':
          x = (options.width / 2) - (image.width / 2)
          y = (options.height / 2) - (image.height / 2)
          break
        case 5: case 'MR':
          x = options.width - image.width
          y = (options.height / 2) - (image.height / 2)
          break
        case 6: case 'BL':
          x = 0
          y = options.height - image.height
          break
        case 7: case 'BC':
          x = (options.width / 2) - (image.width / 2)
          y = options.height - image.height
          break
        case 8: case 'BR':
          x = options.width - image.width
          y = options.height - image.height
          break
        case 9:
          switch (options.align2) {
            case 0: case 'TL':
              x = -options.x
              y = -options.y
              break
            case 1: case 'TC':
              x = -(options.x - (options.width / 2))
              y = -options.y
              break
            case 2: case 'TR':
              x = -(options.x - options.width)
              y = -options.y
              break
            case 3: case 'ML':
              x = -options.x
              y = -(options.y - (options.height / 2))
              break
            case 4: case 'MC':
              x = -(options.x - (options.width / 2))
              y = -(options.y - (options.height / 2))
              break
            case 5: case 'MR':
              x = -(options.x - options.width)
              y = -(options.y - (options.height / 2))
              break
            case 6: case 'BL':
              x = -options.x
              y = -(options.y - options.height)
              break
            case 7: case 'BC':
              x = -(options.x - (options.width / 2))
              y = -(options.y - options.height)
              break
            case 8: case 'BR':
              x = -(options.x - options.width)
              y = -(options.y - options.height)
              break
          }
          break
        case 0: case 'TL': default:
          x = 0
          y = 0
          break
      }
      const canvas = this.CanvasJS.createCanvas(parseFloat(options.width), parseFloat(options.height))
      const ctx = canvas.getContext('2d')
      if (sourceImage.animated) {
        const tempImages = []
        const { width, height } = canvas
        const { delay, loop } = sourceImage
        for (let i = 0; i < images.length; i++) {
          ctx.clearRect(0, 0, width, height)
          ctx.drawImage(images[i], x, y)
          tempImages.push(new this.Image(canvas.toDataURL('image/png')))
        }
        return new this.Image(tempImages, { delay, loop, width, height })
      } else {
        ctx.drawImage(image, x, y)
        return new this.Image(canvas.toDataURL('image/png'))
      }
    }
  }

}
