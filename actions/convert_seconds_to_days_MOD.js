module.exports = {
  name: 'Convert Seconds To D/H/M/S',
  section: 'Other Stuff',
  meta: {
    version: '2.1.7',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/convert_seconds_to_days_MOD.js',
  },

  subtitle(data) {
    return `Convert ${data.time}`;
  },

  variableStorage(data, varType) {
    if (parseInt(data.storage, 10) !== varType) return;
    return [data.varName, 'Date'];
  },

  fields: ['time', 'storage', 'varName'],

  html() {
    return `
<div style="float: left; width: 70%; padding-top: 8px;">
  <span class="dbminputlabel">Seconds to Convert</span>
  <input id="time" class="round" type="text" placeholder="e.g. 1522672056 or use Variables">
</div>
<br><br><br><br>

<div>
  <store-in-variable dropdownLabel="Store In" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></store-in-variable>
</div>
`;
  },

  init() {},

  async action(cache) {
    const data = cache.actions[cache.index];
    const time = this.evalMessage(data.time, cache);

    if (isNaN(time)) return this.callNextAction(cache);

    let s = time;
    let m = Math.floor(s / 60);
    s %= 60;
    let h = Math.floor(m / 60);
    m %= 60;
    const d = Math.floor(h / 24);
    h %= 24;

    let result = `${d}d ${h}h ${m}m ${s}s`;

    if (result.toString() === 'Invalid Date') result = undefined;

    if (result !== undefined) {
      const storage = parseInt(data.storage, 10);
      const varName = this.evalMessage(data.varName, cache);
      this.storeValue(result, storage, varName, cache);
    }
    this.callNextAction(cache);
  },

  mod() {},
};
