module.exports = {

  name: 'Store Canvas Info',

  section: 'Image Editing',

  subtitle (data) {
    const info = ['Image Width', 'Image Height', 'Is Image Gif?', 'Average Color of Image (hex)', 'GIF Total Frame', 'GIF Delay (ms)', 'GIF Repeat Times', 'Get Image from GIF']
    return `${info[parseInt(data.info)]}`
  },

  variableStorage (data, varType) {
    const type = parseInt(data.storage2)
    if (type !== varType) return
    const info = parseInt(data.info)
    let dataType
    switch (info) {
      case 0:
      case 1:
      case 4:
      case 5:
      case 6:
        dataType = 'Number'
        break
      case 2:
        dataType = 'Boolean'
        break
      case 3:
        dataType = 'Color Hex'
        break
      case 7:
        dataType = 'Image'
        break
    }
    return ([data.varName2, dataType])
  },

  fields: ['storage', 'varName', 'info', 'info2', 'storage2', 'varName2'],

  html (isEvent, data) {
    return `
  <div>
    <div style="float: left; width: 35%;">
      Source Image:<br>
      <select id="storage" class="round">
        ${data.variables[1]}
      </select>
    </div>
    <div style="float: right; width: 60%;">
      Variable Name:<br>
      <input id="varName" class="round" type="text" list="variableList"><br>
    </div>
  </div><br><br><br>
  <div style="padding-top: 8px;">
    <div style="float: left; width: 65%;">
      Source Info:<br>
      <select id="info" class="round" onchange="glob.onChange(this)">
        <option value="0" selected>Image Width</option>
        <option value="1">Image Height</option>
        <option value="2">Is Image Gif?</option>
        <option value="3">Average Color of Image (hex)</option>
        <option value="4">GIF Total Frame</option>
        <option value="5">GIF Delay (ms)</option>
        <option value="6">GIF Repeat Times</option>
        <option value="7">GIF Image of</option>
      </select>
    </div>
    <div id="extraInfo" style="display: none; float: right; width: 30%;">
      Position of Image:<br>
      <input id="info2" class="round" type="text" placeholder="First image is position 0">
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
    const extraInfo = document.getElementById('extraInfo')
    glob.onChange = function (info) {
      if (info !== 7) {
        extraInfo.style.display = 'none'
      } else {
        extraInfo.style.display = null
      }
    }
    glob.onChange(parseInt(document.getElementById('info').value))
  },

  action (cache) {
    const data = cache.actions[cache.index]
    const storage = parseInt(data.storage)
    const varName = this.evalMessage(data.varName, cache)
    let sourceImage = this.getVariable(storage, varName, cache)
    if (!sourceImage) {
      this.Canvas.onError(data, cache, 'Image not exist!')
      this.callNextAction(cache)
      return
    }
    sourceImage = this.Canvas.bridge(sourceImage, 1)
    const info = parseInt(data.info)
    let result
    switch (info) {
      case 0:
        if (sourceImage.animated) {
          result = sourceImage.width
        } else {
          const img = this.Canvas.loadImage(sourceImage)
          result = img.width
        }
        break
      case 1:
        if (sourceImage.animated) {
          result = sourceImage.height
        } else {
          const img = this.Canvas.loadImage(sourceImage)
          result = img.height
        }
        break
      case 2:
        result = !!sourceImage.animated
        break
      case 3:
        result = this.Canvas.getAverageColor(sourceImage)
        break
      case 4:
        if (sourceImage.animated) result = sourceImage.totalFrames
        break
      case 5:
        if (sourceImage.animated) result = sourceImage.delay
        break
      case 6:
        if (sourceImage.animated) result = sourceImage.loop
        break
      case 7: {
        const extraInfo = parseInt(this.evalMessage(data.extraInfo, cache))
        if (sourceImage.animated && sourceImage.totalFrames > extraInfo && extraInfo <= 0) result = sourceImage.images[extraInfo]
        break
      }
    }
    if (result !== undefined) {
      const storage2 = parseInt(data.storage2)
      const varName2 = this.evalMessage(data.varName2, cache)
      this.storeValue(result, storage2, varName2, cache)
    }
    this.callNextAction(cache)
  },

  mod (DBM) {
    DBM.Actions.Canvas.getAverageColor = async (sourceImage) => {
      const img = this.CanvasJS.loadImage(sourceImage)
      if (sourceImage.animated) {
        const rgbs = []
        for (let i = 0; i < img.length; i++) {
          const rgb = [0, 0, 0]
          let count = 0
          for (let t = 0; t < img[i].data.length; t += 4) {
            count++
            rgb[0] += img[i].data[t]
            rgb[1] += img[i].data[t + 1]
            rgb[2] += img[i].data[t + 2]
          }
          rgb[0] = Math.floor(rgb[0] / count)
          rgb[1] = Math.floor(rgb[1] / count)
          rgb[2] = Math.floor(rgb[2] / count)
          rgbs.push(rgb)
        }
        const red = Math.floor(rgbs.map(rgb => rgb[0]) / rgbs.length).toString(16)
        const green = Math.floor(rgbs.map(rgb => rgb[1]) / rgbs.length).toString(16)
        const blue = Math.floor(rgbs.map(rgb => rgb[2]) / rgbs.length).toString(16)
        return `${red}${green}${blue}`
      } else {
        const rgb = [0, 0, 0]
        let count = 0
        for (let t = 0; t < img.data.length; t += 4) {
          count++
          rgb[0] += img.data[t]
          rgb[1] += img.data[t + 1]
          rgb[2] += img.data[t + 2]
        }
        rgb[0] = Math.floor(rgb[0] / count)
        rgb[1] = Math.floor(rgb[1] / count)
        rgb[2] = Math.floor(rgb[2] / count)
        return `${rgb[0].toString(16)}${rgb[1].toString(16)}${rgb[2].toString(16)}`
      }
    }
  }

}
