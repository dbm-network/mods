module.exports = {
  name: 'Canvas Send Image',
  section: 'Image Editing',
  meta: {
    version: '2.1.7',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/canvas_send_image_MOD.js',
  },

  subtitle(data) {
    const channels = [
      'Same Channel',
      'Command Author',
      'Mentioned User',
      'Mentioned Channel',
      'Default Channel',
      'Temp Variable',
      'Server Variable',
      'Global Variable',
    ];
    return `${channels[parseInt(data.channel, 10)]}`;
  },

  variableStorage(data, varType) {
    if (parseInt(data.storage2, 10) !== varType) return;
    return [data.varName3, 'Message'];
  },

  fields: ['storage', 'varName', 'channel', 'varName2', 'message', 'compress', 'spoiler', 'storage2', 'varName3'],

  html() {
    return `
<store-in-variable dropdownLabel="Source Image" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></store-in-variable>
<br><br><br>
<send-target-input dropdownLabel="Send To" selectId="channel" variableContainerId="varNameContainer2" variableInputId="varName2"></send-target-input>
<br><br><br>

<div style="padding-top: 8px;">
  <span class="dbminputlabel">Message</span>
  <textarea id="message" rows="2" placeholder="Insert message here..." style="width: 94%"></textarea>
</div>
<br>

<div style="padding-top: 8px;">
  <div style="float: left; width: 44%;">
    <span class="dbminputlabel">Image Spoiler?</span>
    <select id="spoiler" class="round">
      <option value="0" selected>No</option>
      <option value="1">Yes</option>
    </select><br>
  </div>
  <div style="padding-left: 5%; float: left; width: 50%;">
    <span class="dbminputlabel">Compression Level</span>
    <select id="compress" class="round">
      <option value="0">1</option>
      <option value="1">2</option>
      <option value="2">3</option>
      <option value="3">4</option>
      <option value="4">5</option>
      <option value="5">6</option>
      <option value="6">7</option>
      <option value="7">8</option>
      <option value="8">9</option>
      <option value="9" selected>10</option>
    </select><br>
  </div>
</div>
<br><br>

<store-in-variable dropdownLabel="Store In" selectId="storage2" variableContainerId="varNameContainer3" variableInputId="varName3"></store-in-variable>
`;
  },

  init() {
    const { glob, document } = this;

    glob.sendTargetChange(document.getElementById('channel'), 'varNameContainer2');
  },

  async action(cache) {
    const { DiscordJS } = this.getDBM();
    const Canvas = require('canvas');
    const data = cache.actions[cache.index];
    const storage = parseInt(data.storage, 10);
    const varName = this.evalMessage(data.varName, cache);
    const imagedata = this.getVariable(storage, varName, cache);
    if (!imagedata) {
      this.callNextAction(cache);
      return;
    }
    const channel = parseInt(data.channel, 10);
    const varName2 = this.evalMessage(data.varName2, cache);
    const target = await this.getSendTarget(channel, varName2, cache);
    const compress = parseInt(data.compress, 10);
    const image = new Canvas.Image();
    image.src = imagedata;
    const canvas = Canvas.createCanvas(image.width, image.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0, image.width, image.height);
    const name = `${parseInt(data.spoiler, 10) === 1 ? 'SPOILER_' : ''}image.png`;
    const buffer = canvas.toBuffer('image/png', { compressionLevel: compress });
    const attachment = new DiscordJS.MessageAttachment(buffer, name);
    const content = this.evalMessage(data.message, cache);
    const options = { files: [attachment] };
    if (content) options.content = content;
    if (target?.send) {
      target.send(options).then((msgobject) => {
        const varName3 = this.evalMessage(data.varName3, cache);
        const storage2 = parseInt(data.storage2, 10);
        this.storeValue(msgobject, storage2, varName3, cache);
        this.callNextAction(cache);
      });
    } else {
      this.callNextAction(cache);
    }
  },

  mod() {},
};
