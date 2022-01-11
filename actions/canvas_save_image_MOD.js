module.exports = {
  name: 'Canvas Save Image',
  section: 'Image Editing',
  meta: {
    version: '2.0.11',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/canvas_save_image_MOD.js',
  },

  subtitle(data) {
    return `Save to "${data.Path}"`;
  },

  variableStorage(data, varType) {
    if (parseInt(data.storage2, 10) !== varType) return;
    return [data.varName2, 'Image URL'];
  },

  fields: ['storage', 'varName', 'Path', 'storage2', 'varName2'],

  html(_isEvent, data) {
    return `
<div>
  <div style="float: left; width: 40%;">
    Source Image:<br>
    <select id="storage" class="round" onchange="glob.refreshVariableList(this)">
      ${data.variables[1]}
    </select><br>
  </div>
  <div id="varNameContainer" style="padding-left: 2%; float: left; width: 60%;">
    Variable Name:<br>
    <input id="varName" class="round" type="text" list="variableList"><br>
  </div>
</div><br><br><br>
<div>
  <div style="float: left; width: 105%;">
    Path (Save to Local):<br>
    <input id="Path" class="round" type="text" placeholder="resources/output.png"><br>
  </div>
</div><br><br>
<div>
  <div style="float: left; width: 40%;">
    Store In:<br>
    <select id="storage2" class="round">
      ${data.variables[1]}
    </select><br>
  </div>
  <div style="padding-left: 2%; float: left; width: 60%;">
    Variable Name:<br>
    <input id="varName2" class="round" type="text"><br>
  </div>
</div>`;
  },

  init() {
    const { document, glob } = this;

    glob.refreshVariableList(document.getElementById('storage'));
  },

  async action(cache) {
    const data = cache.actions[cache.index];
    const fs = require('fs');
    const Canvas = require('canvas');
    const storage = parseInt(data.storage, 10);
    const varName = this.evalMessage(data.varName, cache);
    const imagedata = this.getVariable(storage, varName, cache);
    if (!imagedata) {
      this.callNextAction(cache);
      return;
    }
    const image = new Canvas.Image();
    image.src = imagedata;
    const canvas = Canvas.createCanvas(image.width, image.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0, image.width, image.height);
    const buffer = canvas.toBuffer();
    const Path = this.evalMessage(data.Path, cache);
    if (Path) {
      fs.writeFileSync(Path, buffer);
      const varName2 = this.evalMessage(data.varName2, cache);
      const storage2 = parseInt(data.storage2, 10);
      if (varName2 && storage2) {
        this.storeValue(Path, storage2, varName2, cache);
      }
    }
    this.callNextAction(cache);
  },

  mod() {},
};
