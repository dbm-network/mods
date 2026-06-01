module.exports = {
  // ---------------------------------------------------------------------
  // Action Name
  // ---------------------------------------------------------------------

  name: 'Add Time To Timestamp',

  // ---------------------------------------------------------------------
  // Action Section
  // ---------------------------------------------------------------------

  section: 'Other Stuff',

  // ---------------------------------------------------------------------
  // Action Subtitle
  // ---------------------------------------------------------------------

  variableStorage(data, varType) {
    if (parseInt(data.storage, 10) !== varType) return;
    const dataType = 'New Timestamp';
    return [data.varName2, dataType];
  },

  subtitle(data, presets) {
    return `Added time ${data.addtime} to new timestamp!`;
  },

  // ---------------------------------------------------------------------
  // Action Meta Data
  // ---------------------------------------------------------------------

  meta: {
    version: '2.2.0',
    preciseCheck: true,
    author: 'Gotowka',
    authorUrl: 'https://github.com/Gotowka',
    downloadUrl: 'https://github.com/dbm-network/mods',
  },
  // ---------------------------------------------------------------------
  // Action Fields
  // ---------------------------------------------------------------------

  fields: ['addtime', 'storage', 'varName2'],

  // ---------------------------------------------------------------------
  // Command HTML
  // ---------------------------------------------------------------------

  html(isEvent, data) {
    return `
  <div style="padding-top: 8px; width: 100%;">
  <span class="dbminputlabel">Time to add</span>
  <input id="addtime" class="round" placeholder="example: 1s/1m/1h/1d" type="text">  
  </div>
  <br><br>
  <store-in-variable dropdownLabel="Store In" selectId="storage" variableContainerId="varNameContainer2" variableInputId="varName2"></store-in-variable>
      `;
  },

  init() {},

  // ---------------------------------------------------------------------
  // Action Bot Function
  // ---------------------------------------------------------------------

  async action(cache) {
    const data = cache.actions[cache.index];
    let duration = this.evalMessage(data.addtime, cache);

    if (duration.includes('s')) {
      duration = duration.split('s')[0] * 1000;
    } else if (duration.includes('m')) {
      duration = duration.split('m')[0] * 60000;
    } else if (duration.includes('h')) {
      duration = duration.split('h')[0] * 3600000;
    } else if (duration.includes('d')) {
      duration = duration.split('d')[0] * 86400000;
    } else {
      duration *= 1000;
    }
    const result = Date.parse(new Date(new Date().getTime() + duration)) / 1000;
    const storage = parseInt(data.storage, 10);
    const varName2 = this.evalMessage(data.varName2, cache);
    this.storeValue(result, storage, varName2, cache);
    this.callNextAction(cache);
  },

  mod() {},
};
