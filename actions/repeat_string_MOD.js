module.exports = {
  name: 'Repeat String',
  section: 'Other Stuff',
  meta: {
    version: '2.1.7',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/repeat_string_MOD.js',
  },

  subtitle(data) {
    return `${data.xtimes || '0'}x "${data.girdi || 'None'}"`;
  },

  variableStorage(data, varType) {
    if (parseInt(data.storage, 10) !== varType) return;
    return [data.varName, 'String'];
  },

  fields: ['storage', 'varName', 'girdi', 'xtimes'],

  html() {
    return `
<div>
  <div>
    <span class="dbminputlabel">String</span>
    <input placeholder="Text or variable" id="girdi" class="round" type="text">
  </div><br>
  <div>
    <span class="dbminputlabel">Times to repeat</span>
    <input placeholder="Number or variable" id="xtimes" class="round" type="text">
  </div>
</div>
<br>

<div>
  <store-in-variable dropdownLabel="Store In" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></store-in-variable>
</div>`;
  },

  init() {},

  async action(cache) {
    const data = cache.actions[cache.index];
    const type = parseInt(data.storage, 10);
    const varName = this.evalMessage(data.varName, cache);
    const girdi = this.evalMessage(data.girdi, cache);
    const xtimes = this.evalMessage(data.xtimes, cache);

    this.storeValue(girdi.repeat(Number(xtimes)), type, varName, cache);
    this.callNextAction(cache);
  },

  mod() {},
};
