module.exports = {
  name: 'Revise',
  section: 'Other Stuff',
  meta: {
    version: '2.0.11',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/revise_MOD.js',
  },

  subtitle(data) {
    return `Revise: "${data.reviser}"`;
  },

  variableStorage(data, varType) {
    if (parseInt(data.storage, 10) !== varType) return;
    return [data.varName2, 'Revised Result'];
  },

  fields: ['reviser', 'storage', 'varName2'],

  html(_isEvent, data) {
    return `
<div>
  <div style="width: 70%;">
    Message to Revise:<br>
    <input id="reviser" type="text" class="round">
  </div><br>
  <div style="float: left; width: 35%;">
    Store In:<br>
    <select id="storage" class="round">
      ${data.variables[1]}
    </select>
  </div>
  <div id="varNameContainer2" style="float: right; width: 60%;">
    Variable Name:<br>
    <input id="varName2" class="round" type="text"><br>
  </div>
</div>`;
  },

  init() {},

  async action(cache) {
    const data = cache.actions[cache.index];
    const reviseText = this.evalMessage(data.reviser, cache);
    try {
      const array = reviseText.split(' ');

      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      const storage = parseInt(data.storage, 10);
      const varName2 = this.evalMessage(data.varName2, cache);
      const out = array.join(' ').trim();
      this.storeValue(out.substr(0, 1).toUpperCase() + out.substr(1), storage, varName2, cache);
    } catch (err) {
      console.log(`ERROR! ${err.stack || err}`);
    }
    this.callNextAction(cache);
  },

  mod() {},
};
