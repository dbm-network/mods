module.exports = {
  name: 'Store Permissions Info',
  section: 'Permission Control',
  meta: {
    version: '2.0.11',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/store_permissions_Info_MOD.js',
  },

  subtitle(data) {
    const variables = ['', 'Temp Variable', 'Server Variable', 'Global Variable'];
    const options = [
      'Allow Bitfields',
      'Allow Flags',
      'Disallow Flags',
      'Disallow Flags',
      'Have Administrator',
      'Have View Audit Log',
      'Have Manage Server',
    ];
    return `${variables[data.storage]} (${data.varName}) - ${options[data.info]}`;
  },

  variableStorage(data, varType) {
    if (parseInt(data.storage2, 10) !== varType) return;
    let dataType;
    switch (parseInt(data.info, 10)) {
      case 0:
      case 2:
        dataType = 'Permission Bitfield';
        break;
      case 1:
      case 3:
        dataType = 'Permissions Flags';
        break;
      case 4:
      case 5:
      case 6:
      case 7:
      case 8:
      case 9:
      case 10:
      case 11:
      case 12:
      case 13:
      case 14:
      case 15:
      case 16:
      case 17:
      case 18:
      case 19:
      case 20:
      case 21:
      case 22:
      case 23:
      case 24:
      case 25:
      case 26:
      case 27:
      case 28:
      case 29:
      case 30:
      case 31:
      case 32:
      case 33:
        dataType = 'Boolean';
        break;
      default:
        break;
    }
    return [data.varName2, dataType];
  },

  fields: ['storage', 'varName', 'info', 'storage2', 'varName2'],

  html(isEvent, data) {
    return `
<div>
  <div style="float: left; width: 35%;">
    Source Permissions:<br>
    <select id="storage" class="round" onchange="glob.refreshVariableList(this)">
      ${data.variables[1]}
    </select><br>
  </div>
  <div style="float: right; width: 60%;">
    Variable Name:<br>
    <input id="varName" class="round" type="text" list="variableList"><br>
  </div>
</div><br><br><br>
<div style="padding-top: 8px;">
  <div style="float: left; width: 60%;">
    Info:<br>
    <select id="info" class="round">
      <optgroup label="Basic Info">
        <option value="0" selected>Allow Bitfields</option>
        <option value="1">Allow Flags</option>
        <option value="2">Disallow Bitfields</option>
        <option value="3">Disallow Flags</option>
      </optgroup>
      <optgroup label="General Permissions">
        <option value="4">Have Administrator</option>
        <option value="5">Have View Audit Log</option>
        <option value="6">Have Manage Server</option>
        <option value="7">Have Manage Roles</option>
        <option value="8">Have Manage Channels</option>
        <option value="9">Have Kick Members</option>
        <option value="10">Have Ban Members</option>
        <option value="11">Have Create Invite</option>
        <option value="12">Have Change Nickname</option>
        <option value="13">Have Manage Nicknames</option>
        <option value="14">Have Manage Emojis</option>
        <option value="15">Have Manage Webhooks</option>
      </optgroup>
      <optgroup label="Text Permissions">
        <option value="16">Have View Channel</option>
        <option value="17">Have Send Messages</option>
        <option value="18">Have Send TTS Messages</option>
        <option value="19">Have Manage Messages</option>
        <option value="20">Have Embed Links</option>
        <option value="21">Have Attach Files</option>
        <option value="22">Have Read Mesage History</option>
        <option value="23">Have Mention Everyone</option>
        <option value="24">Have Use External Emojis</option>
        <option value="25">Have Add Reactions</option>
      </optgroup>
      <optgroup label="Voice Permissions">
        <option value="26">Have Connect</option>
        <option value="27">Have Speak</option>
        <option value="28">Have Video</option>
        <option value="29">Have Mute Members</option>
        <option value="30">Have Deafen Members</option>
        <option value="31">Have Move Members</option>
        <option value="32">Have User Voice Activity</option>
        <option value="33">Have Priority Speaker</option>
      </optgroup>
    </select>
  </div>
</div><br><br><br>
<div style="padding-top: 8px;">
  <div style="float: left; width: 35%;">
    Store In:<br>
    <select id="storage2" class="round">
      ${data.variables[1]}
    </select>
  </div>
  <div style="float: right; width: 60%;">
    Variable Name:<br>
    <input id="varName2" class="round" type="text">
  </div>
</div>`;
  },

  init() {
    const { glob, document } = this;
    glob.refreshVariableList(document.getElementById('storage'));
  },

  async action(cache) {
    const data = cache.actions[cache.index];

    const varName = this.evalMessage(data.varName, cache);
    const storage = parseInt(data.storage, 10);
    const permissions = this.getVariable(storage, varName, cache);
    const info = parseInt(data.info, 10);
    let result = false;
    const storage2 = parseInt(data.storage2, 10);
    const varName2 = this.evalMessage(data.varName2, cache);

    if ((!permissions.allow && ![2, 3].includes(info)) || (!permissions.disallow && [2, 3].includes(info))) {
      this.storeValue(result, storage2, varName2, cache);
      this.callNextAction(cache);
      return;
    }

    switch (info) {
      case 0:
        result = permissions.allow.bitfield;
        break;
      case 1:
        result = permissions.allow.toArray();
        break;
      case 2:
        result = permissions.disallow.bitfield;
        break;
      case 3:
        result = permissions.disallow.toArray();
        break;
      case 4:
        result = permissions.allow.has('ADMINISTRATOR');
        break;
      case 5:
        result = permissions.allow.has('VIEW_AUDIT_LOG');
        break;
      case 6:
        result = permissions.allow.has('MANAGE_GUILD');
        break;
      case 7:
        result = permissions.allow.has('MANAGE_ROLES');
        break;
      case 8:
        result = permissions.allow.has('MANAGE_CHANNELS');
        break;
      case 9:
        result = permissions.allow.has('KICK_MEMBERS');
        break;
      case 10:
        result = permissions.allow.has('BAN_MEMBERS');
        break;
      case 11:
        result = permissions.allow.has('CREATE_INSTANT_INVITE');
        break;
      case 12:
        result = permissions.allow.has('CHANGE_NICKNAME');
        break;
      case 13:
        result = permissions.allow.has('MANAGE_NICKNAMES');
        break;
      case 14:
        result = permissions.allow.has('MANAGE_EMOJIS');
        break;
      case 15:
        result = permissions.allow.has('MANAGE_WEBHOOKS');
        break;
      case 16:
        result = permissions.allow.has('VIEW_CHANNEL');
        break;
      case 17:
        result = permissions.allow.has('SEND_MESSAGES');
        break;
      case 18:
        result = permissions.allow.has('SEND_TTS_MESSAGES');
        break;
      case 19:
        result = permissions.allow.has('MANAGE_MESSAGES');
        break;
      case 20:
        result = permissions.allow.has('EMBED_LINKS');
        break;
      case 21:
        result = permissions.allow.has('ATTACH_FILES');
        break;
      case 22:
        result = permissions.allow.has('READ_MESSAGE_HISTORY');
        break;
      case 23:
        result = permissions.allow.has('MENTION_EVERYONE');
        break;
      case 24:
        result = permissions.allow.has('USE_EXTERNAL_EMOJIS');
        break;
      case 25:
        result = permissions.allow.has('ADD_REACTIONS');
        break;
      case 26:
        result = permissions.allow.has('CONNECT');
        break;
      case 27:
        result = permissions.allow.has('SPEAK');
        break;
      case 28:
        result = permissions.allow.has('STREAM');
        break;
      case 29:
        result = permissions.allow.has('MUTE_MEMBERS');
        break;
      case 30:
        result = permissions.allow.has('DEAFEN_MEMBERS');
        break;
      case 31:
        result = permissions.allow.has('MOVE_MEMBERS');
        break;
      case 32:
        result = permissions.allow.has('USE_VAD');
        break;
      case 33:
        result = permissions.allow.has('PRIORITY_SPEAKER');
        break;
      default:
        break;
    }

    if (typeof result !== 'undefined') {
      this.storeValue(result, storage2, varName2, cache);
    }
    this.callNextAction(cache);
  },
  mod() {},
};
