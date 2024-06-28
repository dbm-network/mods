module.exports = {
  name: 'Canvas Create Shape',
  section: 'Image Editing',
  meta: {
    version: '2.1.7',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/canvas_create_primitive_MOD.js',
  },

  subtitle(data) {
    const info = parseInt(data.info, 10);
    switch (info) {
      case 0:
        return data.color ? `Create Circle with Color ${data.color}` : 'No color circle has been created';
      case 1:
        return data.color ? `Create Rectangle with Color ${data.color}` : 'No color rectangle has been created';
      case 2:
        return data.color ? `Create Triangle with Color ${data.color}` : 'No color triangle has been created';
      case 3:
        return data.color ? `Create Hexagon with Color ${data.color}` : 'No color hexagon has been created';
      case 4:
        return data.color ? `Create Pentagon with Color ${data.color}` : 'No color pentagon has been created';
      case 5:
        return data.color ? `Create Ellipse with Color ${data.color}` : 'No color ellipse has been created';
      case 6:
        return data.color ? `Create Star with Color ${data.color}` : 'No color star has been created';
      default:
        return '';
    }
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
      <option value="2">Triangle</option>
      <option value="3">Hexagon</option>
      <option value="4">Pentagon</option>
      <option value="5">Ellipse</option>
      <option value="6">Star</option>
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
    const color = this.evalMessage(data.color, cache);

    let sideLength;
    let xCenter;
    let yCenter;
    let angle;
    let x;
    let y;
    let angleStep;
    let radius;
    let centerX;
    let centerY;
    let numPoints;
    let outerRadius;
    let innerRadius;

    switch (shapeType) {
      case 0:
        ctx.beginPath();
        ctx.arc(width / 2, height / 2, Math.min(width, height) / 2, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();
        break;
      case 1:
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, width, height);
        break;
      case 2:
        ctx.beginPath();
        ctx.moveTo(width / 2, 0);
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
        break;
      case 3:
        ctx.beginPath();
        sideLength = Math.min(width, height) / 2;
        xCenter = width / 2;
        yCenter = height / 2;
        for (let i = 0; i < 6; i++) {
          angle = (Math.PI / 3) * i;
          x = xCenter + sideLength * Math.cos(angle);
          y = yCenter + sideLength * Math.sin(angle);
          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
        break;
      case 4:
        ctx.beginPath();
        angleStep = (2 * Math.PI) / 5;
        radius = Math.min(width, height) / 2;
        centerX = width / 2;
        centerY = height / 2;
        ctx.moveTo(centerX + radius * Math.cos(0), centerY + radius * Math.sin(0));
        for (let i = 1; i <= 5; i++) {
          ctx.lineTo(centerX + radius * Math.cos(angleStep * i), centerY + radius * Math.sin(angleStep * i));
        }
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
        break;
      case 5:
        ctx.beginPath();
        ctx.ellipse(width / 2, height / 2, width / 2, height / 2, 0, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();
        break;
      case 6:
        numPoints = 5;
        outerRadius = Math.min(width, height) / 2;
        innerRadius = outerRadius * 0.5;
        ctx.beginPath();
        for (let i = 0; i < numPoints * 2; i++) {
          const radius = i % 2 === 0 ? outerRadius : innerRadius;
          const angle = (i * Math.PI) / numPoints - Math.PI / 2;
          ctx.lineTo(width / 2 + radius * Math.cos(angle), height / 2 + radius * Math.sin(angle));
        }
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
        break;
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
