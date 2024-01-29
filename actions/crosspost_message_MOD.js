module.exports = {
  name: 'Crosspost Message',
  section: 'Messaging',
  meta: {
    version: '2.1.7',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/crosspost_message_MOD.js',
  },

  subtitle(data, presets) {
    return presets.getMessageText(data.message, data.varName);
  },

  variableStorage(data, varType) {
    if (parseInt(data.storage, 10) !== varType) return;
    return [data.varName2, 'Message'];
  },

  fields: ['message', 'varName', 'storage', 'varName2'],

  html() {
    return `
<div>
 <message-input dropdownLabel="Source Message" selectId="message" variableContainerId="varNameContainer" variableInputId="varName"></message-input>
</div>
<br><br><br>

<div>
  <store-in-variable dropdownLabel="Store In" selectId="storage2" variableContainerId="varNameContainer2" variableInputId="varName2"></store-in-variable>
</div>`;
  },

  init() {},

  async action(cache) {
    const data = cache.actions[cache.index];
    const message = await this.getMessageFromData(data.message, data.varName, cache);

    if (!message) return this.callNextAction(cache);

    message
      .crosspost()
      .then((msg) => {
        const varName2 = this.evalMessage(data.varName2, cache);
        const storage = parseInt(data.storage, 10);
        this.storeValue(msg, storage, varName2, cache);
        this.callNextAction(cache);
      })
      .catch(console.error);
  },

  mod() {},
};
