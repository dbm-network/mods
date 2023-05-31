module.exports = {
  name: 'Send File To Webhook',
  section: 'Webhook Control',
  meta: {
    version: '2.1.7',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/send_file_to_webhook_MOD.js',
  },

  subtitle() {
    return 'Send a file to a webhook';
  },

  variableStorage(data, varType) {
    if (parseInt(data.storage, 10) !== varType) return;
    return [data.varName, 'Number'];
  },

  fields: ['storage', 'varName', 'file'],

  html() {
    return `
<div style="padding-top: 8px;">
  <store-in-variable dropdownLabel="Source Webhook" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></store-in-variable>
</div>
<br><br><br>

<div style="padding-top: 8px;">
  <span class="dbminputlabel">Local File Path</span>
  <input id="file" class="round" type="text" value="resources/"><br>
</div>`;
  },

  init() {},

  async action(cache) {
    const data = cache.actions[cache.index];
    const storage = parseInt(data.storage, 10);
    const varName = this.evalMessage(data.varName, cache);
    const Mods = this.getMods();
    const webhook = Mods.getWebhook(storage, varName, cache);

    if (!webhook) return this.callNextAction(cache);

    webhook
      .send({
        files: [this.getLocalFile(this.evalMessage(data.file, cache))],
      })
      .then(() => this.callNextAction(cache));
  },

  mod() {},
};
