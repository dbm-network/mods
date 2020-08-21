module.exports = {
  name: 'Weather',
  section: 'Other Stuff',

  subtitle (data) {
    const info = ['Temperature', 'Weather Text', 'Date', 'City', 'Country', 'Region', 'Wind Speed', 'Wind Chill', 'Wind Direction', 'Humidity', 'Pressure', 'Atmosphere Visibility', 'Sunrise Time', 'Sunset Time', 'Feelslike', 'Image URL', 'Current Day']
    return `${info[parseInt(data.info)]}`
  },

  variableStorage (data, varType) {
    const type = parseInt(data.storage)
    if (type !== varType) return
    const info = parseInt(data.info)
    let dataType = 'Unknown Weather Type'
    switch (info) {
      case 0:
        dataType = 'Temperature'
        break
      case 1:
        dataType = 'Weather - Text'
        break
      case 2:
        dataType = 'Date'
        break
      case 3:
        dataType = 'Weather - City'
        break
      case 4:
        dataType = 'Weather - Country'
        break
      case 5: // Deprecated...
        dataType = 'Weather - Region'
        break
      case 6:
        dataType = 'Wind Speed'
        break
      case 7: // Deprecated...
        dataType = 'Wind Chill'
        break
      case 8:
        dataType = 'Wind Direction'
        break
      case 9:
        dataType = 'Atmosphere Humidity'
        break
      case 10: // Deprecated...
        dataType = 'Atmosphere Pressure'
        break
      case 11: // Deprecated...
        dataType = 'Atmosphere Visibility'
        break
      case 12: // Deprecated...
        dataType = 'Weather - Sunrise'
        break
      case 13: // Deprecated...
        dataType = 'Weather - Sunset'
        break
      case 14:
        dataType = 'Feelslike'
        break
      case 15:
        dataType = 'Image URL'
        break
      case 16:
        dataType = 'Current Day'
        break
    }
    return ([data.varName, dataType])
  },

  fields: ['city', 'degreeType', 'info', 'storage', 'varName'],

  html (isEvent, data) {
    return `
<div style="float: left; width: 55%; padding-top: 8px;">
  Source City:<br>
  <input id="city" class="round" type="text">
  </div>
  <div style="float: right; width: 45%; padding-top: 8px;">
  Degree Type:<br>
  <select id="degreeType" class="round">
    <option value="F">F</option>
    <option value="C">C</option>
  </select>
  </div><br>
<div style="float: left; width: 100%; padding-top: 8px;">
  Source Info:<br>
  <select id="info" class="round">
    <option value="0">Temperature</option>
    <option value="14">Feelslike</option>
    <option value="1">Weather Text</option>
    <option value="2">Date</option>
    <option value="3">City</option>
    <option value="4">Country</option>
    <option value="6">Wind Speed</option>
    <option value="8">Wind Direction</option>
    <option value="9">Humidity</option>
    <option value="15">Image URL</option>
    <option value="16">Current Day</option>
  </select>
</div><br>
<div>
  <div style="float: left; width: 35%; padding-top: 8px;">
    Store In:<br>
    <select id="storage" class="round" onchange="glob.variableChange(this, 'varNameContainer')">
      ${data.variables[0]}
    </select>
  </div>
  <div id="varNameContainer" style="float: right; width: 60%; padding-top: 8px;">
    Variable Name:<br>
    <input id="varName" class="round" type="text"><br>
  </div>
</div>`
  },

  init () {
    const { glob, document } = this
    glob.variableChange(document.getElementById('storage'), 'varNameContainer')
  },

  action (cache) {
    const data = cache.actions[cache.index]
    const info = parseInt(data.info)
    const city = this.evalMessage(data.city, cache)
    const degreeType2 = this.evalMessage(data.degreeType, cache)
    const _this = this

    if (!city) return console.log('Please specify a city to get weather informations.')

    const Mods = this.getMods()
    const weather = Mods.require('weather-js')

    weather.find({ search: `${city}`, degreeType: `${degreeType2}` }, (err, response) => {
      if (err || !response || response.length < 1) {
        const storage = parseInt(data.storage)
        const varName2 = _this.evalMessage(data.varName, cache)
        _this.storeValue(undefined, storage, varName2, cache)
        _this.callNextAction(cache)
      } else {
        let result

        switch (info) { // Never use deprecated results. Current API doesn't support any of them. RIP old module...
          case 0:
            result = response[0].current.temperature
            break
          case 1:
            result = response[0].current.skytext
            break
          case 2:
            result = response[0].current.date
            break
          case 3:
            result = response[0].location.name
            break
          case 4:
            result = response[0].current.observationpoint
            break
          case 5: // Deprecated...
            result = response[0].location.region
            break
          case 6:
            result = response[0].current.windspeed
            break
          case 7: // Deperecated...
            result = response[0].wind.chill
            break
          case 8:
            result = response[0].current.winddisplay
            break
          case 9:
            result = response[0].current.humidity
            break
          case 10: // Deprecated...
            result = response[0].atmosphere.pressure
            break
          case 11: // Deprecated...
            result = response[0].atmosphere.visibility
            break
          case 12: // Deprecated...
            result = response[0].astronomy.sunrise
            break
          case 13: // Deprecated...
            result = response[0].astronomy.sunset
            break
          case 14:
            result = response[0].current.feelslike
            break
          case 15:
            result = response[0].current.imageUrl
            break
          case 16:
            result = response[0].current.day
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
      }
    })
  },

  mod () {}
}
