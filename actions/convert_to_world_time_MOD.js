module.exports = {
  name: 'Convert To World Time',
  section: 'Other Stuff',
  meta: {
    version: '2.1.7',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/convert_to_world_time_MOD.js',
  },

  subtitle() {
    return 'Input a timezone and retrieve its current time.';
  },

  variableStorage(data, varType) {
    if (parseInt(data.storage, 10) !== varType) return;
    return [data.varName, 'Time'];
  },

  fields: ['textbox', 'info', 'storage', 'varName'],

  html() {
    return `
<div>
  <div style="width: 90%;">
    <span class="dbminputlabel">Timezone To Convert</span>
    <input id="textbox" class="round" type="text">
  </div>
</div>
<br>

<div style="padding-top: 8px;">
  <store-in-variable dropdownLabel="Store In" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></store-in-variable>
</div>`;
  },

  init() {},

  async action(cache) {
    const data = cache.actions[cache.index];
    const Mods = this.getMods();
    const moment = Mods.require('moment-timezone');
    const str = this.evalMessage(data.textbox, cache);

    const timec = moment().tz(str).format('dddd, MMMM Do YYYY, h:mm:ss a');

    const storage = parseInt(data.storage, 10);
    const varName = this.evalMessage(data.varName, cache);
    this.storeValue(timec, storage, varName, cache);
    this.callNextAction(cache);
  },

  mod() {},
};
