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
    const query = this.evalMessage(data.query, cache)
    const INFO = parseInt(data.info)
    const ytlist = require('youtube-playlist')
    const url = query
    let result = 5

    switch (INFO) {
      case 0:
        const datas = await ytlist(url, ['id', 'name', 'url'])
        const datalist = JSON.stringify(datas)
        result = datalist
        break
      case 1:
        const urls = await ytlist(url, 'url')
        const urllist = JSON.stringify(urls)
        result = urllist
        break
      case 2:
        const names = await ytlist(url, 'name')
        const namelist = JSON.stringify(names)
        result = namelist
        break
      case 3:
        const durationis = await ytlist(url, 'duration')
        const durationlist = JSON.stringify(durationis)
        result = durationlist
        break
      case 4:
        const ids = await ytlist(url, 'id')
        const idlist = JSON.stringify(ids)
        result = idlist
        break
    }

    this.storeValue(result, storage, varName, cache)
    this.callNextAction(cache)
  },

  mod () {}
}
