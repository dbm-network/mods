module.exports = {

  name: 'Canvas Set Gif Option',

  section: 'Image Editing',

  subtitle (data) {
    const type = ['Set Loop', 'Set Delap', 'Set Images']
    return `${type[parseInt(data.type)]} ${data.value}`
  },

  fields: ['storage', 'varName', 'type', 'value'],

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
    <div style="float: left; width: 40%;">
      Set Option:<br>
      <select id="type" class="round" onchange="glob.onChange(this)">
        <option value="0" selected>Loop (integer)</option>
        <option value="1">Delay (ms)</option>
        <option value="2">Images (path)</option>
        <option value="3">FPS (integer)</option>
      </select>
    </div>
    <div style="padding-left: 5%; float: left; width: 60%;">
      Value:<br>
      <input id="value" class="round" type="text">
    </div>
  </div>`
  },

  init () {
    const { glob, document } = this
    glob.refreshVariableList(document.getElementById('storage'))
    const value = document.getElementById('value')
    glob.onChange = function (event) {
      if (parseInt(event.value) === 2) {
        value.placeholder = 'Local Image only'
      } else {
        value.placeholder = 'Number Here'
      }
    }
    glob.onChange(document.getElementById('type'))
  },

  async action (cache) {
    const data = cache.actions[cache.index]
    const storage = parseInt(data.storage)
    const varName = this.evalMessage(data.varName, cache)
    let sourceImage = this.getVariable(storage, varName, cache)
    if (!sourceImage) {
      this.Canvas.onError(data, cache, 'Image not exist!')
      this.callNextAction(cache)
      return
    } else if (!sourceImage.animated) {
      this.Canvas.onError(data, cache, 'Image is not a gif!')
      this.callNextAction(cache)
      return
    }
    const type = parseInt(data.type)
    const value = this.evalMessage(data.value, cache)
    if (isNaN(value)) {
      this.Canvas.onError(data, cache, "'Value' is not a number!")
      this.callNextAction(cache)
      return
    }
    switch (type) {
      case 0:
        sourceImage.loop = parseInt(value)
        break
      case 1:
        sourceImage.delay = parseInt(value)
        break
      case 2:
        try {
          if (!value.endsWith('.png') && !value.endsWith('.jpg')) {
            this.Canvas.onError(cache, data, 'Please provide valid image format, png or jpg')
            return
          }
          const glob = this.getMods().require('glob')
          const array = glob.sync(value)
          if (array.length > 0) {
            const tempImages = []
            const allWidth = []
            const allHeight = []
            for (let i = 0; i < array.length; i++) {
              const image = await this.createImage(array[i], { isCache: true })
              tempImages.push(image.returnImg)
              allWidth.push(image.width)
              allHeight.push(image.height)
            }
            const width = Math.max(...allWidth)
            const height = Math.max(...allHeight)
            const { delay, loop } = sourceImage
            sourceImage = new this.Image(tempImages, { delay, loop, width, height })
          } else {
            this.Canvas.onError(cache, data, "'Value' is not valid images path!")
            break
          }
        } catch (err) {
          this.Canvas.onError(data, cache, err)
        }
        break
      case 3:
        sourceImage.delay = parseInt(1 / parseInt(value) * 1000)
        break
    }
    this.storeValue(sourceImage, storage, varName, cache)
    this.callNextAction(cache)
  },

  mod () {
  }

}
