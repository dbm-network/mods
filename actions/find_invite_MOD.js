module.exports = {
  name: 'Find Invite',
  section: 'Invite Control',
  meta: {
    version: '2.1.7',
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

  html() {
    return `
<div>
  <div style="padding-top: 8px;">
    <span class="dbminputlabel">Source Invite</span>
    <textarea class="round" id="invite" rows="1" placeholder="Code or URL | e.g abcdef or discord.gg/abcdef" style="width: 99%; font-family: monospace; white-space: nowrap; resize: none;"></textarea>
  </div><br>
</div>

<div style="padding-top: 8px;">
  <store-in-variable dropdownLabel="Store In" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></store-in-variable>
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
