module.exports = {
  name: 'Filter List/Object',
  section: 'Lists and Loops',

  subtitle (data) {
    const storages = ['', 'Temp Variable', 'Server Variable', 'Global Variable']
    return `Filter ${storages[parseInt(data.storage)]} "${data.varName}"`
  },

  variableStorage (data, varType) {
    const type = parseInt(data.storage2)
    if (type !== varType) return
    const dataType = 'List / Object'
    return ([data.varName2, dataType])
  },

  fields: ['storage', 'varName', 'type', 'value', 'value2', 'storage2', 'varName2'],

  html (isEvent, data) {
    return `
<div id ="wrexdiv" style="width: 550px; height: 350px; overflow-y: scroll; overflow-x: hidden;">
  <div>
    <div style="float: left; width: 35%;">
      Source Variable:<br>
      <select id="storage" class="round" onchange="glob.refreshVariableList(this)">
        ${data.variables[1]}
      </select>
    </div>
    <div id="varNameContainer" style="float: right; width: 60%;">
      Variable Name:<br>
      <input id="varName" class="round" type="text" list="variableList">
    </div>
  </div><br><br><br>
  <div style="float: left; width: 30%; padding-top: 8px;">
    Filter Type:<br>
    <select id="type" class="round" onchange="glob.onChange1(this)">
      <option value="0" selected>Exists</option>
      <option value="1">Equals</option>
      <option value="2">Equals Exactly</option>
      <option value="3">Less Than</option>
      <option value="4">Greater Than</option>
      <option value="5">Includes</option>
      <option value="6">Matches Regex</option>
      <option value="7">Matches Full Regex</option>
      <option value="8">Length is Bigger Than</option>
      <option value="9">Length is Smaller Than</option>
      <option value="10">Length is Equals</option>
      <option value="11">Starts With</option>
      <option value="12">Ends With</option>
    </select>
  </div>
  <div id="valueDiv2" style="float: left; width: 30.5%; padding-top: 8px; padding-left: 16px;">
    Value to Filter from:<br>
    <input id="value2" class="round" type="text" placeholder="Optional">
  </div>
  <div id="valueDiv" style="float: left; width: 37%; padding-top: 8px; display: none;">
    Value to Filter to:<br>
    <input id="value" class="round" type="text" placeholder="">
  </div><br><br><br>
  <div style="float: left; width: 35%; padding-top: 8px;">
    Store In:<br>
    <select id="storage2" class="round">
      ${data.variables[1]}
    </select>
  </div>
  <div id="varNameContainer2" style="float: right; width: 60%; padding-top: 8px;">
    Variable Name:<br>
    <input id="varName2" class="round" type="text"><br>
  </div><br><br><br>
  <div style="float: left; width: 100%; padding-top: 16px;">
    <p>
      You can find some useful values to filter from in the <span class="wrexlink" data-url="https://discord.js.org/#/docs/">Discord.js Documentation</span>.
    </p>
  </div>
</div>
<style>
  span.wrexlink {
    color: #99b3ff;
    text-decoration:underline;
    cursor:pointer;
  }
  span.wrexlink:hover {
    color:#4676b9;
  }
</style>`
  },

  init () {
    const { glob, document } = this

    try {
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
    } catch (error) {
      require('fs').appendFile('errors.txt', error.stack ? error.stack : `${error}\r\n`)
    }

    glob.onChange1 = function () {
      const valueDiv = document.getElementById('valueDiv')
      const valueDiv2 = document.getElementById('valueDiv2')
      const value = document.getElementById('value')
      switch (parseInt(document.getElementById('type').value)) {
        case 0:// Exists
          value.placeholder = ''
          valueDiv.style.display = 'none'
          valueDiv2.style.display = null
          break
        case 6:// Regex
          value.placeholder = "('My'|'Regex')"
          valueDiv.style.display = null
          valueDiv2.style.display = null
          break
        case 7:// Full Regex
          value.placeholder = "/('My'|'Regex')\\w+/igm"
          valueDiv.style.display = null
          valueDiv2.style.display = null
          break
        default:// Other Stuff
          value.placeholder = ''
          valueDiv.style.display = null
          valueDiv2.style.display = null
          break
      }
    }

    glob.onChange1(document.getElementById('type'))
    glob.variableChange(document.getElementById('storage'), 'varNameContainer')
    glob.variableChange(document.getElementById('storage2'), 'varNameContainer2')
  },

  action (cache) {
    const data = cache.actions[cache.index]

    const storage = parseInt(data.storage)
    const varName = this.evalMessage(data.varName, cache)
    const variable = this.getVariable(storage, varName, cache)
    const value = this.evalMessage(data.value, cache) // Filter To
    const value2 = this.evalMessage(data.value2, cache) // Filter From
    let result

    if (value2 !== '' && value2 !== undefined) {
      switch (parseInt(data.type)) {
        case 0:// Exists
          result = variable.filter((item) => item[value2] !== undefined && item[value2] !== null)
          break
        case 1:// Equals
          // eslint-disable-next-line eqeqeq
          result = variable.filter((item) => item[value2] == value)
          break
        case 2:// Equals Exactly
          result = variable.filter((item) => item[value2] === value)
          break
        case 3:// Less Than
          result = variable.filter((item) => item[value2] < value)
          break
        case 4:// Greater Than
          result = variable.filter((item) => item[value2] > value)
          break
        case 5:// Includes
          result = variable.filter((item) => item[value2].indexOf(value))
          break
        case 6:// Regex
          result = variable.filter((item) => item[value2].match(new RegExp(`^${value}$`, 'i')))
          break
        case 7:// Full Regex
          result = variable.filter((item) => item[value2].match(new RegExp(value)))
          break
        case 8:// Bigger Length
          result = variable.filter((item) => item[value2].length > value)
          break
        case 9:// Smaller Length
          result = variable.filter((item) => item[value2].length < value)
          break
        case 10:// Equals Length
          result = variable.filter((item) => item[value2].length === value)
          break
        case 11:// Starts With
          result = variable.filter((item) => item[value2].startsWith(value))
          break
        case 12:// Ends With
          result = variable.filter((item) => item[value2].endsWith(value))
          break
        default:// Mistake in RawData
          return console.log('Please check your Filter List/Object action! There is something wrong...')
      }
    } else {
      switch (parseInt(data.type)) {
        case 0:// Exists
          result = variable.filter((item) => item !== undefined && item !== null)
          break
        case 1:// Equals
          // eslint-disable-next-line eqeqeq
          result = variable.filter((item) => item == value)
          break
        case 2:// Equals Exactly
          result = variable.filter((item) => item === value)
          break
        case 3:// Less Than
          result = variable.filter((item) => item < value)
          break
        case 4:// Greater Than
          result = variable.filter((item) => item > value)
          break
        case 5:// Includes
          result = variable.filter((item) => item.indexOf(value))
          break
        case 6:// Regex
          result = variable.filter((item) => item.match(new RegExp(`^${value}$`, 'i')))
          break
        case 7:// Full Regex
          result = variable.filter((item) => item.match(new RegExp(value)))
          break
        case 8:// Bigger Length
          result = variable.filter((item) => item.length > value)
          break
        case 9:// Smaller Length
          result = variable.filter((item) => item.length < value)
          break
        case 10:// Equals Length
          result = variable.filter((item) => item.length === value)
          break
        case 11:// Starts With
          result = variable.filter((item) => item.startsWith(value))
          break
        case 12:// Ends With
          result = variable.filter((item) => item.endsWith(value))
          break
        default:// Mistake in RawData
          return console.log('Please check your Filter List/Object action! There is something wrong...')
      }
    }

    if (result !== undefined) {
      const storage2 = parseInt(data.storage2)
      const varName2 = this.evalMessage(data.varName2, cache)
      this.storeValue(result, storage2, varName2, cache)
    }
    this.callNextAction(cache)
  },

  mod () {}
}
