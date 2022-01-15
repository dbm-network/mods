module.exports = {
  name: 'Find Webhook',
  section: 'Webhook Control',
  meta: {
    version: '2.0.11',
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

  html(isEvent, data) {
    return `
<div>
  <div style="float: left; width: 40%;">
    Webhook ID:<br>
    <input id="id" class="round" type="text">
  </div>
  <div style="float: right; width: 55%;">
    Webhook Token:<br>
    <input id="token" class="round" type="text">
  </div>
</div><br><br><br>
<div style="padding-top: 8px;">
  <div style="float: left; width: 35%;">
    Store In:<br>
    <select id="storage" class="round">
      ${data.variables[1]}
    </select>
  </div>
  <div id="varNameContainer" style="float: right; width: 60%;">
    Variable Name:<br>
    <input id="varName" class="round" type="text">
  </div>
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
