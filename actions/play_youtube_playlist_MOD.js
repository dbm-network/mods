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
  YouTube Playlist:<br>
  <input id="url" class="round" type="text" placeholder="Insert your playlist URL or ID here"><br>
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
    const url = this.evalMessage(data.url, cache)
    const ytpl = Mods.require('ytpl')
    // const moment = Mods.require('moment')
    const { msg } = cache
    const options = {}

    // const re = new RegExp('(^[0-9]?[0-9]:[0-9][0-9]:[0-9][0-9]$)')
    // const re1 = new RegExp('(^[0-9]?[0-9]:[0-9][0-9]$)')

    // Check Input
    if (!url) {
      return console.log('Please insert a playlist url!')
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
    if (msg) {
      options.requester = msg.author
    }

    ytpl(url, function (err, playlist) {
      if (err) return this.displayError(data, cache, err)

      playlist.items.forEach(function (video) {
        /* // This functionality is broken from going into the queue and i have 0 idea why thats happening. I left everything here in case someone figures it out in the future.
let duration
if (re.test(video.duration)) {
duration = moment.duration(video.duration).asSeconds()
} else if (re1.test(video.duration)) {
duration = moment.duration(`00:${video.duration}`).asSeconds()
} else (console.log('Error with duration in play youtube playlist'))

options.title = video.title
options.thumbnail = video.thumbnail
options.duration = duration
*/
        const info = ['yt', options, video.url]
        if (video.id !== undefined) {
          Audio.addToQueue(info, cache)
        }
      })
    })
    this.callNextAction(cache)
  },

  mod () {}
}
