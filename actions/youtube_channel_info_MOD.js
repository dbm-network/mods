module.exports = {

  name: 'Store YouTube Channel Info',
  section: 'Audio Control',

  subtitle (data) {
    return 'Store information about a YouTube channel.'
  },

  variableStorage (data, varType) {
    const type = parseInt(data.storage)
    if (type !== varType) return
    const dataType = 'YouTube Channel Info'
    return ([data.varName, dataType])
  },

  fields: ['query', 'info', 'storage', 'varName'],

  html (isEvent, data) {
    return `
<div style="width: 100%;">
  YouTube Channel URL:<br>
  <input id="query" class="round" type="text">
</div><br>
<div style="padding-top: 8px; width: 60%;">
  Options:
  <select id="info" class="round">
    <option value="0" selected>Channel ID</option>
    <option value="1">Channel Name</option>
    <option value="2">Channel Creation Date</option>
    <option value="3">Channel Location</option>
    <option value="4">Channel Description</option>
    <option value="5">Subscriber Count</option>
    <option value="6">View Count</option>
    <option value="7">Is Family Friendly?</option>
    <option value="8">Channel Keywords</option>
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

  init () { },

  async action (cache) {
    const data = cache.actions[cache.index]
    const storage = parseInt(data.storage)
    const INFO = parseInt(data.info)
    const varName = this.evalMessage(data.varName, cache)
    const query = this.evalMessage(data.query, cache)
    const Mods = this.getMods()
    const url = query
    let result = false
    const ytscrape = Mods.require('yt-scraper')
    const testresponse = await ytscrape.channelInfo(url)
    switch (INFO) {
      case 0:
        result = testresponse.id
        dataType = 'YouTube Channel ID'
        break
      case 1:
        result = testresponse.name
        dataType = 'YouTube Channel Name'
        break
      case 2:
        result = testresponse.joined
        dataType = 'YouTube Channel Creation Date'
        break
      case 3:
        result = testresponse.location
        dataType = 'YouTube Channel Location'
        break
      case 4:
        result = testresponse.description
        dataType = 'YouTube Channel Description'
        break
      case 5:
        result = testresponse.approx.subscribers
        dataType = 'Subscriber Count'
        break
      case 6:
        result = testresponse.approx.views
        dataType = 'View Count'
        break
      case 7:
        result = testresponse.privacy.familySafe
        break
      case 8:
        result = testresponse.keywords
        dataType = 'YouTube Channel Keywords'
        break
    }

    this.storeValue(result, storage, varName, cache)
    this.callNextAction(cache)
  },

  mod () {}
}