/* eslint-disable no-unused-vars */
module.exports = {
  name: 'Delete Webhook',
  section: 'Webhook Control',
  meta: {
    version: '2.1.6',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/delete_webhook_MOD.js',
  },

  subtitle(data) {
    const names = ['You cheater!', 'Temp Variable', 'Server Variable', 'Global Variable'];
    return `${names[parseInt(data.webhook, 10)]} - ${data.varName}`;
  },

  fields: ['webhook', 'varName'],

  html(_isEvent, data) {
    return `
<div style="float: left; width: 35%;">
  Source Webhook:<br>
  <select id="webhook" class="round" onchange="glob.refreshVariableList(this)">
    ${data.variables[1]}
  </select>
</div>
<div id="varNameContainer" style="float: right; width: 60%;">
  Variable Name:<br>
  <input id="varName" class="round" type="text" list="variableList"><br>
</div>`;
  },

  init() {
    const { glob, document } = this;
    glob.refreshVariableList(document.getElementById('webhook'));
  },

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
