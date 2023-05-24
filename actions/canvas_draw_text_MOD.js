module.exports = {
  name: 'Canvas Draw Text on Image',
  section: 'Image Editing',
  meta: {
    version: '2.1.7',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/canvas_draw_text_MOD.js',
  },

  subtitle(data) {
    return `${data.text}`;
  },

  fields: ['storage', 'varName', 'x', 'y', 'fontPath', 'fontColor', 'fontSize', 'align', 'text'],

  html() {
    return `
    <store-in-variable dropdownLabel="Source Image" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></store-in-variable>
    <br><br><br>

<div style="float: left; width: 50%;">
  <span class="dbminputlabel">Local Font URL</span>
  <input id="fontPath" class="round" type="text" value="fonts/"><br>

  <span class="dbminputlabel">Alignment</span>
  <select id="align" class="round" style="width: 90%;">
    <option value="0" selected>Top Left</option>
    <option value="1">Top Center</option>
    <option value="2">Top Right</option>
    <option value="3">Middle Left</option>
    <option value="4">Middle Center</option>
    <option value="5">Middle Right</option>
    <option value="6">Bottom Left</option>
    <option value="7">Bottom Center</option>
    <option value="8">Bottom Right</option>
  </select><br>
  <span class="dbminputlabel">X Position</span>
  <input id="x" class="round" type="text" value="0"><br>
</div>

<div style="float: right; width: 50%;">
  <span class="dbminputlabel">Font Color (Hex)</span>
  <input id="fontColor" class="round" type="text" value="FFFFFF"><br>
  <span class="dbminputlabel">Font Size</span>
  <input id="fontSize" class="round" type="text" placeholder="Default size 10px"><br>
  <span class="dbminputlabel">Y Position</span>
  <input id="y" class="round" type="text" value="0"><br>
</div>
<br><br><br>

<div>
  <span class="dbminputlabel">Text</span>
  <textarea id="text" rows="2" placeholder="Insert text here..." style="width: 95%; white-space: nowrap; resize: none;"></textarea>
</div>`;
  },

  init() {
    const { glob, document } = this;

    glob.refreshVariableList(document.getElementById('storage'));
  },

  async action(cache) {
    const Canvas = require('canvas');
    const opentype = require('opentype.js');
    const data = cache.actions[cache.index];
    const storage = parseInt(data.storage, 10);
    const varName = this.evalMessage(data.varName, cache);
    const imagedata = this.getVariable(storage, varName, cache);
    if (!imagedata) {
      this.callNextAction(cache);
      return;
    }
    const fontPath = this.evalMessage(data.fontPath, cache);
    let fontColor = this.evalMessage(data.fontColor, cache);
    if (!fontColor.startsWith('#')) {
      fontColor = `#${fontColor}`;
    }
    let fontSize = parseInt(this.evalMessage(data.fontSize, cache), 10);
    if (Number.isNaN(fontSize)) {
      fontSize = 10;
    }
    const align = parseInt(data.align, 10);
    let x = parseFloat(this.evalMessage(data.x, cache));
    let y = parseFloat(this.evalMessage(data.y, cache));
    const text = this.evalMessage(data.text, cache);
    const image = new Canvas.Image();
    image.src = imagedata;
    const canvas = Canvas.createCanvas(image.width, image.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0, image.width, image.height);
    const font = opentype.loadSync(fontPath);
    const textpath = font.getPath(text, 0, 0, fontSize);
    const bounder = textpath.getBoundingBox();
    const width = bounder.x2 - bounder.x1;
    const height = bounder.y2 - bounder.y1;
    switch (align) {
      case 1:
        x -= width / 2;
        break;
      case 2:
        x -= width;
        break;
      case 3:
        y -= height / 2;
        break;
      case 4:
        x -= width / 2;
        y -= height / 2;
        break;
      case 5:
        x -= width;
        y -= height / 2;
        break;
      case 6:
        y -= height;
        break;
      case 7:
        x -= width / 2;
        y -= height;
        break;
      case 8:
        x -= width;
        y -= height;
        break;
      default:
        break;
    }
    x -= bounder.x1;
    y -= bounder.y1;
    const Path = font.getPath(text, x, y, fontSize);
    Path.fill = fontColor;
    Path.draw(ctx);
    const result = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
    this.storeValue(result, storage, varName, cache);
    this.callNextAction(cache);
  },

  mod() {},
};
