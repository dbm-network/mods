module.exports = {
  name: 'Create Webhook',
  section: 'Webhook Control',
  meta: {
    version: '2.0.11',
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

  html(_isEvent, data) {
    return `
<div style="width: 90%;">
  Webhook Name:<br>
  <input id="webhookName" class="round" type="text">
</div><br>
<div style="width: 90%;">
  Webhook Icon URL:<br>
  <input id="webhookIcon" class="round" type="text">
</div><br>
<div>
  <div style="float: left; width: 35%;">
    Source Channel:<br>
    <select id="storage" class="round" onchange="glob.channelChange(this, 'varNameContainer')">
      ${data.channels[1]}
    </select>
  </div>
  <div id="varNameContainer" style="display: none; float: right; width: 60%;">
    Variable Name:<br>
    <input id="varName" class="round" type="text" list="variableList"><br>
  </div>
</div><br><br><br>
<div style="padding-top: 8px;">
  <div style="float: left; width: 35%;">
    Store In:<br>
    <select id="storage2" class="round" onchange="glob.variableChange(this, 'varNameContainer2')">
      ${data.variables[0]}
    </select>
  </div>
  <div id="varNameContainer2" style="display: none; float: right; width: 60%;">
    Variable Name:<br>
    <input id="varName2" class="round" type="text">
  </div>
</div>`;
  },

  init() {
    const { glob, document } = this;

    glob.channelChange(document.getElementById('storage'), 'varNameContainer');
    glob.variableChange(document.getElementById('storage2'), 'varNameContainer2');
  },

  async action(cache) {
    const data = cache.actions[cache.index];
    const storage = parseInt(data.storage, 10);
    const varName = this.evalMessage(data.varName, cache);
    const channel = await this.getChannel(storage, varName, cache);

    if (!channel && !channel.createWebhook) return this.callNextAction(cache);

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
