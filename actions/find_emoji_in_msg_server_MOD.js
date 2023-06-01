module.exports = {
  name: 'Find Custom Emoji in Current Server',
  displayName: 'Find Custom Emoji/Sticker in Server',
  section: 'Emoji Control',
  meta: {
    version: '2.1.7',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/find_emoji_in_msg_server_MOD.js',
  },

  subtitle(data) {
    const info = ['Emoji ID', 'Emoji Name'];
    return `Find Emoji by ${info[parseInt(data.info, 10)]}`;
  },

  variableStorage(data, varType) {
    if (parseInt(data.storage, 10) !== varType) return;
    return [data.varName, 'Emoji'];
  },

  fields: ['server', 'varName2', 'info', 'find', 'storage', 'varName'],

  html() {
    return `
<div>
  <server-input dropdownLabel="Source Server" selectId="server" variableContainerId="varNameContainer2" variableInputId="varName2"></server-input>
</div>
<br><br><br>

<div>
  <div style="float: left; width: 35%;">
    <span class="dbminputlabel">Source Field</span>
    <select id="info" class="round">
      <option value="0" selected>Emoji ID</option>
      <option value="1">Emoji Name</option>
      <option value="2">Sticker ID</option>
      <option value="3">Sticker Name</option>
    </select>
  </div>
  <div style="float: right; width: 60%;">
    <span class="dbminputlabel">Search Value</span>
    <input id="find" class="round" type="text">
  </div>
</div>
<br><br><br>

<div style="padding-top: 8px;">
  <store-in-variable dropdownLabel="Store In" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></store-in-variable>
</div>`;
  },

  init() {},

  async action(cache) {
    const data = cache.actions[cache.index];
    const server = await this.getServerFromData(data.server, data.varName2, cache);
    const info = parseInt(data.info, 10);
    const find = this.evalMessage(data.find, cache);
    let result;

    switch (info) {
      case 0:
        result = server.emojis.cache.get(find);
        break;
      case 1:
        result = server.emojis.cache.find((e) => e.name === find);
        break;
      case 2:
        result = server.stickers.cache.get(find);
        break;
      case 3:
        result = server.stickers.cache.find((s) => s.name === find);
      default:
        break;
    }

    if (result !== undefined) {
      const storage = parseInt(data.storage, 10);
      const varName = this.evalMessage(data.varName, cache);
      this.storeValue(result, storage, varName, cache);
    }
    this.callNextAction(cache);
  },

  mod() {},
};
