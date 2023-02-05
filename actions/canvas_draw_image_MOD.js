module.exports = {
  name: 'Canvas Draw Image on Image',
  section: 'Image Editing',
  meta: {
    version: '2.1.6',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/canvas_draw_image_MOD.js',
  },

  subtitle(data) {
    const storeTypes = ['', 'Temp Variable', 'Server Variable', 'Global Variable'];
    return `${storeTypes[parseInt(data.storage2, 10)]} (${data.varName2}) -> ${
      storeTypes[parseInt(data.storage, 10)]
    } (${data.varName})`;
  },

  fields: ['storage', 'varName', 'storage2', 'varName2', 'x', 'y', 'effect'],

  html(_isEvent, data) {
    return `
<div>
  <div style="float: left; width: 45%;">
    Source Image:<br>
    <select id="storage" class="round" onchange="glob.refreshVariableList(this)">
      ${data.variables[1]}
    </select>
  </div>
  <div id="varNameContainer" style="float: right; width: 50%;">
    Variable Name:<br>
    <input id="varName" class="round" type="text" list="variableList"><br>
  </div>
</div><br><br><br>
<div style="padding-top: 8px;">
  <div style="float: left; width: 45%;">
    Image that is Drawn:<br>
    <select id="storage2" class="round">
      ${data.variables[1]}
    </select>
  </div>
  <div id="varNameContainer2" style="float: right; width: 50%;">
    Variable Name:<br>
    <input id="varName2" class="round" type="text" list="variableList"><br>
  </div>
</div><br><br><br>
<div style="padding-top: 8px;">
  <div style="float: left; width: 50%;">
    X Position:<br>
    <input id="x" class="round" type="text" value="0"><br>
  </div>
  <div style="float: right; width: 50%;">
    Y Position:<br>
    <input id="y" class="round" type="text" value="0"><br>
  </div>
</div><br><br><br>
<div style="padding-top: 8px;">
  <div style="float: left; width: 45%;">
    Draw Effect:<br>
    <select id="effect" class="round">
      <option value="0" selected>Overlay</option>
      <option value="1">Mask</option>
    </select>
  </div>
</div>`;
  },

  init() {
    const { glob, document } = this;

    glob.refreshVariableList(document.getElementById('storage'));
  },

  async action(cache) {
    const Canvas = require('canvas');
    const data = cache.actions[cache.index];
    const storage = parseInt(data.storage, 10);
    const varName = this.evalMessage(data.varName, cache);
    const imagedata = this.getVariable(storage, varName, cache);
    if (!imagedata) {
      this.callNextAction(cache);
      return;
    }
    const storage2 = parseInt(data.storage2, 10);
    const varName2 = this.evalMessage(data.varName2, cache);
    const imagedata2 = this.getVariable(storage2, varName2, cache);
    if (!imagedata2) {
      this.callNextAction(cache);
      return;
    }
    const x = parseInt(this.evalMessage(data.x, cache), 10);
    const y = parseInt(this.evalMessage(data.y, cache), 10);
    const effect = parseInt(data.effect, 10);
    const image = new Canvas.Image();
    image.src = imagedata;
    const image2 = new Canvas.Image();
    image2.src = imagedata2;
    const canvas = Canvas.createCanvas(image.width, image.height);
    const ctx = canvas.getContext('2d');

    ctx.drawImage(image, 0, 0, image.width, image.height);
    if (effect === 1) ctx.globalCompositeOperation = 'destination-out';
    ctx.drawImage(image2, x, y, image2.width, image2.height);

    const result = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
    this.storeValue(result, storage, varName, cache);
    this.callNextAction(cache);
  },

  mod() {},
};
