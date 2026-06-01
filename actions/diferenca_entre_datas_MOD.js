module.exports = {
  name: 'Calculate Difference Between Dates',
  section: 'Other Stuff',
  meta: {
    version: '2.1.6',
    preciseCheck: true,
    author: 'DBM Extended',
    authorUrl: 'https://github.com/DBM-Extended/mods',
    downloadURL: 'https://github.com/DBM-Extended/mods',
  },

  subtitle(data) {
    return `Difference between ${data.date} and ${data.date2}`;
  },

  variableStorage(data, varType) {
    if (parseInt(data.storage, 10) !== varType) return;
    return [data.varName, 'Date'];
  },

  fields: ['date', 'date2', 'saida', 'storage', 'varName'],

  html(_isEvent, data) {
    return `
    <div style="float: left; width: 70%; padding-top: 10px; padding-bottom: 15px;">
    <span class="dbminputlabel">Data 1</span>
    <input id="date" class="round" type="text" placeholder='22/02/2022 22:22:22 or "new" for a new date.'>
  </div>
  <div style="float: left; width: 70%; padding-top: 10px; padding-bottom: 15px;">
  <span class="dbminputlabel">Data 2</span>
    <input id="date2" class="round" type="text" placeholder='22/02/2022 22:22:22 or "new" for a new date.'>
  </div>
  <div style="float: left; width: 70%; padding-top: 10px; padding-bottom: 15px;">
  Convert seconds:
  <select id="saida" class="round">
      <option value="0" selected>Yes</option>
      <option value="1">No</option>
  </select>
  </div>
  <div style="float: left; width: 35%; padding-top: 8px;">
  <span class="dbminputlabel">Store in</span><br>
    <select id="storage" class="round" onchange="glob.variableChange(this, 'varNameContainer')">
    ${data.variables[1]}
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

    const date = this.evalMessage(data.date, cache);
    const date2 = this.evalMessage(data.date2, cache);
    const saida = parseInt(data.saida, 10);

    let d1 = date;
    let d2 = date2;

    if (d1 === 'new') {
      d1 = new Date();
    }

    if (d2 === 'new') {
      d2 = new Date();
    }

    let result = moment(d2, 'DD/MM/YYYY HH:mm:ss').diff(moment(d1, 'DD/MM/YYYY HH:mm:ss'), 'seconds');

    switch (saida) {
      case 0:
        if (isNaN(result) || result === 'Invalid date') {
          result = 'Invalid date!';
        } else {
          let s = result;
          let m = Math.floor(s / 60);
          s %= 60;
          let h = Math.floor(m / 60);
          m %= 60;
          const d = Math.floor(h / 24);
          h %= 24;

          result = `${d}d ${h}h ${m}m ${s}s`;
        }
        break;
      case 1:
        if (isNaN(result) || result === 'Invalid date') {
          result = 'Invalid date!';
        }
        break;
    }

    const storage = parseInt(data.storage, 10);
    const varName = this.evalMessage(data.varName, cache);
    this.storeValue(result, storage, varName, cache);

    this.callNextAction(cache);
  },

  mod() {},
};
