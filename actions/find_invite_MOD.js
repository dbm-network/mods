module.exports = {
  name: 'Find Invite',
  section: 'Invite Control',
  meta: {
    version: '2.2.0',
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
  <div style="padding-top: 8px;">
    <span class="dbminputlabel">Source Invite</span>
    <input id="invite" class="round" type="text" placeholder="Code or URL | e.g abcdef or discord.gg/abcdef">
  </div><br>

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
      .catch(this.displayError.bind(this, data, cache));
  },

  mod() {},
};
