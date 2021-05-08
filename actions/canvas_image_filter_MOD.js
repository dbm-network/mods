module.exports = {

  name: 'Canvas Image Filter',

  section: 'Image Editing',

  subtitle (data) {
    const storeTypes = ['', 'Temp Variable', 'Server Variable', 'Global Variable']
    const filter = ['Blur', 'Hue Rotate', 'Brightness', 'Contrast', 'Grayscale', 'Invert', 'Opacity', 'Saturate', 'Sepia']
    return `${storeTypes[parseInt(data.storage)]} (${data.varName}) -> ${filter[parseInt(data.info)]} (${data.value})`
  },

  fields: ['storage', 'varName', 'info', 'value'],

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
  <div style="padding-top: 8px;">
    <div style="float: left; width: 45%;">
      Filter:<br>
      <select id="info" class="round" onchange="glob.onChange1(this)">
        <option value="0" selected>Blur</option>
        <option value="1">Hue Rotate</option>
        <option value="2">Brightness</option>
        <option value="3">Contrast</option>
        <option value="4">Grayscale</option>
        <option value="5">Invert</option>
        <option value="6">Opacity</option>
        <option value="7">Saturate</option>
        <option value="8">Sepia</option>
      </select><br>
    </div>
    <div style="float: right; width: 50%;">
      <span id="valuetext">Value:</span><br>
      <input id="value" class="round" type="text" placeholder="0 = None filter"><br>
    </div>
  </div>`
  },

  init () {
    const { glob, document } = this

    glob.refreshVariableList(document.getElementById('storage'))

    glob.onChange1 = function (event) {
      const value = parseInt(event.value)
      const valuetext = document.getElementById('valuetext')
      if (value === 1) {
        valuetext.innerHTML = 'Value (Degree):'
      } else {
        valuetext.innerHTML = 'Value (Percent):'
      };
    }

    glob.onChange1(document.getElementById('info'))
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
    };
    const info = parseInt(data.info)
    const value = parseFloat(this.evalMessage(data.value, cache))
    try {
      const image = this.Canvas.Filter(sourceImage, info, value)
      this.storeValue(image, storage, varName, cache)
      this.callNextAction(cache)
    } catch (err) {
      this.Canvas.onError(data, cache, err)
    }
  },

  mod (DBM) {
    if (!DBM.Actions.Canvas.FilterJS) DBM.Actions.Canvas.FilterJS = DBM.Actions.getMods().require('imagedata-filters')
    DBM.Actions.Canvas.filterFnc = function (imageData, type, value) {
      let filtered
      switch (type) {
        case 0: case 'blur':
          filtered = this.FilterJS.blur(imageData, { amount: (value / 100).toString() })
          break
        case 1: case 'huerotate':
          filtered = this.FilterJS.hueRotate(imageData, { amount: (value / 180 * Math.PI).toString() })
          break
        case 2: case 'brightness':
          filtered = this.FilterJS.brightness(imageData, { amount: ((100 - value) / 100).toString() })
          break
        case 3: case 'contrast':
          filtered = this.FilterJS.contrast(imageData, { amount: ((100 - value) / 100).toString() })
          break
        case 4: case 'grayscale':
          filtered = this.FilterJS.grayscale(imageData, { amount: (value / 100).toString() })
          break
        case 5: case 'invert':
          filtered = this.FilterJS.invert(imageData, { amount: (value / 100).toString() })
          break
        case 6: case 'opacity':
          filtered = this.FilterJS.opacity(imageData, { amount: ((100 - value) / 100).toString() })
          break
        case 7: case 'saturate':
          filtered = this.FilterJS.saturate(imageData, { amount: ((100 - value) / 100).toString() })
          break
        case 8: case 'sepia':
          filtered = this.FilterJS.sepia(imageData, { amount: (value / 100).toString() })
          break
      }
      return filtered
    }
    DBM.Actions.Canvas.Filter = function (sourceImage, type, value) {
      let image = this.loadImage(sourceImage)
      let images
      if (sourceImage.animated) {
        images = image
        image = images[0]
      }
      if (typeof type === 'string') type = type.toLowerCase()
      const { width, height } = image
      if (sourceImage.animated) {
        const tempImgs = []
        for (let i = 0; i < images.length; i++) {
          const imgData = this.getImageData(image[i], 0, 0, width, height)
          const imgDataFiltered = this.filterFnc(imgData, type, value)
          tempImgs.push(this.putImageData(imgDataFiltered, 0, 0, width, height))
        }
        return new this.Image(tempImgs, sourceImage)
      } else {
        const imgData = this.getImageData(image, 0, 0, width, height)
        const imgDataFiltered = this.filterFnc(imgData, type, value)
        return this.putImageData(imgDataFiltered, 0, 0, width, height)
      }
    }
  }

}
