import type { Action } from '../typings/globals';

const action: Action<'time' | 'storage' | 'varName'> = {
  name: 'Convert Seconds To D/H/M/S',
  section: 'Other Stuff',
  fields: ['time', 'storage', 'varName'],

  subtitle(data) {
    return `Convert ${data.time}`;
  },

  variableStorage(data, varType) {
    if (parseInt(data.storage, 10) !== varType) return;
    return [data.varName, 'Date'];
  },

  html(_isEvent, data) {
    return `
<div style="float: left; width: 70%; padding-top: 8px;">
  Seconds to Convert:
  <input id="time" class="round" type="text" placeholder="e.g. 1522672056 or use Variables">
</div>
<div style="float: left; width: 35%; padding-top: 8px;">
  Store Result In:<br>
  <select id="storage" class="round" onchange="glob.variableChange(this, 'varNameContainer')">
  ${data.variables[0]}
  </select>
</div>
<div id="varNameContainer" style="float: right; display: none; width: 60%; padding-top: 8px;">
  Variable Name:<br>
  <input id="varName" class="round" type="text">
</div><br><br>`;
  },

  init(this: any) {
    const { glob, document } = this;
    glob.variableChange(document.getElementById('storage'), 'varNameContainer');
  },

  action(this, cache) {
    const data = cache.actions[cache.index];
    const time = parseInt(this.evalMessage(data.time, cache), 10);

    if (isNaN(time)) return this.callNextAction(cache);

    let s = time;
    let m = Math.floor(s / 60);
    s %= 60;
    let h = Math.floor(m / 60);
    m %= 60;
    const d = Math.floor(h / 24);
    h %= 24;

    const result = `${d}d ${h}h ${m}m ${s}s`;

    if (result.toString() !== 'Invalid Date') {
      const storage = parseInt(data.storage, 10);
      const varName = this.evalMessage(data.varName, cache);
      this.storeValue(result, storage, varName, cache);
    }
    this.callNextAction(cache);
  },

  mod() {},
};

module.exports = action;
