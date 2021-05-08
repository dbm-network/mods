module.exports = {

  name: 'Canvas Draw Image on Image',

  section: 'Image Editing',

  subtitle (data) {
    const storeTypes = ['', 'Temp Variable', 'Server Variable', 'Global Variable']
    return `${storeTypes[parseInt(data.storage2)]} (${data.varName2}) -> ${storeTypes[parseInt(data.storage)]} (${data.varName})`
  },

  fields: ['storage', 'varName', 'storage2', 'varName2', 'x', 'y', 'effect', 'opacity', 'expand'],

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
      <input id="varName" class="round" type="text" list="variableList"><br>
    </div>
  </div><br><br><br>
  <div style="padding-top: 8px;">
    <div style="float: left; width: 45%;">
      Image that is Drawn:<br>
      <select id="storage2" class="round" onchange="glob.refreshVariableList(this)">
        ${data.variables[1]}
      </select>
    </div>
    <div style="float: right; width: 50%;">
      Variable Name:<br>
      <input id="varName2" class="round" type="text" list="variableList"><br>
    </div>
  </div><br><br><br>
  <div style="padding-top: 8px;">
    <div style="float: left; width: 50%;">
      X Position:<br>
      <input id="x" class="round" type="text" value="0"><br>
    </div>
    <div style="float: right; width: 50%;">
      Y Position:<br>
      <input id="y" class="round" type="text" value="0"><br>
    </div>
  </div><br><br><br>
  <div style="padding-top: 8px;">
    <div style="float: left; width: 45%;">
      Draw Effect:<br>
      <select id="effect" class="round">
        <option value="0" selected>Overlay</option>
        <option value="1">Mask</option>
      </select>
    </div>
    <div style="float: right; width: 50%;">
      Opacity:<br>
      <input id="opacity" class="round" placeholder="0 - 100" value="100" type="text"><br>
    </div>
  </div><br><br><br>
  <div style="padding-top: 8px;">
    <div style="float: left; width: 45%;">
      Auto Expand:<br>
      <select id="expand" class="round">
        <option value="false" selected>False</option>
        <option value="true">True</option>
      </select>
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
    if (!sourceImage) {
      this.Canvas.onError(data, cache, 'Image 1 not exist!')
      this.callNextAction(cache)
      return
    }
    const storage2 = parseInt(data.storage2)
    const varName2 = this.evalMessage(data.varName2, cache)
    const sourceImage2 = this.getVariable(storage2, varName2, cache)
    if (!sourceImage2) {
      this.Canvas.onError(data, cache, 'Image 2 not exist!')
      this.callNextAction(cache)
      return
    }
    const options = {}
    options.x = parseInt(this.evalMessage(data.x, cache))
    options.y = parseInt(this.evalMessage(data.y, cache))
    options.opacity = parseFloat(this.evalMessage(data.opacity, cache))
    options.expand = Boolean(data.expand === 'true')
    const effect = parseInt(data.effect)
    if (effect === 1) options.effect = 'mask'
    try {
      const result = this.Canvas.drawImage(sourceImage, sourceImage2, options)
      this.storeValue(result, storage, varName, cache)
      this.callNextAction(cache)
    } catch (err) {
      this.Canvas.onError(data, cache, err)
    }
  },

  mod (DBM) {
    DBM.Actions.Canvas.RBGtoLin = function (color) {
      color = color / 255
      if (color <= 0.03928) {
        return color / 12.92
      } else {
        return Math.pow((color + 0.055) / 1.055, 2.4)
      }
    }

    DBM.Actions.Canvas.getLuminance = function (imageData) {
      const Luminance = []
      for (let i = 0; i < imageData.length; i += 4) {
        const Y = (0.2126 * this.RBGtoLin(imageData[i]) + 0.7152 * this.RBGtoLin(imageData[i + 1]) + 0.0722 * this.RBGtoLin(imageData[i + 2])) * imageData[i + 3] / 255
        Luminance.push(Y)
      }
      return Luminance
    }

    DBM.Actions.Canvas.drawFnc = function (ctx, image, image2, canvas, options) {
      const { x, y, opacity, effect } = options
      const { width, height } = canvas
      ctx.clearRect(0, 0, width, height)
      if (effect && effect === 'mask') {
        const imageData = this.getImageData(image, 0, 0, image.width, image.height)
        const imageData2 = this.getImageData(image2, x, y, image.width, image.height, true).data
        const Luminance = this.getLuminance(imageData2)
        let alpha = 3
        for (let i = 0; i < Luminance.length; i++) {
          imageData.data[alpha] = Luminance[i] * opacity * 255
          alpha += 4
        }
        ctx.putImageData(imageData, 0, 0)
      } else {
        ctx.globalAlpha = 1
        ctx.drawImage(image, 0, 0)
        ctx.globalAlpha = opacity
        ctx.drawImage(image2, x, y)
      }
    }

    DBM.Actions.Canvas.getImageData = function (image, x, y, width, height, grayscale = false) {
      const tempCanvas = this.CanvasJS.createCanvas(width, height)
      const tempCtx = tempCanvas.getContext('2d')
      tempCtx.rect(0, 0, width, height)
      tempCtx.fillStyle = 'white'
      tempCtx.fill()
      if (grayscale) tempCtx.globalCompositeOperation = 'luminosity'
      tempCtx.drawImage(image, x, y)
      return tempCtx.getImageData(0, 0, width, height)
    }

    DBM.Actions.Canvas.putImageData = function (imageData, x, y, width, height) {
      const tempCanvas = this.CanvasJS.createCanvas(width, height)
      const tempCtx = tempCanvas.getContext('2d')
      tempCtx.putImageData(imageData, x, y)
      return new this.Image(tempCanvas.toDataURL('image/png'))
    }

    DBM.Actions.Canvas.drawImage = function (sourceImage, sourceImage2, options) {
      const image = this.loadImage(sourceImage)
      const image2 = this.loadImage(sourceImage2)
      const width = image.width || sourceImage.width
      const height = image.height || sourceImage.height
      if (!options.x || isNaN(options.x)) options.x = 0
      if (!options.y || isNaN(options.y)) options.y = 0
      if (!options.opacity || (options.opacity && isNaN(options.opacity)) || options.opacity > 100) {
        options.opacity = 1
      } else {
        options.opacity = Number(options.opacity) / 100
      }
      const tempImages = []
      const canvas = (options.expand) ? this.CanvasJS.createCanvas(Math.max(width, (image2.width || sourceImage2.width) + options.x), Math.max(height, (image2.height || sourceImage2.height) + options.y)) : this.CanvasJS.createCanvas(width, height)
      const ctx = canvas.getContext('2d')
      if (!sourceImage.animated && !sourceImage2.animated) {
        this.drawFnc(ctx, image, image2, canvas, options)
        return new this.Image(canvas.toDataURL('image/png'))
      } else if (!sourceImage.animated && sourceImage2.animated) {
        sourceImage2.width = canvas.width
        sourceImage2.height = canvas.height
        for (let i = 0; i < image2.length; i++) {
          this.drawFnc(ctx, image, image2[i], canvas, options)
          tempImages.push(new this.Image(canvas.toDataURL('image/png')))
        }
        return new this.Image(tempImages, sourceImage2)
      } else if (sourceImage.animated && !sourceImage2.animated) {
        sourceImage.width = canvas.width
        sourceImage.height = canvas.height
        for (let i = 0; i < image.length; i++) {
          this.drawFnc(ctx, image[i], image2, canvas, options)
          tempImages.push(new this.Image(canvas.toDataURL('image/png')))
        }
        return new this.Image(tempImages, sourceImage)
      } else if (sourceImage.animated && sourceImage2.animated) {
        sourceImage.width = canvas.width
        sourceImage.height = canvas.height
        const maxFrame = Math.max(image.length, image2.length)
        let imgFrame = 0
        let img2Frame = 0
        for (let i = 0; i < maxFrame; i++) {
          this.drawFnc(ctx, image[imgFrame], image2[img2Frame], canvas, options)
          tempImages.push(new this.Image(canvas.toDataURL('image/png')))
          imgFrame = (imgFrame + 1 >= image.length) ? 0 : imgFrame + 1
          img2Frame = (img2Frame + 1 >= image2.length) ? 0 : img2Frame + 1
        }
        return new this.Image(tempImages, sourceImage)
      }
    }
  }
}
