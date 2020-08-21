module.exports = {
  name: 'Parse From Stored Json',
  section: 'JSON Things',

  subtitle (data) {
    return `${data.varName}`
  },

  variableStorage (data, varType) {
    const type = parseInt(data.storage)
    if (type !== varType) return

    if (varType === 'object') return [data.varName, 'JSON Object']

    return [data.varName, `JSON ${varType} Value`]
  },

  fields: ['behavior', 'varStorage', 'jsonObjectVarName', 'path', 'storage', 'varName'],

  html (isEvent, data) {
    return `
<div style="margin: 0; overflow-y: none;">
    <div>
        <p>
        <u>Mod Info:</u><br>
        Authors: ${this.author}
        </p>
    </div><br>
    <div style="width: 80%;">
        <div style="float: left; width: 35%;">
              Variable:<br>
              <select id="varStorage" class="round" onchange="glob.refreshVariableList(this)">
                  ${data.variables[1]}
              </select>
        </div>
        <div id="jsonObjectVarNameContainer" style="float: right; width: 60%;">
            Variable Name:<br>
            <input id="jsonObjectVarName" class="round" type="text" list="variableList">
        </div><br><br><br>
        <div id="pathContainer" tyle="padding-top: 8px;">
            JSON Path: (supports the usage of <a href="http://goessner.net/articles/JsonPath/index.html#e2" target="_blank">JSON Path (Regex)</a>)<br>
            <input id="path" class="round" ;" type="text"><br>
        </div>
    </div>
    <div style="width: 80%;">
        <div style="float: left; width: 30%;">
            <label for="storage">
                <font color="white">Store In:</font>
            </label>
            <select id="storage" class="round" onchange="glob.variableChange(this, 'varNameContainer')">
                ${data.variables[1]}
            </select>
        </div>
        <div id="varNameContainer" style="margin-left: 10px; float: left; width: 65%;">
            <label for="varName">
                <font color="white">Variable Name:</font>
            </label>
            <input id="varName" class="round" type="text">
        </div>
    </div>
    <div>
        <div style="float: left;">
            <br>
            <label for="behavior">
                <font color="white">End Behavior:</font>
            </label>
            <select id="behavior" class="round" ;>
                <option value="0" selected>Call Next Action Automatically</option>
                <option value="1">Do Not Call Next Action</option>
            </select>
        </div>
        <div style="float: left; margin-left: 10px; width: 30%;">
            <br>
            <label for="debugMode">
                <font color="white">Debug Mode:</font>
            </label>
            <select id="debugMode" class="round">
                <option value="0" selected>Disabled</option>
                <option value="1">Enabled</option>
            </select>
        </div>
    </div>
</div>
`
  },

  init () {
    const { glob, document } = this
    glob.variableChange(document.getElementById('storage'), 'varNameContainer')
    glob.refreshVariableList(document.getElementById('storage'))
  },

  action (cache) {
    const Mods = this.getMods()
    const data = cache.actions[cache.index]
    const varName = this.evalMessage(data.varName, cache)
    const storage = parseInt(data.storage)
    const type = parseInt(data.varStorage)
    const jsonObjectVarName = this.evalMessage(data.jsonObjectVarName, cache)
    const path = this.evalMessage(data.path, cache)
    const jsonRaw = this.getVariable(type, jsonObjectVarName, cache)
    const DEBUG = parseInt(data.debugMode)

    let jsonData = jsonRaw
    if (typeof jsonRaw !== 'object') {
      jsonData = JSON.parse(jsonRaw)
    }

    try {
      if (path && jsonData) {
        let outData = Mods.jsonPath(jsonData, path)

        // if it dont work, try to go backwards one path
        if (outData === false) {
          outData = Mods.jsonPath(jsonData, `$.${path}`)
        }

        // if it still dont work, try to go backwards two paths
        if (outData === false) {
          outData = Mods.jsonPath(jsonData, `$..${path}`)
        }

        if (DEBUG) console.log(outData)

        try {
          JSON.parse(JSON.stringify(outData))
        } catch (error) {
          const errorJson = JSON.stringify({ error, success: false })
          this.storeValue(errorJson, storage, varName, cache)
          console.error(error.stack ? error.stack : error)
        }

        // eslint-disable-next-line no-eval
        const outValue = eval(JSON.stringify(outData), cache)

        if (outData.success != null || outValue.success != null) {
          const errorJson = JSON.stringify({
            error: 'error',
            statusCode: 0,
            success: false
          })
          this.storeValue(errorJson, storage, varName, cache)
          console.log(`WebAPI Parser: Error Invalid JSON, is the Path set correctly? [${path}]`)
        } else if (outValue.success != null || !outValue) {
          const errorJson = JSON.stringify({
            error: 'error',
            statusCode: 0,
            success: false
          })
          this.storeValue(errorJson, storage, varName, cache)
          console.log(`WebAPI Parser: Error Invalid JSON, is the Path set correctly? [${path}]`)
        } else {
          this.storeValue(outValue, storage, varName, cache)
          if (DEBUG) console.log(`WebAPI Parser: JSON Data values starting from [${path}] stored to: [${varName}]`)
        }
      }
    } catch (error) {
      const errorJson = JSON.stringify({
        error,
        statusCode: 0,
        success: false
      })
      this.storeValue(errorJson, storage, varName, cache)
      console.error(`WebAPI Parser: Error: ${errorJson} stored to: [${varName}]`)
    }

    if (data.behavior === '0') {
      this.callNextAction(cache)
    }
  },

  mod () {}
}
