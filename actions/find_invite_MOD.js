module.exports = {
  name: 'Find Invite',
  section: 'Invite Control',
  meta: {
    version: '2.1.6',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/find_invite_MOD.js',
  },

  subtitle(data) {
    return `${data.invite}`;
  },

  variableStorage(data, varType) {
    if (parseInt(data.storage, 10) !== varType) return;
    return [data.varName, 'Invite'];
  },

  fields: ['invite', 'storage', 'varName'],

  html(isEvent, data) {
    return `
<div>
  <div style="padding-top: 8px;">
    Source Invite:<br>
    <textarea class="round" id="invite" rows="1" placeholder="Code or URL | e.g abcdef or discord.gg/abcdef" style="width: 99%; font-family: monospace; white-space: nowrap; resize: none;"></textarea>
  </div><br>
</div>
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
    const invite = this.evalMessage(data.invite, cache);
    const client = this.getDBM().Bot.bot;

    client
      .fetchInvite(invite)
      .then((invite) => {
        const storage = parseInt(data.storage, 10);
        const varName = this.evalMessage(data.varName, cache);
        this.storeValue(invite, storage, varName, cache);
        this.callNextAction(cache);
      })
      .catch(console.error);
  },

  mod() {},
};
