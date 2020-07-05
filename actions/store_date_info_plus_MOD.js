module.exports = {
  name: 'Store Date Info Plus',
  section: 'Other Stuff',

  subtitle (data) {
    const info = ['Day of Week', 'Day Number', 'Day of Year', 'Week of Year', 'Month of Year', 'Month Number', 'Year', 'Hour', 'Minute', 'Second', 'Millisecond', 'Timezone', 'Unix Timestamp']
    const storage = ['', 'Temp Variable', 'Server Variable', 'Global Variable']
    return `Store ${data.modeStorage === '0' ? `"${info[data.info]}"` : data.buildInput === '' ? '"Not Set"' : `"${data.buildInput}"`} from a Date ~ ${storage[data.storage]}`
  },

  variableStorage (data, varType) {
    const type = parseInt(data.storage)
    if (type !== varType) return
    const dataType = 'Date'
    return ([data.varName, dataType])
  },

  fields: ['sourceDate', 'dateLanguage', 'modeStorage', 'info', 'buildInput', 'storage', 'varName'],

  html (isEvent, data) {
    return `
<div style="float: left; width: 62%">
  Source Date:<br>
  <input id="sourceDate" class="round" type="text" placeholder="Ex: Sun Oct 26 2019 10:38:01 GMT+0200">
</div>
<div style="float: right; width: 38%">
  Date Language (initials):<br>
  <input id="dateLanguage" class="round" placeholder='Default is "en" (English)'>
</div><br>
<div style="float: left; width: 40%; padding-top: 16px">
  Mode:<br>
  <select id="modeStorage" class="round" onchange="glob.onChangeMode(this)">
    <option value="0" selected>Select</option>
    <option value="1">Builder</option>
  </select>
</div>
<div id="selectMode" style="display: none; float: right; width: 50%; padding-top: 16px">
  Source Info:<br>
  <select id="info" class="round">
    <option value="0" selected>Day of Week</option>
    <option value="1">Day Number</option>
    <option value="2">Day of Year (number)</option>
    <option value="3">Week of Year (number)</option>
    <option value="4">Month of Year</option>
    <option value="5">Month Number</option>
    <option value="6">Year</option>
    <option value="7">Hour</option>
    <option value="8">Minute</option>
    <option value="9">Second</option>
    <option value="10">Millisecond</option>
    <option value="11">Timezone</option>
    <option value="12">Unix Timestamp</option>
  </select>
</div>
<div id="buildMode" style="display: none; float: right; width: 50%; padding-top: 16px">
  Build It (<span class="wrexlink" data-url="https://momentjs.com/docs/#/displaying/format/">Moment Docs</span>):<br>
  <input id="buildInput" class="round" placeholder="Ex: DD/MM/YYYY = 10/26/2019">
</div><br><br><br><br><br>
<div style="float: left; width: 35%; padding-top: 10px">
  Store In:<br>
  <select id="storage" class="round">
    ${data.variables[1]}
  </select>
</div>
<div id="varNameContainer" style="float: right; width: 60%; padding-top: 10px">
  Variable Name:<br>
  <input id="varName" class="round" type="text">
</div><br><br><br>
<div id="noteContainer" style="display: none; padding-top: 16px">
  <b>Note:</b> You can use square brackets to put text in <b>builder mode</b> in the "Build It" field.<br>
  <b>Ex:</b> <span id="code">DD/MM/YYYY [at] HH:mm</span> = <span id="code">10/26/2019 at 10:38</span>
</div>
<style>
  span.wrexlink {
    color: #99b3ff;
    text-decoration: underline;
    cursor: pointer
  }

  span.wrexlink:hover {
    color:#4676b9
  }

  #code {
    background: #2C313C;
    color: white;
    padding: 3px;
    font-size: 12px;
    border-radius: 2px
  }
</style>`
  },

  init () {
    const { glob, document } = this

    glob.onChangeMode = function (modeStorage) {
      switch (parseInt(modeStorage.value)) {
        case 0:
          document.getElementById('selectMode').style.display = null
          document.getElementById('buildMode').style.display = 'none'
          document.getElementById('noteContainer').style.display = 'none'
          break
        case 1:
          document.getElementById('selectMode').style.display = 'none'
          document.getElementById('buildMode').style.display = null
          document.getElementById('noteContainer').style.display = null
          break
      }
    }

    glob.onChangeMode(document.getElementById('modeStorage'))

    const wrexlinks = document.getElementsByClassName('wrexlink')
    for (let x = 0; x < wrexlinks.length; x++) {
      const wrexlink = wrexlinks[x]
      var url = wrexlink.getAttribute('data-url')
      if (url) {
        wrexlink.setAttribute('title', url)
        wrexlink.addEventListener('click', (e) => {
          e.stopImmediatePropagation()
          console.log(`Launching URL: [${url}] in your default browser.`)
          require('child_process').execSync(`start ${url}`)
        })
      }
    }
  },

  action (cache) {
    const data = cache.actions[cache.index]
    const moment = this.getMods().require('moment')
    const dateLanguage = this.evalMessage(data.dateLanguage, cache)
    const date = moment(Date.parse(this.evalMessage(data.sourceDate, cache)), '', dateLanguage === '' ? 'en' : dateLanguage)
    const buildInput = this.evalMessage(data.buildInput, cache)
    const modeType = parseInt(this.evalMessage(data.modeStorage, cache))
    const info = parseInt(data.info)

    let result

    if (modeType === 0) {
      switch (info) {
        case 0:
          result = date.format('dddd')
          break
        case 1:
          result = date.format('DD')
          break
        case 2:
          result = date.format('DDD')
          break
        case 3:
          result = date.format('ww')
          break
        case 4:
          result = date.format('MMMMM')
          break
        case 5:
          result = date.format('MM')
          break
        case 6:
          result = date.format('YYYY')
          break
        case 7:
          result = date.format('hh')
          break
        case 8:
          result = date.format('mm')
          break
        case 9:
          result = date.format('ss')
          break
        case 10:
          result = date.format('SS')
          break
        case 11:
          result = date.format('ZZ')
          break
        case 12:
          result = date.format('X')
          break
      }
    } else {
      result = date.format(buildInput)
    }

    if (result === 'Invalid date') {
      return console.log('Invalid Date! Check that your date is valid in "Store Date Info Plus". A Date generally looks like the one stored in "Creation Date" of a server. (variables works)')
    }

    if (result !== undefined) {
      const storage = parseInt(data.storage)
      const varName = this.evalMessage(data.varName, cache)
      this.storeValue(result, storage, varName, cache)
    }

    this.callNextAction(cache)
  },

  mod () {}
}
