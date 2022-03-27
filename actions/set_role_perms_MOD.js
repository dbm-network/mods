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

  subtitle(data, presets) {
    const index = ['Granted', 'Denied'];
    const perm = [
      'Administrator',
      'Manage Guild',
      'Manage Nicknames',
      'Manage Roles',
      'Manage Emojis',
      'Kick Members',
      'Ban Members',
      'View Audit Log',
      'Change Nickname',
      'Create Instant Invite',
      'Priority Speaker',
      'Manage Channel',
      'Manage Webhooks',
      'Read Messages (Deprecated)',
      'Send Messages',
      'Send TTS Messages',
      'Manage Messages',
      'Embed Links',
      'Attach Files',
      'Read Message History',
      'Mention Everyone',
      'Use External Emojis',
      'Add Reactions',
      'Connect to Voice',
      'Speak in Voice',
      'Mute Members',
      'Deafen Members',
      'Move Members',
      'Use Voice Activity',
      'All Permissions',
      'Stream',
      'View Channels',
      'Moderate Member',
      'Send Messages In Threads',
      'Create Public Threads',
      'Create Private Threads',
      'Use External Stickers',
      'Manage Threads',
      'Use Application Commands',
      'Use Activities',
      'Manage Events',
    ];
    return `${presets.getRoleText(data.role, data.varName)} - ${perm[data.permission]} - ${index[data.state]} ${
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
        <option value="31">View Channels</option>
        <option value="11">Manage Channels</option>
        <option value="3">Manage Roles</option>
        <option value="4">Manage Emojis and Stickers</option>
        <option value="7">View Audit Log</option>
        <option value="12">Manage Webhooks</option>
        <option value="1">Manage Server</option>
      </optgroup>
      
      <optgroup label="Membership Permissions">
        <option value="9">Create Invite</option>
        <option value="8">Change Nickname</option>
        <option value="2">Manage Nicknames</option>
        <option value="5">Kick Members</option>
        <option value="6">Ban Members</option>
        <option value="32">Moderate Member</option>
      </optgroup>
      
      <optgroup label="Text Channel Permissions">
        <option value="13" class="deprecated" disabled>Read Messages (Deprecated)</option>
        <option value="14">Send Messages</option>
        <option value="33">Send Messages In Threads</option>
        <option value="34">Create Public Threads</option>
        <option value="35">Create Private Threads</option>
        <option value="17">Embed Links</option>
        <option value="18">Attach Files</option>
        <option value="22">Add Reactions</option>
        <option value="21">Use External Emojis</option>
        <option value="36">Use External Stickers</option>
        <option value="20">Mention Everyone</option>
        <option value="16">Manage Messages</option>
        <option value="37">Manage Threads</option>
        <option value="19">Read Message History</option>
        <option value="15">Send TTS Messages</option>
        <option value="38">Use Application Commands</option>
      </optgroup>

      <optgroup label="Voice Channel Permissions">
        <option value="23">Connect</option>
        <option value="24">Speak</option>
        <option value="30">Stream</option>
        <option value="39">Use Activities</option>
        <option value="28">Use Voice Activity</option>
        <option value="10">Priority Speaker</option>
        <option value="25">Mute Members</option>
        <option value="26">Deafen Members</option>
        <option value="27">Move Members</option>
      </optgroup>

      <optgroup label="Events Permissions">
        <option value="40">Manage Events</option>
      </optgroup>

      <optgroup label="Advanced Permissions">
        <option value="0" selected>Administrator</option>
        <option value="29">All Permissions</option>
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
</div>
<style>
.deprecated[disabled] {
  color: var(--placeholder-text-color, #aaa);
}
.deprecated[disabled]:not(:checked) {
  display:none;
}
</style>`;
  },

  init() {
    const { glob, document } = this;
    glob.roleChange(document.getElementById('role'), 'varNameContainer');
  },

  async action(cache) {
    const data = cache.actions[cache.index];
    const { FLAGS, ALL } = this.getDBM().DiscordJS.Permissions;
    const storage = parseInt(data.role, 10);
    const varName = this.evalMessage(data.varName, cache);
    const role = await this.getRole(storage, varName, cache);
    const info = parseInt(data.permission, 10);
    const reason = this.evalMessage(data.reason, cache);

    let result;
    switch (info) {
      case 0:
        result = FLAGS.ADMINISTRATOR;
        break;
      case 1:
        result = FLAGS.MANAGE_GUILD;
        break;
      case 2:
        result = FLAGS.MANAGE_NICKNAMES;
        break;
      case 3:
        result = FLAGS.MANAGE_ROLES;
        break;
      case 4:
        result = FLAGS.MANAGE_EMOJIS_AND_STICKERS;
        break;
      case 5:
        result = FLAGS.KICK_MEMBERS;
        break;
      case 6:
        result = FLAGS.BAN_MEMBERS;
        break;
      case 7:
        result = FLAGS.VIEW_AUDIT_LOG;
        break;
      case 8:
        result = FLAGS.CHANGE_NICKNAME;
        break;
      case 9:
        result = FLAGS.CREATE_INSTANT_INVITE;
        break;
      case 10:
        result = FLAGS.PRIORITY_SPEAKER;
        break;
      case 11:
        result = FLAGS.MANAGE_CHANNELS;
        break;
      case 12:
        result = FLAGS.MANAGE_WEBHOOKS;
        break;
      case 13:
        result = FLAGS.VIEW_CHANNEL; // Read Messages (Deprecated) fallback
        break;
      case 14:
        result = FLAGS.SEND_MESSAGES;
        break;
      case 15:
        result = FLAGS.SEND_TTS_MESSAGES;
        break;
      case 16:
        result = FLAGS.MANAGE_MESSAGES;
        break;
      case 17:
        result = FLAGS.EMBED_LINKS;
        break;
      case 18:
        result = FLAGS.ATTACH_FILES;
        break;
      case 19:
        result = FLAGS.READ_MESSAGE_HISTORY;
        break;
      case 20:
        result = FLAGS.MENTION_EVERYONE;
        break;
      case 21:
        result = FLAGS.USE_EXTERNAL_EMOJIS;
        break;
      case 22:
        result = FLAGS.ADD_REACTIONS;
        break;
      case 23:
        result = FLAGS.CONNECT;
        break;
      case 24:
        result = FLAGS.SPEAK;
        break;
      case 25:
        result = FLAGS.MUTE_MEMBERS;
        break;
      case 26:
        result = FLAGS.DEAFEN_MEMBERS;
        break;
      case 27:
        result = FLAGS.MOVE_MEMBERS;
        break;
      case 28:
        result = FLAGS.USE_VAD;
        break;
      case 29:
        result = ALL;
        break;
      case 30:
        result = FLAGS.STREAM;
        break;
      case 31:
        result = FLAGS.VIEW_CHANNEL;
        break;
      case 32:
        result = FLAGS.MODERATE_MEMBERS;
        break;
      case 33:
        result = FLAGS.SEND_MESSAGES_IN_THREADS;
        break;
      case 34:
        result = FLAGS.CREATE_PUBLIC_THREADS;
        break;
      case 35:
        result = FLAGS.CREATE_PRIVATE_THREADS;
        break;
      case 36:
        result = FLAGS.USE_EXTERNAL_STICKERS;
        break;
      case 37:
        result = FLAGS.MANAGE_THREADS;
        break;
      case 38:
        result = FLAGS.USE_APPLICATION_COMMANDS;
        break;
      case 39:
        result = FLAGS.START_EMBEDDED_ACTIVITIES;
        break;
      case 40:
        result = FLAGS.MANAGE_EVENTS;
        break;
      default:
        break;
    }

    if (role?.id) {
      const perms = role.permissions;

      if (data.state === '0') {
        role
          .setPermissions([perms, result], reason)
          .then(() => this.callNextAction(cache))
          .catch(this.displayError.bind(this, data, cache));
      } else {
        role
          .setPermissions(result !== ALL ? [perms - result] : [0n], reason)
          .then(() => this.callNextAction(cache))
          .catch(this.displayError.bind(this, data, cache));
      }
    } else {
      this.callNextAction(cache);
    }
  },

  mod() {},
};
