module.exports = {
  name: 'Base Convert MOD',
  displayName: 'Base Convert',
  section: 'Other Stuff',
  meta: {
    version: '2.1.6',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/base_convert_MOD.js',
  },

  subtitle(data) {
    return `Base ${data.basef} to Base ${data.baset}`;
  },

  variableStorage(data, varType) {
    if (parseInt(data.storage, 10) !== varType) return;
    return [data.varName, 'Number'];
  },

  fields: ['num', 'basef', 'baset', 'storage', 'varName'],

  html(_isEvent, data) {
    return `
<div style="float: left; width: 100%;">
  Number:<br>
  <input id="num" class="round" type="text">
</div><br><br><br>
<div>
  <div style="float: left; width: 40%;">
    Base From (2-36):<br>
    <input id="basef" class="round" type="number" min="2" max="36">
  </div>
  <div style="padding-left: 3%; float: left; width: 50%;">
    Base To (2-36):<br>
    <input id="baset" class="round" type="number" min="2" max="36">
  </div>
</div><br><br><br>
<div>
  <div style="float: left; width: 40%;">
    Store In:<br>
    <select id="storage" class="round">
      ${data.variables[1]}
    </select>
  </div>
  <div id="varNameContainer" style="padding-left: 3%; float: left; width: 55%;">
    Variable Name:<br>
    <input id="varName" class="round" type="text">
  </div>
</div>`;
  },

  init() {},

  async action(cache) {
    const data = cache.actions[cache.index];
    const num = this.evalMessage(data.num, cache);
    const basef = parseInt(data.basef, 10);
    const baset = parseInt(data.baset, 10);
    let result;
    if (basef > 1 && basef <= 36 && baset > 1 && baset <= 36) {
      const base = parseInt(num, basef, 10);
      if (!Number.isNaN(base)) {
        result = base.toString(baset).toUpperCase();
      } else {
        console.log(`Invalid input, ${num} not Base-${basef}`);
      }
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
