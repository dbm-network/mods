module.exports = {
  name: 'Get Current Timestamp',
  section: 'Other Stuff',
  meta: {
    version: '2.1.7',
    preciseCheck: false,
    author: 'Itz T0kyoo',
    authorUrl: 'https://gitlab.com/t0kyoo.fr/dbm-mods/',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/convert_timestamp_to_date_MOD.js',
  },

  subtitle(data) {
    return `Store current timestamp`;
  },

  variableStorage(data, varType) {
    if (parseInt(data.storage, 10) !== varType) return;
    return [data.varName, 'Date'];
  },

  fields: ['storage', 'varName'],

  html() {
    return `
<div style="float: left; width: 60%; padding-top: 8px;">
  <p><u>Note:</u><br>
  This action store the current timestamp.</p>
</div>
<br><br><br>

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

    const currentDate = new Date();
    const timestamp = Math.round(currentDate.getTime() / 1000);
    
    const storage = parseInt(data.storage, 10);
    const varName = this.evalMessage(data.varName, cache);

    this.storeValue(timestamp, storage, varName, cache);

    this.callNextAction(cache);
  },

  mod() {},
};
