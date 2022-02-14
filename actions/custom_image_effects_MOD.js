module.exports = {
  name: 'Custom Image Effects',
  section: 'Image Editing',
  meta: {
    version: '2.0.11',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/custom_image_effects_MOD.js',
  },

  subtitle(data) {
    const storeTypes = ['', 'Temp Variable', 'Server Variable', 'Global Variable'];
    const effect = ['Custom Blur', 'Custom Pixelate'];
    return `${storeTypes[parseInt(data.storage, 10)]} (${data.varName}) -> ${effect[parseInt(data.effect, 10)]} ${
      data.intensity
    }`;
  },

  fields: ['storage', 'varName', 'effect', 'intensity'],

  html(_isEvent, data) {
    return `
<div>
  <div style="float: left; width: 45%;">
    Base Image:<br>
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
  <div style="float: left; width: 90%;">
    Effect:<br>
    <select id="effect" class="round">
      <option value="0" selected>Custom Blur</option>
      <option value="1">Custom Pixelate</option>
    </select><br>
  </div>
  <div id="intensityContainer" style="float: left; width: 50%;">
    Intensity:<br>
    <input id="intensity" class="round" type="text"><br>
  </div>
</div>`;
  },

  init() {
    const { glob, document } = this;
    glob.refreshVariableList(document.getElementById('storage'));
  },

  async action(cache) {
    const { Actions } = this.getDBM();
    const data = cache.actions[cache.index];

    const storage = parseInt(data.storage, 10);
    const varName = this.evalMessage(data.varName, cache);
    const image = this.getVariable(storage, varName, cache);
    const intensity = parseInt(data.intensity, 10);

    const Jimp = require('jimp');

    if (!image) return this.callNextAction(cache);

    Jimp.read(image, (err, image1) => {
      if (err) return console.error('Error with custom image effects: ', err);
      const effect = parseInt(data.effect, 10);
      switch (effect) {
        case 0:
          image1.blur(intensity);

          image1.getBuffer(Jimp.MIME_PNG, (error, image2) => {
            if (err) return console.error('Error with custom image effects: ', error);

            Actions.storeValue(image2, storage, varName, cache);
            Actions.callNextAction(cache);
          });

          break;
        case 1:
          image1.pixelate(intensity);
          image1.getBuffer(Jimp.MIME_PNG, (error, image2) => {
            if (err) return console.error('Error with custom image effects: ', error);

            Actions.storeValue(image2, storage, varName, cache);
            Actions.callNextAction(cache);
          });
          break;
        default:
          break;
      }
    });
  },

  mod() {},
};
