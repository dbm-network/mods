module.exports = {
  name: 'Create Embed Message',
  section: 'Embed Message',

  subtitle (data) {
    return `${data.title}`
  },

  variableStorage (data, varType) {
    const type = parseInt(data.storage)
    if (type !== varType) return
    return ([data.varName, 'Embed Object'])
  },

  fields: ['title', 'author', 'color', 'url', 'authorIcon', 'authorUrl', 'imageUrl', 'thumbUrl', 'timestamp', 'debug', 'timestamp1', 'timestamp2', 'text', 'year', 'month', 'day', 'hour', 'minute', 'second', 'note1', 'note2', 'storage', 'varName'],

  html (isEvent, data) {
    return `
<div id ="wrexdiv" style="width: 550px; height: 350px; overflow-y: scroll; overflow-x: hidden;">
<div>
  <p>
    This action has been modified by DBM Mods.
  </p>
</div>
<div style="float: left; width: 50%; padding-top: 16px;">
  Title:<br>
  <input id="title" class="round" type="text"><br>
  Author Name:<br>
  <input id="author" class="round" type="text" placeholder="Leave blank to disallow author!"><br>
  Author URL:<br>
  <input id="authorUrl" class="round" type="text" placeholder="Leave blank for none!"><br>
  Author Icon URL:<br>
  <input id="authorIcon" class="round" type="text" placeholder="Leave blank for none!"><br>
</div>
<div style="float: right; width: 50%; padding-top: 16px;">
  Color:<br>
  <input id="color" class="round" type="text" placeholder="Leave blank for default!"><br>
  URL:<br>
  <input id="url" class="round" type="text" placeholder="Leave blank for none!"><br>
  Image URL:<br>
  <input id="imageUrl" class="round" type="text" placeholder="Leave blank for none!"><br>
  Thumbnail URL:<br>
  <input id="thumbUrl" class="round" type="text" placeholder="Leave blank for none!"><br>
</div>
<div id="timestampDiv" style="float: left; width: 45%; display: none;">
  Timestamp:<br>
  <select id="timestamp" class="round" onchange="glob.onChange1(this)">
    <option value="false" selected>No Timestamp</option>
    <option value="true">Current Timestamp</option>
    <option value="string">String Timestamp</option>
    <option value="custom">Custom Timestamp</option>
  </select>
</div>
<div id="timestampDivDebug" style="float: left; width: 45%; display: none;">
  Timestamp:<br>
  <select id="timestampDebug" class="round" onchange="glob.onChange1(this)">
    <option value="false" selected>No Timestamp</option>
    <option value="true">Current Timestamp</option>
  </select>
</div>
<div style="float: right; width: 50%; padding-right: 26px;">
  Debug:<br>
  <select id="debug" class="round" onchange="glob.onChange2(this)">
    <option value="false" selected>No - More options</option>
    <option value="true">Yes - More stable</option>
  </select>
</div>
<div id="timestamp1" class="round" style="float: left; width: 104.6%; padding-top: 16px; display: none;">
  UTC Timestamp:<br>
  <input id="text" class="round" type="text" placeholder="Insert your utc timestamp string...">
</div>
<div id="timestamp2" style="padding-top: 16px; display: table; width: 95.5%;">
  <div style="display: table-cell;">
    Year:<br>
    <input id="year" class="round" type="text">
  </div>
  <div style="display: table-cell;">
    Month:<br>
    <input id="month" class="round" type="text">
  </div>
  <div style="display: table-cell;">
    Day:<br>
    <input id="day" class="round" type="text">
  </div>
  <div style="display: table-cell;">
    Hour:<br>
    <input id="hour" class="round" type="text">
  </div>
  <div style="display: table-cell;">
    Minute:<br>
    <input id="minute" class="round" type="text">
  </div>
  <div style="display: table-cell;">
    Second:<br>
    <input id="second" class="round" type="text">
  </div>
</div>
<div>
  <div style="float: left; width: 35%;">
    <br>Store In:<br>
    <select id="storage" class="round">
      ${data.variables[1]}
    </select>
  </div>
  <div id="varNameContainer" style="float: right; width: 60%;">
    <br>Variable Name:<br>
    <input id="varName" class="round" type="text"><br>
  </div>
</div>
<div id="note1" style="float: left; padding-top: 8px; width: 100%; display: none;">
  <h2>
    String Timestamp<br>
  </h2>
  <p>
    This setting works with time formats like "March 03, 1973 11:13:00" or "100000000000" (milliseconds).<br>
  </p>
</div>
<div id="note2" style="float: left; padding-top: 8px; width: 100%; display: none;">
  <h2>
    Custom Timestamp<br>
  </h2>
  <p>
    Correct input:<br>
    Year: [2019] Month: [8] Day: [10] Hour: [ ] Minute: [ ] Second: [ ]<br>
    Incorrect input:<br>
    Year: [2019] Month: [8] Day: [ ] Hour: [6] Minute: [ ] Second: [ ]<br>
  </p>
</div>
</div>`
  },

  init () {
    const { glob, document } = this
    const timestampDiv = document.getElementById('timestampDiv')
    const timestamp = document.getElementById('timestamp')
    const timestampDivDebug = document.getElementById('timestampDivDebug')
    const debug = document.getElementById('debug')
    const timestamp1 = document.getElementById('timestamp1')
    const timestamp2 = document.getElementById('timestamp2')
    const note = document.getElementById('note1')
    const note2 = document.getElementById('note2')
    const authorUrl = document.getElementById('authorUrl')

    glob.onChange1 = function () {
      if (debug.value === 'false') {
        authorUrl.placeholder = 'Leave blank for none!'
        switch (timestamp.value) {
          case 'false':
          case 'true':
            timestamp1.style.display = 'none'
            timestamp2.style.display = 'none'
            note.style.display = 'none'
            note2.style.display = 'none'
            break
          case 'string':
            timestamp1.style.display = 'table'
            timestamp2.style.display = 'none'
            note.style.display = null
            note2.style.display = 'none'
            break
          case 'custom':
            timestamp1.style.display = 'none'
            timestamp2.style.display = 'table'
            note.style.display = 'none'
            note2.style.display = null
            break
        }
      }
    }

    glob.onChange2 = function () {
      switch (debug.value) {
        case 'false':
          timestampDiv.style.display = null
          timestampDivDebug.style.display = 'none'
          break
        case 'true':
          timestampDiv.style.display = 'none'
          timestampDivDebug.style.display = null
          timestamp1.style.display = 'none'
          timestamp2.style.display = 'none'
          note.style.display = 'none'
          note2.style.display = 'none'
          authorUrl.placeholder = 'Unavaible!'
          break
      }
      glob.onChange1()
    }

    document.getElementById('timestamp')
    document.getElementById('debug')

    glob.onChange1(document.getElementById('timestamp'))
    glob.onChange2(document.getElementById('debug'))
  },

  action (cache) {
    const data = cache.actions[cache.index]
    const { DiscordJS } = this.getDBM()
    const embed = new DiscordJS.MessageEmbed()
    const text = this.evalMessage(data.text, cache)
    const year = parseInt(this.evalMessage(data.year, cache))
    const month = parseInt(this.evalMessage(data.month, cache) - 1)
    const day = parseInt(this.evalMessage(data.day, cache))
    const hour = parseInt(this.evalMessage(data.hour, cache))
    const minute = parseInt(this.evalMessage(data.minute, cache))
    const second = parseInt(this.evalMessage(data.second, cache))
    const timestamp = this.evalMessage(data.timestamp, cache)
    const timestampDebug = this.evalMessage(data.timestampDebug, cache)
    const debug = this.evalMessage(data.debug)
    const storage = parseInt(data.storage)
    const varName = this.evalMessage(data.varName, cache)

    if (!varName) {
      this.callNextAction(cache)
      return
    }

    if (debug !== 'true') {
      // Title
      if (data.title) {
        embed.setTitle(this.evalMessage(data.title, cache))
      }
      // URL
      if (data.url) {
        embed.setURL(this.evalMessage(data.url, cache))
      }
      // Author Name
      if (data.author) {
        embed.setAuthor(this.evalMessage(data.author, cache), this.evalMessage(data.authorIcon, cache), this.evalMessage(data.authorUrl, cache))
      }
      // Color
      if (data.color) {
        embed.setColor(this.evalMessage(data.color, cache))
      }
      // Image URL
      if (data.imageUrl) {
        embed.setImage(this.evalMessage(data.imageUrl, cache))
      }
      // Thumbnail URL
      if (data.thumbUrl) {
        embed.setThumbnail(this.evalMessage(data.thumbUrl, cache))
      }
      // Timestamp
      switch (timestamp) {
        case 'false':
          break
        case 'true':
          embed.setTimestamp()
          break
        case 'string':
          if (text.length > 0) {
            embed.setTimestamp(new Date(`${text}`))
          } else {
            embed.setTimestamp()
            console.log('Invaild UTC timestamp! Changed from [String Timestamp] to [Current Timestamp].')
          }
          break
        case 'custom':
          embed.setTimestamp(new Date(year || null, month || null, day || null, hour || null, minute || null, second || null))
          break
        default:
          embed.setTimestamp()
          break
      }

      this.storeValue(embed, storage, varName, cache)
      this.callNextAction(cache)
    } else {
      if (data.title) {
        embed.setTitle(this.evalMessage(data.title, cache))
      }
      if (data.url) {
        embed.setURL(this.evalMessage(data.url, cache))
      }
      if (data.author && data.authorIcon) {
        embed.setAuthor(this.evalMessage(data.author, cache), this.evalMessage(data.authorIcon, cache))
      }
      if (data.color) {
        embed.setColor(this.evalMessage(data.color, cache))
      }
      if (data.imageUrl) {
        embed.setImage(this.evalMessage(data.imageUrl, cache))
      }
      if (data.thumbUrl) {
        embed.setThumbnail(this.evalMessage(data.thumbUrl, cache))
      }
      if (timestampDebug === 'true') {
        embed.setTimestamp()
      }
      this.storeValue(embed, storage, varName, cache)
      this.callNextAction(cache)
    }
  },

  mod () {}
}
