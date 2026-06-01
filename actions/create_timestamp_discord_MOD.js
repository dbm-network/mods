module.exports = {
  name: 'Create Timestamp Discord',
  section: 'Other Stuff',
  meta: {
    version: '2.1.6',
    preciseCheck: true,
    author: 'DBM Extended',
    authorUrl: 'https://github.com/DBM-Extended/mods',
    downloadURL: 'https://github.com/DBM-Extended/mods',
  },

  subtitle(data) {
    const info = [
      'Short time',
      'Very long',
      'Short date',
      'Long date',
      'Long date with short time',
      'Long date with day of week and short time',
      'Relative',
    ];
    const prse = parseInt(data.saida, 10);
    return `${info[prse]}`;
  },

  variableStorage(data, varType) {
    if (parseInt(data.storage, 10) !== varType) return;
    return [data.varName, 'Date'];
  },

  fields: ['date', 'saida', 'storage', 'varName'],

  html(_isEvent, data) {
    return `
    <div>
    <span class="dbminputlabel" style="padding-top: 8px;">Data</span><br>
    <input id="date" class="round"; style="width: 100%;" type="text" placeholder="Example: \${new Date}">
  </div>
  <br>
  <div>
    <span class="dbminputlabel">Output</span><br>
    <select id="saida" class="round">
    <option value="0" selected>Short time</option>
     <option value="1">Too long</option>
     <option value="2">Short date</option>
     <option value="3">Long date</option>
     <option value="4">Long date with short time</option>
     <option value="5">Long date with weekday and short time</option>
     <option value="6">Relative</option>
     </select>
  </div>
  <br>
  <div style="float: left; width: 35%; padding-top: 8px;">
  <span class="dbminputlabel">Store in</span><br>
    <select id="storage" class="round" onchange="glob.variableChange(this, 'varNameContainer')">
    ${data.variables[0]}
    </select>
  </div>
  <div id="varNameContainer" style="float: right; display: none; width: 60%; padding-top: 8px;">
  <span class="dbminputlabel">Variable name</span><br>
    <input id="varName" class="round" type="text">
  </div>`;
  },

  init() {
    const { glob, document } = this;
    glob.variableChange(document.getElementById('storage'), 'varNameContainer');
  },

  async action(cache) {
    const data = cache.actions[cache.index];
    const moment = require('moment');
    const saida = parseInt(data.saida, 10);
    let result;

    let date = moment(Date.parse(this.evalMessage(data.date, cache)));

    if (isNaN(date)) {
      console.error('Action Create Discord Timestamp: Invalid date format!');
      result = 'Invalid date format!';
    } else {
      date += '-';
      date = date.replace('000-', '');
      date = date.toString();

      switch (saida) {
        case 0:
          result = `<t:${date}:t>`;
          break;
        case 1:
          result = `<t:${date}:T>`;
          break;
        case 2:
          result = `<t:${date}:d>`;
          break;
        case 3:
          result = `<t:${date}:D>`;
          break;
        case 4:
          result = `<t:${date}:f>`;
          break;
        case 5:
          result = `<t:${date}:F>`;
          break;
        case 6:
          result = `<t:${date}:R>`;
          break;
      }
    }

    const storage = parseInt(data.storage, 10);
    const varName = this.evalMessage(data.varName, cache);
    this.storeValue(result, storage, varName, cache);

    this.callNextAction(cache);
  },

  mod() {},
};
