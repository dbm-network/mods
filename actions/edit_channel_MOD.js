module.exports = {
  name: 'Edit Channel',
  section: 'Channel Control',

  subtitle (data) {
    const names = ['Same Channel', 'Mentioned Channel', 'Default Channel', 'Temp Variable', 'Server Variable', 'Global Variable']
    const opt = ['Name', 'Topic', 'Position', 'Bitrate', 'User Limit', 'Category ID', 'Rate Limit Per User', 'Set Channel NSFW', 'Remove Channel NSFW']
    return `${names[parseInt(data.storage)]} - ${opt[parseInt(data.toChange)]}`
  },

  fields: ['storage', 'varName', 'channelType', 'toChange', 'newState'],

  html (isEvent, data) {
    return `
<div>
  <div style="float: left; width: 35%;">
    Source Channel:<br>
    <select id="storage" class="round" onchange="glob.channelChange(this, 'varNameContainer')">
      ${data.channels[isEvent ? 1 : 0]}
    </select>
  </div>
  <div id="varNameContainer" style="display: none; float: right; width: 60%;">
    Variable Name:<br>
    <input id="varName" class="round" type="text" list="variableList"><br>
  </div>
</div><br><br><br>
<div>
  <div style="float: left; width: 35%;">
    Channel Type:<br>
    <select id="channelType" class="round">
      <option value="0" selected>Text Channel</option>
      <option value="1">Voice Channel</option>
    </select>
  </div><br><br><br>
</div>
<div>
  <div style="float: left; width: 35%;">
    Change:<br>
    <select id="toChange" class="round">
      <option value="0" selected>Name</option>
      <option value="1">Topic</option>
      <option value="2">Position</option>
      <option value="3">Bitrate</option>
      <option value="4">User Limit</option>
      <option value="5">Category ID</option>
      <option value="6">Rate Limit Per User</option>
      <option value="7">Set Channel NSFW</option>
      <option value="8">Remove Channel NSFW</option>
    </select>
  </div><br><br><br>
<div>
  <div style="float: left; width: 80%;">
    Change to:<br>
    <input id="newState" class="round" type="text"><br>
  </div>
</div>`
  },

  init () {
    const { glob, document } = this

    glob.channelChange(document.getElementById('storage'), 'varNameContainer')
  },

  action (cache) {
    const data = cache.actions[cache.index]
    const storage = parseInt(data.storage)
    const varName = this.evalMessage(data.varName, cache)
    const channelType = parseInt(data.channelType)
    const newState = this.evalMessage(data.newState, cache)
    const toChange = parseInt(data.toChange, cache)

    let channel
    switch (channelType) {
      case 0:
        channel = this.getChannel(storage, varName, cache)
        break
      case 1:
        channel = this.getVoiceChannel(storage, varName, cache)
        break
      default:
        channel = this.getChannel(storage, varName, cache)
        break
    }

    if (toChange === 1) {
      channel.edit({ topic: newState })
    } else if (toChange === 0) {
      channel.edit({ name: newState })
    } else if (toChange === 2) {
      channel.edit({ position: newState })
    } else if (toChange === 3) {
      channel.edit({ bitrate: parseInt(newState) })
    } else if (toChange === 4) {
      channel.edit({ userLimit: parseInt(newState) })
    } else if (toChange === 5) {
      channel.setParent(newState)
    } else if (toChange === 6) {
      channel.setRateLimitPerUser(newState)
    } else if (toChange === 7) {
      channel.setNSFW(true)
    } else if (toChange === 8) {
      channel.setNSFW(false)
    } else {
      console.log('Please update your edit_channel_MOD.js in your projects action folder!')
    }
    this.callNextAction(cache)
  },

  mod (DBM) {
    DBM.Actions['Edit channel'] = DBM.Actions['Edit Channel']
  }
}
