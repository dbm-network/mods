module.exports = {
  name: 'Speed Test',
  section: 'Other Stuff',
  meta: {
    version: '2.1.6',
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

  html(_isEvent, data) {
    return `
<div style="float: left; width: 50%; padding-top: 8px;">
  Speed:<br>
  <select id="info" class="round">
    <option value="downloadspeed" selected>Download Speed</option>
    <option value="uploadspeed">Upload Speed</option>
  </select>
</div>
  <div style="float: left; width: 50%; padding-left: 10px; padding-top: 8px;">
  Bit Type:<br>
  <select id="type" class="round">
    <option value="0" selected>MB/s</option>
    <option value="1">KB/s</option>
  </select>
      </div><br><br><br>
<div>
  <div style="float: left; width: 35%; padding-top: 8px;">
    Store In:<br>
    <select id="storage" class="round" onchange="glob.variableChange(this, 'varNameContainer')">
      ${data.variables[0]}
    </select>
  </div>
  <div id="varNameContainer" style="float: right; width: 60%; padding-top: 8px;">
    Variable Name:<br>
    <input id="varName" class="round" type="text"><br>
  </div>
</div>

<style>
  div.embed { /* <div class="embed"></div> */
    position: relative;
  }

  embedleftline { /* <embedleftline></embedleftline> OR if you want to change the Color: <embedleftline style="background-color: #HEXCODE;"></embedleftline> */
    background-color: #eee;
    width: 4px;
    border-radius: 3px 0 0 3px;
    border: 0;
    height: 100%;
    margin-left: 4px;
    position: absolute;
  }

  div.embedinfo { /* <div class="embedinfo"></div> */
    background: rgba(46,48,54,.45) fixed;
    border: 1px solid hsla(0,0%,80%,.3);
    padding: 10px;
    margin:0 4px 0 7px;
    border-radius: 0 3px 3px 0;
  }

  span.embed-auth { /* <span class="embed-auth"></span> (Title thing) */
    color: rgb(255, 255, 255);
  }

  span.embed-desc { /* <span class="embed-desc"></span> (Description thing) */
    color: rgb(128, 128, 128);
  }

  span {
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  }
</style>`;
  },

  init() {
    const { glob, document } = this;
    glob.variableChange(document.getElementById('storage'), 'varNameContainer');
  },

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
