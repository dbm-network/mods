module.exports = {
  name: 'Variable Pattern MOD',
  section: 'Variable Things',
  meta: {
    version: '2.0.11',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/variable_pattern_MOD.js',
  },

  subtitle(data) {
    const storage = ['', 'Temp Variable', 'Server Variable', 'Global Variable'];
    return `${storage[parseInt(data.storage, 10)]} (${data.varName})`;
  },

  variableStorage(data, varType) {
    if (parseInt(data.storage2, 10) !== varType) return;
    return [data.varName2, 'String'];
  },

  fields: ['storage', 'varName', 'info', 'info2', 'value', 'storage2', 'varName2'],

  html(_isEvent, data) {
    return `
<div>
  <div style="float: left; width: 35%;">
    Variable:<br>
    <select id="storage" class="round" onchange="glob.refreshVariableList(this)">
      ${data.variables[1]}
    </select>
  </div>
  <div id="varNameContainer" style="float: right; width: 60%;">
    Variable Name:<br>
    <input id="varName" class="round" type="text" list="variableList">
  </div>
</div><br><br><br>
<div style="padding-top: 8px;">
  <div style="float: left; width: 45%;">
    Pattern Type:<br>
    <select id="info" class="round" onchange="glob.onChange1(this)">
      <option value="0">Repeat</option>
      <option value="1">Change</option>
      <option value="2">Add To Front</option>
      <option value="3">Add To End</option>
      <option value="4">Add To Specific Position</option>
      <option value="5">Store From Front</option>
      <option value="6">Store From End</option>
      <option value="7">Store One Character</option>
    </select>
  </div>
  <div style="float: right; width: 50%;" id="info2box">
    <div id="info2text">Character:</div>
    <input id="info2" class="round" type="text">
  </div>
</div><br><br><br>
<div style="padding-top: 8px;">
  <div id="info3text">Character:</div>
  <input id="value" class="round" type="text">
</div><br>
<div style="padding-top: 8px;">
  <div style="float: left; width: 35%;">
    Store In:<br>
    <select id="storage2" class="round">
      ${data.variables[1]}
    </select>
  </div>
  <div id="varNameContainer" style="float: right; width: 60%;">
    Variable Name:<br>
    <input id="varName2" class="round" type="text"><br>
  </div>
</div>`;
  },

  init() {
    const { glob, document } = this;

    glob.onChange1 = function onChange1(event) {
      const info3text = document.getElementById('info3text');
      if (event.value === '0' || event.value === '1' || event.value === '4') {
        const info2text = document.getElementById('info2text');
        document.getElementById('info2box').style.display = null;
        if (event.value === '0') {
          info2text.innerHTML = 'Repeat Every Character';
          info3text.innerHTML = 'Repeat Character';
        } else if (event.value === '1') {
          info2text.innerHTML = 'Change From Character';
          info3text.innerHTML = 'Change To Character';
        } else if (event.value === '4') {
          info2text.innerHTML = 'Position Character';
          info3text.innerHTML = 'Add Character';
        }
      } else {
        document.getElementById('info2box').style.display = 'none';
        if (event.value === '2' || event.value === '3') {
          info3text.innerHTML = 'Add Character';
        } else if (event.value === '5' || event.value === '6' || event.value === '7') {
          info3text.innerHTML = 'Store Number Character';
        }
      }
    };

    glob.onChange1(document.getElementById('info'));
    glob.refreshVariableList(document.getElementById('storage'));
  },

  async action(cache) {
    const data = cache.actions[cache.index];
    const storage = parseInt(data.storage, 10);
    const varName = this.evalMessage(data.varName, cache);
    const variable = this.getVariable(storage, varName, cache);
    const info = parseInt(data.info, 10);
    const value = this.evalMessage(data.value, cache);
    let result;
    let info2;

    if (info === 0 || info === 1 || info === 4) info2 = this.evalMessage(data.info2, cache);

    switch (info) {
      case 0: {
        const parts = variable.toString().split('.');
        parts[0] = parts[0].replace(new RegExp(`\\B(?=(.{${info2}})+(?!.))`, 'g'), value);
        result = parts.join('.');
        break;
      }
      case 1: {
        result = variable.replace(new RegExp(info2, 'g'), value);
        break;
      }
      case 2: {
        result = `${value}${variable}`;
        break;
      }
      case 3: {
        result = `${variable}${value}`;
        break;
      }
      case 4: {
        const front = variable.slice(0, parseInt(info2, 10));
        const end = variable.slice(parseInt(info2, 10));
        result = front + value + end;
        break;
      }
      case 5: {
        result = variable.slice(0, value);
        break;
      }
      case 6: {
        result = variable.slice(-1 * parseInt(value, 10));
        break;
      }
      case 7: {
        result = variable.slice(value, 1 + parseInt(value, 10));
        break;
      }
      default:
        break;
    }

    if (result) {
      const storage2 = parseInt(data.storage2, 10);
      const varName2 = this.evalMessage(data.varName2, cache);
      this.storeValue(result, storage2, varName2, cache);
    }
    this.callNextAction(cache);
  },

  mod() {},
};
