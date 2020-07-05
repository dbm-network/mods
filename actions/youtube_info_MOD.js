module.exports = {
  name: 'Store YouTube Info',
  section: 'Audio Control',

  subtitle (data) {
    const info = ['Video ID', 'Video URL', 'Video Title', 'Video Description', 'Video Owner', 'Video ChannelID', 'Video ThumbnailUrl', 'Video EmbedURL', 'Video Genre', 'Video Paid', 'Video Unlisted', 'Video isFamilyFriendly', 'Video Duration', 'Video Views', 'Video regionsAllowed', 'Video commentCount', 'Video  likeCount', 'Video  dislikeCount', 'Video  channelThumbnailUrl']
    return `YouTube ${info[parseInt(data.info)]}`
  },

  variableStorage (data, varType) {
    const type = parseInt(data.storage)
    if (type !== varType) return
    const info = parseInt(data.info)
    let dataType = 'Unknown YouTube Type'
    switch (info) {
      case 0:
        dataType = 'YouTube Video ID'
        break
      case 1:
        dataType = 'YouTube Video URL'
        break
      case 2:
        dataType = 'YouTube Video Title'
        break
      case 3:
        dataType = 'YouTube Video Description'
        break
      case 4:
        dataType = 'YouTube Video Owner'
        break
      case 5:
        dataType = 'YouTube Video ChannelID'
        break
      case 6:
        dataType = 'YouTube Video ThumbnailUrl'
        break
      case 7:
        dataType = 'YouTube Video EmbedURL'
        break
      case 8:
        dataType = 'YouTube Video Genre'
        break
      case 9:
        dataType = 'YouTube Video Paid'
        break
      case 10:
        dataType = 'YouTube Video Unlisted'
        break
      case 11:
        dataType = 'YouTube Video isFamilyFriendly'
        break
      case 12:
        dataType = 'YouTube Video Duration'
        break
      case 13:
        dataType = 'YouTube Video Views'
        break
      case 14:
        dataType = 'YouTube Video regionsAllowed'
        break
      case 15:
        dataType = 'YouTube Video commentCount'
        break
      case 16:
        dataType = 'YouTube Video likeCount'
        break
      case 17:
        dataType = 'YouTube Video dislikeCount'
        break
      case 18:
        dataType = 'YouTube Video channelThumbnailUrl'
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
    <textarea id="video" rows="2" placeholder="Video ID or Video URL Goes here!" style="width: 95%; font-family: monospace; white-space: nowrap; resize: none;"></textarea>
  </div>
  <div style="width: 95%; padding-top: 8px;">
    Source Info:<br>
    <select id="info" class="round">
      <option value="0">Video ID</option>
      <option value="1">Video URL</option>
      <option value="2">Video Title</option>
      <option value="3">Video Description</option>
      <option value="4">Video Owner</option>
      <option value="5">Video ChannelID</option>
      <option value="6">Video ThumbnailUrl</option>
      <option value="7">Video EmbedURL</option>
      <option value="8">Video Genre</option>
      <option value="9">Video Paid</option>
      <option value="10">Video Unlisted</option>
      <option value="11">Video isFamilyFriendly</option>
      <option value="12">Video Duration(hh:mm:ss)</option>
      <option value="13">Video Views</option>
      <option value="14">Video regionsAllowed</option>
      <option value="15">Video commentCount</option>
      <option value="16">Video likeCount</option>
      <option value="17">Video dislikeCount</option>
      <option value="18">Video channelThumbnailUrl</option>
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
    const fetchVideoInfo = Mods.require('youtube-info')
    const TimeFormat = Mods.require('hh-mm-ss')
    const ytdl = Mods.require('ytdl-core')
    let result

    if (!video) return console.log('Please specify a video id to get video informations.')

    const songID = ytdl.getVideoID(video)

    fetchVideoInfo(songID, (err, videoInfo) => {
      if (err) return console.error(err)

      switch (info) {
        case 0:
          result = videoInfo.videoId
          break
        case 1:
          result = videoInfo.url
          break
        case 2:
          result = videoInfo.title
          break
        case 3:
          result = videoInfo.description
          break
        case 4:
          result = videoInfo.owner
          break
        case 5:
          result = videoInfo.channelId
          break
        case 6:
          result = videoInfo.thumbnailUrl
          break
        case 7:
          result = videoInfo.embedURL
          break
        case 8:
          result = videoInfo.genre
          break
        case 9:
          result = videoInfo.paid
          break
        case 10:
          result = videoInfo.unlisted
          break
        case 11:
          result = videoInfo.isFamilyFriendly
          break
        case 12:
          result = TimeFormat.fromS(videoInfo.duration) // check documentation/parameters ==> https://www.npmjs.com/package/hh-mm-ss
          // result = videoInfo.duration; just seconds =]]
          break
        case 13:
          result = videoInfo.views
          break
        case 14:
          result = videoInfo.regionsAllowed
          break
        case 15:
          result = videoInfo.commentCount
          break
        case 16:
          result = videoInfo.likeCount
          break
        case 17:
          result = videoInfo.dislikeCount
          break
        case 18:
          result = videoInfo.channelThumbnailUrl
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
