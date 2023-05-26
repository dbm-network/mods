module.exports = {
  name: 'Send Message To Webhook',
  section: 'Webhook Control',
  meta: {
    version: '2.1.7',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/push_webhook_MOD.js',
  },

  subtitle(data) {
    return `${data.message}`;
  },

  fields: ['webhook', 'varName', 'message'],

  html() {
    return `
<div>
  <store-in-variable dropdownLabel="Source Webhook" selectId="webhook" variableContainerId="varNameContainer" variableInputId="varName"></store-in-variable>
</div>
<br><br><br>

<div style="padding-top: 8px;">
  <span class="dbminputlabel">Message</span>
  <textarea id="message" rows="9" placeholder="Insert message here..." style="width: 99%; font-family: monospace; white-space: nowrap; resize: none;"></textarea>
</div>`;
  },

  init() {},

  async action(cache) {
    const data = cache.actions[cache.index];
    const webhook = parseInt(data.webhook, 10);
    const varName = this.evalMessage(data.varName, cache);
    const Mods = this.getMods();
    const wh = Mods.getWebhook(webhook, varName, cache);
    const message = this.evalMessage(data.message, cache);
    if (!wh) {
      console.log('Push Webhook ERROR: Unable to load webhook from variable.');
      return this.callNextAction(cache);
    }

    wh.send(message);
    this.callNextAction(cache);
  },

  mod() {},
};
