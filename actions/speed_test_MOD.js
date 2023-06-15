module.exports = {
  name: 'Speed Test',
  section: 'Other Stuff',
  meta: {
    version: '2.2.0',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/speed_test_MOD.js',
  },

  subtitle(data) {
    if (data.info === 'downloadspeed') {
      return 'Speed Test - Download Speed';
    }
    if (data.info === 'uploadspeed') {
      return 'Speed Test - Upload Speed';
    }
    return 'Error in subtitles.';
  },

  variableStorage(data, varType) {
    if (parseInt(data.storage, 10) !== varType) return;
    let dataType = 'Unknown Data Type';
    if (data.info === 'downloadspeed') {
      dataType = 'Download Speed';
    } else if (data.info === 'uploadspeed') {
      dataType = 'Upload Speed';
    }
    return [data.varName, dataType];
  },

  fields: ['info', 'type', 'storage', 'varName'],

  html() {
    return `
  <div style="float: left; width: 35%; padding-top: 8px;">
    <span class="dbminputlabel">Bit Type</span><br>
    <select id="type" class="round">
      <option value="0" selected>MB/s</option>
      <option value="1">KB/s</option>
    </select>
  </div>

  <div style="float: right; width: 60%; padding-top: 8px;">
    <span class="dbminputlabel">Speed</span><br>
    <select id="info" class="round">
      <option value="downloadspeed" selected>Download Speed</option>
      <option value="uploadspeed">Upload Speed</option>
    </select>
  </div>
  <br><br><br>

<div style="padding-top: 8px;">
  <store-in-variable dropdownLabel="Store In" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></store-in-variable>
</div>`;
  },

  init() {},

  async action(cache) {
    const data = cache.actions[cache.index];
    const type = parseInt(data.type, 10);
    const Mods = this.getMods();
    const speedTest = Mods.require('speedtest-net');

    try {
      const test = await speedTest({ maxTime: 5000, acceptLicense: true });

      let result = data.info === 'downloadspeed' ? test.download.bandwidth : test.upload.bandwidth;
      if (type === 0) result /= 125000;
      else if (type === 1) result /= 1000;

      if (result !== undefined) {
        const storage = parseInt(data.storage, 10);
        const varName2 = this.evalMessage(data.varName, cache);
        this.storeValue(result, storage, varName2, cache);
      }
    } catch (err) {
      console.log(`Error in Speed Test Mod: ${err}`);
    } finally {
      this.callNextAction(cache);
    }
  },

  mod() {},
};
