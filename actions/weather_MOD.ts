/* eslint-disable @typescript-eslint/restrict-template-expressions */
import type { Action, ActionCache, Actions } from '../typings/globals';

interface SubtitleData {
  storage: string;
  varName: string;
  city: string;
  degreeType: string;
  info: string;
}

interface WeatherStatus {
  temperature: string;
  skytext: string;
  date: string;
  observationpoint: string;
  windspeed: string;
  winddisplay: string;
  humidity: string;
  feelslike: string;
  imageUrl: string;
  day: string;
}

export class WeatherAction implements Action {
  static section = 'Other Stuff';
  static fields = ['city', 'degreeType', 'info', 'storage', 'varName'];

  static subtitle(data: SubtitleData) {
    const info = [
      'Temperature',
      'Weather Text',
      'Date',
      'City',
      'Country',
      'Wind Speed',
      'Wind Direction',
      'Humidity',
      'Feels Like',
      'Image URL',
      'Current Day',
    ];
    return `${info[parseInt(data.info, 10)]}`;
  }

  static html(_isEvent: any, data: any) {
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
    <option value="14">Feels Like</option>
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
</div>`;
  }

  static init(this: Actions) {
    const { glob, document } = this;
    glob.variableChange(document.getElementById('storage'), 'varNameContainer');
  }

  static action(this: Actions, cache: ActionCache) {
    const data = cache.actions[cache.index];
    const info = parseInt(data.info, 10);
    const city = this.evalMessage(data.city, cache);
    const degreeType2 = this.evalMessage(data.degreeType, cache);
    const { Actions } = this.getDBM();

    if (!city) {
      console.error('Please specify a city to get weather information.');
      return this.callNextAction(cache);
    }

    const Mods = this.getMods();
    const weather = Mods.require('weather-js');

    weather.find({ search: city, degreeType: degreeType2 }, (err: Error | null, response: any) => {
      if (err || !response?.[0]) return Actions.callNextAction(cache);
      const currentWeather: WeatherStatus = response[0].current;
      let result: string | null = null;
      switch (info) {
        case 0:
          result = currentWeather.temperature;
          break;
        case 1:
          result = currentWeather.skytext;
          break;
        case 2:
          result = currentWeather.date;
          break;
        case 3:
          result = response[0].location.name;
          break;
        case 4:
          result = currentWeather.observationpoint;
          break;
        case 6:
          result = currentWeather.windspeed;
          break;
        case 8:
          result = currentWeather.winddisplay;
          break;
        case 9:
          result = currentWeather.humidity;
          break;
        case 14:
          result = currentWeather.feelslike;
          break;
        case 15:
          result = currentWeather.imageUrl;
          break;
        case 16:
          result = currentWeather.day;
          break;
        default:
          break;
      }
      if (result) {
        const storage = parseInt(data.storage, 10);
        const varName2 = Actions.evalMessage(data.varName, cache);
        Actions.storeValue(result, storage, varName2, cache);
      }
      Actions.callNextAction(cache);
    });
  }
}
