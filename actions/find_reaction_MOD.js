module.exports = {
  name: 'Find Reaction',
  section: 'Reaction Control',
  meta: {
    version: '2.1.6',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/find_reaction_MOD.js',
  },

  subtitle(data) {
    return `${data.find}`;
  },

  variableStorage(data, varType) {
    if (parseInt(data.storage, 10) !== varType) return;
    return [data.varName2, 'Reaction'];
  },

  fields: ['message', 'varName', 'info', 'find', 'storage', 'varName2'],

  html(isEvent, data) {
    return `
<div>
<message-input dropdownLabel="Source Message" selectId="message" variableContainerId="varNameContainer" variableInputId="varName"></message-input>
</div><br><br><br><br>
<div>
  <div style="float: left; width: 40%;">
    Source Emoji:<br>
    <select id="info" class="round">
      <option value="0" selected>Emoji ID</option>
      <option value="1">Emoji Name</option>
    </select>
  </div>
  <div style="float: right; width: 55%;">
    Search Value:<br>
    <input id="find" class="round" type="text">
  </div>
</div><br><br><br><br>
<div style="padding-top: 8px;">
  <div style="float: left; width: 35%;">
    Store In:<br>
    <select id="storage" class="round">
      ${data.variables[1]}
    </select>
  </div>
  <div id="varNameContainer2" style="float: right; width: 60%;">
    Variable Name:<br>
    <input id="varName2" class="round" type="text">
  </div>
</div>`;
  },

  init() {
    const { glob, document } = this;
    glob.messageChange(document.getElementById('message'), 'varNameContainer');
  },

  async action(cache) {
    const data = cache.actions[cache.index];
    const msg = await this.getMessageFromData(data.message, data.varName, cache);
    const info = parseInt(data.info, 10);
    const emoji = this.evalMessage(data.find, cache);

    let result;
    switch (info) {
      case 0:
        result = msg.reactions.cache.get(emoji);
        break;
      case 1:
        result = msg.reactions.cache.find((r) => r.emoji.name === emoji);
        break;
      default:
        break;
    }

    if (result === undefined) return this.callNextAction(cache);
    const storage = parseInt(data.storage, 10);
    const varName2 = this.evalMessage(data.varName2, cache);
    result.fetch().then((react) => {
      this.storeValue(react, storage, varName2, cache);
      this.callNextAction(cache);
    });
  },

  mod() {},
};
