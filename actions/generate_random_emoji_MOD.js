module.exports = {
  name: 'Generate Random Emoji',
  section: 'Other Stuff',
  meta: {
    version: '2.1.7',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/generate_random_emoji_MOD.js',
  },

  subtitle() {
    return "Generate emoji's";
  },

  variableStorage(data, varType) {
    if (parseInt(data.storage, 10) !== varType) return;
    return [data.varName, 'Text'];
  },

  fields: ['storage', 'varName'],

  html() {
    return `
    <div style="padding-top: 8px;">
      <store-in-variable dropdownLabel="Store In" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></store-in-variable>
    </div>`;
  },

  init() {},

  async action(cache) {
    const data = cache.actions[cache.index];
    const storage = parseInt(data.storage, 10);
    const varName = this.evalMessage(data.varName, cache);
    const Mods = this.getMods();
    const emoji = Mods.require('node-emoji');

    const res = emoji.random();
    this.storeValue(res.emoji, storage, varName, cache);
    this.callNextAction(cache);
  },

  mod() {},
};
