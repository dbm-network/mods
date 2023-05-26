module.exports = {
  name: 'Store Webhook Info',
  section: 'Webhook Control',
  meta: {
    version: '2.1.7',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/store_webhook_info_MOD.js',
  },

  subtitle(data) {
    const info = ['Webhook ', 'Webhook ', 'Webhook ', 'Webhook ', 'Webhook ', 'Webhook ', 'Webhook ', 'Webhook '];
    return `${info[parseInt(data.info, 10)]}`;
  },

  variableStorage(data, varType) {
    if (parseInt(data.storage, 10) !== varType) return;
    let dataType = 'Webhook Info';

    switch (parseInt(data.info, 10)) {
      case 0:
        dataType = 'ID';
        break;
      case 1:
        dataType = 'ID';
        break;
      case 2:
        dataType = 'ID';
        break;
      case 3:
        dataType = 'Username';
        break;
      case 4:
        dataType = 'User';
        break;
      case 5:
        dataType = 'Token';
        break;
      case 6:
        dataType = 'URL';
        break;
      default:
        break;
    }
    return [data.varName2, dataType];
  },

  fields: ['webhook', 'varName', 'info', 'storage', 'varName2'],

  html() {
    return `
<div>
  <store-in-variable dropdownLabel="Source Webhook" selectId="webhook" variableContainerId="varNameContainer" variableInputId="varName"></store-in-variable>
</div>

<div style="float: left; width: 100%; padding-top: 16px;">
  <span class="dbminputlabel">Source Info</span>
  <select id="info" class="round">
    <option value="6" selected>Webhook URL</option>
    <option value="2">Webhook ID</option>
    <option value="5">Webhook Token</option>
    <option value="3">Webhook Name</option>
    <option value="4">Webhook Owner</option>
    <option value="1">Webhook Guild ID</option>
    <option value="0">Webhook Channel ID</option>
  </select>
</div>

<div style="float: left; padding-top: 16px; width: 100%">
  <store-in-variable dropdownLabel="Store In" selectId="storage" variableContainerId="varNameContainer2" variableInputId="varName2"></store-in-variable>
</div>`;
  },

  init() {},

  async action(cache) {
    const data = cache.actions[cache.index];
    const webhook = parseInt(data.webhook, 10);
    const varName = this.evalMessage(data.varName, cache);
    const info = parseInt(data.info, 10);
    const Mods = this.getMods();
    const wh = Mods.getWebhook(webhook, varName, cache);
    let result;

    switch (info) {
      case 0:
        result = wh.channelID;
        break;
      case 1:
        result = wh.guildID;
        break;
      case 2:
        result = wh.id;
        break;
      case 3:
        result = wh.name;
        break;
      case 4:
        result = wh.owner;
        break;
      case 5:
        result = wh.token;
        break;
      case 6:
        result = wh.url;
        break;
      default:
        break;
    }

    if (result !== undefined) {
      const storage = parseInt(data.storage, 10);
      const varName2 = this.evalMessage(data.varName2, cache);
      this.storeValue(result, storage, varName2, cache);
    }
    this.callNextAction(cache);
  },

  mod() {},
};
