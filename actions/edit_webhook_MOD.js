module.exports = {
  name: 'Edit Webhook',
  section: 'Webhook Control',
  meta: {
    version: '2.1.7',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/edit_webhook',
  },
  subtitle(data) {
    return `${data.webhookName}`;
  },
  fields: ['webhookName', 'webhookIcon', 'webhook', 'varName'],

  html() {
    return `
  <div>
    <store-in-variable dropdownLabel="Source Webhook" selectId="webhook" variableContainerId="varNameContainer" variableInputId="varName"></store-in-variable>
  </div>
  <br><br><br>

  <div style="width: 90%;">
    <span class="dbminputlabel">Webhook Name</span>
    <input id="webhookName" class="round" type="text">
  </div>
  <br>
  
  <div style="width: 90%;">
    <span class="dbminputlabel">Webhook Icon URL</span>
    <input id="webhookIcon" class="round" type="text">
  </div><br>
  `;
  },

  init() {},

  async action(cache) {
    const data = cache.actions[cache.index];
    const webhook = parseInt(data.webhook, 10);
    const varName = this.evalMessage(data.varName, cache);
    const Mods = this.getMods();
    const wh = Mods.getWebhook(webhook, varName, cache);

    if (!wh) return this.callNextAction(cache);

    const avatar = this.evalMessage(data.webhookIcon, cache);
    const name = this.evalMessage(data.webhookName, cache);
    if (avatar && name) {
      wh.edit({ avatar, name });
    } else if (avatar) {
      wh.edit({ avatar });
    } else if (name) {
      wh.edit({ name });
    }
    this.callNextAction(cache);
  },
  mod() {},
};
