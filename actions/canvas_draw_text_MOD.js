module.exports = {

  name: 'Canvas Draw Text on Image',

  section: 'Image Editing',

  subtitle (data) {
    return `${data.text}`
  },

  fields: ['storage', 'varName', 'x', 'y', 'fontPath', 'fontColor', 'fontSize', 'align', 'text', 'rotate', 'antialias', 'maxWidth', 'fillType', 'autoWrap'],

  html (isEvent, data) {
    return `
  <div style="width: 550px; height: 350px; overflow-y: scroll;">
    <div style="float: left; width: 50%;">
      Source Image:<br>
      <select id="storage" class="round" style="width: 90%" onchange="glob.refreshVariableList(this)">
        ${data.variables[1]}
      </select><br>
      Local Font URL:<br>
      <input id="fontPath" class="round" type="text" value="fonts/"><br>
      Alignment:<br>
      <select id="align" class="round" style="width: 90%;">
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
      X Position:<br>
      <input id="x" class="round" type="text" value="0"><br>
      Rotate (0 - 359):<br>
      <input id="rotate" class="round" type="text" value="0"><br>
      Auto Wrap Text:<br>
      <select id="autoWrap" class="round" style="width: 90%;">
        <option value="1" selected>True</option>
        <option value="0">False</option>
      </select><br>
    </div>
    <div style="float: right; width: 50%;">
      Variable Name:<br>
      <input id="varName" class="round" type="text" list="variableList"><br>
      Font Color (Hex):<br>
      <input id="fontColor" class="round" type="text" value="FFFFFF"><br>
      Font Size:<br>
      <input id="fontSize" class="round" type="text" placeholder="Default size 10px"><br>
      Y Position:<br>
      <input id="y" class="round" type="text" value="0"><br>
      Antialias:<br>
      <select id="antialias" class="round" style="width: 90%;">
        <option value="true" selected>True</option>
        <option value="false">False</option>
      </select><br>
      Fill Type:<br>
      <select id="fillType" class="round" style="width: 90%;">
        <option value="fill" selected>Fill</option>
        <option value="stroke">Stroke</option>
      </select><br>
    </div><br><br><br><br>
    <div>
      Max Width:<br>
      <input id="maxWidth" class="round" type="text" style="width: 95%;"placeholder="Leave it blank for None."><br>
      Text:<br>
      <textarea id="text" rows="3" placeholder="Insert text here..." style="width: 95%; resize: none;"></textarea>
    </div>
  </div>`
  },

  init () {
    const { glob, document } = this
    glob.refreshVariableList(document.getElementById('storage'))
  },

  action (cache) {
    const fs = require('fs')
    const path = require('path')
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
    const font = this.evalMessage(data.fontPath, cache)
    if (!font || !fs.existsSync(path.normalize(font))) {
      this.Canvas.onError(data, cache, 'Font file not exist!')
      return
    } else {
      options.font = path.normalize(font)
    }
    options.color = this.evalMessage(data.fontColor, cache)
    options.size = parseInt(this.evalMessage(data.fontSize, cache))
    options.align = parseInt(data.align)
    options.x = parseFloat(this.evalMessage(data.x, cache))
    options.y = parseFloat(this.evalMessage(data.y, cache))
    options.autoWrap = parseInt(data.autoWrap)
    const maxWidth = this.evalMessage(data.maxWidth)
    if (maxWidth && !isNaN(maxWidth)) options.maxWidth = parseFloat(maxWidth)
    options.rotate = parseFloat(this.evalMessage(data.rotate, cache))
    options.antialias = Boolean(data.antialias === 'true')
    options.type = data.fillType
    const text = this.evalMessage(data.text, cache)
    try {
      const result = this.Canvas.drawText(sourceImage, text, options)
      this.storeValue(result, storage, varName, cache)
      this.callNextAction(cache)
    } catch (err) {
      this.Canvas.onError(data, cache, err)
    }
  },

  mod (DBM) {
    if (!DBM.Actions.Canvas.OpenTypeJS) {
      DBM.Actions.Canvas.OpenTypeJS = DBM.Actions.getMods().require('opentype.js')
    }
    DBM.Actions.Canvas.drawText = function (sourceImage, text, options) {
      const path = require('path')
      if (!options) options = {}
      if (!options.color) {
        options.color = '#000000'
      } else {
        if (typeof options.color === 'number') options.color = options.color.toString()
        const match = options.color.match(/[0-9a-fA-F]{6}/g)
        if (match !== null) {
          options.color = '#' + match[0].toUpperCase()
        } else {
          options.color = '#000000'
        }
      }
      if (!options.size || isNaN(options.size)) options.size = 10
      if (!options.x || isNaN(options.x)) options.x = 0
      if (!options.y || isNaN(options.y)) options.y = 0
      if (!options.rotate || isNaN(options.rotate)) options.rotate = 0
      if (options.maxWidth && isNaN(options.maxWidth)) delete options.maxWidth
      if (typeof options.antialias === 'undefined') options.antialias = true
      if (!options || !isNaN(options.align)) {
        if (options.align > 8 || options.align < 0) options.align = 0
      } else {
        options.align = options.align.toUpperCase()
        if (!['TL', 'TC', 'TR', 'ML', 'MC', 'MR', 'BL', 'BC', 'BR'].includes(options.align)) options.align = 'TL'
      }
      if (!['undefined', 'boolean'].includes(typeof options.autoWrap)) {
        options.autoWrap = Boolean(options.autoWrap === 1)
      }
      (!options.type || !['fill', 'stroke'].includes(options.type.toLowerCase())) ? options.type = 'fill' : options.type = options.type.toLowerCase()
      const font = this.OpenTypeJS.loadSync(path.normalize(options.font))
      this.CanvasJS.registerFont(options.font, { family: font.names.postScriptName.en })
      const image = this.loadImage(sourceImage)
      const canvas = this.CanvasJS.createCanvas(image.width || sourceImage.width, image.height || sourceImage.height)
      const ctx = canvas.getContext('2d')
      ctx.font = `${font.names.fontSubfamily.en} ${options.size}px "${font.names.postScriptName.en}"`
      ctx.fillStyle = options.color
      switch (options.align) {
        case 1:
        case 'TC':
          ctx.textBaseline = 'hanging'
          ctx.textAlign = 'center'
          break
        case 2:
        case 'TR':
          ctx.textBaseline = 'hanging'
          ctx.textAlign = 'right'
          break
        case 3:
        case 'ML':
          ctx.textBaseline = 'middle'
          ctx.textAlign = 'left'
          break
        case 4:
        case 'MC':
          ctx.textBaseline = 'middle'
          ctx.textAlign = 'center'
          break
        case 5:
        case 'MR':
          ctx.textBaseline = 'middle'
          ctx.textAlign = 'right'
          break
        case 6:
        case 'BL':
          ctx.textBaseline = 'alphabetic'
          ctx.textAlign = 'left'
          break
        case 7:
        case 'BC':
          ctx.textBaseline = 'alphabetic'
          ctx.textAlign = 'center'
          break
        case 8:
        case 'BR':
          ctx.textBaseline = 'alphabetic'
          ctx.textAlign = 'right'
          break
        case 0:
        case 'TL':
        default:
          ctx.textBaseline = 'hanging'
          ctx.textAlign = 'left'
          break
      }
      if (options.autoWrap) {
        let maxWidth
        if (!options.maxWidth) {
          if (ctx.textAlign === 'left') {
            if (options.x < 0) {
              maxWidth = canvas.width - options.x
            } else if (options.x > canvas.width) {
              maxWidth = canvas.width
            } else {
              maxWidth = canvas.width - options.x
            }
          } else if (ctx.textAlign === 'center') {
            if (options.x < 0) {
              maxWidth = 2 * canvas.width - options.x
            } else if (options.x > canvas.width) {
              maxWidth = 2 * options.x
            } else {
              maxWidth = 2 * Math.min((canvas.width - options.x), options.x)
            }
          } else if (ctx.textAlign === 'right') {
            if (options.x < 0) {
              maxWidth = canvas.width
            } else if (options.x > canvas.width) {
              maxWidth = canvas.width - options.x
            } else {
              maxWidth = options.x
            }
          }
        } else {
          maxWidth = options.maxWidth
        }
        const tempText = text.split(' ')
        text = []
        let line = ''
        while (tempText.length !== 0) {
          let measure = (line === '') ? tempText[0] : line + ' ' + tempText[0]
          const { width } = ctx.measureText(measure)
          if (width <= maxWidth) {
            tempText.shift()
            line = measure
          } else {
            if (line === '') {
              let postMeasure = true
              let around = Math.floor(measure.length / width * maxWidth)
              while (postMeasure) {
                const reWidth = ctx.measureText(measure.slice(0, around)).width
                if (reWidth <= maxWidth) { around-- } else {
                  text.push(measure.slice(0, around))
                  measure = measure.substr(around)
                  tempText[0] = measure
                  if (width - reWidth > maxWidth) {
                    around = Math.floor(measure.length / (width - reWidth) * maxWidth)
                  } else {
                    postMeasure = false
                  }
                }
              }
            } else {
              if (maxWidth * 2 < width) {
                let around = Math.floor(measure.length / width * maxWidth)
                let reWidth = ctx.measureText(measure.slice(0, around)).width
                while (reWidth > maxWidth) {
                  around--
                  reWidth = ctx.measureText(measure.slice(0, around)).width
                }
                text.push(measure.slice(0, around))
                tempText[0] = measure.substr(around)
              } else {
                text.push(line)
              }
              line = ''
            }
          }
        }
        if (line !== '') {
          text.push(line)
        }
        if (typeof text === 'object') {
          text = text.join('\n')
        }
      }
      ctx.textDrawingMode = 'glyph'
      if (options.antialias) ctx.antialias = 'none'
      if (sourceImage.animated) {
        const tempImages = []
        for (let i = 0; i < image.length; i++) {
          ctx.drawImage(image[i], 0, 0)
          ctx.save()
          ctx.translate(options.x, options.y)
          ctx.rotate(options.rotate * Math.PI / 180)
          if (options.type === 'fill') {
            (options.maxWidth) ? ctx.fillText(text, 0, 0, options.maxWidth) : ctx.fillText(text, 0, 0)
          } else if (options.type === 'stroke') {
            (options.maxWidth) ? ctx.strokeText(text, 0, 0, options.maxWidth) : ctx.strokeText(text, 0, 0)
          }
          tempImages.push(new this.Image(canvas.toDataURL('image/png')))
          ctx.restore()
          ctx.clearRect(0, 0, canvas.width, canvas.height)
        }
        return new this.Images(tempImages, sourceImage)
      } else {
        ctx.drawImage(image, 0, 0)
        ctx.translate(options.x, options.y)
        ctx.rotate(options.rotate * Math.PI / 180)
        if (options.type === 'fill') {
          (options.maxWidth) ? ctx.fillText(text, 0, 0, options.maxWidth) : ctx.fillText(text, 0, 0)
        } else if (options.type === 'stroke') {
          (options.maxWidth) ? ctx.strokeText(text, 0, 0, options.maxWidth) : ctx.strokeText(text, 0, 0)
        }
        return new this.Image(canvas.toDataURL('image/png'))
      }
    }
  }

}
