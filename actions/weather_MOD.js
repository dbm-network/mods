module.exports = {
  name: 'Weather',
  section: 'Other Stuff',
  meta: {
    version: '2.1.6',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/weather_MOD.js',
  },

  subtitle(data) {
    const info = [
      'Temperature',
      'Weather Text',
      'Date',
      'City',
      'Country',
      'Wind Speed',
      'Wind Direction',
      'Humidity',
      'Feelslike',
      'Image URL',
      'Current Day',
    ];
    return `${info[parseInt(data.info, 10)]}`;
  },

  variableStorage(data, varType) {
    if (parseInt(data.storage, 10) !== varType) return;
    let dataType = 'Unknown Weather Type';
    switch (parseInt(data.info, 10)) {
      case 0:
        dataType = 'Temperature';
        break;
      case 1:
        dataType = 'Weather - Text';
        break;
      case 2:
        dataType = 'Date';
        break;
      case 3:
        dataType = 'Weather - City';
        break;
      case 4:
        dataType = 'Weather - Country';
        break;
      case 6:
        dataType = 'Wind Speed';
        break;
      case 8:
        dataType = 'Wind Direction';
        break;
      case 9:
        dataType = 'Atmosphere Humidity';
        break;
      case 14:
        dataType = 'Feelslike';
        break;
      case 15:
        dataType = 'Image URL';
        break;
      case 16:
        dataType = 'Current Day';
        break;
    }
    return [data.varName, dataType];
  },

  fields: ['city', 'degreeType', 'info', 'storage', 'varName'],

  html() {
    return `
<div style="float: left; width: 54%; padding-top: 8px; padding-right: 8px;">
  Source City:<br>
  <input id="city" class="round" type="text">
</div>
<div style="float: right; width: 44%; padding-top: 8px;">
  Degree Type:<br>
  <select id="degreeType" class="round">
    <option value="F">F</option>
    <option value="C">C</option>
  </select>
</div>
<br>

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
</div>
<br><br><br><br>

<div style="padding-top: 16px;">
  <store-in-variable dropdownLabel="Store In" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></store-in-variable>
</div>`;
  },

  init() {},

  async action(cache) {
    const data = cache.actions[cache.index];
    const info = parseInt(data.info, 10);

    const Mods = this.getMods();
    const weather = Mods.require('weather-js');

    const city = this.evalMessage(data.city, cache);
    const degreeType = this.evalMessage(data.degreeType, cache);
    const { Actions } = this.getDBM();

    if (!city) {
      console.error('Please specify a city to get weather information.');
      return this.callNextAction(cache);
    }

    weather.find({ search: city, degreeType }, (err, response) => {
      if (err || !response || !response[0]) return Actions.callNextAction(cache);
      const current = response[0].current;
      let result;

      switch (info) {
        case 0:
          result = current.temperature;
          break;
        case 1:
          result = current.skytext;
          break;
        case 2:
          result = current.date;
          break;
        case 3:
          result = response[0].location.name;
          break;
        case 4:
          result = current.observationpoint;
          break;
        case 6:
          result = current.windspeed;
          break;
        case 8:
          result = current.winddisplay;
          break;
        case 9:
          result = current.humidity;
          break;
        case 14:
          result = current.feelslike;
          break;
        case 15:
          result = current.imageUrl;
          break;
        case 16:
          result = current.day;
          break;
        default:
          break;
      }
      if (result !== undefined) {
        const storage = parseInt(data.storage, 10);
        const varName2 = Actions.evalMessage(data.varName, cache);
        Actions.storeValue(result, storage, varName2, cache);
      }
      Actions.callNextAction(cache);
    });
  },

  mod() {},
};
