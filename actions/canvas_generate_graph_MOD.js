module.exports = {

  name: 'Canvas Generate Graph',

  section: 'Image Editing',

  subtitle (data) {
    const storeTypes = ['', 'Temp Variable', 'Server Variable', 'Global Variable']
    return `${storeTypes[parseInt(data.storage)]} (${data.varName})`
  },

  variableStorage (data, varType) {
    const type = parseInt(data.storage)
    if (type !== varType) return
    return ([data.varName, 'Image'])
  },

  fields: ['type', 'sort', 'width', 'height', 'title', 'borderWidth', 'borderColor', 'borderColorAlpha', 'bgColor', 'bgColorAlpha', 'labels', 'datasets', 'storage', 'varName'],

  html (isEvent, data) {
    return `
  <div style="width: 550px; height: 350px; overflow-y: scroll;">
    <div>
      <div style="float: left; width: 60%;">
        Chart Type:<br>
        <select id="type" class="round">
          <option value="0" selected>Line</option>
          <option value="1">Bar</option>
          <option value="2">Horizontal Bar</option>
          <option value="3">Radar</option>
          <option value="4">Pie</option>
          <option value="5">Doughnut</option>
          <option value="6">Polar Area</option>
        </select><br>
      </div>
      <div style="padding-left: 3%; float: left; width: 30%;">
        Sort By:<br>
        <select id="sort" class="round">
          <option value="0" selected>None</option>
          <option value="1">Ascend</option>
          <option value="2">Descend</option>
        </select><br>
      </div>
    </div><br><br><br>
    <div>
      <div style="float: left; width: 48%;">
        Width (px):<br>
        <input id="width" class="round" type="text"><br>
      </div>
      <div style="padding-left: 1px; float: left; width: 49%;">
        Height (px):<br>
        <input id="height" class="round" type="text"><br>
      </div>
    </div><br><br><br>
    <div>
      <div style="float: left; width: 70%;">
        Title:<br>
        <input id="title" class="round" type="text"><br>
      </div>
      <div style="padding-left: 1px; float: left; width: 30%;">
        Border Width (px):<br>
        <input id="borderWidth" class="round" type="text"><br>
      </div>
    </div><br><br><br>
    <div>
      <div style="float: left; width: 70%;">
        Border Colors Hex (Separate by comma):<br>
        <input id="borderColor" class="round" type="text" placeholder="222831,00adb5,eeeeee..."><br>
      </div>
      <div style="padding-left: 1px; float: left; width: 30%;">
        Border Opacity:<br>
        <input id="borderColorAlpha" class="round" type="text" value="1"><br>
      </div>
    </div><br><br><br>
    <div>
      <div style="float: left; width: 70%;">
        Background Colors Hex (Separate by comma):<br>
        <input id="bgColor" class="round" type="text" placeholder="222831,00adb5,eeeeee..."><br>
      </div>
      <div style="padding-left: 1px; float: left; width: 30%;">
        Background Opacity:<br>
        <input id="bgColorAlpha" class="round" type="text" value="0.1"><br>
      </div>
    </div><br><br><br>
    <div>
      <div style="float: left; width: 49%;">
        Labels (Separate by comma):<br>
        <input id="labels" class="round" type="text" placeholder="example1,example2,example3..."><br>
      </div>
      <div style="padding-left: 1px; float: left; width: 50%;">
        Data (Separate by comma):<br>
        <input id="datasets" class="round" type="text" placeholder="10,20,30..."><br>
      </div>
    </div><br><br><br>
    <div style="padding-top: 8px;">
      <div style="float: left; width: 35%;">
        Store In:<br>
        <select id="storage" class="round">
          ${data.variables[1]}
        </select>
      </div>
      <div style="float: right; width: 60%;">
        Variable Name:<br>
        <input id="varName" class="round" type="text"><br>
      </div>
    </div>
  </div>`
  },

  init () {
  },

  action (cache) {
    const data = cache.actions[cache.index]
    const storage = parseInt(data.storage)
    const varName = this.evalMessage(data.varName, cache)
    let type = parseInt(data.type, cache)
    switch (type) {
      case 1:
        type = 'bar'
        break
      case 2:
        type = 'horizontalBar'
        break
      case 3:
        type = 'radar'
        break
      case 4:
        type = 'pie'
        break
      case 5:
        type = 'doughnut'
        break
      case 6:
        type = 'polarArea'
        break
      case 0:
      default:
        type = 'line'
        break
    }
    const sort = parseInt(data.sort, cache)
    const width = parseInt(this.evalMessage(data.width, cache))
    const height = parseInt(this.evalMessage(data.height, cache))
    const title = this.evalMessage(data.title, cache)
    let labels = this.evalMessage(data.labels, cache)
    if (typeof labels === 'string') labels = labels.split(',')
    let datasets = this.evalMessage(data.datasets, cache)
    if (typeof datasets === 'string') datasets = datasets.split(',')
    const bgColor = this.evalMessage(data.bgColor, cache)
    const bgColorAlpha = parseFloat(this.evalMessage(data.bgColorAlpha, cache))
    const borderWidth = parseFloat(this.evalMessage(data.borderWidth, cache))
    const borderColor = this.evalMessage(data.borderColor, cache)
    const borderColorAlpha = parseFloat(this.evalMessage(data.borderColorAlpha, cache))
    const options = {}
    try {
      const result = this.Canvas.generateChart(type, width, height, title, labels, datasets, sort, bgColor, bgColorAlpha, borderWidth, borderColor, borderColorAlpha, options)
      this.storeValue(result, storage, varName, cache)
      this.callNextAction(cache)
    } catch (err) {
      this.Canvas.onError(data, cache, err)
    }
  },

  mod (DBM) {
    if (!DBM.Actions.Canvas.ChartJS) {
      try {
        DBM.Actions.Canvas.ChartJS = DBM.Actions.getMods().require('chart.js')
      } catch (err) {
        DBM.Actions.Canvas.onError('', '', err)
      }
    }
    DBM.Actions.Canvas.generateChart = function (type, width, height, title, labels, data, sort, bgColor, bgColorAlpha, borderWidth, borderColor, borderColorAlpha, options = {}) {
      const config = { type, data: {}, options }
      config.options.responsive = false
      config.options.animation = false
      if (sort !== 0) {
        const sortList = {}
        for (let i = 0; i < data.length; i++) {
          sortList[labels[i]] = data[i]
        }
        let sortedLabels
        const sortedData = []
        if (sort === 1) {
          sortedLabels = Object.keys(sortList).sort((a, b) => sortList[a] - sortList[b])
        } else {
          sortedLabels = Object.keys(sortList).sort((a, b) => sortList[b] - sortList[a])
        }
        sortedLabels.forEach((key) => {
          sortedData.push(sortList[key])
        })
        data = sortedData
        labels = sortedLabels
      }
      config.data = { labels, datasets: [{ label: title, data }] }
      function getColors (colors, alpha) {
        return colors.map(hex => `rgba(${parseInt(hex.slice(0, 2), 16)},${parseInt(hex.slice(2, 4), 16)},${parseInt(hex.slice(4, 6), 16)},${alpha})`)
      }
      const palette = require(this.dependencies.palette)
      bgColorAlpha = (isNaN(bgColorAlpha) || bgColorAlpha > 1) ? 1 : ((bgColorAlpha <= 0) ? 0.1 : bgColorAlpha)
      borderColorAlpha = (isNaN(borderColorAlpha) || borderColorAlpha > 1) ? 1 : ((borderColorAlpha <= 0) ? 0 : borderColorAlpha)
      let mainColor
      if (!bgColor) {
        mainColor = palette('tol', data.length)
      } else {
        mainColor = bgColor.split(',')
      }
      if (mainColor.length < data.length) mainColor = mainColor.concat(palette('tol', data.length - mainColor.length))
      bgColor = getColors(mainColor, bgColorAlpha)
      config.data.datasets[0].backgroundColor = bgColor
      if (borderWidth > 0) {
        if (!borderColor) {
          borderColor = getColors(mainColor, borderColorAlpha)
        } else {
          borderColor = getColors(borderColor.split(','), borderColorAlpha)
        }
        config.data.datasets[0].borderColor = borderColor
        config.data.datasets[0].borderWidth = borderWidth
      }
      const canvas = this.CanvasJS.createCanvas(width, height)
      canvas.style = {}
      const ctx = canvas.getContext('2d')
      const chart = new this.ChartJS(ctx, config)
      try {
        return new this.Image(chart.canvas.toDataURL('image/png'))
      } catch (error) {
        throw new Error(error)
      }
    }
  }

}
