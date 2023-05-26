module.exports = {
  name: 'Send Embed to Webhook',
  section: 'Webhook Control',
  meta: {
    version: '2.1.7',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/send_embed_to_webhook_MOD.js',
  },

  subtitle(data) {
    return `${data.varName2}`;
  },

  fields: ['storage', 'varName', 'storage2', 'varName2'],

  html() {
    return `
<div style="padding-top: 8px;">
  <store-in-variable dropdownLabel="Source Webhook" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></store-in-variable>
</div>
<br><br><br>

<div style="padding-top: 8px;">
  <store-in-variable dropdownLabel="Source Embed Object" selectId="storage2" variableContainerId="varNameContainer2" variableInputId="varName2"></store-in-variable>
</div>`;
  },

  init() {},

  async action(cache) {
    const data = cache.actions[cache.index];
    const storage = parseInt(data.storage, 10);
    const varName = this.evalMessage(data.varName, cache);
    const Mods = this.getMods();
    const webhook = Mods.getWebhook(storage, varName, cache);

    const storage2 = parseInt(data.storage2, 10);
    const varName2 = this.evalMessage(data.varName2, cache);
    const embed2 = this.getVariable(storage2, varName2, cache);

    if (!embed2 || !webhook) return this.callNextAction(cache);

    webhook
      .send({ embeds: [embed2] })
      .then(() => this.callNextAction(cache))
      .catch((err) => this.displayError(data, cache, err));
  },

  mod() {},
};
