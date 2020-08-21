module.exports = {
  name: 'Parse From Stored Webpage',
  section: 'HTML/XML Things',

  subtitle (data) {
    return ` Var: ${data.varName} Path: ${data.xpath}`
  },

  variableStorage (data, varType) {
    const type = parseInt(data.storage)
    if (type !== varType) return
    return ([data.varName, 'String'])
  },

  fields: ['debugMode', 'xpath', 'source', 'sourceVarName', 'storage', 'varName'],

  html (isEvent, data) {
    return `
<div id ="wrexdiv" style="width: 550px; height: 350px; overflow-y: scroll;">
  <div>
    <u>Instructions:</u><br>
    1. Input a Path into the XPath textarea<br>
    2. Test Online: <span class="wrexlink" data-url="https://codebeautify.org/Xpath-Tester">X-Path Tester</span><br>
    3. How to get <span class="wrexlink" data-url="https://stackoverflow.com/a/46599584/1422928">XPath from Chrome.</span><br>
    </p
  </div>
  <div style="float: left; width: 35%;">
    Source HTML:<br>
    <select id="source" class="round" onchange="glob.variableChange(this, 'sourceVarNameContainer')">
      ${data.variables[1]}
    </select>
  </div>
  <div id="sourceVarNameContainer" style="display: none; float: right; width: 60%;">
    Variable Name:<br>
    <input id="sourceVarName" class="round" type="text" list="variableList">
  </div><br><br><br>
  <div>
    XPath: (Supports multiple, split with the <b>|</b> symbol) <br>
    <textarea id="xpath" class="round" style="width: 99%; resize: none;" type="textarea" rows="2" cols="20"></textarea><br>
  </div>
  <div hidden="true">
    <button class="tiny compact ui labeled icon button" onclick="glob.checkPath(this)"><i class="plus icon"></i>Check XPath</button><br>
    Valid: <text id="valid" style="color: red">Input A Path</text>
  </div><br>
  <div style="float: left; width: 35%;">
    Store In:<br>
    <select id="storage" class="round" onchange="glob.variableChange(this, 'varNameContainer')">
      ${data.variables[0]}
    </select>
  </div>
  <div id="varNameContainer" style="display: none; float: right; width: 60%;">
    Storage Variable Name:<br>
    <input id="varName" class="round" type="text">
  </div><br>
  <div style="float: left; width: 30%;">
    <br>Debug Mode: (Enable to see verbose printing in the bot console)<br>
    <select id="debugMode" class="round">
      <option value="1" selected>Enabled</option>
      <option value="0" >Disabled</option>
    </select>
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
      // write any init errors to errors.txt in dbm's main directory
      require('fs').appendFile('errors.txt', error.stack ? error.stack : `${error}\r\n`)
    }

    glob.variableChange(document.getElementById('storage'), 'varNameContainer')
    glob.variableChange(document.getElementById('source'), 'sourceVarNameContainer')
  },

  action (cache) {
    function manageXmlParseError (msg, errorLevel, errorLog) {
      if ((errorLog.errorLevel == null) || (errorLog.errorLevel < errorLevel)) {
        errorLog.errorLevel = errorLevel
      }
      if (errorLog[errorLevel.toString()] == null) {
        errorLog[errorLevel.toString()] = []
      }
      errorLog[errorLevel.toString()].push(msg)
    }

    try {
      const Mods = this.getMods()

      const data = cache.actions[cache.index]

      const sourceVarName = this.evalMessage(data.sourceVarName, cache)
      const source = parseInt(data.source)
      const varName = this.evalMessage(data.varName, cache)
      const storage = parseInt(data.storage)

      const DEBUG = parseInt(data.debugMode)

      const myXPath = this.evalMessage(data.xpath, cache)

      const html = this.getVariable(source, sourceVarName, cache)

      const xpath = Mods.require('xpath')
      const DOM = Mods.require('xmldom').DOMParser
      const ent = Mods.require('ent')

      if (myXPath) {
        // check for errors
        let errored = false
        try {
          xpath.evaluate(myXPath, null, null, null)
        } catch (error) {
          errored = error
          if (!error.toString().includes('nodeType')) console.error(`Invalid XPath: [${myXPath}] (${(error || '')})`)
        }

        if (html) {
          const mylocator = {}
          const parseLog = { errorLevel: 0 }
          const doc = new DOM({
            locator: mylocator,
            errorHandler: {
              warning: (msg) => {
                manageXmlParseError(msg, 1, parseLog)
              },
              error: (msg) => {
                manageXmlParseError(msg, 2, parseLog)
                if (DEBUG) console.log(`XMLDOMError: ${msg}`)
              },
              fatalError: (msg) => {
                manageXmlParseError(msg, 3, parseLog)
                if (DEBUG) console.log(`FATAL XMLDOMError: ${msg}`)
              }
            }
          }).parseFromString(ent.decode(html))

          let nodes = []
          try {
            nodes = xpath.select(myXPath, doc)

            if (nodes && nodes.length > 0) {
              const out = []
              nodes.forEach((node) => {
                const name = node.name || 'Text Value'
                const value = node.value ? node.value : node.toString()

                if (DEBUG) {
                  console.log('====================================')
                  console.log(`Source String: ${node.toString()}`)
                  console.log('====================================')
                  // console.log("Parent Node Name: " +  .name);
                  console.log(`Name: ${name}`)
                  console.log(`Line Number: ${node.lineNumber}`)
                  console.log(`Column Number: ${node.columnNumber}`)
                  console.log(`Parsed Value: ${value.trim()}`)
                  console.log('====================================\n')
                }

                out.push(value.trim())
              })

              if (out.length > 1 && DEBUG) {
                console.log('Stored value(s);\r\n')

                for (let i = 0; i < out.length; i++) {
                  console.log(`[${i}] = ${out[i]}`)
                }

                console.log('\r\nAppend the key that you want to store that value to the variable.')

                const storageType = ['', 'tempVars', 'serverVars', 'globalVars']
                const output = storageType[storage]

                console.log(`Example \${${output}("${varName}")} to \${${output}("${varName}")[key]}`)
                console.log(`${varName}[key] if not using it as a template\r\n`)
              }

              this.storeValue(out, storage, varName, cache)
              if (DEBUG) console.log(`Stored value(s) [${out}] to  [${varName}] `)

              this.callNextAction(cache)
            } else {
              console.error(`Could not store a value from path ${myXPath}, Check that the path is valid!\n`)
              if (DEBUG) console.info(`parsestatus ==> ${parseLog.errorLevel}\nlocator:${mylocator.columnNumber}/${mylocator.lineNumber}`)

              this.storeValue(errored || undefined, storage, varName, cache)
              this.callNextAction(cache)
            }
          } catch (error) {
            this.storeValue(errored || undefined, storage, varName, cache)
            this.callNextAction(cache)
          }
        } else {
          console.error('HTML data Is Not Valid!')
        }
      } else {
        console.error(`Path [${myXPath}] Is Not Valid`)
      }
    } catch (error) {
      console.error(`Webpage Things:  Error: ${error.stack}` ? error.stack : error)
    }
  },

  mod () {}
}
