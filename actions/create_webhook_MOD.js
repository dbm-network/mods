module.exports = {
  name: 'Create Webhook',
  section: 'Webhook Control',
  meta: {
    version: '2.1.7',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/create_webhook_MOD.js',
  },

  subtitle(data) {
    return `${data.webhookName}`;
  },

  variableStorage(data, varType) {
    if (parseInt(data.storage2, 10) !== varType) return;
    return [data.varName2, 'Webhook'];
  },

  fields: ['webhookName', 'webhookIcon', 'storage', 'varName', 'storage2', 'varName2'],

  html() {
    return `
<div style="width: 90%;">
  <span class="dbminputlabel">Webhook Name</span>
  <input id="webhookName" class="round" type="text">
</div>
<br>

<div style="width: 90%;">
  <span class="dbminputlabel">Webhook Icon URL</span>
  <input id="webhookIcon" class="round" type="text">
</div>
<br>

<div>
  <channel-input dropdownLabel="Source Channel" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></channel-input>
</div>
<br><br><br>

<div style="padding-top: 8px;">
  <store-in-variable dropdownLabel="Store In" selectId="storage2" variableContainerId="varNameContainer2" variableInputId="varName2"></store-in-variable>
</div>`;
  },

  init() {},

  async action(cache) {
    const data = cache.actions[cache.index];
    const channel = await this.getChannelFromData(data.storage, data.varName, cache);

    if (!channel?.createWebhook) return this.callNextAction(cache);

    const avatar = this.evalMessage(data.webhookIcon, cache);
    const name = this.evalMessage(data.webhookName, cache);
    channel
      .createWebhook(name, { avatar })
      .then((webhook) => {
        const storage2 = parseInt(data.storage2, 10);
        const varName2 = this.evalMessage(data.varName2, cache);
        this.storeValue(webhook, storage2, varName2, cache);
        this.callNextAction(cache);
      })
      .catch(this.displayError.bind(this, data, cache));
  },

  mod() {},
};
