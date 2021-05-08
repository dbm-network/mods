module.exports = {

  name: 'Canvas Image Bridge',

  section: 'Image Editing',

  subtitle (data) {
    const bridge = ['Canvas to Jimp', 'Jimp to Canvas']
    const storeTypes = ['', 'Temp Variable', 'Server Variable', 'Global Variable']
    return `${bridge[parseInt(data.bridge)]} ${storeTypes[parseInt(data.storage)]} (${data.varName}) -> ${storeTypes[parseInt(data.storage2)]} (${data.varName2})`
  },

  variableStorage (data, varType) {
    const type = parseInt(data.storage2)
    if (type !== varType) return
    return ([data.varName2, 'Image'])
  },

  fields: ['storage', 'varName', 'type', 'varName2', 'storage2'],

  html (isEvent, data) {
    return `
  <div>
    <div style="float: left; width: 60%;">
      Bridge Direction:<br>
      <select id="type" class="round">
        <option value="0" selected>From Canvas to Jimp</option>
        <option value="1">From Jimp to Canvas</option>
      </select>
    </div>
  </div><br><br><br>
  <div>
    <div style="float: left; width: 35%;">
      Source Image:<br>
      <select id="storage" class="round" onchange="glob.refreshVariableList(this)">
        ${data.variables[1]}
      </select>
    </div>
    <div style="float: right; width: 60%;">
      Variable Name:<br>
      <input id="varName" class="round" type="text" list="variableList">
    </div>
  </div><br><br><br>
  <div>
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

  async action (cache) {
    const data = cache.actions[cache.index]
    const storage = parseInt(data.storage)
    const varName = this.evalMessage(data.varName, cache)
    const image = this.getVariable(storage, varName, cache)
    if (!image) {
      this.Canvas.onError(data, cache, 'Image not exist!')
      this.callNextAction(cache)
      return
    }
    try {
      const type = parseInt(data.type)
      const result = this.Canvas.bridge(image, type)
      const storage2 = parseInt(data.storage2)
      const varName2 = this.evalMessage(data.varName2, cache)
      this.storeValue(result, storage2, varName2, cache)
      this.callNextAction(cache)
    } catch (err) {
      this.Canvas.onError(data, cache, err)
    }
  },

  mod (DBM) {
    if (!DBM.Actions.Canvas.PixelGif) {
      try {
        DBM.Actions.Canvas.PixelGif = DBM.Actions.getMods().require('pixel-gif')
      } catch (err) {
        DBM.Actions.Canvas.onError('', '', err)
      }
    }

    DBM.Actions.Canvas.bridge = function (sourceImage, type = -1) {
      const name = sourceImage.name || sourceImage.constructor.name
      const Jimp = DBM.Actions.getMods().require('jimp')
      switch (name.toLowerCase()) {
        case 'jimp':
          if (type === 1) {
            return sourceImage
          } else {
            if (sourceImage.animated) {
              const outputImgs = []
              const canvas = this.CanvasJS.createCanvas(sourceImage.width, sourceImage.height)
              const ctx = canvas.getContext('2d')
              for (let i = 0; i < sourceImage.totalFrames; i++) {
                const imageData = this.CanvasJS.createImageData(new Uint8ClampedArray(sourceImage.images[i].bitmap.data), canvas.width, canvas.height)
                ctx.putImageData(imageData, 0, 0)
                outputImgs.push(new this.Image(canvas.toDataURL('image/png')))
              }
              return new this.Image(outputImgs, { delay: sourceImage.delay, loop: sourceImage.loop, width: sourceImage.width, height: sourceImage.height })
            } else {
              const canvas = this.CanvasJS.createCanvas(sourceImage.bitmap.width, sourceImage.bitmap.height)
              const ctx = canvas.getContext('2d')
              const imageData = this.CanvasJS.createImageData(new Uint8ClampedArray(sourceImage.bitmap.data), canvas.width, canvas.height)
              ctx.putImageData(imageData, 0, 0)
              return new this.Image(canvas.toDataURL('image/png'))
            }
          }
        case 'canvas':
          if (type === 0) {
            return sourceImage
          } else {
            if (sourceImage.animated) {
              const outputImgs = []
              const images = this.loadImage(sourceImage)
              const canvas = this.CanvasJS.createCanvas(sourceImage.width, sourceImage.height)
              for (let i = 0; i < images.length; i++) {
                const imageData = this.getImageData(images, 0, 0, images[0].width, images[0].height)
                outputImgs.push(new Jimp({ data: Buffer.from(imageData.data), width: canvas.width, height: canvas.height }))
              }
              return new this.JimpImage(sourceImage, outputImgs)
            } else {
              const image = this.loadImage(sourceImage)
              const imageData = this.getImageData(image, 0, 0, image.width, image.height)
              return new Jimp({ data: Buffer.from(imageData.data), width: image.width, height: image.height })
            }
          }
      }
    }
  }
}
