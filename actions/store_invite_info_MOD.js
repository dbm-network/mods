module.exports = {
  name: 'Store Invite Info',
  section: 'Channel Control',
  meta: {
    version: '2.0.11',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/store_invite_info_MOD.js',
  },

  subtitle(data) {
    const info = [
      'Channel Object',
      'Invite Creator',
      'Creation Date',
      'Expiration Date',
      'Guild Object',
      'Max. Uses',
      'Is Temporary?',
      'URL for Invite',
      'Times Used',
      'Invite server member count',
      'Invite code',
    ];
    return `Store ${info[parseInt(data.info, 10)]} from Invite`;
  },

  variableStorage(data, varType) {
    if (parseInt(data.storage, 10) !== varType) return;
    let dataType = 'Unknown Type';
    switch (parseInt(data.info, 10)) {
      case 0:
        dataType = 'Object';
        break;
      case 1:
        dataType = 'User';
        break;
      case 2:
        dataType = 'date';
        break;
      case 3:
        dataType = 'date';
        break;
      case 4:
        dataType = 'Guild';
        break;
      case 5:
        dataType = 'number';
        break;
      case 6:
        dataType = 'boolean';
        break;
      case 7:
        dataType = 'string';
        break;
      case 8:
        dataType = 'number';
        break;
      case 9:
        dataType = 'number';
        break;
      case 10:
        dataType = 'number';
        break;
      default:
        break;
    }
    return [data.varName, dataType];
  },

  fields: ['invite', 'info', 'storage', 'varName'],

  html(_isEvent, data) {
    return `
<div style="padding-top: 8px;">
  Source Invite:<br>
  <textarea class="round" id="invite" rows="1" placeholder="Code or URL | e.g abcdef or discord.gg/abcdef" style="width: 99%; font-family: monospace; white-space: nowrap; resize: none;"></textarea>
</div><br>
<div style="padding-top: 8px; width: 70%;">
  Source Info:<br>
  <select id="info" class="round">
    <option value="0" selected>Channel object</option>
    <option value="1">Creator of invite</option>
    <option value="2">Creation date</option>
    <option value="3">Expiration date</option>
    <option value="4">Guild object</option>
    <option value="5">Max. uses</option>
    <option value="6">Is temporary?</option>
    <option value="7">Url for invite</option>
    <option value="8">Times used</option>
    <option value="9">Invite server member count</option>
    <option value=10">Invite Code</option>
  </select>
</div><br>
<div style="float: left; width: 35%; padding-top: 8px;">
  Store Result In:<br>
  <select id="storage" class="round" onchange="glob.variableChange(this, 'varNameContainer')">
    ${data.variables[0]}
  </select>
</div>
<div id="varNameContainer" style="float: right; display: none; width: 60%; padding-top: 8px;">
  Variable Name:<br>
  <input id="varName" class="round" type="text">
</div>`;
  },

  init() {
    const { glob, document } = this;

    glob.variableChange(document.getElementById('storage'), 'varNameContainer');
  },

  async action(cache) {
    const data = cache.actions[cache.index];
    const invite = this.evalMessage(data.invite, cache);
    const info = parseInt(data.info, 10);
    const storage = parseInt(data.storage, 10);
    const varName = this.evalMessage(data.varName, cache);

    const inviteInfo = await this.getDBM().Bot.bot.fetchInvite(invite).catch(console.error);
    if (!inviteInfo) return this.callNextAction(cache);

    let result;
    switch (info) {
      case 0:
        result = invite.channel;
        break;
      case 1:
        result = invite.inviter;
        break;
      case 2:
        result = invite.createdAt;
        break;
      case 3:
        result = invite.expiresAt;
        break;
      case 4:
        result = invite.guild;
        break;
      case 5:
        result = invite.maxUses;
        break;
      case 6:
        result = invite.temporary;
        break;
      case 7:
        result = invite.url;
        break;
      case 8:
        result = invite.uses;
        break;
      case 9:
        result = invite.memberCount;
        break;
      case 10:
        result = invite.code;
        break;
      default:
        break;
    }

    if (result !== undefined) {
      this.storeValue(result, storage, varName, cache);
    }
    this.callNextAction(cache);
  },

  mod() {},
};
