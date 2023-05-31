module.exports = {
  name: 'Canvas Save Image',
  section: 'Image Editing',
  meta: {
    version: '2.1.7',
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

  html() {
    return `
<store-in-variable dropdownLabel="Source Image" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></store-in-variable>
<br><br><br>

<div>
  <div style="float: left; width: 105%;">
    <span class="dbminputlabel">Path (Save to Local)</span>
    <input id="Path" class="round" type="text" placeholder="resources/output.png"><br>
  </div>
</div>
<br><br><br>

<store-in-variable dropdownLabel="Store In" selectId="storage" variableContainerId="varNameContainer2" variableInputId="varName2"></store-in-variable>
`;
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
    if (!imagedata) return this.callNextAction(cache);

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
