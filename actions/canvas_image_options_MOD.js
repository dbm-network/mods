module.exports = {

  name: 'Canvas Image Options',

  section: 'Image Editing',

  subtitle (data) {
    const storeTypes = ['', 'Temp Variable', 'Server Variable', 'Global Variable']
    return `${storeTypes[parseInt(data.storage)]} (${data.varName})`
  },

  fields: ['storage', 'varName', 'mirror', 'rotation', 'width', 'height', 'resampling', 'opacity'],

  html (isEvent, data) {
    return `
  <div>
    <div style="float: left; width: 45%;">
      Source Image:<br>
      <select id="storage" class="round">
        ${data.variables[1]}
      </select><br>
    </div>
    <div style="float: right; width: 50%;">
      Variable Name:<br>
      <input id="varName" class="round" type="text" list="variableList"><br>
    </div>
  </div><br><br><br>
  <div style="padding-top: 8px;">
    <div style="float: left; width: 45%;">
      Mirror:<br>
      <select id="mirror" class="round">
        <option value="0" selected>None</option>
        <option value="1">Horizontal Mirror</option>
        <option value="2">Vertical Mirror</option>
        <option value="3">Diagonal Mirror</option>
      </select><br>
    </div>
    <div style="float: right; width: 50%;">
      Rotation (degrees):<br>
      <input id="rotation" class="round" type="text" value="0"><br>
    </div>
  </div><br><br><br>
  <div style="padding-top: 8px;">
    <div style="float: left; width: 50%;">
      Scale Width (direct size or percent):<br>
      <input id="width" class="round" type="text" value="100%"><br>
    </div>
    <div style="float: right; width: 50%;">
      Scale Height (direct size or percent):<br>
      <input id="height" class="round" type="text" value="100%"><br>
    </div>
  </div><br><br><br>
  <div style="padding-top: 8px;">
    <div style="float: left; width: 45%;">
      Resampling:<br>
      <select id="resampling" class="round">
        <option value="0" selected>Bilinear</option>
        <option value="1">Bicubic</option>
        <option value="2">Nearest</option>
      </select>
    </div>
    <div style="float: right; width: 50%;">
      Opacity:<br>
      <input id="opacity" class="round" type="text" value="100%"><br>
    </div>
  </div>`
  },

  init () {
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
    if (typeof data.mirror !== 'undefined') options.flip = parseInt(data.mirror)
    if (typeof data.rotate !== 'undefined') options.rotate = parseInt(data.rotation)
    if (typeof data.resampling !== 'undefined') options.resampling = parseInt(data.resampling)
    const scalex = this.evalMessage(data.width, cache)
    const scaley = this.evalMessage(data.height, cache)
    if (scalex || scaley) options.resize = {}
    if (scalex) options.resize.width = scalex
    if (scaley) options.resize.height = scaley
    const opacity = this.evalMessage(data.opacity, cache)
    if (opacity) options.opacity = opacity
    try {
      const result = this.Canvas.controlImage(sourceImage, options)
      this.storeValue(result, storage, varName, cache)
      this.callNextAction(cache)
    } catch (err) {
      this.Canvas.onError(data, cache, err)
    }
  },

  mod (DBM) {
    DBM.Actions.Canvas.controlImage = function (sourceImage, options) {
      let image = this.loadImage(sourceImage)
      let images
      if (sourceImage.animated) {
        images = image
        image = image[0]
      }
      let radian = 0
      let scaleWidth = 1
      let scaleHeight = 1
      let imageWidth = image.width
      let imageHeight = image.height
      if (options.rotate && !isNaN(options.rotate)) {
        radian = Math.PI / 180 * options.rotate
        imageWidth = image.width * Math.abs(Math.cos(radian)) + image.height * Math.abs(Math.sin(radian))
        imageHeight = image.height * Math.abs(Math.cos(radian)) + image.width * Math.abs(Math.sin(radian))
      }
      if (options.flip) {
        switch (options.flip) {
          case 0: case 'horizontal':
            scaleWidth = -1
            scaleHeight = 1
            break
          case 1: case 'vertical':
            scaleWidth = 1
            scaleHeight = -1
            break
          case 2: case 'diagonal':
            scaleWidth = -1
            scaleHeight = -1
            break
        }
      }
      if (options.resize) {
        const key = Object.keys(options.resize)
        if (key.length === 1) {
          if (key[0] === 'width') {
            options.resize.height = '100%'
          } else {
            options.resize.width = '100%'
          }
        }
        if (options.resize.aspectRatio && (options.resize.width || options.resize.height)) {
          if (options.resize.width) {
            if (!isNaN(options.resize.width)) {
              scaleWidth *= options.resize.width / image.width
              scaleHeight *= options.resize.width / image.width
            } else if (options.resize.width.endsWith('%')) {
              scaleWidth *= parseFloat(options.resize.width) / 100
              scaleHeight *= parseFloat(options.resize.width) / 100
            }
          } else {
            if (!isNaN(options.resize.height)) {
              scaleWidth *= options.resize.height / image.height
              scaleHeight *= options.resize.height / image.height
            } else if (options.resize.height.endsWith('%')) {
              scaleWidth *= parseFloat(options.resize.height) / 100
              scaleHeight *= parseFloat(options.resize.height) / 100
            }
          }
        } else if (options.resize.width && options.resize.height) {
          if (!isNaN(options.resize.width)) {
            scaleWidth *= parseFloat(options.resize.width) / image.width
          } else if (options.resize.width.endsWith('%')) {
            scaleWidth *= parseFloat(options.resize.width) / 100
          }
          if (!isNaN(options.resize.height)) {
            scaleHeight *= parseFloat(options.resize.height) / image.height
          } else if (options.resize.height.endsWith('%')) {
            scaleHeight *= parseFloat(options.resize.height) / 100
          }
        }
      }
      imageWidth *= Math.abs(scaleWidth)
      imageHeight *= Math.abs(scaleHeight)
      const canvas = this.CanvasJS.createCanvas(imageWidth, imageHeight)
      const ctx = canvas.getContext('2d')
      if (!options.resampling) options.resampling = 0
      switch (options.resampling) {
        case 1:
        case 'best':
        case 'bicubic':
          ctx.patternQuality = 'best'
          break
        case 2:
        case 'fast':
        case 'nearest':
          ctx.patternQuality = 'fast'
          break
        case 0:
        case 'good':
        case 'bilinear':
        default:
          ctx.patternQuality = 'good'
          break
      }
      ctx.translate(imageWidth / 2, imageHeight / 2)
      ctx.rotate(radian)
      ctx.scale(scaleWidth, scaleHeight)
      if (sourceImage.animated) {
        const tempImages = []
        for (let i = 0; i < images.length; i++) {
          ctx.clearRect(imageWidth / 2, imageHeight / 2, canvas.width, canvas.height)
          ctx.drawImage(images[i], -sourceImage.width / 2, -sourceImage.height / 2)
          if (options.opacity) {
            const imagedata = ctx.getImageData(0, 0, canvas.width, canvas.height)
            for (let i = 3; i < imagedata.data.length; i += 4) {
              if (!isNaN(options.opacity)) {
                imagedata.data[i] = Math.min(Math.max(Number(options.opacity), 0), 255)
              } else if (options.opacity.endsWith('%')) {
                imagedata.data[i] = imagedata.data[i] * parseInt(options.opacity) / 100
              }
            }
            ctx.putImageData(imagedata, 0, 0)
          }
          tempImages.push(new this.Image(canvas.toDataURL('image/png')))
        }
        sourceImage.width = imageWidth
        sourceImage.height = imageHeight
        return new this.Image(tempImages, sourceImage)
      } else {
        ctx.drawImage(image, -image.width / 2, -image.height / 2)
        if (options.opacity) {
          const imagedata = ctx.getImageData(0, 0, canvas.width, canvas.height)
          for (let i = 3; i < imagedata.data.length; i += 4) {
            if (!isNaN(options.opacity)) {
              imagedata.data[i] = Math.min(Math.max(Number(options.opacity), 0), 255)
            } else if (options.opacity.endsWith('%')) {
              imagedata.data[i] = imagedata.data[i] * parseInt(options.opacity) / 100
            }
          }
          ctx.putImageData(imagedata, 0, 0)
        }
        return new this.Image(canvas.toDataURL('image/png'))
      }
    }
  }
}
