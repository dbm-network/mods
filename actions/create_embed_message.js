module.exports = {
  name: 'Create Embed Message',
  section: 'Embed Message',

  subtitle (data) {
    return `${data.title}`
  },

  variableStorage (data, varType) {
    const type = parseInt(data.storage)
    if (type !== varType) return
    return [data.varName, 'Embed Object']
  },

  fields: [
    'title',
    'author',
    'color',
    'url',
    'authorIcon',
    'authorUrl',
    'imageUrl',
    'thumbUrl',
    'description',
    'timestamp',
    'debug',
    'timestamp1',
    'timestamp2',
    'text',
    'year',
    'month',
    'day',
    'hour',
    'minute',
    'second',
    'note1',
    'note2',
    'storage',
    'varName'
  ],

  size () {
    return { width: 550, height: 350 }
  },

  html (_isEvent, data) {
    return `
      <div style="width: 550px; height: 350px; overflow-y: scroll; overflow-x: hidden;">
        <div style="float: left; width: 50%; padding-top: 0px;">
          <label>Title:</label>
          <input id="title" class="round" type="text" />
          <label>Author Name:</label>
          <input id="author" class="round" type="text" />
          <label>Author URL:</label>
          <input id="authorUrl" class="round" type="text" />
          <label>Author Icon URL:</label>
          <input id="authorIcon" class="round" type="text" />
        </div>
        <div style="float: right; width: 50%; padding-top: 0px;">
          <label>Color:</label>
          <input id="color" class="round" type="text" />
          <label>URL:</label>
          <input id="url" class="round" type="text" />
          <label>Image URL:</label>
          <input id="imageUrl" class="round" type="text" />
          <label>Thumbnail URL:</label>
          <input id="thumbUrl" class="round" type="text" />
        </div>
        <div>
          <label>Description:</label>
          <textarea id="description" rows="10" style="width: 95.5%; font-family: monospace; white-space: nowrap; resize: none;"></textarea>
        </div>
        <div id="timestampDiv" style="float: left; width: 45%; display: none;">
          <label>Timestamp:</label>
          <select id="timestamp" class="round" onchange="glob.onChange1(this)">
            <option value="false" selected>No Timestamp</option>
            <option value="true">Current Timestamp</option>
            <option value="string">String Timestamp</option>
            <option value="custom">Custom Timestamp</option>
          </select>
        </div>
        <div id="timestampDivDebug">
          <label>Timestamp:</label>
          <select
            id="timestampDebug"
            class="round"
            onchange="glob.onChange1(this)"
          >
            <option value="false" selected>
              No Timestamp
            </option>
            <option value="true">Current Timestamp</option>
          </select>
        </div>
        <div style="float: right; width: 50%; padding-right: 26px;">
          <label>Debug:</label>
          <select id="debug" class="round" onchange="glob.onChange2(this)">
            <option value="false" selected>
              No - More options
            </option>
            <option value="true">Yes - More stable</option>
          </select>
        </div>
        <div
          id="timestamp1"
          class="round"
          style="float: left; width: 104.6%; padding-top: 16px; display: none;"
        >
          <label>UTC Timestamp:</label>
          <input
            id="text"
            class="round"
            type="text"
            placeholder="UTC timestamp string"
          />
        </div>
        <div
          id="timestamp2"
          style="padding-top: 16px; display: table; width: 95.5%;"
        >
          <div style="display: table-cell;">
            <label>Year:</label>
            <input id="year" class="round" type="text" />
          </div>
          <div style="display: table-cell;">
            <label>Month:</label>
            <input id="month" class="round" type="text" />
          </div>
          <div style="display: table-cell;">
            <label>Day:</label>
            <input id="day" class="round" type="text" />
          </div>
          <div style="display: table-cell;">
            <label>Hour:</label>
            <input id="hour" class="round" type="text" />
          </div>
          <div style="display: table-cell;">
            <label>Minute:</label>
            <input id="minute" class="round" type="text" />
          </div>
          <div style="display: table-cell;">
            <label>Second:</label>
            <input id="second" class="round" type="text" />
          </div>
        </div>
        <div>
          <div style="float: left; width: 35%;">
            <label>Store In:</label>
            <select id="storage" class="round">
              ${data.variables[1]}
            </select>
          </div>
          <div id="varNameContainer" style="float: right; width: 60%;">
            <label>Variable Name:</label>
            <input id="varName" class="round" type="text" />
            <br />
          </div>
        </div>
        <div
          id="note1"
          style="float: left; padding-top: 8px; width: 100%; display: none;"
        >
          <h2>
            String Timestamp
            <br />
          </h2>
          <p>
            This setting works with time formats like "March 03, 1973 11:13:00"
            or "100000000000" (milliseconds).
            <br />
          </p>
        </div>
        <div
          id="note2"
          style="float: left; padding-top: 8px; width: 100%; display: none;"
        >
          <h3>
            Custom Timestamp
            <br />
          </h3>
          <p>
            Correct input: Year: [2019] Month: [8] Day: [10] Hour: [ ] Minute: [ ] Second: [ ]
            <br />
            Incorrect input: Year: [2019] Month: [8] Day: [ ] Hour: [6] Minute: [ ] Second: [ ]
          </p>
        </div>
        <div id="author-note">Action modified by Wrex and Michael.</div>
      <style>
        input, select, textarea { margin-bottom: 10px }
        #timestampDivDebug { float: left; width: 45%; display: none; }
        #author-note { color: grey; float: left; width: 100%; text-align:center; }
      </style>
      </div>
    `
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
          authorUrl.placeholder = 'Unavailable!'
          authorUrl.disabled = true
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
        embed.setAuthor(
          this.evalMessage(data.author, cache),
          this.evalMessage(data.authorIcon, cache),
          this.evalMessage(data.authorUrl, cache)
        )
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
      // Description
      if (data.description) {
        embed.setDescription(this.evalMessage(data.description, cache))
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
            console.log(
              'Invaild UTC timestamp! Changed from [String Timestamp] to [Current Timestamp].'
            )
          }
          break
        case 'custom':
          embed.setTimestamp(
            new Date(
              year || null,
              month || null,
              day || null,
              hour || null,
              minute || null,
              second || null
            )
          )
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
        embed.setAuthor(
          this.evalMessage(data.author, cache),
          this.evalMessage(data.authorIcon, cache)
        )
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
