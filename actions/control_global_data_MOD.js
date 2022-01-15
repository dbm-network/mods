module.exports = {
  name: 'Control Global Data',
  section: 'Data',
  meta: {
    version: '2.0.11',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/control_global_data_MOD.js',
  },

  subtitle(data) {
    return `(${data.dataName}) ${data.changeType === '1' ? '+=' : '='} ${data.value}`;
  },

  fields: ['dataName', 'changeType', 'value'],

  html() {
    return `
<div style="padding-top: 8px;">
  <div style="float: left; width: 50%;">
    Data Name:<br>
    <input id="dataName" class="round" type="text">
  </div>
  <div style="float: left; width: 45%;">
    Control Type:<br>
    <select id="changeType" class="round">
      <option value="0" selected>Set Value</option>
      <option value="1">Add Value</option>
    </select>
  </div>
</div><br><br><br>
<div style="padding-top: 8px;">
  Value:<br>
  <input id="value" class="round" type="text" name="is-eval"><br>
</div>`;
  },

  init() {},

  async action(cache) {
    const data = cache.actions[cache.index];

    const dataName = this.evalMessage(data.dataName, cache);
    const isAdd = data.changeType === '1';
    const { Globals } = this.getDBM();

    let val = this.evalMessage(data.value, cache);
    try {
      val = this.eval(val, cache);
    } catch (e) {
      this.displayError(data, cache, e);
    }
    if (isAdd) {
      Globals.addData(dataName, val);
    } else {
      Globals.setData(dataName, val);
    }
    this.callNextAction(cache);
  },

  mod() {},
};
