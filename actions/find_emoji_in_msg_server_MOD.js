module.exports = {
  name: 'Find Custom Emoji in Current Server',
  section: 'Emoji Control',
  meta: {
    version: '2.1.5',
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

  fields: ['info', 'find', 'storage', 'varName'],

  html(_isEvent, data) {
    return `
<div>
  <div style="float: left; width: 40%;">
    Source Field:<br>
    <select id="info" class="round">
      <option value="0" selected>Emoji ID</option>
      <option value="1">Emoji Name</option>
    </select>
  </div>
  <div style="float: right; width: 55%;">
    Search Value:<br>
    <input id="find" class="round" type="text">
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
    const data = cache.actions[cache.index];
    const { server } = cache;
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
