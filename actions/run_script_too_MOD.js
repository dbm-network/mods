module.exports = {
  name: 'Run Script Too',
  section: 'Other Stuff',
  meta: {
    version: '2.2.0',
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

  html() {
    return `
<div id="wrexdiv" style="height: 350px; overflow-y: scroll;">
  <div style="padding-top: 8px;">
    <div style="float: left; width: 35%;">
      <span class="dbminputlabel">End Behavior</span>
      <select id="behavior" class="round">
        <option value="0">Call Next Action</option>
        <option value="1" selected>Do Not Call Next Action</option>
      </select>
    </div>
    <div style="float: right; width: 60%;">
      <span class="dbminputlabel">Interpretation Style</span>
      <select id="interpretation" class="round">
        <option value="0">Evaluate Text First</option>
        <option value="1" selected>Evaluate Text Directly</option>
      </select>
    </div>
  </div>
  <br><br><br>

  <div style="float: left; width: 100%;">
    <span class="dbminputlabel">Script Name</span>
    <input id="title" class="round" type="text">
  </div>
  <br><br><br>

  <div>
    <div style="float: left; width: 100%;">
      <span class="dbminputlabel">External File Path</span>
      <input type="text" name="file" id="file" class="round" placeholder="./scripts/myscript.js" style="float: left;"/>
    </div>
  </div>
  <br><br><br>

  <div style="float: left; width: 100%">
    <store-in-variable dropdownLabel="Store In" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></store-in-variable>
  </div>
  <br><br><br>

  <div style="padding-top: 8px;">
    Or Use Custom Code: (This isn't used if an external path is defined.)<br>
    <textarea id="code" rows="14" name="is-eval" style="width: 99%; white-space: nowrap; resize: none;"></textarea>
  </div>
</div>`;
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
    this.storeValue(result instanceof Promise ? await result : result, storage, varName, cache);

    if (data.behavior === '0') this.callNextAction(cache);
  },

  mod() {},
};
