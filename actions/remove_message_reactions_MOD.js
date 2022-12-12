module.exports = {
  name: 'Clear reactions from message',
  section: 'Reaction Control',
  meta: {
    version: '2.1.6',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/remove_message_reactions_MOD.js',
  },

  subtitle() {
    return 'Remove reactions from a message';
  },

  fields: ['storage', 'varName'],

  html() {
    return `
<message-input dropdownLabel="Source Message" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></message-input>`;
  },

  init() {},

  async action(cache) {
    const data = cache.actions[cache.index];
    const message = await this.getMessageFromData(data.storage, data.varName, cache);

    if (Array.isArray(message)) {
      this.callListFunc(
        message.map((m) => m.reactions),
        'removeAll',
        [],
      ).then(() => {
        this.callNextAction(cache);
      });
    } else if (message?.reactions?.removeAll) {
      message.reactions
        .removeAll()
        .then(() => {
          this.callNextAction(cache);
        })
        .catch(this.displayError.bind(this, data, cache));
    }
    this.callNextAction(cache);
  },

  mod() {},
};
