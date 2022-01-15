module.exports = {
  name: 'Run Script Too',
  section: 'Other Stuff',
  meta: {
    version: '2.0.11',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/run_script_too_MOD.js',
  },

  subtitle(data) {
    if (data.title) return `${data.title}`;
    return `${data.file ? `External File: ${data.file}` : data.code}`;
  },

  variableStorage(data, varType) {
    if (parseInt(data.storage, 10) !== varType) return;
    return [data.varName, 'Unknown Type'];
  },

  fields: ['behavior', 'interpretation', 'code', 'file', 'storage', 'varName', 'title'],

  html(_isEvent, data) {
    return `
<div id ="wrexdiv" style="width: 550px; height: 350px; overflow-y: scroll;">
  <div>
    <div style="float: left; width: 45%;">
      End Behavior:<br>
      <select id="behavior" class="round">
        <option value="0"selected>Call Next Action</option>
        <option value="1">Do Not Call Next Action</option>
      </select>
    </div>
    <div style="padding-left: 5%; float: left; width: 55%;">
      Interpretation Style:<br>
      <select id="interpretation" class="round">
        <option value="0">Evaluate Text First</option>
        <option value="1" selected>Evaluate Text Directly</option>
      </select>
    </div>
  </div><br><br><br><br>
  <div id="" style="float: left; width: 65%;">
    Script Name: (shown in the action subtitle)<br>
    <input id="title" class="round" type="text">
  </div><br><br><br><br>
  <div>
    External File Path: (Root directory is your bot folder )<br>
    <div style="float: left; width: 65%;">
      <input type="text" name="file" id="file" class="round" placeholder="./scripts/myscript.js" style="float: left;"/>
    </div>
  </div><br><br><br><br><br><br>
  <div>
    <div style="float: left; width: 35%;">
      Store In:<br>
      <select id="storage" class="round" onchange="glob.variableChange(this, 'varNameContainer')">
      ${data.variables[0]}
      </select>
    </div>
    <div id="varNameContainer" style="display: none; float: right; width: 60%;">
      Variable Name:<br>
      <input id="varName" class="round" type="text">
    </div>
  </div><br><br><br><br><br>
  <div style="padding-top: 8px;">
    Or Use Custom Code: (This isn't used if an external path is defined.)<br>
    <textarea id="code" rows="14" name="is-eval" style="width: 99%; white-space: nowrap; resize: none;"></textarea>
  </div><br><br>
</div>
<style>
  /* Embed CSS code */
  .embed {
    position: relative;
  }

  .embedinfo {
    background: rgba(46,48,54,.45) fixed;
    border: 1px solid hsla(0,0%,80%,.3);
    padding: 10px;
    margin:0 4px 0 7px;
    border-radius: 0 3px 3px 0;
  }

  embedleftline {
    background-color: #eee;
    width: 4px;
    border-radius: 3px 0 0 3px;
    border: 0;
    height: 100%;
    margin-left: 4px;
    position: absolute;
  }

  span {
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  }

  span.embed-auth {
    color: rgb(255, 255, 255);
  }

  span.embed-desc {
    color: rgb(128, 128, 128);
  }

  span.wrexlink {
    color: #99b3ff;
    text-decoration:underline;
    cursor:pointer;
  }

  span.wrexlink:hover {
    color:#4676b9;
  }
</style>`;
  },

  init() {},

  async action(cache) {
    const data = cache.actions[cache.index];
    const { file } = data;

    let code;

    const fs = require('fs');
    if (file && fs.existsSync(file)) {
      try {
        code = fs.readFileSync(file, 'utf8');
      } catch (error) {
        console.error(error.stack ? error.stack : error);
      }
    } else if (data.interpretation === '0') {
      code = this.evalMessage(data.code, cache);
    } else {
      code = data.code;
    }

    const result = this.eval(code, cache);
    const varName = this.evalMessage(data.varName, cache);
    const storage = parseInt(data.storage, 10);
    this.storeValue(result, storage, varName, cache);

    if (data.behavior === '0') this.callNextAction(cache);
  },

  mod() {},
};
