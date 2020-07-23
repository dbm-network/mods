module.exports = {
  name: 'Store YouTube Info',
  section: 'Audio Control',

  subtitle (data) {
    const info = ['Video ID', 'Video URL', 'Video Title', 'Video Description', 'Video Channel ID', 'Video Channel URL', 'Video Channel Name', 'Video Thumbnail URL', 'Video Duration', 'Video Publish Data', 'Video Views', 'Video is live?']
    return `YouTube ${info[parseInt(data.info)]}`
  },

  variableStorage (data, varType) {
    const type = parseInt(data.storage)
    if (type !== varType) return
    let dataType = 'Unknown Type'
    switch (parseInt(data.info)) {
      case 0: // Video ID
      case 2: // Video Title
      case 3: // Video Description
      case 5: // Video Channel ID
      case 4: // Video Channel Name
      case 12: // Video Duration
      case 21: // Video Publish Date
        dataType = 'Text'
        break
      case 1: // Video URL
      case 20: // Video Channel URL
        dataType = 'URL'
        break
      case 6: // Video Thumbnail URL
        dataType = 'Image URL'
        break
      case 19: // Video is live?
        dataType = 'Boolean'
        break
      case 13: // Video Views
        dataType = 'Number'
        break
    }
    return ([data.varName, dataType])
  },

  fields: ['video', 'info', 'storage', 'varName'],

  html (isEvent, data) {
    return `
<div style="width: 550px; height: 350px; overflow-y: scroll;">
  <div style="width: 95%; padding-top: 8px;">
    Video to Search:<br>
    <textarea id="video" rows="2" placeholder="Video to search for goes here" style="width: 95%; font-family: monospace; white-space: nowrap; resize: none;"></textarea>
  </div>
  <div style="width: 95%; padding-top: 8px;">
    Source Info:<br>
    <select id="info" class="round">
      <option value="0">Video ID</option>
      <option value="1">Video URL</option>
      <option value="2">Video Title</option>
      <option value="3">Video Description</option>
      <option value="4">Video Channel Name</option>
      <option value="5">Video Channel ID</option>
      <option value="20">Video Channel URL</option>
      <option value="6">Video Thumbnail URL</option>
      <option value="12">Video Duration</option>
      <option value="21">Video Publish Date</option>
      <option value="13">Video Views</option>
      <option value="19">Video is Live?</option>
    </select>
  </div>
  <div>
    <div style="float: left; width: 35%;  padding-top: 8px;">
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

  async action (cache) {
    const data = cache.actions[cache.index]
    const info = parseInt(data.info)
    const _this = this
    const video = this.evalMessage(data.video, cache)
    const Mods = this.getMods()
    const TimeFormat = Mods.require('hh-mm-ss')
    const ytsr = Mods.require('ytsr')
    let result

    if (!video) return console.log('Please specify a video to get video informations.')

    ytsr(video, function (err, searchResults) {
      if (err) return console.error(err)
      const video = searchResults.item[0]

      switch (info) {
        case 0: // Video ID
          result = video.link.replace('https://www.youtube.com/watch?v=', '')
          break
        case 1: // Video URL
          result = video.link
          break
        case 2: // Video Title
          result = video.title.replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&#39;/g, "'")
          break
        case 3: // Video Description
          result = video.description.replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&#39;/g, "'")
          break
        case 4: // Video Channel Name
          result = video.author.name
          break
        case 5: // Video Channel ID
          result = video.author.ref.replace('https://www.youtube.com/channel/', '')
          break
        case 6: // Thumbnail URL (Default)
          result = video.thumbnail
          break
        case 12: // Video Duration
          result = TimeFormat.toS(video.duration)
          break
        case 13: // Video Views
          result = video.views
          break
        case 19: // is live?
          result = video.live
          break
        case 20: // Video Channel URL
          result = video.author.ref
          break
        case 21: // Video Publish Date
          result = video.uploaded_at
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
