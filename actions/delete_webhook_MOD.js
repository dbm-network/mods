/* eslint-disable no-unused-vars */
module.exports = {
  name: 'Delete Webhook',
  section: 'Webhook Control',
  meta: {
    version: '2.2.0',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/delete_webhook_MOD.js',
  },

  subtitle(data, presets) {
    return presets.getVariableText(data.webhook, data.varName);
  },

  fields: ['webhook', 'varName'],

  html() {
    return `<retrieve-from-variable dropdownLabel="Source Webhook" selectId="webhook" variableContainerId="varNameContainer" variableInputId="varName"></retrieve-from-variable>`;
  },

  init() {},

  async action(cache) {
    const data = cache.actions[cache.index];
    const storage = parseInt(data.webhook, 10);
    const varName = this.evalMessage(data.varName, cache);
    const Mods = this.getMods();
    const webhook = Mods.getWebhook(storage, varName, cache);

    if (Array.isArray(webhook)) {
      this.callListFunc(webhook, 'delete', []).then(() => {
        this.callNextAction(cache);
      });
    } else if (webhook && webhook.delete) {
      webhook
        .delete()
        .then((webhook) => {
          this.callNextAction(cache);
        })
        .catch(this.displayError.bind(this, data, cache));
    }
    this.callNextAction(cache);
  },

  mod() {},
};
