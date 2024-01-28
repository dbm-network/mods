module.exports = {
  name: 'Add Commas to Number',
  section: 'Other Stuff',
  meta: {
    version: '2.1.7',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    modAuthors: ['Robskan5300'],
  },

  subtitle(data) {
    return `Add Commas to ${data.number}`;
  },

  variableStorage(data, varType) {
    if (parseInt(data.storage, 10) !== varType) return;
    return [data.varName, 'String'];
  },

  fields: ['number', 'storage', 'varName'],

  html() {
    return `
<div style="float: left; width: 60%; padding-top: 8px;">
  <p><u>Note:</u><br>
  This mod adds commas to a number for every 1000.</p>
</div>
<br><br><br>

<div style="float: left; width: 70%; padding-top: 8px;">
  <span class="dbminputlabel">Number to Add Commas</span>
  <input id="number" class="round" type="text" placeholder="e.g. 1000000">
</div>
<br><br><br><br>

<div>
  <store-in-variable dropdownLabel="Store In" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></store-in-variable>
</div>
<br><br><br>

<div style="text-align: center; float: left; width: 100%; padding-top: 8px;">
  <p><b>Example:</b> 1000000 will be converted to 1,000,000</p>
</div>`;
  },

  init() {
    const { glob, document } = this;
    glob.variableChange(document.getElementById('storage'), 'varNameContainer');
  },

  async action(cache) {
    const data = cache.actions[cache.index];
    const number = this.evalMessage(data.number, cache);

    // Use regex to add commas to the number
    const numberWithCommas = number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    const storage = parseInt(data.storage, 10);
    const varName = this.evalMessage(data.varName, cache);
    this.storeValue(numberWithCommas, storage, varName, cache);

    this.callNextAction(cache);
  },
};
