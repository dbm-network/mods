module.exports = {
  name: 'Store HTML From Webpage',
  section: 'HTML/XML Things',

  subtitle (data) {
    return `URL: ${data.url}`
  },

  variableStorage (data, varType) {
    const type = parseInt(data.storage)
    if (type !== varType) return
    return ([data.varName, 'HTML Webpage'])
  },

  fields: ['url', 'storage', 'varName'],

  html (isEvent, data) {
    return `
  <div id ="wrexdiv" style="width: 550px; height: 350px; overflow-y: scroll;">
  <div>
    <p>
      <u>Instructions:</u><br>
      1. Input a url into the Webpage URL textarea<br>
      2. Click valid URL to check if the url is valid!
    </p>
  </div>
  <div style="float: left; width: 95%;">
    Webpage URL: <br>
    <textarea id="url" class="round" style="width: 99%; resize: none;" type="textarea" rows="4" cols="20"></textarea><br>
  </div>
  <div>
  <button class="tiny compact ui labeled icon button" onclick="glob.checkURL(this)"><i class="plus icon"></i>Check URL</button><br>
  Valid: <text id="valid" style="color: red">Input A Url</text>
  </div><br>
  <div style="float: left; width: 35%;">
    Store In:<br>
    <select id="storage" class="round" onchange="glob.variableChange(this, 'varNameContainer')">
      ${data.variables[0]}
    </select>
  </div>
  <div id="varNameContainer" style="display: ; float: right; width: 60%;">
    Storage Variable Name:<br>
    <input id="varName" class="round" type="text">
  </div>
</div>`
  },

  init () {
    const { glob, document } = this

    function evalMessage (content) {
      if (!content) return ''
      if (!content.match(/\$\{.*\}/im)) return content
      return content.replace(/\$\{.*\}/im, 'CUSTOMVALUE')
    }

    try {
      const Mods = require(require('path').join(__dirname, 'aaa_wrexmods_dependencies_MOD.js')).getMods()

      const valid = document.getElementById('valid')
      const url = document.getElementById('url')

      glob.checkURL = function (element) {
        const pUrl = url.value

        const checkedUrl = Mods.checkURL(encodeURI(evalMessage(pUrl)))

        if (checkedUrl && pUrl) {
          valid.innerHTML = 'Valid URL Format!'
          valid.style.color = 'green'
        } else {
          valid.innerHTML = 'Invalid URL Format!'
          valid.style.color = 'red'
        }
      }
    } catch (error) {
      // write any init errors to errors.txt in dbm's main directory
      require('fs').appendFile('errors.txt', error.stack ? error.stack : `${error}\r\n`)
    }

    glob.variableChange(document.getElementById('storage'), 'varNameContainer')
  },

  action (cache) {
    try {
      const Mods = this.getMods()

      const data = cache.actions[cache.index]

      const varName = this.evalMessage(data.varName, cache)
      const storage = parseInt(data.storage)

      let url = this.evalMessage(data.url, cache)

      if (!Mods.checkURL(url)) {
        url = encodeURI(url)
      }

      if (Mods.checkURL(url)) {
        const request = Mods.require('request')

        request(url, (err, res, html) => {
          if (err) throw err

          this.storeValue(html.trim(), storage, varName, cache)
          this.callNextAction(cache)
        })
      } else {
        throw Error(`HTML Parser - URL [${url}] Is Not Valid`)
      }
    } catch (error) {
      console.error(`API Things:  Error: ${error.stack}` ? error.stack : error)
    }
  },

  mod () {}
}
