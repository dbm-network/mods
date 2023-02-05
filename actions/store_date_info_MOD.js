module.exports = {
  name: 'Store Date Info',
  section: 'Other Stuff',
  meta: {
    version: '2.1.6',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/store_date_info_MOD.js',
  },

  subtitle(data) {
    const info = [
      'Day of the Week',
      'Month of the Year',
      'Unix Timestamp',
      '',
      'Day Number',
      'Year',
      'Full Time',
      'Hour',
      'Month Number',
      'Minute',
      'Second',
      'Timezone',
    ];
    return `Store ${info[parseInt(data.info, 10)]} from Date`;
  },

  variableStorage(data, varType) {
    if (parseInt(data.storage, 10) !== varType) return;
    let dataType = 'Unknown Type';
    switch (parseInt(data.info, 10)) {
      case 0:
        dataType = 'String';
        break;
      case 1:
        dataType = 'String';
        break;
      case 2:
        dataType = 'Number';
        break;
      case 4:
        dataType = 'Number';
        break;
      case 5:
        dataType = 'Number';
        break;
      case 6:
        dataType = 'String';
        break;
      case 7:
        dataType = 'Number';
        break;
      case 8:
        dataType = 'Number';
        break;
      case 9:
        dataType = 'Number';
        break;
      case 10:
        dataType = 'Number';
        break;
      case 11:
        dataType = 'String';
        break;
      default:
        break;
    }
    return [data.varName, dataType];
  },

  fields: ['date', 'info', 'storage', 'varName'],

  html(isEvent, data) {
    return `
<div style="padding-top: 8px;">
  Source Date:<br>
  <textarea id="date" rows="3" placeholder="e.g. Fri Apr 06 2018 13:32:10 GMT+0200" style="width: 99%; font-family: monospace; white-space: nowrap; resize: none;"></textarea>
</div><br>
<div style="padding-top: 8px; width: 70%;">
  Source Info:<br>
  <select id="info" class="round">
    <option value="2" selected>Unix Timestamp</option>
    <option value="0">Day of the Week</option>
    <option value="4">Day Number</option>
    <option value="1">Month of the Year</option>
    <option value="8">Month Number</option>
    <option value="5">Year</option>
    <option value="6">Full Time</option>
    <option value="7">Hour</option>
    <option value="9">Minute</option>
    <option value="10">Second</option>
    <option value="11">Timezone</option>

  </select>
</div><br>
<div style="float: left; width: 35%; padding-top: 8px;">
  Store Result In:<br>
  <select id="storage" class="round" onchange="glob.variableChange(this, 'varNameContainer')">
  ${data.variables[0]}
  </select>
</div>
<div id="varNameContainer" style="float: right; display: none; width: 60%; padding-top: 8px;">
  Variable Name:<br>
  <input id="varName" class="round" type="text">
</div>`;
  },

  init() {
    const { glob, document } = this;
    glob.variableChange(document.getElementById('storage'), 'varNameContainer');
  },

  async action(cache) {
    const data = cache.actions[cache.index];
    const date = this.evalMessage(data.date, cache);
    const info = parseInt(data.info, 10);
    if (isNaN(Date.parse(date))) {
      console.log(
        'Invalid Date ! Check that your date is valid. A Date generally looks like the one stored in "Creation Date" of a server. (variables works)',
      );
      this.callNextAction(cache);
    }

    let result;
    switch (info) {
      case 0:
        result = date.slice(0, 3);
        break;
      case 1:
        result = date.slice(4, 7);
        break;
      case 2:
        result = parseInt(Date.parse(date) / 1000, 10);
        break;
      case 4:
        result = parseInt(date.slice(8, 10), 10);
        break;
      case 5:
        result = parseInt(date.slice(11, 15), 10);
        break;
      case 6:
        result = date.slice(16, 24);
        break;
      case 7:
        result = date.slice(16, 18);
        break;
      case 8:
        result = date.slice(4, 7);
        if (result === 'Jan') result = 1;
        if (result === 'Feb') result = 2;
        if (result === 'Mar') result = 3;
        if (result === 'Apr') result = 4;
        if (result === 'May') result = 5;
        if (result === 'Jun') result = 6;
        if (result === 'Jul') result = 7;
        if (result === 'Aug') result = 8;
        if (result === 'Sep') result = 9;
        if (result === 'Oct') result = 10;
        if (result === 'Nov') result = 11;
        if (result === 'Dec') result = 12;
        if (result === date.slice(4, 7)) {
          console.log('An error occurred on "Store Date Info (Month Number)"');
          this.callNextAction(cache);
        }
        break;
      case 9:
        result = date.slice(19, 21);
        break;
      case 10:
        result = date.slice(22, 24);
        break;
      case 11:
        result = `GMT${date.slice(28, 29)}${parseInt(date.slice(29, 33), 10) / 100}`;
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
