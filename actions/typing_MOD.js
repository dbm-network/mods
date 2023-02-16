module.exports = {
  name: 'Bot Typing',
  section: 'Bot Client Control',
  meta: {
    version: '2.1.6',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/typing_MOD.js',
  },

  subtitle(data, presets) {
    return `Send typing to ${presets.getChannelText(data.storage, data.varName)}`;
  },

  fields: ['storage', 'varName'],

  html() {
    return `
<channel-input dropdownLabel="Channel to start typing in:" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></channel-input>
<br><br><br>`;
  },

  init() {},

  async action(cache) {
    const data = cache.actions[cache.index];
    const channel = await this.getChannelFromData(data.storage, data.varName, cache);

    try {
      await channel.sendTyping();
    } catch (e) {
      console.error(`ERROR!`, e);
    }

    this.callNextAction(cache);
  },

  mod() {},
};
