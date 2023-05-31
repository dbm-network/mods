module.exports = {
  name: 'Store Audit Log List MOD',
  displayName: 'Store Audit Log List',
  section: 'Server Control',
  meta: {
    version: '2.1.7',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/store_audit_log_list_MOD.js',
  },

  subtitle(data) {
    const storage = ['All Member', 'Mentioned User', 'Command Author', 'tempVars', 'serverVars', 'globalVars'];
    const type = {
      0: 'All Type',
      1: 'Update Server',
      10: 'Create Channel',
      11: 'Update Channel',
      12: 'Delete Channel',
      13: 'Create Channel Permission',
      14: 'Update Channel Permission',
      15: 'Delete Channel Permission',
      20: 'Kick Member',
      21: 'Prune Members',
      22: 'Ban Member',
      23: 'Unban Member',
      24: 'Update Member',
      25: 'Update Member Roles',
      26: 'Move Member',
      27: 'Disconnect Member',
      28: 'Add Bot',
      30: 'Create Role',
      31: 'Update Role',
      32: 'Delete Role',
      40: 'Create Invite',
      41: 'Update Invite',
      42: 'Delete Invite',
      50: 'Create Webhook',
      51: 'Update Webhook',
      52: 'Delete Webhook',
      60: 'Create Emoji',
      61: 'Update Emoji',
      62: 'Delete Emoji',
      72: 'Delete Messages',
      73: 'Bulk Delete Messages',
      74: 'Pin Message',
      75: 'Unpin Message',
      76: 'Create Integration',
      77: 'Update Intergration',
      78: 'Delete Integration',
    };

    const storageData = parseInt(data.storage, 10);
    if ([0, 1, 2].includes(storageData)) {
      return `Store ${storage[storageData]} - ${type[parseInt(data.type, 10)]}`;
    }
    return `Store ${storage[storageData]} ("${data.varName}") - ${type[parseInt(data.type, 10)]}`;
  },

  variableStorage(data, varType) {
    if (parseInt(data.storage2, 10) !== varType) return;
    return [data.varName2, 'Audit Log List'];
  },

  fields: ['storage', 'varName', 'type', 'before', 'limit', 'storage2', 'varName2'],

  html() {
    return `
<div>
  <member-input style="padding-top: 8px;" dropdownLabel="Filter Member" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></member-input>
</div>
<br><br><br>

<div>
  <div style="float: left; width: 94%;">
    <span class="dbminputlabel">Action Type</span><br>
    <select id="type" class="round">
      <option value="0" selected>All</option>
      <option value="1">Update Server</option>
      <option value="10">Create Channel</option>
      <option value="11">Update Channel</option>
      <option value="12">Delete Channel</option>
      <option value="13">Create Channel Permission</option>
      <option value="14">Update Channel Permission</option>
      <option value="15">Delete Channel Permission</option>
      <option value="20">Kick Member</option>
      <option value="21">Prune Members</option>
      <option value="22">Ban Member</option>
      <option value="23">Unban Member</option>
      <option value="24">Update Member</option>
      <option value="25">Update Member Roles</option>
      <option value="26">Move Member</option>
      <option value="27">Disconnect Member</option>
      <option value="28">Add Bot</option>
      <option value="30">Create Role</option>
      <option value="31">Update Role</option>
      <option value="32">Delete Role</option>
      <option value="40">Create Invite</option>
      <option value="41">Update Invite</option>
      <option value="42">Delete Invite</option>
      <option value="50">Create Webhook</option>
      <option value="51">Update Webhook</option>
      <option value="52">Delete Webhook</option>
      <option value="60">Create Emoji</option>
      <option value="61">Update Emoji</option>
      <option value="62">Delete Emoji</option>
      <option value="72">Delete Messages</option>
      <option value="73">Bulk Delete Messages</option>
      <option value="74">Pin Message</option>
      <option value="75">Unpin Message</option>
      <option value="76">Create Integration</option>
      <option value="77">Update Integration</option>
      <option value="78">Delete Integration</option>
    </select><br>
  </div>
</div>
<br><br><br>

<div>
  <div style="float: left; width: 48%;">
    <span class="dbminputlabel">Before Entry / Timestamp</span><br>
    <input id="before" class="round" type="text" placeholder="Leave it blank for None."><br>
  </div>
</div>
<br><br><br>

<div>
  <div style="float: left; width: 104%;">
    <span class="dbminputlabel">Amount to Fetch</span><br>
    <input id="limit" class="round" type="text" placeholder="Leave it blank for All."><br>
  </div>
</div>
<br><br><br>

<div>
  <store-in-variable dropdownLabel="Store In" selectId="storage2" variableContainerId="varNameContainer2" variableInputId="varName2"></store-in-variable>
</div>`;
  },

  init() {},

  async action(cache) {
    const data = cache.actions[cache.index];
    const { server } = cache;
    const member = parseInt(data.storage, 10);

    if (!server) return this.callNextAction(cache);

    let mem;
    switch (member) {
      case 0:
        break;
      default: {
        const varName = this.evalMessage(data.varName, cache);
        mem = await this.getMember(member - 1, varName, cache);
        break;
      }
    }

    const before = this.evalMessage(data.before, cache);
    const limit = parseInt(this.evalMessage(data.limit, cache), 10);
    const type = parseInt(data.type, 10);
    const options = {};

    if (type !== 0) {
      options.type = type;
    } else {
      options.type = null;
    }
    if (!isNaN(before) && before !== '') {
      options.before = before;
    }
    if (limit && !isNaN(limit)) {
      options.limit = limit;
    }
    if (mem) {
      options.user = mem;
    }

    const result = [];
    server.fetchAuditLogs(options).then((audits) => {
      audits.entries.forEach((entry) => {
        result.push(entry);
      });
      const storage2 = parseInt(data.storage2, 10);
      const varName2 = this.evalMessage(data.varName2, cache);
      if (result.length !== 0) {
        this.storeValue(result, storage2, varName2, cache);
      }
      this.callNextAction(cache);
    });
  },

  mod() {},
};
