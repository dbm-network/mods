module.exports = {
  name: 'Canvas Draw Image on Image',
  section: 'Image Editing',
  meta: {
    version: '2.1.7',
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

  html() {
    return `
    <store-in-variable dropdownLabel="Source Image" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></store-in-variable>
    <br><br><br>
    <store-in-variable dropdownLabel="Image that is Drawn" selectId="storage2" variableContainerId="varNameContainer2" variableInputId="varName2"></store-in-variable>
    <br><br><br>

<div style="padding-top: 8px;">
  <div style="float: left; width: 50%;">
    <span class="dbminputlabel">X Position</span>
    <input id="x" class="round" type="text" value="0"><br>
  </div>
  <div style="float: right; width: 50%;">
    <span class="dbminputlabel">Y Position</span>
    <input id="y" class="round" type="text" value="0"><br>
  </div>
</div>
<br><br><br>

<div style="padding-top: 8px;">
  <div style="float: left; width: 45%;">
    <span class="dbminputlabel">Draw Effect</span>
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
    if (!imagedata) return this.callNextAction(cache);

    const storage2 = parseInt(data.storage2, 10);
    const varName2 = this.evalMessage(data.varName2, cache);
    const imagedata2 = this.getVariable(storage2, varName2, cache);
    if (!imagedata2) return this.callNextAction(cache);

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
