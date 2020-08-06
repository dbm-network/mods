module.exports = {
  name: 'Store Playlist Info',
  section: 'YouTube Tools',

  subtitle (data) {
    return 'Store YouTube playlist information.'
  },

  variableStorage (data, varType) {
    if (parseInt(data.storage) !== varType) return
    return ([data.varName, 'Playlist Info'])
  },

  fields: ['query', 'info', 'storage', 'varName'],

  html (isEvent, data) {
    return `
<div style="width: 90%;">
  Playlist URL:<br>
  <input id="query" class="round" type="text">
</div><br>
<div style="padding-top: 8px; width: 60%;">
  Options:
  <select id="info" class="round">
    <option value="0" selected>Video Data List</option>
    <option value="1">Video URL List</option>
    <option value="2">Video Name List</option>
    <option value="3">Video Duration List</option>
    <option value="4">Video ID List</option>
  </select>
</div><br>
<div style="padding-top: 8px;">
  <div style="float: left; width: 35%;">
    Store In:<br>
    <select id="storage" class="round">
      ${data.variables[1]}
    </select>
  </div>
  <div id="varNameContainer" style="float: right; width: 60%;">
    Variable Name:<br>
    <input id="varName" class="round" type="text">
  </div>
</div>`
  },

  init () {},

  async action (cache) {
    const data = cache.actions[cache.index]
    const storage = parseInt(data.storage)
    const varName = this.evalMessage(data.varName, cache)
    const url = this.evalMessage(data.query, cache)
    const INFO = parseInt(data.info)
    const Mods = this.getMods()
    const ytlist = Mods.require('youtube-playlist')
    let result

    switch (INFO) {
      case 0:
        result = await ytlist(url, ['id', 'name', 'url'])
        break
      case 1:
        result = await ytlist(url, 'url')
        break
      case 2:
        result = await ytlist(url, 'name')
        break
      case 3:
        result = await ytlist(url, 'duration')
        break
      case 4:
        result = await ytlist(url, 'id')
        break
    }

    this.storeValue(result, storage, varName, cache)
    this.callNextAction(cache)
  },

  mod () {}
}
