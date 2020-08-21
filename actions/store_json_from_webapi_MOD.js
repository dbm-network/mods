module.exports = {
  name: 'Store Json From WebAPI',
  section: 'JSON Things',

  subtitle (data) {
    return `${data.varName}`
  },

  variableStorage (data, varType) {
    const type = parseInt(data.storage)
    if (type !== varType) return
    return ([data.varName, 'JSON Object'])
  },

  fields: ['token', 'user', 'pass', 'url', 'path', 'storage', 'varName', 'debugMode', 'headers', 'reUse'],

  html (isEvent, data) {
    return `
<div id ="wrexdiv" style="width: 550px; height: 350px; overflow-y: scroll;">
  <div style="float: left; width: 95%;">
    WebAPI URL: <br>
    <textarea id="url" class="round" style="width: 99%; resize: none;" type="textarea" rows="4" cols="20"></textarea>
      <text style="font-size: 60%;">If the url is the same, json data will be used from the initial store json within the command</text><br>
      Headers (By default 'User-Agent: Other' is applied, It's 1 per line, (<b>key:value</b>))<br>
      <textarea id="headers" class="round" placeholder="User-Agent: Other" style="width: 99%; resize: none;" type="textarea" rows="4" cols="20"></textarea><br>
  </div>
  <div class="ui toggle checkbox" >
    <input type="checkbox" name="public" id="toggleAuth" onclick="glob.checkBox(this, 'auth');">
    <label><font color="white">Show Authentication Options</font></label>
    <text style="font-size: 60%;">Show/Hide Auth Options</text>
  </div>
  <div id="authSection" style="display: ;"><br>
    Bearer Token<br>
    <textarea id="token" class="round" placeholder="blank if none" style="width: 99%; resize: none;" type="textarea" rows="4" cols="20"></textarea><br>
    Username<br>
    <input id="user" class="round" placeholder="blank if none" style="width: 99%; resize: none;" ><br>
    Password <br>
    <input id="pass" class="round" placeholder="blank if none"  style="width: 99%; resize: none;" ><br>
  </div><br><br>
  JSON Path: (Leave blank to store everything)<br>
  Supports the usage of JSON Path (Regex)<br>
  More info here <br>
  http://goessner.net/articles/JsonPath/index.html#e2<br><br>
  <input id="path" class="round"; style="width: 75%;" type="text">
  <div><br><br>
    <div style="float: left; width: 35%;">
      Store In:<br>
      <select id="storage" class="round" onchange="glob.variableChange(this, 'varNameContainer')">
        ${data.variables[0]}
      </select><br>
    </div>
    <div id="varNameContainer" style="display: ; float: right; width: 60%;">
      JSON Storage Variable Name:<br>
      <input id="varName" class="round" type="text"><br>
    </div>
  </div><br>
  <div style="float: left; width: 70%;"><br>
    <div>
      <label for="reUse"><font color="white">Re-Use Previously Stored</font></label>
      <select id="reUse" class="round" onchange="glob.disallowAlert(this)">
        <option value="1" selected>Allow</option>
        <option value="0">Disallow</option>
      </select>
      <text style="font-size: 60%;">Toggles re-use of previously stored JSON from same URL.</text>
    </div>
  </div>
  <div style="float: left; width: 70%;"><br>
  <div>
    <label for="debugMode"><font color="white">Debug Mode</font></label>
    <select id="debugMode" class="round">
      <option value="1" selected>Enabled</option>
      <option value="0">Disabled</option>
    </select>
    <text style="font-size: 60%;">Enables verbose printing to the console, disable to stop all but error printing.</text>
  </div>
</div>
</div>`
  },

  init () {
    const { glob, document } = this

    glob.variableChange(document.getElementById('storage'), 'varNameContainer')

    glob.checkBox = function (element, type) {
      if (type === 'auth') {
        document.getElementById('authSection').style.display = element.checked ? '' : 'none'
        document.getElementById('showAuth').value = element.checked ? '1' : '0'
      }
    }

    glob.disallowAlert = function (element) {
      if (element.value === '0') {
        // eslint-disable-next-line no-undef
        alert('Disabling this could lead to you being banned or rate limited by APIs, please be careful.')
      }
    }

    glob.checkBox(document.getElementById('toggleAuth'), 'auth')
  },

  action (cache) {
    const _this = this

    const data = cache.actions[cache.index]

    const Mods = this.getMods()
    const request = Mods.require('request')

    const _DEBUG = parseInt(data.debugMode)

    const storage = parseInt(data.storage)
    const varName = this.evalMessage(data.varName, cache)

    let url = this.evalMessage(data.url, cache)
    const path = this.evalMessage(data.path, cache)

    const token = this.evalMessage(data.token, cache)
    const user = this.evalMessage(data.user, cache)
    const reUse = parseInt(data.reUse)
    const pass = this.evalMessage(data.pass, cache)

    const headers = this.evalMessage(data.headers, cache)

    // if it fails the check, try to re-encode the url
    if (!Mods.checkURL(url)) { url = encodeURI(url) }

    if (Mods.checkURL(url)) {
      try {
        // eslint-disable-next-line no-inner-declarations
        function storeData (error, res, jsonData) {
          const statusCode = res ? res.statusCode : 200
          let errorJson
          if (error) {
            errorJson = JSON.stringify({ error, statusCode })
            _this.storeValue(errorJson, storage, varName, cache)

            console.error(`WebAPI: Error: ${errorJson} stored to: [${varName}]`)
          } else if (path) {
            const outData = Mods.jsonPath(jsonData, path)

            if (_DEBUG) console.dir(outData)

            try {
              JSON.parse(JSON.stringify(outData))
            } catch (error) {
              errorJson = JSON.stringify({ error, statusCode, success: false })
              _this.storeValue(errorJson, storage, varName, cache)
              console.error(error.stack ? error.stack : error)
            }

            // eslint-disable-next-line no-eval
            const outValue = eval(JSON.stringify(outData), cache)

            if (!outData) {
              console.error(`WebAPI: Error: ${errorJson} NO JSON data returned. Check the URL: ${url}`)
              errorJson = JSON.stringify({ error: 'No JSON Data Returned', statusCode: 0 })
              _this.storeValue(errorJson, storage, varName, cache)
            } else if (outData.success != null) {
              errorJson = JSON.stringify({ error, statusCode, success: false })
              _this.storeValue(errorJson, storage, varName, cache)
              console.log(`WebAPI: Error Invalid JSON, is the Path and/or URL set correctly? [${path}]`)
            } else if (outValue.success != null || !outValue) {
              errorJson = JSON.stringify({ error, statusCode, success: false })
              _this.storeValue(errorJson, storage, varName, cache)
              console.log(`WebAPI: Error Invalid JSON, is the Path and/or URL set correctly? [${path}]`)
            } else {
              _this.storeValue(outValue, storage, varName, cache)
              _this.storeValue(jsonData, 1, url, cache)
              _this.storeValue(url, 1, `${url}_URL`, cache)
              if (_DEBUG) console.log(`WebAPI: JSON Data values starting from [${path}] stored to: [${varName}]`)
            }
          } else {
            if (_DEBUG) console.dir(jsonData)
            _this.storeValue(jsonData, storage, varName, cache)
            _this.storeValue(jsonData, 1, url, cache)
            _this.storeValue(url, 1, `${url}_URL`, cache)
            if (_DEBUG) console.log(`WebAPI: JSON Data Object stored to: [${varName}]`)
          }
          _this.callNextAction(cache)
        }

        const oldUrl = this.getVariable(1, `${url}_URL`, cache)

        if (url === oldUrl && reUse === 1) {
          let jsonData
          let error
          const res = { statusCode: 200 }

          try {
            jsonData = this.getVariable(1, url, cache)
          } catch (err) {
            error = err
          }

          if (_DEBUG) console.log('WebAPI: Using previously stored json data from the initial store json action within this command.')

          storeData(error, res, jsonData)
        } else {
          const setHeaders = {}

          // set default required header
          setHeaders['User-Agent'] = 'Other'

          // Because headers are a dictionary ;)
          if (headers) {
            const lines = String(headers).split('\n')
            for (let i = 0; i < lines.length; i++) {
              const header = lines[i].split(':')

              if (lines[i].includes(':') && header.length > 0) {
                const key = header[0] || 'Unknown'
                const value = header[1] || 'Unknown'
                setHeaders[key] = value

                if (_DEBUG) console.log(`Applied Header: ${lines[i]}`)
              } else {
                console.error(`WebAPI: Error: Custom Header line ${lines[i]} is wrongly formatted. You must split the key from the value with a colon (:)`)
              }
            }
          }

          request.get({
            url,
            json: true,
            headers: setHeaders,
            auth: {
              bearer: token,
              user,
              pass,
              sendImmediately: false
            }
          }, (error, res, jsonData) => storeData(error, res, jsonData))
        }
      } catch (err) {
        console.error(err.stack ? err.stack : err)
      }
    } else {
      console.error(`URL [${url}] Is Not Valid`)
    }
  },

  mod (DBM) {
    DBM.Actions['Store Variable From WebAPI'] = DBM.Actions['Store Json From WebAPI']
  }
}
