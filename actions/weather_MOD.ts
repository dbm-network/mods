/* eslint-disable @typescript-eslint/restrict-template-expressions */
import type { Action, ActionCache, Actions } from '../typings/globals';

interface SubtitleData {
  storage: string;
  varName: string;
  city: string;
  info: string;
}

export class WeatherAction implements Action {
  static section = 'Other Stuff';
  static fields = ['city', 'info', 'storage', 'varName'];

  static subtitle(data: SubtitleData) {
    const info = [
      'City Name',
      'Region',
      'Country',
      'Latitude',
      'Longitude',
      'Timezone',
      'Date',
      'Temperature (Celsius)',
      'Temperature (Fahrenheit)',
      'Feels Like (Celsius)',
      'Feels Like (Fahrenheit)',
      'Condition',
      'Condition Icon URL',
      'Wind Speed (Kilometer per hour)',
      'Wind Speed (Mile per hour)',
      'Wind Direction',
      'Pressure (hPa)',
      'Pressure (psi)',
      'Humidity (Percent)',
      'Cloud (Percent)',
      'Visibility (Kilometer)',
      'Visibility (Mile)',
      'UV Index',
      'Gust (Kilometer per hour)',
      'Gust (Mile per hour)',
    ];
    return `${info[parseInt(data.info, 10)]}`;
  }

  static html(_isEvent: any, data: any) {
    return `
<div style="float: left; width: 55%; padding-top: 8px;">
  Source City:<br>
  <input id="city" class="round" type="text">
  </div><br>
<div style="float: left; width: 100%; padding-top: 8px;">
  Source Info:<br>
  <select id="info" class="round">
    <option value="0" selected>City Name</option>
    <option value="1">Region</option>
    <option value="2">Country</option>
    <option value="3">Latitude</option>
    <option value="4">Longitude</option>
    <option value="5">Timezone</option>
    <option value="6">Date</option>
    <option value="7">Temperature (Celsius)</option>
    <option value="8">Temperature (Fahrenheit)</option>
    <option value="9">Feels Like (Celsius)</option>
    <option value="10">Feels Like (Fahrenheit)</option>
    <option value="11">Condition</option>
    <option value="12">Condition Icon URL</option>
    <option value="13">Wind Speed (Kilometer per hour)</option>
    <option value="14">Wind Speed (Mile per hour)</option>
    <option value="15">Wind Direction</option>
    <option value="16">Pressure (hPa)</option>
    <option value="17">Pressure (psi)</option>
    <option value="18">Humidity (Percent)</option>
    <option value="19">Cloud (Percent)</option>
    <option value="20">Visibility (Kilometer)</option>
    <option value="21">Visibility (Mile)</option>
    <option value="22">UV Index</option>
    <option value="23">Gust (Kilometer per hour)</option>
    <option value="24">Gust (Mile per hour)</option>
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

    if (!city) {
      console.error('Weather Action: Please specify a city to fetch the weather information.');
      return this.callNextAction(cache);
    }

    const Mods = this.getMods();
    const fetch = Mods.require('node-fetch');
    fetch(`https://fnrr.dev/weather/${encodeURI(city)}`)
      .then((result: any) => result.json())
      .then((data: any) => {
        if (data?.error) {
          console.error(
            `Weather Action: There was an error while fetching the weather info: ${
              typeof data.error === 'string' ? data.error : data?.message
            }`,
          );
          return this.callNextAction(cache);
        }

        let result: any;
        switch (info) {
          case 0:
            result = data.location.name;
            break;
          case 1:
            result = data.location.region;
            break;
          case 2:
            result = data.location.country;
            break;
          case 3:
            result = data.location.lat;
            break;
          case 4:
            result = data.location.lon;
            break;
          case 5:
            result = data.location.tz_id;
            break;
          case 6:
            result = data.location.localtime;
            break;
          case 7:
            result = data.current.temp_c;
            break;
          case 8:
            result = data.current.temp_f;
            break;
          case 9:
            result = data.current.feelslike_c;
            break;
          case 10:
            result = data.current.feelslike_f;
            break;
          case 11:
            result = data.current.condition.text;
            break;
          case 12:
            result = data.current.condition.icon;
            break;
          case 13:
            result = data.current.wind_kph;
            break;
          case 14:
            result = data.current.wind_mph;
            break;
          case 15:
            result = data.current.wind_dir;
            break;
          case 16:
            result = data.current.pressure_mb;
            break;
          case 17:
            result = data.current.pressure_in;
            break;
          case 18:
            result = data.current.humidity;
            break;
          case 19:
            result = data.current.cloud;
            break;
          case 20:
            result = data.current.vis_km;
            break;
          case 21:
            result = data.current.vis_miles;
            break;
          case 22:
            result = data.current.uv;
            break;
          case 23:
            result = data.current.gust_kph;
            break;
          case 24:
            result = data.current.gust_mph;
            break;
          default:
            break;
        }
        const storage = parseInt(data.storage, 10);
        this.storeValue(result, storage, this.evalMessage(data.varName, cache), cache);
      })
      .catch((e: Error) => {
        this.displayError(data, cache, e);
        this.callNextAction(cache);
      });
  }
}

Object.defineProperty(WeatherAction, 'name', { value: 'Weather' });
