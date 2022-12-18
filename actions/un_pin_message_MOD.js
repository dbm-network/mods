module.exports = {
  name: 'Un-Pin Message',
  section: 'Messaging',
  meta: {
    version: '2.1.6',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/un_pin_message_MOD.js',
  },

  subtitle(data) {
    const names = ['Command Message', 'Temp Variable', 'Server Variable', 'Global Variable'];
    const index = parseInt(data.storage, 10);
    return data.storage === '0' ? `Un-Pin ${names[index]}` : `Un-Pin ${names[index]} (${data.varName})`;
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
