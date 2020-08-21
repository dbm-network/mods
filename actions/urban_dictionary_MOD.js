module.exports = {
  name: 'Urban Dictionary Search',
  section: 'Other Stuff',

  subtitle (data) {
    const info = ['Definition', 'Result URL', 'Example', 'Thumbs Up Count', 'Thumbs Down Count', 'Author', 'Result ID', 'Tags']
    return `${info[parseInt(data.info)]}`
  },

  variableStorage (data, varType) {
    const type = parseInt(data.storage)
    if (type !== varType) return
    const info = parseInt(data.info)
    let dataType = 'Unknown Urban Dictionary Result'
    switch (info) {
      case 0:
        dataType = 'U.D. Definition'
        break
      case 1:
        dataType = 'U.D. URL'
        break
      case 2:
        dataType = 'U.D. Example'
        break
      case 3:
        dataType = 'U.D. Thumbs Up Count'
        break
      case 4:
        dataType = 'U.D. Thumbs Down Count'
        break
      case 5:
        dataType = 'U.D. Author'
        break
      case 6:
        dataType = 'U.D. Result ID'
        break
    }
    return ([data.varName, dataType])
  },

  fields: ['string', 'info', 'storage', 'varName'],

  html (isEvent, data) {
    return `
<div style="width: 550px; height: 350px; overflow-y: scroll;">
  <div style="width: 100%; padding-top: 8px;">
    String to Search:<br>
    <textarea id="string" rows="6" placeholder="Write a something or use variables..." style="width: 95%; font-family: monospace; white-space: nowrap; resize: none;"></textarea>
  </div>
  <div style="float: left; width: 94%; padding-top: 8px;">
    Source Info:<br>
    <select id="info" class="round">
      <option value="0">Definition</option>
      <option value="1">URL</option>
      <option value="2">Example</option>
      <option value="3">Thumbs Up Count</option>
      <option value="4">Thumbs Down Count</option>
      <option value="5">Author</option>
      <option value="6">Result ID</option>
    </select>
  </div><br><br><br>
  <div>
    <div style="float: left; width: 35%; padding-top: 8px;">
      Store In:<br>
      <select id="storage" class="round" onchange="glob.variableChange(this, 'varNameContainer')">
        ${data.variables[0]}
      </select>
    </div>
    <div id="varNameContainer" style="float: right; width: 60%; padding-top: 8px;">
      Variable Name:<br>
      <input id="varName" class="round" type="text"><br>
    </div>
  </div>
</div>`
  },

  init () {
    const { glob, document } = this
    glob.variableChange(document.getElementById('storage'), 'varNameContainer')
  },

  action (cache) {
    const data = cache.actions[cache.index]
    const info = parseInt(data.info)
    const string = this.evalMessage(data.string, cache)

    if (!string) return console.log('Please write something to search on Urban Dictionary.')

    const _this = this
    const Mods = this.getMods()
    const urban = Mods.require('urban')

    urban(`${string}`).first((results) => {
      if (!results) return _this.callNextAction(cache)
      let result
      switch (info) {
        case 0:
          result = results.definition
          break
        case 1:
          result = results.permalink
          break
        case 2:
          result = results.example
          break
        case 3:
          result = results.thumbs_up
          break
        case 4:
          result = results.thumbs_down
          break
        case 5:
          result = results.author
          break
        case 6:
          result = results.defid
          break
        default:
          break
      }

      if (result !== undefined) {
        const storage = parseInt(data.storage)
        const varName2 = _this.evalMessage(data.varName, cache)
        _this.storeValue(result, storage, varName2, cache)
      }
      _this.callNextAction(cache)
    })
  },

  mod () {}
}
