module.exports = {
  name: 'Convert ISO 8601 to Timestamp',
  section: 'Other Stuff',
  meta: {
    version: '2.1.7',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    modAuthors: ['Robskan5300'],
  },

  subtitle(data) {
    return `Convert ${data.isoDate}`;
  },

  variableStorage(data, varType) {
    if (parseInt(data.storage, 10) !== varType) return;
    return [data.varName, 'Number'];
  },

  fields: ['isoDate', 'storage', 'varName'],

  html() {
    return `
<div style="float: left; width: 60%; padding-top: 8px;">
  <p><u>Note:</u><br>
  You can convert <b>ISO 8601</b> date to <b>Unix Timestamp</b> with this mod.</p>
</div>
<br><br><br>

<div style="float: left; width: 70%; padding-top: 8px;">
  <span class="dbminputlabel">ISO 8601 Date to Convert</span>
  <input id="isoDate" class="round" type="text" placeholder="e.g. 2024-01-28T16:05:00Z">
</div>
<br><br><br><br>

<div>
  <store-in-variable dropdownLabel="Store In" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></store-in-variable>
</div>
<br><br><br>`;
  },

  init() {
    const { glob, document } = this;
    glob.variableChange(document.getElementById('storage'), 'varNameContainer');
  },

  async action(cache) {
    const data = cache.actions[cache.index];
    const isoDate = this.evalMessage(data.isoDate, cache);

    const timestamp = Date.parse(isoDate);

    if (!isNaN(timestamp)) {
      const storage = parseInt(data.storage, 10);
      const varName = this.evalMessage(data.varName, cache);
      this.storeValue(timestamp, storage, varName, cache);
    }

    this.callNextAction(cache);
  },
};
