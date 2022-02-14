module.exports = {
  name: 'Attach Image To Embed',
  section: 'Embed Message',
  meta: {
    version: '2.0.11',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/attach_image_to_embed_MOD.js',
  },

  subtitle(data) {
    const array = ['Temp Variable', 'Server Variable', 'Global Variable'];
    return `Attach (${array[data.imagestorage - 1]} ${data.imagevarName}) to Embed (${array[data.embedstorage - 1]} ${
      data.embedvarName
    }) (${data.filename || 'image.png'})`;
  },

  fields: ['embedstorage', 'embedvarName', 'imagestorage', 'imagevarName', 'filename'],

  html(_isEvent, data) {
    return `
<div>
  <div style="float: left; width: 35%;">
    Source Embed Object:<br>
    <select id="embedstorage" class="round" onchange="glob.refreshVariableList(this)">
      ${data.variables[1]}
    </select>
  </div>
  <div id="varNameContainer" style="float: right; width: 60%;">
    Variable Name:<br>
    <input id="embedvarName" class="round" type="text" list="variableList"><br>
  </div>
</div><br><br><br>
<div><br>
  <div style="float: left; width: 35%;">
    Image Object to Attach:<br>
    <select id="imagestorage" class="round" onchange="glob.refreshVariableList(this)">
      ${data.variables[1]}
    </select>
  </div>
  <div id="varNameContainer" style="float: right; width: 60%;">
    Variable Name:<br>
    <input id="imagevarName" class="round" type="text" list="variableList"><br>
  </div><br><br><br>
  <div id="varNameContainer" style="float: right; width: 60%;">
    Image File Name:<br>
    <input id="filename" class="round" type="text" placeholder="image.png"><br>
  </div>
</div>`;
  },

  init() {},

  async action(cache) {
    const data = cache.actions[cache.index];

    const embedstorage = parseInt(data.embedstorage, 10);
    const embedvarName = this.evalMessage(data.embedvarName, cache);
    const embed = this.getVariable(embedstorage, embedvarName, cache);

    const imagestorage = parseInt(data.imagestorage, 10);
    const imagevarName = this.evalMessage(data.imagevarName, cache);
    const image = this.getVariable(imagestorage, imagevarName, cache);

    const filename = data.filename || 'image.png';

    const DBM = this.getDBM();
    const { Images } = DBM;

    Images.createBuffer(image).then((buffer) => {
      const attachment = new DBM.DiscordJS.MessageAttachment(buffer, filename);
      embed.attachFiles([attachment]);
      this.callNextAction(cache);
    });
  },

  mod() {},
};
