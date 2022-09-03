module.exports = {
  name: 'Delete Invite',
  section: 'Invite Control',
  meta: {
    version: '2.1.6',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/delete_invite',
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
    Source Invite:<br>
    <textarea class="round" id="invite" rows="1" placeholder="Code or URL | e.g abcdef or discord.gg/abcdef" style="width: 99%; font-family: monospace; white-space: nowrap; resize: none;"></textarea>
  </div><br>
  <div style="padding-top: 8px;">
    Reason:<br>
    <textarea class="round" id="reason" rows="1" placeholder="Insert a reason.." style="width: 99%; font-family: monospace; white-space: nowrap; resize: none;"></textarea>
  </div><br>
</div>`;
  },

  init() {},

  async action(cache) {
    const data = cache.actions[cache.index];
    const invite = this.evalMessage(data.invite, cache);
    const reason = this.evalMessage(data.reason, cache);
    const client = this.getDBM().Bot.bot;

    client
      .fetchInvite(invite)
      .catch(console.error)
      .then((invite) => {
        if (!invite) this.callNextAction(cache);
        invite.delete(reason);
      });

    this.callNextAction(cache);
  },

  mod() {},
};
