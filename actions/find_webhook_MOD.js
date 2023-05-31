module.exports = {
  name: 'Find Webhook',
  section: 'Webhook Control',
  meta: {
    version: '2.1.7',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/find_webhook_MOD.js',
  },

  subtitle(data) {
    return `${data.id}`;
  },

  variableStorage(data, varType) {
    const type = parseInt(data.storage, 10);
    if (type !== varType) return;
    return [data.varName, 'Webhook'];
  },

  fields: ['id', 'token', 'storage', 'varName'],

  html() {
    return `
<div>
  <div style="float: left; width: 35%;">
    <span class="dbminputlabel">Webhook ID</span>
    <input id="id" class="round" type="text">
  </div>
  <div style="float: right; width: 60%;">
    <span class="dbminputlabel">Webhook Token</span>
    <input id="token" class="round" type="text">
  </div>
</div>
<br><br><br>

<div>
  <store-in-variable dropdownLabel="Store In" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></store-in-variable>
</div>`;
  },

  init() {},

  async action(cache) {
    const { DiscordJS } = this.getDBM();
    const data = cache.actions[cache.index];
    const id = this.evalMessage(data.id, cache);
    const token = this.evalMessage(data.token, cache);

    const result = new DiscordJS.WebhookClient({ id, token });

    if (!result) {
      console.log('Find Webhook: There was an issue creating the webhook object.');
      return this.callNextAction(cache);
    }

    const storage = parseInt(data.storage, 10);
    const varName = this.evalMessage(data.varName, cache);
    this.storeValue(result, storage, varName, cache);
    this.callNextAction(cache);
  },

  mod() {},
};
