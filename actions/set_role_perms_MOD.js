module.exports = {
  name: 'Set Role Permissions',
  section: 'Role Control',
  meta: {
    version: '2.1.1',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/set_role_perms_MOD.js',
  },

  subtitle(data) {
    const roles = [
      'Mentioned Role',
      '1st Author Role',
      '1st Server Role',
      'Temp Variable',
      'Server Variable',
      'Global Variable',
    ];
    const index = ['Granted', 'Denied'];
    const perm = [
      'View Channels',
      'Manage Channels',
      'Manage Roles',
      'Manage Emojis and Stickers',
      'View Audit Log',
      'Manage Webhooks',
      'Manage Server',
      'Create Invite',
      'Change Nickname',
      'Manage Nicknames',
      'Kick Members',
      'Ban Members',
      'Moderate Member',
      'Send Messages',
      'Send Messages In Threads',
      'Create Public Threads',
      'Create Private Threads',
      'Embed Links',
      'Attach Files',
      'Add Reactions',
      'Use External Emojis',
      'Use External Stickers',
      'Mention Everyone',
      'Manage Messages',
      'Manage Threads',
      'Read Message History',
      'Send TTS Messages',
      'Use Application Commands',
      'Connect',
      'Speak',
      'Stream',
      'Use Activities',
      'Use Voice Activity',
      'Priority Speaker',
      'Mute Members',
      'Deafen Members',
      'Move Members',
      'Manage Events',
      'Administrator',
      'All Permissions'
    ];
    return `${roles[data.role]} - ${perm[data.permission]} - ${index[data.state]} ${
      !data.reason ? '' : `with Reason: <i>${data.reason}<i>`
    }`;
  },

  fields: ['role', 'varName', 'permission', 'state', 'reason'],

  html(isEvent, data) {
    return `
<div style="padding-top: 8px;">
  <div style="float: left; width: 35%;">
    Source Role:<br>
    <select id="role" class="round" onchange="glob.roleChange(this, 'varNameContainer')">
      ${data.roles[isEvent ? 1 : 0]}
    </select>
  </div>
  <div id="varNameContainer" style="display: none; float: right; width: 60%;">
    Variable Name:<br>
    <input id="varName" class="round" type="text" list="variableList"><br>
  </div>
</div><br><br><br>
<div style="padding-top: 8px;">
  <div style="float: left; width: 45%;">
    Permission:<br>
    <select id="permission" class="round">
      <optgroup label="General Server Permissions">
        <option value="0">View Channels</option>
        <option value="1">Manage Channels</option>
        <option value="2">Manage Roles</option>
        <option value="3">Manage Emojis and Stickers</option>
        <option value="4">View Audit Log</option>
        <option value="5">Manage Webhooks</option>
        <option value="6">Manage Server</option>
      </optgroup>

      <optgroup label="Membership Permissions">
        <option value="7">Create Invite</option>
        <option value="8">Change Nickname</option>
        <option value="9">Manage Nicknames</option>
        <option value="10">Kick Members</option>
        <option value="11">Ban Members</option>
        <option value="12">Moderate Member</option>
      </optgroup>

      <optgroup label="Text Channel Permissions">
        <option value="13">Send Messages</option>
        <option value="14">Send Messages In Threads</option>
        <option value="15">Create Public Threads</option>
        <option value="16">Create Private Threads</option>
        <option value="17">Embed Links</option>
        <option value="18">Attach Files</option>
        <option value="19">Add Reactions</option>
        <option value="20">Use External Emojis</option>
        <option value="21">Use External Stickers</option>
        <option value="22">Mention Everyone</option>
        <option value="23">Manage Messages</option>
        <option value="24">Manage Threads</option>
        <option value="25">Read Message History</option>
        <option value="26">Send TTS Messages</option>
        <option value="27">Use Application Commands</option>
      </optgroup>

      <optgroup label="Voice Channel Permissions">
        <option value="28">Connect</option>
        <option value="29">Speak</option>
        <option value="30">Stream</option>
        <option value="31">Use Activities</option>
        <option value="32">Use Voice Activity</option>
        <option value="33">Priority Speaker</option>
        <option value="34">Mute Members</option>
        <option value="35">Deafen Members</option>
        <option value="36">Move Members</option>
      </optgroup>

      <optgroup label="Events Permissions">
        <option value="37">Manage Events</option>
      </optgroup>

      <optgroup label="Advanced Permissions">
        <option value="38" selected>Administrator</option>
        <option value="39">All Permissions</option>
      </optgroup>
    </select>
  </div>
  <div style="padding-left: 5%; float: left; width: 55%;">
    Change To:<br>
      <select id="state" class="round">
      <option value="0" selected>Granted</option>
      <option value="1">Denied</option>
    </select>
  </div>
</div><br><br><br>
<div style="padding-top: 8px;">
  Reason:<br>
  <textarea id="reason" rows="2" placeholder="Insert reason here... (optional)" style="width: 99%; font-family: monospace; white-space: nowrap; resize: none;"></textarea>
</div>`;
  },

  init() {
    const { glob, document } = this;
    glob.roleChange(document.getElementById('role'), 'varNameContainer');
  },

  async action(cache) {
    const data = cache.actions[cache.index];
    const storage = parseInt(data.role, 10);
    const varName = this.evalMessage(data.varName, cache);
    const role = await this.getRole(storage, varName, cache);
    const info = parseInt(data.permission, 10);
    const reason = this.evalMessage(data.reason, cache);

    const options = {};
    options[data.permission] = data.state === '0';

    let result;
    switch (info) {
      case 0:
        result = 1024n;
        break;
      case 1:
        result = 16n;
        break;
      case 2:
        result = 268435456n;
        break;
      case 3:
        result = 1073741824n;
        break;
      case 4:
        result = 128n;
        break;
      case 5:
        result = 536870912n;
        break;
      case 6:
        result = 32n;
        break;
      case 7:
        result = 1n;
        break;
      case 8:
        result = 67108864n;
        break;
      case 9:
        result = 134217728n;
        break;
      case 10:
        result = 2n;
        break;
      case 11:
        result = 4n;
        break;
      case 12:
        result = 1099511627776n;
        break;
      case 13:
        result = 2048n;
        break;
      case 14:
        result = 274877906944n;
        break;
      case 15:
        result = 34359738368n;
        break;
      case 16:
        result = 68719476736n;
        break;
      case 17:
        result = 16384n;
        break;
      case 18:
        result = 32768n;
        break;
      case 19:
        result = 64n;
        break;
      case 20:
        result = 262144n;
        break;
      case 21:
        result = 137438953472n;
        break;
      case 22:
        result = 131072n;
        break;
      case 23:
        result = 8192n;
        break;
      case 24:
        result = 17179869184n;
        break;
      case 25:
        result = 65536n;
        break;
      case 26:
        result = 4096n;
        break;
      case 27:
        result = 2147483648n;
        break;
      case 28:
        result = 1048576n;
        break;
      case 29:
        result = 2097152n;
        break;
      case 30:
        result = 200n;
        break;
      case 31:
        result = 549755813888n;
        break;
      case 32:
        result = 33554432n;
        break;
      case 33:
        result = 256n;
        break;
      case 34:
        result = 4194304n;
        break;
      case 35:
        result = 8388608n;
        break;
      case 36:
        result = 16777216n;
        break;
      case 37:
        result = 8589934592n;
        break;
      case 38:
        result = 8n;
        break;
      case 39:
        result = 2199023255551n;
        break;
      default:
        break;
    }

    if (role?.id) {
      const perms = role.permissions;

      if (Array.isArray(role))
        this.callListFunc(role, 'setPermissions', [role.id, options]).then(() => this.callNextAction(cache));

      if (data.state === '0') {
        role
          .setPermissions([perms, result], reason)
          .then(() => this.callNextAction(cache))
          .catch(this.displayError.bind(this, data, cache));
      } else {
        role
          .setPermissions([perms - result], reason)
          .then(() => this.callNextAction(cache))
          .catch(this.displayError.bind(this, data, cache));
      }
    } else {
      this.callNextAction(cache);
    }
  },

  mod() {},
};
