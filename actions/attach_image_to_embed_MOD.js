module.exports = {
  name: 'Attach Image To Embed',
  section: 'Embed Message',
  meta: {
    version: '2.1.7',
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

  html() {
    return `
<div>
  <store-in-variable dropdownLabel="Source Embed Object" selectId="embedstorage" variableInputId="embedvarName" variableContainerId="varNameContainer"></store-in-variable>
</div>
<br><br><br>

<div>
  <store-in-variable dropdownLabel="Image Object to Attach" selectId="imagestorage" variableInputId="imagevarName" variableContainerId="varNameContainer2"></store-in-variable>
</div>
<br><br><br>

<div>
  <span class="dbminputlabel">Image File Name</span>
  <input id="filename" class="round" type="text" placeholder="image.png"><br>
</div>

<div>
  <store-in-variable selectId="storage" variableInputId="varName" variableContainerId="varNameContainer3"></store-in-variable>
</div>`;
  },

  init() {},

  async action(cache) {
    const data = cache.actions[cache.index];
    const { Actions } = this.getDBM();

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

      const storage = parseInt(data.storage, 10);
      const varName = Actions.evalMessage(data.varName, cache);
      Actions.storeValue(embed, storage, varName, cache);
      this.callNextAction(cache);
    });
  },

  mod() {},
};
