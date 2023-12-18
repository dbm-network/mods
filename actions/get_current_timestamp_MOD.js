module.exports = {
  name: 'Get Current Timestamp',
  section: 'Other Stuff',
  meta: {
    version: '2.1.7',
    preciseCheck: false,
    author: 'Itz T0kyoo',
    authorUrl: 'https://github.com/ItzT0kyooFR',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/convert_timestamp_to_date_MOD.js',
  },

  subtitle() {
    return `Store current timestamp`;
  },

  variableStorage(data, varType) {
    if (parseInt(data.storage, 10) !== varType) return;
    return [data.varName, 'Timestamp'];
  },

  fields: ['resultType', 'storage', 'varName'],

  html() {
    return `
    <div style="float: left; width: 60%; padding-top: 8px;">
      <p><u>Note:</u><br>
      This action stores the current time in a variable in timestamp form(number or markdown).</p>
    </div>
    <br><br><br>
    
    <div style="float: left; width: 55%; padding-top: 8px;">
      <span class="dbminputlabel">Result Type</span>
      <select id="resultType" class="round">
        <option value="0" selected>Default</option>
        <option value="1">Short Time</option>
        <option value="2">Long Time</option>
        <option value="3">Short Date</option>
        <option value="4">Long Date</option>
        <option value="5">Long Date w. Short Time</option>
        <option value="6">Full Date</option>
        <option value="7">Relative</option>
      </select>
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

    const currentDate = new Date();
    const timestamp = Math.round(currentDate.getTime() / 1000);
    let timestamp2;

    const resultType = parseInt(data.resultType, 10);
    const storage = parseInt(data.storage, 10);
    const varName = this.evalMessage(data.varName, cache);

    switch (resultType) {
      case 0:
        timestamp2 = timestamp;
        break;
      case 1:
        timestamp2 = `<t:${timestamp}:t>`;
        break;
      case 2:
        timestamp2 = `<t:${timestamp}:T>`;
        break;
      case 3:
        timestamp2 = `<t:${timestamp}:d>`;
        break;
      case 4:
        timestamp2 = `<t:${timestamp}:D>`;
        break;
      case 5:
        timestamp2 = `<t:${timestamp}:f>`;
        break;
      case 6:
        timestamp2 = `<t:${timestamp}:F>`;
        break;
      case 7:
        timestamp2 = `<t:${timestamp}:R>`;
        break;
      default:
        break;
    }
    this.storeValue(timestamp2, storage, varName, cache);

    this.callNextAction(cache);
  },

  mod() {},
};
