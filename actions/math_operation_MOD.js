module.exports = {
  name: 'Math Operation',
  section: 'Other Stuff',
  meta: {
    version: '2.0.11',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/math_operation_MOD.js',
  },

  subtitle(data) {
    const info = [
      'Round',
      'Absolute',
      'Ceil',
      'Floor',
      'Sine',
      'Cosine',
      'Tangent',
      'Arc Sine',
      'Arc Cosine',
      'Arc Tangent',
    ];
    return `${info[data.info]}`;
  },

  variableStorage(data, varType) {
    if (parseInt(data.storage, 10) !== varType) return;
    return [data.varName, 'Number'];
  },

  fields: ['num', 'info', 'storage', 'varName'],

  html(isEvent, data) {
    return `
<div>
  <div style="width: 60%; padding-top: 8px;">
    <p><u>Note:</u><br>
    Get more information <a href="https://www.w3schools.com/js/js_math.asp">here</a>.
  </div>
</div><br>
<div style="padding-top: 8px;">
  Source Number:
  <textarea id="num" rows="2" placeholder="Insert number(s) here..." style="width: 99%; font-family: monospace; white-space: nowrap; resize: none;"></textarea>
</div><br>
<div style="padding-top: 8px; width: 60%;">
  Math Operation:
  <select id="info" class="round">
    <option value="0" selected>Round</option>
    <option value="1">Absolute</option>
    <option value="2">Ceil</option>
    <option value="3">Floor</option>
    <option value="4">Sine</option>
    <option value="5">Cosine</option>
    <option value="6">Tangent</option>
    <option value="7">Arc Sine</option>
    <option value="8">Arc Cosine</option>
    <option value="9">Arc Tangent</option>
  </select>
</div><br>
<div style="padding-top: 8px;">
  <div style="float: left; width: 35%;">
    Store In:<br>
    <select id="storage" class="round">
      ${data.variables[1]}
    </select>
  </div>
  <div id="varNameContainer" style="float: right; width: 60%;">
    Variable Name:<br>
    <input id="varName" class="round" type="text">
  </div>
</div>`;
  },

  init() {},

  async action(cache) {
    const data = cache.actions[cache.index];
    const num = parseFloat(this.evalMessage(data.math, cache).replace(/,/g, ''));
    const info = parseInt(data.info, 10);

    if (!num) return this.callNextAction(cache);

    let result;
    switch (info) {
      case 0:
        result = Math.round(num);
        break;
      case 1:
        result = Math.abs(num);
        break;
      case 2:
        result = Math.ceil(num);
        break;
      case 3:
        result = Math.floor(num);
        break;
      case 4:
        result = Math.sin(num);
        break;
      case 5:
        result = Math.cos(num);
        break;
      case 6:
        result = Math.tan(num);
        break;
      case 7:
        result = Math.asin(num);
        break;
      case 8:
        result = Math.acos(num);
        break;
      case 9:
        result = Math.atan(num);
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
