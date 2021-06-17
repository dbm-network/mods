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
  <div>
    <div style="float: left; width: 95%;">
      Webpage URL: <br>
      <textarea id="url" class="round" style="width: 99%; resize: none;" type="textarea" rows="4" cols="20"></textarea><br>
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

    glob.variableChange(document.getElementById('storage'), 'varNameContainer')
  },

  async action (cache) {
    const Mods = this.getMods()
    const got = Mods.require('got')

    const data = cache.actions[cache.index]

    const varName = this.evalMessage(data.varName, cache)
    const storage = parseInt(data.storage)

    let url = this.evalMessage(data.url, cache)

    if (!Mods.checkURL(url)) url = encodeURI(url)

    if (Mods.checkURL(url)) {
      try {
        const response = await got(url)
        const html = response.body
        this.storeValue(html.trim(), storage, varName, cache)
        this.callNextAction(cache)
      } catch (err) {
        console.error(err)
      }
    } else {
      throw Error(`HTML Parser - URL [${url}] Is Not Valid`)
    }
  },

  mod () {}
}
