module.exports = {
  name: 'Create Animated Emoji',
  section: 'Emoji Control',
  meta: {
    version: '2.1.7',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/create_animated_emoji_MOD.js',
  },

  subtitle(data) {
    return `${data.emojiName}`;
  },

  variableStorage(data, varType) {
    if (parseInt(data.storage2, 10) !== varType) return;
    return [data.varName2, 'Animated Emoji'];
  },

  fields: ['emojiName', 'storage', 'varName', 'storage2', 'varName2'],

  html() {
    return `
<div style="width: 90%;">
  <span class="dbminputlabel">Animated Emoji Name</span>
  <input id="emojiName" class="round" type="text">
</div>
<br>

<div>
  <store-in-variable dropdownLabel="Source GIF" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></store-in-variable>
</div>
<br><br><br>

<div>
  <store-in-variable dropdownLabel="Store In" selectId="storage2" variableContainerId="varNameContainer2" variableInputId="varName2"></store-in-variable>
</div>`;
  },

  init() {},

  async action(cache) {
    const data = cache.actions[cache.index];
    const { server } = cache;

    if (!server?.emojis?.create) return this.callNextAction(cache);

    const type = parseInt(data.storage, 10);
    const varName = this.evalMessage(data.varName, cache);
    const gif = this.getVariable(type, varName, cache);
    const name = this.evalMessage(data.emojiName, cache);

    server.emojis
      .create(gif, name)
      .then((emoji) => {
        const varName2 = this.evalMessage(data.varName2, cache);
        const storage = parseInt(data.storage2, 10);
        this.storeValue(emoji, storage, varName2, cache);
        this.callNextAction(cache);
      })
      .catch(this.displayError.bind(this, data, cache));
  },

  mod() {},
};
