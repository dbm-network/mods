module.exports = {
  name: 'Un-Pin Message',
  section: 'Messaging',
  meta: {
    version: '2.1.7',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/un_pin_message_MOD.js',
  },

  subtitle(data, presets) {
    return `Un-Pin ${presets.getMessageText(data.storage, data.varName)}`;
  },

  fields: ['storage', 'varName'],

  html() {
    return `
    <div>
      <message-input dropdownLabel="Source Message" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></message-input>
    </div>`;
  },

  init() {},

  async action(cache) {
    const data = cache.actions[cache.index];
    const message = await this.getMessageFromData(data.storage, data.varName, cache);

    if (Array.isArray(message)) {
      this.callListFunc(message, 'unpin', []).then(() => {
        this.callNextAction(cache);
      });
    } else if (message && message.unpin) {
      message
        .unpin()
        .then(() => this.callNextAction(cache))
        .catch(this.displayError.bind(this, data, cache));
    }
    this.callNextAction(cache);
  },

  mod() {},
};
