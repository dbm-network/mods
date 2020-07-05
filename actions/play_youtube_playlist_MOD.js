module.exports = {
  name: 'Play YouTube Playlist',
  section: 'Audio Control',

  requiresAudioLibraries: true,

  subtitle (data) {
    return `${data.url}`
  },

  fields: ['url', 'apikey', 'seek', 'volume', 'passes', 'bitrate'],

  html (isEvent, data) {
    return `
<div style="float: left; width: 105%;">
  YouTube Playlist URL:<br>
  <input id="url" class="round" type="text" value="https://www.youtube.com/playlist?list=PLkfg3Bt9RE055BeP8DeDZSUCYxeSLnobe"><br>
</div>
<div style="float: left; width: 105%;">
  API Key:<br>
  <input id="apikey" class="round" type="text" placeholder="Insert your YouTube Data V3 API Key..."><br>
</div>
<div style="float: left; width: 49%;">
  Video Seek Positions:<br>
  <input id="seek" class="round" type="text" value="0"><br>
  Video Volumes:<br>
  <input id="volume" class="round" type="text" placeholder="Leave blank for automatic..."><br>
</div>
<div style="float: right; width: 49%;">
  Video Passes:<br>
  <input id="passes" class="round" type="text" value="1"><br>
  Video Bitrates:<br>
  <input id="bitrate" class="round" type="text" placeholder="Leave blank for automatic..."><br>
</div>`
  },

  init () {},

  action (cache) {
    const data = cache.actions[cache.index]
    const { Audio } = this.getDBM()
    const Mods = this.getMods()
    const YTapi = Mods.require('simple-youtube-api')
    const apikey = this.evalMessage(data.apikey, cache)
    const playlist = this.evalMessage(data.url, cache)
    const options = {}

    // Check Input
    if (playlist === undefined || playlist === '') {
      return console.log('Please insert a playlist url!')
    }
    if (apikey === undefined || playlist === '') {
      return console.log('Please insert an valid api key!')
    }

    // Check Options
    if (data.seek) {
      options.seek = parseInt(this.evalMessage(data.seek, cache))
    }
    if (data.volume) {
      options.volume = parseInt(this.evalMessage(data.volume, cache)) / 100
    } else if (cache.server) {
      options.volume = Audio.volumes[cache.server.id] || 0.5
    } else {
      options.volume = 0.5
    }
    if (data.passes) {
      options.passes = parseInt(this.evalMessage(data.passes, cache))
    }
    if (data.bitrate) {
      options.bitrate = parseInt(this.evalMessage(data.bitrate, cache))
    } else {
      options.bitrate = 'auto'
    }

    // Load playlist
    const YouTube = new YTapi(`${apikey}`)

    YouTube.getPlaylist(`${playlist}`).then((playlist) => {
      playlist.getVideos().then((videos) => {
        videos.forEach((video) => {
          const info = ['yt', options, `https://www.youtube.com/watch?v=${video.id}`]
          if (video.id !== undefined) {
            Audio.addToQueue(info, cache)
          }
        })
      })
    })

    this.callNextAction(cache)
  },

  mod () {}
}
