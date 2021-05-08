module.exports = {

  name: 'Canvas Edit Image Border',

  section: 'Image Editing',

  subtitle (data) {
    const storeTypes = ['', 'Temp Variable', 'Server Variable', 'Global Variable']
    return `${storeTypes[parseInt(data.storage)]} (${data.varName})`
  },

  fields: ['storage', 'varName', 'circleinfo', 'radius'],

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
      Type:<br>
      <select id="circleinfo" class="round">
        <option value="0" selected>Round</option>
        <option value="1">Circle</option>
      </select><br>
    </div>
    <div style="float: right; width: 50%;">
      Round Corner Radius:<br>
      <input id="radius" class="round" type="text" value="0"><br>
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
    const dataUrl = this.getVariable(storage, varName, cache)
    if (!dataUrl) {
      this.Canvas.onError(data, cache, 'Image not exist!')
      this.callNextAction(cache)
      return
    }
    const type = parseInt(data.circleinfo)
    const radius = parseInt(data.radius)
    try {
      const result = this.Canvas.editBorder(dataUrl, type, radius)
      this.storeValue(result, storage, varName, cache)
      this.callNextAction(cache)
    } catch (err) {
      this.Canvas.onError(data, cache, err)
    }
  },

  mod (DBM) {
    DBM.Actions.Canvas.editBorderFnc = (ctx, width, height, type, radius) => {
      ctx.clearRect(0, 0, width, height)
      switch (type) {
        case 0: case 'corner':
          ctx.beginPath()
          ctx.moveTo(radius, 0)
          ctx.lineTo(width - radius, 0)
          ctx.quadraticCurveTo(width, 0, width, radius)
          ctx.lineTo(width, height - radius)
          ctx.quadraticCurveTo(width, height, width - radius, height)
          ctx.lineTo(radius, height)
          ctx.quadraticCurveTo(0, height, 0, height - radius)
          ctx.lineTo(0, radius)
          ctx.quadraticCurveTo(0, 0, radius, 0)
          ctx.closePath()
          ctx.clip()
          break
        case 1: case 'circle': default:
          ctx.beginPath()
          ctx.arc(width / 2, height / 2, (width + height) / 4, 0, Math.PI * 2)
          ctx.closePath()
          ctx.clip()
          break
      }
    }
    DBM.Actions.Canvas.editBorder = function (sourceImage, type, radius) {
      const image = this.loadImage(sourceImage)
      const width = image.width || sourceImage.width
      const height = image.height || sourceImage.height
      if (isNaN(type)) type = type.toLowerCase()
      if ([1, 'circle'].includes(type) && width !== height) {
        type = 'corner'
        radius = Math.min(width, height) / 2
      }
      if ([0, 'corner'].includes(type) && radius <= 0) {
        return sourceImage
      } else if ([1, 'corner'].includes(type) && (radius > width || radius > height)) {
        radius = Math.min(width, height) / 2
      }
      const canvas = this.CanvasJS.createCanvas(width, height)
      const ctx = canvas.getContext('2d')
      if (sourceImage.animated) {
        const tempImages = []
        for (let i = 0; i < image.length; i++) {
          this.editBorderFnc(ctx, width, height, type, radius)
          ctx.drawImage(image[i], 0, 0)
          tempImages.push(new this.Image(canvas.toDataURL('image/png')))
        }
        return new this.Image(tempImages, sourceImage)
      } else {
        this.editBorderFnc(ctx, width, height, type, radius)
        ctx.drawImage(image, 0, 0)
        return new this.Image(canvas.toDataURL('image/png'))
      }
    }
  }

}
