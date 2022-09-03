module.exports = {
  name: 'Edit Webhook',
  section: 'Webhook Control',
  meta: {
    version: '2.1.6',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/edit_webhook',
  },
  subtitle(data) {
    return `${data.webhookName}`;
  },
  fields: ['webhookName', 'webhookIcon', 'webhook', 'varName'],

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
    </div>
  </div><br><br><br>
  <div style="width: 90%;">
    Webhook Name:<br>
    <input id="webhookName" class="round" type="text">
  </div><br>
  <div style="width: 90%;">

    Webhook Icon URL:<br>
    <input id="webhookIcon" class="round" type="text">
  </div><br>
  <div>
  </div>`;
  },

  init() {
    const { glob, document } = this;
    glob.channelChange(document.getElementById('webhook'));
  },

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
