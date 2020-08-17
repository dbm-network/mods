module.exports = {
  name: 'Store YouTube Channel Info',
  section: 'YouTube Tools',

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
<div style="width: 90%;">
  YouTube Channel ID:<br>
  <input id="query" class="round" type="text">
</div><br>
<div style="padding-top: 8px; width: 60%;">
  Options:
  <select id="info" class="round">
    <option value="0" selected>Channel URL</option>
    <option value="1">Channel Name</option>
    <option value="2">Channel Description</option>
    <option value="3">Subscriber Count</option>
    <option value="4">Related Channels</option>
    <option value="5">Is Family Friendly?</option>
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
    const channelId = this.evalMessage(data.query, cache)
    const info = parseInt(data.info)
    const Mods = this.getMods()
    const ytch = Mods.require('yt-channel-info')
    let result

    const maininfo = await ytch.getChannelInfo(channelId)

    switch (info) {
      case 0:
        result = maininfo.authorUrl
        break
      case 1:
        result = maininfo.author
        break
      case 2:
        result = maininfo.description
        break
      case 3:
        result = maininfo.subscriberCount
        break
      case 4:
        result = maininfo.relatedChannels
        break
      case 5:
        result = maininfo.isFamilyFriendly
        break
    }

    this.storeValue(result, storage, varName, cache)
    this.callNextAction(cache)
  },

  mod () {}
}
