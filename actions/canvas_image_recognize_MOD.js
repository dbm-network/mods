module.exports = {

  name: 'Canvas Image Recognize',

  section: 'Image Editing',

  subtitle (data) {
    const storeTypes = ['', 'Temp Variable', 'Server Variable', 'Global Variable']
    return `Recognize image ${storeTypes[parseInt(data.storage)]} (${data.varName}) for language ${data.lang}`
  },

  fields: ['storage', 'varName', 'left', 'top', 'width', 'height', 'lang', 'offsetType', 'acceptRange', 'max', 'offset', 'forceAccept', 'forceMax', 'debug', 'storage2', 'varName2'],

  html (isEvent, data) {
    return `
  <div style="width: 550px; height: 350px; overflow-y: scroll;">
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
      <div style="float: left; width: 50%;">
        Left Position:<br>
        <input id="left" class="round" type="text"><br>
        Rectangle Width:<br>
        <input id="width" class="round" type="text"><br>
        <a id="link" href='#'>Language Code</a>:<br>
        <input id="lang" class="round" type="text" value="eng" placeholder="Default: eng"><br>
      </div>
      <div style="float: right; width: 50%;">
        Top Position:<br>
        <input id="top" class="round" type="text"><br>
        Rectangle Height:<br>
        <input id="height" class="round" type="text"><br>
        Debug:<br>
        <select id="debug" class="round" style="width: 90%;">
          <option value=false selected>False</option>
          <option value=true>True</option>
        </select><br>
      </div>
    </div><br><br><br>
    <div style="padding-top: 8px;">
      <div style="float: left; width: 34%;">
        Confidence Percent:<br>
        <input id="acceptRange" class="round" type="text" value="80"><br>
        Force Accept:<br>
        <select id="forceAccept" class="round" style="width: 90%;">
          <option value=true selected>True</option>
          <option value=false>False</option>
        </select><br>
      </div>
      <div style="padding-left: 1%; float: left; width: 33%;">
        Max Times:<br>
        <input id="max" class="round" type="text" value="3"><br>
        Force Max:<br>
        <select id="forceMax" class="round" style="width: 90%;">
          <option value=true selected>True</option>
          <option value=false>False</option>
        </select><br>
      </div>
      <div style="padding-left: 1%; float: left; width: 33%;">
        Offset Rectangle:<br>
        <input id="offset" class="round" type="text" value="5"><br>
        Offset Type:<br>
        <select id="offsetType" class="round" style="width: 90%;">
          <option value="pixel" selected>Pixel</option>
          <option value="percentage">Percentage</option>
        </select><br>
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
    </div>
  </div>`
  },

  init () {
    const { glob, document } = this
    glob.refreshVariableList(document.getElementById('storage'))
    document.getElementById('link').onclick = function () {
      require('child_process').execSync('start  https://tesseract-ocr.github.io/tessdoc/Data-Files#data-files-for-version-400-november-29-2016')
    }
  },

  async action (cache) {
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
    options.left = parseInt(this.evalMessage(data.left, cache))
    options.top = parseInt(this.evalMessage(data.top, cache))
    options.width = parseInt(this.evalMessage(data.width, cache))
    options.height = parseInt(this.evalMessage(data.height, cache))
    options.lang = this.evalMessage(data.lang, cache)
    options.debug = Boolean(data.debug === 'true')
    options.acceptRange = parseInt(this.evalMessage(data.acceptRange, cache))
    options.max = parseInt(this.evalMessage(data.max, cache))
    options.offset = parseInt(this.evalMessage(data.offset, cache))
    options.forceAccept = Boolean(data.forceAccept === 'true')
    options.forceMax = Boolean(data.forceMax === 'true')
    options.offsetType = data.offsetType
    try {
      const result = await this.Canvas.Recognize(sourceImage, options)
      const storage2 = parseInt(data.storage2)
      const varName2 = this.evalMessage(data.varName2, cache)
      this.storeValue(result, storage2, varName2, cache)
      this.callNextAction(cache)
    } catch (err) {
      this.Canvas.onError(data, cache, err)
    }
  },

  mod (DBM) {
    if (!DBM.Actions.Canvas.TesseractJS) {
      try {
        DBM.Actions.Canvas.TesseractJS = DBM.Actions.getMods().require('tesseract.js')
      } catch (err) {
        DBM.Actions.Canvas.onError('', '', err)
      }
    }
    DBM.Actions.Canvas.Recognize = async function (sourceImage, options) {
      function newOptions (o, width, height) {
        const options = {}
        options.left = (isNaN(o.left)) ? 0 : o.left || 0
        options.top = (isNaN(o.top)) ? 0 : o.top || 0
        options.width = (isNaN(o.width)) ? 100 : o.width || 100 // rectangle width, 100 pixel from options.right
        options.height = (isNaN(o.height)) ? 100 : o.height || 100 // rectangle height, 100 pixel from options.top
        options.lang = (!o.lang) ? 'eng' : o.lang // language, default should be 'eng', language list -> https://tesseract-ocr.github.io/tessdoc/Data-Files#data-files-for-version-400-november-29-2016 and https://tesseract-ocr.github.io/tessdoc/Data-Files#special-data-files
        options.offsetType = o.offsetType || 'pixel' // offset type for rectangle, it can be 'px' or 'percentage'. px is pixel and percentage will calculate percent of the image size
        options.offset = (!o.offset || isNaN(o.offset)) ? 5 : o.offset || 5 // Offset at bounding for rectangle, it should be 0, 5, 10, 15...
        options.max = (!o.max || isNaN(o.max)) ? 3 : o.max || 3 // Max times for looping for finding perfect result
        options.forceMax = (o.forceMax && typeof o.forceMax === 'boolean') ? o.forceMax : false // Once if some of result pass options.acceptRange, the worker will stop
        options.debug = (o.debug && typeof o.debug === 'boolean') ? o.debug : false // showing result
        options.acceptRange = (!o.acceptRange || isNaN(o.acceptRange)) ? 80 : (o.acceptRange > 100 || o.acceptRange < 0) ? 80 : o.acceptRange // [0 - 100] 80% confidence
        options.forceAccept = (o.forceAccept && typeof o.forceAccept === 'boolean') ? o.forceAccept : true // if all confidence is under options.acceptRange, it will auto choose the highest result, if not it will return nothing
        options.rectangles = [{ left: options.left, top: options.top, width: options.width, height: options.height }]
        while (options.rectangles.length < options.max) {
          const rec = { left: options.left, top: options.top, width: options.width, height: options.height }
          switch (options.offsetType) {
            case 'percentage':
            case 'percent':
              rec.left -= width * options.rectangles.length * options.offset / 100
              rec.top -= height * options.rectangles.length * options.offset / 100
              rec.width += width * options.rectangles.length * options.offset / 100
              rec.height += height * options.rectangles.length * options.offset / 100
              break
            case 'pixel':
            case 'px':
            default:
              rec.left -= options.offset * options.rectangles.length
              rec.top -= options.offset * options.rectangles.length
              rec.width += options.offset * options.rectangles.length
              rec.height += options.offset * options.rectangles.length
              break
          }
          if (rec.left < 0) rec.left = 0
          if (rec.top < 0) rec.top = 0
          if (rec.width > width) rec.height = width
          if (rec.height > height) rec.height = height
          options.rectangles.push(rec)
        }
        return options
      }
      const image = this.loadImage(sourceImage)
      const width = image.width || sourceImage.width
      const height = image.height || sourceImage.height
      options = newOptions(options, width, height)
      const { createWorker } = this.TesseractJS
      if (options.debug) console.log('Initializing tesseract.js worker...')
      const worker = createWorker()
      await worker.load()
      await worker.loadLanguage(options.lang)
      await worker.initialize(options.lang)
      if (options.debug) console.log('Worker loaded.')
      let result
      if (sourceImage.animated) {
        result = []
        for (let i = 0; i < sourceImage.images.length; i++) {
          const data = await this.RecognizeFN(worker, sourceImage.images[i], options)
          result.push(data)
        }
      } else {
        result = await this.RecognizeFN(worker, sourceImage.image, options)
      }
      await worker.terminate()
      return result
    }
    DBM.Actions.Canvas.RecognizeFN = async function (worker, img, options) {
      if (options.debug) console.log('Begin for running recognize services')
      const data = []
      for (let i = 0; i < options.max; i++) {
        const result = await worker.recognize(img, { rectangle: options.rectangles[i] })
        if (options.debug) console.log(`rectangle ${i + 1} ${JSON.stringify(options.rectangles[i])}, confidence is ${result.data.confidence} and result is ${JSON.stringify(result.data.text)}`)
        data.push(result.data)
        if (!options.forceMax && result.data.confidence >= options.acceptRange) {
          if (options.debug) console.log('Perfect result found, stop looping now')
          break
        }
      }
      const max = Math.max(...Array.from(data, d => d.confidence))
      const result = data.find(data => data.confidence === max)
      if (options.forceAccept || result.confidence >= options.acceptRange) {
        if (options.debug) console.log('Final Result for recognize')
        if (options.debug) console.log(result.text)
        return result.text
      } else {
        if (options.debug) console.log(`Force accept's value is ${options.forceAccept}. Max confidence for all result is ${max} and accept range is above ${options.acceptRange}`)
      }
    }
  }
}
