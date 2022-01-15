module.exports = {
  name: 'Store UTC Time Info',
  section: 'Other Stuff',
  meta: {
    version: '2.0.11',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/store_utc_time_info_MOD.js',
  },

  subtitle(data) {
    const time = [
      'UTC Year',
      'UTC Month',
      'UTC Day of the Month',
      'UTC Hour',
      'UTC Minute',
      'UTC Second',
      'UTC Millisecond',
    ];
    return `${time[parseInt(data.type, 10)]}`;
  },

  variableStorage(data, varType) {
    if (parseInt(data.storage, 10) !== varType) return;
    return [data.varName, 'Number'];
  },

  fields: ['type', 'storage', 'varName'],

  html(_isEvent, data) {
    return `
<div>
  <div style="padding-top: 8px; width: 70%;">
    Time Info:<br>
    <select id="type" class="round">
      <option value="0" selected>UTC Year</option>
      <option value="1">UTC Month</option>
      <option value="2">UTC Day of the Month</option>
      <option value="3">UTC Hour</option>
      <option value="4">UTC Minute</option>
      <option value="5">UTC Second</option>
      <option value="6">UTC Millisecond</option>
    </select>
  </div>
</div><br>
<div>
  <div style="float: left; width: 35%;">
    Store In:<br>
    <select id="storage" class="round">
      ${data.variables[1]}
    </select>
  </div>
  <div id="varNameContainer" style="float: right; width: 60%;">
    Variable Name:<br>
    <input id="varName" class="round" type="text"><br>
  </div>
</div>`;
  },

  init() {},

  async action(cache) {
    const data = cache.actions[cache.index];
    const type = parseInt(data.type, 10);
    let result;

    switch (type) {
      case 0:
        result = new Date().getUTCFullYear();
        break;
      case 1:
        result = new Date().getUTCMonth() + 1;
        break;
      case 2:
        result = new Date().getUTCDate();
        break;
      case 3:
        result = new Date().getUTCHours();
        break;
      case 4:
        result = new Date().getUTCMinutes();
        break;
      case 5:
        result = new Date().getUTCSeconds();
        break;
      case 6:
        result = new Date().getUTCMilliseconds();
        break;
      default:
        break;
    }

    if (result !== undefined) {
      const storage = parseInt(data.storage, 10);
      const varName = this.evalMessage(data.varName, cache);
      this.storeValue(result, storage, varName, cache);
    }
    this.callNextAction(cache);
  },

  mod() {},
};
