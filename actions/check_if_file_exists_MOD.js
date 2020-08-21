module.exports = {
  name: 'Check if File Exists',
  section: 'File Stuff',

  subtitle (data) {
    const results = ['Continue Actions', 'Stop Action Sequence', 'Jump To Action', 'Jump Forward Actions', 'Jump to Anchor']
    return `If True: ${results[parseInt(data.iftrue)]} ~ If False: ${results[parseInt(data.iffalse)]}`
  },

  fields: ['filename', 'iftrue', 'iftrueVal', 'iffalse', 'iffalseVal'],

  html (isEvent, data) {
    return `
<div style="float: left; width: 60%">
  Path:
  <input id="filename" class="round" type="text">
</div><br><br><br>
<div style="padding-top: 8px;">
  ${data.conditions[0]};
</div>`
  },

  init () {
    const { glob, document } = this
    const option = document.createElement('OPTION')
    option.value = '4'
    option.text = 'Jump to Anchor'
    const iffalse = document.getElementById('iffalse')
    if (iffalse.length === 4) {
      iffalse.add(option)
    }
    const option2 = document.createElement('OPTION')
    option2.value = '4'
    option2.text = 'Jump to Anchor'
    const iftrue = document.getElementById('iftrue')
    if (iftrue.length === 4) {
      iftrue.add(option2)
    }
    glob.onChangeTrue = function (event) {
      switch (parseInt(event.value)) {
        case 0:
        case 1:
          document.getElementById('iftrueContainer').style.display = 'none'
          break
        case 2:
          document.getElementById('iftrueName').innerHTML = 'Action Number'
          document.getElementById('iftrueContainer').style.display = null
          break
        case 3:
          document.getElementById('iftrueName').innerHTML = 'Number of Actions to Skip'
          document.getElementById('iftrueContainer').style.display = null
          break
        case 4:
          document.getElementById('iftrueName').innerHTML = 'Anchor ID'
          document.getElementById('iftrueContainer').style.display = null
          break
      }
    }
    glob.onChangeFalse = function (event) {
      switch (parseInt(event.value)) {
        case 0:
        case 1:
          document.getElementById('iffalseContainer').style.display = 'none'
          break
        case 2:
          document.getElementById('iffalseName').innerHTML = 'Action Number'
          document.getElementById('iffalseContainer').style.display = null
          break
        case 3:
          document.getElementById('iffalseName').innerHTML = 'Number of Actions to Skip'
          document.getElementById('iffalseContainer').style.display = null
          break
        case 4:
          document.getElementById('iffalseName').innerHTML = 'Anchor ID'
          document.getElementById('iffalseContainer').style.display = null
          break
      }
    }
    glob.onChangeTrue(document.getElementById('iftrue'))
    glob.onChangeFalse(document.getElementById('iffalse'))
  },

  action (cache) {
    const data = cache.actions[cache.index]
    const fs = require('fs')
    const path = this.evalMessage(data.filename, cache)
    let result
    if (path) {
      result = fs.existsSync(path)
    } else {
      console.log('Path is missing.')
    }
    this.executeResults(result, data, cache)
  },

  mod () {}
}
