module.exports = {
  name: 'Play YouTube Playlist',
  section: 'Audio Control',

  requiresAudioLibraries: true,

  subtitle (data) {
    return `${data.url}`
  },

  fields: ['url', 'seek', 'volume', 'passes', 'bitrate', 'maxvid'],

  html (isEvent, data) {
    return `
<div style="float: left; width: 105%;">
  YouTube Playlist:<br>
  <input id="url" class="round" type="text" placeholder="Insert your playlist URL or ID here"><br>
</div>
<div style="float: left; width: 49%;">
  Video Seek Positions:<br>
  <input id="seek" class="round" type="text" value="0"><br>
  Video Volumes:<br>
  <input id="volume" class="round" type="text" placeholder="Leave blank for automatic..."><br>
    Max Videos to Queue from Playlist:<br>
    <input id="maxvid" class="round" type="text" placeholder="Defaults to 250 videos"><br>
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
    const {Audio} = this.getDBM()
    const Mods = this.getMods()
    const url = this.evalMessage(data.url, cache)
    var maxvideos = this.evalMessage(data.maxvid, cache)
    const ytpl = Mods.require('ytpl')
    const ytdl = Mods.require('ytdl-core')
    const {msg} = cache

    // Check Input
    if (!url) {
      return console.log('Please insert a playlist url!')
    }
    if (!maxvideos) {
      maxvideos = 250
    }

    // Check Options
    if (data.seek) {
      var seek = parseInt(this.evalMessage(data.seek, cache))
    }
    if (data.volume) {
      var vol = parseInt(this.evalMessage(data.volume, cache)) / 100
    } else if (cache.server) {
      vol = Audio.volumes[cache.server.id] || 0.5
    } else {
      vol = 0.5
    }
    if (data.passes) {
      var passes = parseInt(this.evalMessage(data.passes, cache))
    }
    if (data.bitrate) {
      var bitrate = parseInt(this.evalMessage(data.bitrate, cache))
    } else {
      bitrate = 'auto'
    }
    if (msg) {
      var requester = msg.author
    }
    var watermark = 'highWaterMark: 1' // idk what this does, but the queue data has it, so i might as well add it in case someone needs it
    ytpl(url, {limit: maxvideos}).then((playlist) => {

      playlist.items.forEach( async(video) => { // have to do it async so the await can work, side effect of the playlist being added being shuffled
        if (video.id !== undefined) {

          const videod = await ytdl.getInfo(video.url_simple)
          var title = videod.videoDetails.title
          var duration = parseInt(videod.videoDetails.lengthSeconds) // you need to use ytdl for this, ytpl doesn't have a way to get the duration in seconds
          var thumbnail = videod.player_response.videoDetails.thumbnail.thumbnails[3].url
          var info = ['yt', {seek, vol, passes, bitrate, requester, title, duration, thumbnail, watermark}, video.url_simple] // setting the "options" second value here fixes an issue where all items added to the queue from a playlist have the title, duration, thumbnail, and so on of the last one added to the queue from said playlist
          Audio.addToQueue(info, cache)
          }
      })
    })
    this.callNextAction(cache)
  },

  mod () {}
}
