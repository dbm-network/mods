module.exports = {
  name: 'Canvas Create Shape',
  section: 'Image Editing',
  meta: {
    version: '1.0.0',
    author: 'Your Name',
    authorUrl: 'https://yourwebsite.com',
    downloadURL: 'https://github.com/yourrepository/your-script.js',
  },

  subtitle(data) {
    const info = parseInt(data.info, 10);
    if (info === 0) {
      return data.color ? `Create Circle with Color ${data.color}` : 'No color circle has been created';
    }
    if (info === 1) {
      return data.color ? `Create Rectangle with Color ${data.color}` : 'No color rectangle has been created';
    }
    // Add more cases for different shapes as needed
  },

  variableStorage(data, varType) {
    if (parseInt(data.storage, 10) !== varType) return;
    return [data.varName, 'Image'];
  },

  fields: ['shapeType', 'width', 'height', 'color', 'storage', 'varName'],

  html() {
    return `
<div>
  <div>
    <span class="dbminputlabel">Shape Type</span>
    <select id="shapeType" class="round">
      <option value="0" selected>Circle</option>
      <option value="1">Rectangle</option>
      <!-- Add more options for different shapes -->
    </select>
  </div>
</div>
<br><br>

<div>
  <div>
    <span class="dbminputlabel">Width (px)</span>
    <input id="width" class="round" type="text"><br>
  </div>
  <div>
    <span class="dbminputlabel">Height (px)</span>
    <input id="height" class="round" type="text"><br>
  </div>
</div>
<br><br>

<div>
  <div>
    <span class="dbminputlabel">Color</span>
    <input id="color" class="round" type="text" placeholder="Insert Color Hex code here"><br>
  </div>
</div>
<br><br>

<store-in-variable dropdownLabel="Store In" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></store-in-variable>
`;
  },

  async action(cache) {
    const data = cache.actions[cache.index];
    const Canvas = require('canvas');
    const shapeType = parseInt(data.shapeType, 10);
    const width = parseInt(this.evalMessage(data.width, cache), 10);
    const height = parseInt(this.evalMessage(data.height, cache), 10);
    const canvas = Canvas.createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    let color = this.evalMessage(data.color, cache);

    switch (shapeType) {
      case 0: // Circle
        ctx.beginPath();
        ctx.arc(width / 2, height / 2, Math.min(width, height) / 2, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();
        break;
      case 1: // Rectangle
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, width, height);
        break;
      // Add more cases for different shapes
      default:
        break;
    }

    const result = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
    const varName = this.evalMessage(data.varName, cache);
    const storage = parseInt(data.storage, 10);
    this.storeValue(result, storage, varName, cache);
    this.callNextAction(cache);
  },

  mod() {},
};
