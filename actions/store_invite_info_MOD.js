module.exports = {
  name: 'Store Invite Info',
  section: 'Channel Control',
  meta: {
    version: '2.1.7',
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

  html() {
    return `
<div style="padding-top: 8px;">
  <span class="dbminputlabel">Source Invite</span>
  <textarea class="round" id="invite" rows="1" placeholder="Code or URL | e.g abcdef or discord.gg/abcdef" style="width: 99%; font-family: monospace; white-space: nowrap; resize: none;"></textarea>
</div>

<div style="padding-top: 16px; width: 70%;">
  <span class="dbminputlabel">Source Info</span>
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
</div>
<br>

<div>
  <store-in-variable dropdownLabel="Store In" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></store-in-variable>
</div>`;
  },

  init() {},

  async action(cache) {
    const data = cache.actions[cache.index];
    const invite = this.evalMessage(data.invite, cache);
    const info = parseInt(data.info, 10);
    const storage = parseInt(data.storage, 10);
    const varName = this.evalMessage(data.varName, cache);

    const inviteGuild = await this.getDBM().Bot.bot.fetchInvite(invite).catch(console.error);
    const inviteInfo = await inviteGuild.guild.invites.fetch(invite).catch(console.error);

    if (!inviteInfo) return this.callNextAction(cache);

    let result;
    switch (info) {
      case 0:
        result = inviteInfo.channel;
        break;
      case 1:
        result = inviteInfo.inviter;
        break;
      case 2:
        result = inviteInfo.createdAt;
        break;
      case 3:
        result = inviteInfo.expiresAt;
        break;
      case 4:
        result = inviteInfo.guild;
        break;
      case 5:
        result = inviteInfo.maxUses;
        break;
      case 6:
        result = inviteInfo.temporary;
        break;
      case 7:
        result = inviteInfo.url;
        break;
      case 8:
        result = inviteInfo.uses;
        break;
      case 9:
        result = inviteInfo.memberCount;
        break;
      case 10:
        result = inviteInfo.code;
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
