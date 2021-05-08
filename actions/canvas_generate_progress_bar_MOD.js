module.exports = {

  name: 'Canvas Generate Progress Bar',

  section: 'Image Editing',

  subtitle (data) {
    const storeTypes = ['', 'Temp Variable', 'Server Variable', 'Global Variable']
    const type = ['Basic', 'Circle']
    const index = parseInt(data.type)
    return `Generate ${type[index]} Progress Bar ${storeTypes[parseInt(data.storage)]} (${data.varName})`
  },

  variableStorage (data, varType) {
    const type = parseInt(data.storage)
    if (type !== varType) return
    return ([data.varName, 'Image'])
  },

  fields: ['storage', 'varName', 'type', 'width', 'height', 'lineWidth', 'lineCap', 'percent', 'color'],

  html (isEvent, data) {
    return `
  <div style="padding-top: 8px;">
    <div style="float: left; width: 45%;">
      Type:<br>
      <select id="type" class="round" onchange="glob.onChange1(this)">
        <option value="0" selected>Basic</option>
        <option value="1">Circle</option><br>
      </select>
    </div>
  </div><br><br><br>
  <div style="padding-top: 8px;">
    <div style="float: left; width: 50%;">
      <div id="Change1text">Width:</div>
      <input id="width" class="round" type="text"><br>
    </div>
    <div style="float: right; width: 50%;">
      <div id="Change2text">Height:</div>
      <input id="height" class="round" type="text"><br>
    </div>
  </div><br><br><br>
  <div style="padding-top: 8px;">
    <div style="float: left; width: 50%;">
      Line Width:<br>
      <input id="lineWidth" class="round" type="text"><br>
    </div>
    <div style="padding-left: 1%; float: left; width: 45%;">
      Line Cap:<br>
      <select id="lineCap" class="round">
        <option value="0" selected>Square</option>
        <option value="1">Round</option>
      </select><br>
    </div>
  </div><br><br><br>
  <div style="padding-top: 8px;">
    <div style="float: left; width: 50%;">
      Percent:<br>
      <input id="percent" class="round" type="text"><br>
    </div>
    <div style="float: right; width: 50%;">
      Color:<br>
      <input id="color" class="round" type="text" value="FFFFFF"><br>
    </div>
  </div><br><br><br>
  <div style="padding-top: 8px;">
    <div style="float: left; width: 45%;">
      Store In:<br>
      <select id="storage" class="round">
        ${data.variables[1]}
      </select>
    </div>
    <div id="varNameContainer" style="float: right; width: 50%;">
      Variable Name:<br>
      <input id="varName" class="round" type="text">
    </div>
  </div>`
  },

  init () {
    const { glob, document } = this

    glob.onChange1 = function (event) {
      const Change1text = document.getElementById('Change1text')
      const Change2text = document.getElementById('Change2text')
      if (event.value === '0') {
        Change1text.innerHTML = 'Width:'
        Change2text.innerHTML = 'Height:'
      } else if (event.value === '1') {
        Change1text.innerHTML = 'Radius:'
        Change2text.innerHTML = 'Size:'
      }
    }
    glob.onChange1(document.getElementById('type'))
  },

  action (cache) {
    const data = cache.actions[cache.index]
    const storage = parseInt(data.storage)
    const varName = this.evalMessage(data.varName, cache)
    const options = {}
    options.type = parseInt(data.type)
    options.width = parseInt(data.width)
    options.height = parseInt(data.height)
    const lineCap = parseInt(data.lineCap)
    const lineWidth = parseInt(data.lineWidth)
    const percent = parseFloat(this.evalMessage(data.percent, cache))
    const color = this.evalMessage(data.color, cache)
    try {
      const result = this.Canvas.generateProgress(options, lineCap, lineWidth, percent, color)
      this.storeValue(result, storage, varName, cache)
      this.callNextAction(cache)
    } catch (err) {
      this.Canvas.onError(data, cache, err)
    }
  },
  mod (DBM) {
    DBM.Actions.Canvas.generateProgress = function ({ type, width, height }, lineCap, lineWidth, percent, color) {
      let canvas
      switch (type) {
        case 1: case 'circle':
          canvas = this.CanvasJS.createCanvas(height, height)
          break
        case 0: case 'normal': case 'basic': default:
          canvas = this.CanvasJS.createCanvas(width, height)
          break
      }
      const ctx = canvas.getContext('2d')
      if ([1, 'round'].includes(lineCap)) ctx.lineCap = 'round'
      if (!color) {
        ctx.strokeStyle = '#000000'
      } else if (color.startsWith('#')) {
        ctx.strokeStyle = color
      } else {
        ctx.strokeStyle = '#' + color
      }
      ctx.lineWidth = lineWidth
      ctx.beginPath()
      switch (type) {
        case 1: case 'circle':
          ctx.translate(canvas.height / 2, canvas.height / 2)
          ctx.rotate(-0.5 * Math.PI)
          ctx.arc(0, 0, width, 0, Math.PI * 2 * percent / 100, false)
          break
        case 0: case 'normal': case 'basic': default:
          switch (lineCap) {
            case 0: case 'square':
              ctx.moveTo(0, canvas.height / 2)
              ctx.lineTo(canvas.width * percent / 100, canvas.height / 2)
              break
            case 1: case 'round': {
              const center = lineWidth / 2
              const top = canvas.height / 2 - center
              const bottom = canvas.height / 2 + center
              ctx.moveTo(center, top)
              ctx.lineTo(canvas.width - lineWidth, top)
              ctx.arcTo(canvas.width, top, canvas.width, canvas.height / 2, center)
              ctx.arcTo(canvas.width, bottom, top, bottom, center)
              ctx.lineTo(center, bottom)
              ctx.arcTo(0, bottom, 0, canvas.height / 2, center)
              ctx.arcTo(0, top, center, top, center)
              ctx.closePath()
              ctx.clip()
              ctx.beginPath()
              ctx.moveTo(-center, canvas.height / 2)
              ctx.lineTo(canvas.width * percent / 100 - center, canvas.height / 2)
              break
            }
          }
          break
      }
      ctx.stroke()
      return new this.Image(canvas.toDataURL('image/png'))
    }
  }
}
