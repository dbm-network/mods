/* eslint-disable no-unused-vars */

module.exports = {
  name: 'Create Permissions',
  section: 'Permission Control',
  meta: {
    version: '2.1.6',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/create_permission_MOD.js',
  },

  subtitle(data) {
    const target = [
      'Role Permissions',
      'Category Channel Permissions',
      'Text Channel Permissions',
      'Voice Channel Permissions',
    ];
    const variables = ['', 'Temp Variable', 'Server Variable', 'Global Variable'];
    return `For ${target[parseInt(data.targetType, 10)]} ${variables[parseInt(data.storage, 10)]} (${data.varName})`;
  },

  variableStorage(data, varType) {
    if (parseInt(data.storage, 10) !== varType) return;
    let dataType;
    switch (parseInt(data.targetType, 10)) {
      case 0:
        dataType = 'Role Permissions';
        break;
      case 1:
        dataType = 'Category Channel Permissions';
        break;
      case 2:
        dataType = 'Text Channel Permissions';
        break;
      case 3:
        dataType = 'Voice Channel Permissions';
        break;
    }
    return [data.varName, dataType];
  },

  fields: [
    'type',
    'targetType',
    'bitFields',
    'storage',
    'varName',
    'ADMINISTRATOR',
    'CREATE_INSTANT_INVITE',
    'KICK_MEMBERS',
    'BAN_MEMBERS',
    'MANAGE_CHANNELS',
    'MANAGE_GUILD',
    'ADD_REACTIONS',
    'VIEW_AUDIT_LOG',
    'PRIORITY_SPEAKER',
    'STREAM',
    'VIEW_CHANNEL',
    'SEND_MESSAGES',
    'SEND_TTS_MESSAGES',
    'MANAGE_MESSAGES',
    'EMBED_LINKS',
    'ATTACH_FILES',
    'READ_MESSAGE_HISTORY',
    'MENTION_EVERYONE',
    'USE_EXTERNAL_EMOJIS',
    'VIEW_GUILD_INSIGHT',
    'CONNECT',
    'SPEAK',
    'MUTE_MEMBERS',
    'DEAFEN_MEMBERS',
    'MOVE_MEMBERS',
    'USE_VAD',
    'CHANGE_NICKNAME',
    'MANAGE_NICKNAMES',
    'MANAGE_ROLES',
    'MANAGE_WEBHOOKS',
    'MANAGE_EMOJIS',
  ],

  html(_isEvent, data) {
    return `
<div style="width: 550px; height: 350px; overflow-y: scroll;">
  <div style="padding-top: 8px;">
    <div style="float: left; width: 35%; ">
      Apply Type:<br>
      <select id="type" class="round" onchange="glob.typeChange(this)">
        <option value="0" selected>Bit Fields</option>
        <option value="1">Check Box</option>
      </select>
    </div>
    <div style="padding-left: 5%; float: left; width: 60%;">
      Permission Type:<br>
      <select id="targetType" class="round" onchange="glob.targetChange(this)">
        <option value="0" selected>Role</option>
        <option value="1">Category Channel</option>
        <option value="2">Text Channel</option>
        <option value="3">Voice Channel</option>
      </select>
    </div>
  </div><br><br><br>
  <div style="padding-top: 8px;">
    <div id="bitfield" style="float: left; width: 80%;">
      Bit Fields:<br>
      <input id="bitFields" class="round" type="text"><br>
    </div>
  </div>
  <div style="padding-top: 8px;">
    <div id="checkbox" style="display: none; float: left; width: 80%;">
    </div>
  </div>
  <div style="padding-top: 8px;">
    <div style="float: left; width: 35%;">
      Store In:<br>
      <select id="storage" class="round">
        ${data.variables[1]}
      </select>
    </div>
    <div style="float: right; width: 60%;">
      Variable Name:<br>
      <input id="varName" class="round" type="text">
    </div>
  </div>
</div>`;
  },

  init() {
    const { glob, document } = this;
    const bitField = document.getElementById('bitfield');
    const checkbox = document.getElementById('checkbox');

    const permissionsName = {
      ADMINISTRATOR: 'Administrator',
      CREATE_INSTANT_INVITE: 'Create Invite',
      KICK_MEMBERS: 'Kick Members',
      BAN_MEMBERS: 'Ban Members',
      MANAGE_CHANNELS: 'Manage Channels',
      MANAGE_GUILD: 'Manage Server',
      ADD_REACTIONS: 'Add Reactions',
      VIEW_AUDIT_LOG: 'View Audit Log',
      PRIORITY_SPEAKER: 'Priority Speaker',
      STREAM: 'Video',
      VIEW_CHANNEL: 'View Channel',
      SEND_MESSAGES: 'Send Messages',
      SEND_TTS_MESSAGES: 'Send TTS Messages',
      MANAGE_MESSAGES: 'Manage Messages',
      EMBED_LINKS: 'Embed Links',
      ATTACH_FILES: 'Attach Files',
      READ_MESSAGE_HISTORY: 'Read Mesage History',
      MENTION_EVERYONE: 'Mention Everyone',
      USE_EXTERNAL_EMOJIS: 'Use External Emojis',
      CONNECT: 'Connect',
      SPEAK: 'Speak',
      MUTE_MEMBERS: 'Mute Members',
      DEAFEN_MEMBERS: 'Deafen Members',
      MOVE_MEMBERS: 'Move Members',
      USE_VAD: 'User Voice Activity',
      CHANGE_NICKNAME: 'Change Nickname',
      MANAGE_NICKNAMES: 'Manage Nicknames',
      MANAGE_ROLES: 'Manage Roles',
      MANAGE_WEBHOOKS: 'Manage Webhooks',
      MANAGE_EMOJIS: 'Manage Emojis',
    };
    const option1 = ['Default', 'Disallow', 'Allow'];
    const option2 = ['Default', 'Inherit', 'Allow', 'Disallow'];

    const rolePermissions = [
      'ADMINISTRATOR',
      'VIEW_AUDIT_LOG',
      'MANAGE_GUILD',
      'MANAGE_ROLES',
      'MANAGE_CHANNELS',
      'KICK_MEMBERS',
      'BAN_MEMBERS',
      'CREATE_INSTANT_INVITE',
      'CHANGE_NICKNAME',
      'MANAGE_NICKNAMES',
      'MANAGE_EMOJIS',
      'MANAGE_WEBHOOKS',
      'VIEW_CHANNEL',
      'SEND_MESSAGES',
      'SEND_TTS_MESSAGES',
      'MANAGE_MESSAGES',
      'EMBED_LINKS',
      'ATTACH_FILES',
      'READ_MESSAGE_HISTORY',
      'MENTION_EVERYONE',
      'USE_EXTERNAL_EMOJIS',
      'ADD_REACTIONS',
      'CONNECT',
      'SPEAK',
      'STREAM',
      'MUTE_MEMBERS',
      'DEAFEN_MEMBERS',
      'MOVE_MEMBERS',
      'USE_VAD',
      'PRIORITY_SPEAKER',
    ];
    const textPermissions = [
      'CREATE_INSTANT_INVITE',
      'MANAGE_CHANNELS',
      'MANAGE_WEBHOOKS',
      'VIEW_CHANNEL',
      'SEND_MESSAGES',
      'SEND_TTS_MESSAGES',
      'MANAGE_MESSAGES',
      'EMBED_LINKS',
      'ATTACH_FILES',
      'READ_MESSAGE_HISTORY',
      'MENTION_EVERYONE',
      'USE_EXTERNAL_EMOJIS',
      'ADD_REACTIONS',
    ];
    const voicePermissions = [
      'CREATE_INSTANT_INVITE',
      'MANAGE_CHANNELS',
      'MANAGE_WEBHOOKS',
      'VIEW_CHANNEL',
      'CONNECT',
      'SPEAK',
      'STREAM',
      'MUTE_MEMBERS',
      'DEAFEN_MEMBERS',
      'MOVE_MEMBERS',
      'USE_VAD',
      'PRIORITY_SPEAKER',
    ];
    const categoryPermissions = [
      'CREATE_INSTANT_INVITE',
      'MANAGE_CHANNELS',
      'MANAGE_WEBHOOKS',
      'VIEW_CHANNEL',
      'SEND_MESSAGES',
      'SEND_TTS_MESSAGES',
      'MANAGE_MESSAGES',
      'EMBED_LINKS',
      'ATTACH_FILES',
      'READ_MESSAGE_HISTORY',
      'MENTION_EVERYONE',
      'USE_EXTERNAL_EMOJIS',
      'ADD_REACTIONS',
      'CONNECT',
      'SPEAK',
      'STREAM',
      'MUTE_MEMBERS',
      'DEAFEN_MEMBERS',
      'MOVE_MEMBERS',
      'USE_VAD',
      'PRIORITY_SPEAKER',
    ];
    glob.typeChange = function typeChange(type) {
      switch (parseInt(type.value, 10)) {
        case 0:
          bitField.style.display = null;
          checkbox.style.display = 'none';
          break;
        case 1:
          bitField.style.display = 'none';
          checkbox.style.display = null;
          break;
      }
    };

    glob.targetChange = function targetChange(target) {
      switch (parseInt(target.value, 10)) {
        case 0:
          while (checkbox.firstChild) {
            checkbox.removeChild(checkbox.lastChild);
          }
          checkbox.innerHTML = '';
          rolePermissions.forEach((Permission) => {
            const dom = document.createElement('select');
            checkbox.innerHTML += `${permissionsName[Permission]}:<br>`;
            dom.id = Permission;
            dom.className = 'round';
            option1.forEach((option, index) => {
              const op = document.createElement('option');
              op.innerHTML = option;
              op.value = option;
              dom.add(op);
            });
            checkbox.appendChild(dom);
            checkbox.innerHTML += '<br>';
          });
          break;
        case 1:
          while (checkbox.firstChild) {
            checkbox.removeChild(checkbox.lastChild);
          }
          checkbox.innerHTML = '';
          categoryPermissions.forEach((Permission) => {
            const dom = document.createElement('select');
            checkbox.innerHTML += `${permissionsName[Permission]}:<br>`;
            dom.id = Permission;
            dom.className = 'round';
            option2.forEach((option, index) => {
              const op = document.createElement('option');
              op.innerHTML = option;
              op.value = option;
              dom.add(op);
            });
            checkbox.appendChild(dom);
            checkbox.innerHTML += '<br>';
          });
          break;
        case 2:
          while (checkbox.firstChild) {
            checkbox.removeChild(checkbox.lastChild);
          }
          checkbox.innerHTML = '';
          textPermissions.forEach((Permission) => {
            const dom = document.createElement('select');
            checkbox.innerHTML += `${permissionsName[Permission]}:<br>`;
            dom.id = Permission;
            dom.className = 'round';
            option2.forEach((option, index) => {
              const op = document.createElement('option');
              op.innerHTML = option;
              op.value = option;
              dom.add(op);
            });
            checkbox.appendChild(dom);
            checkbox.innerHTML += '<br>';
          });
          break;
        case 3:
          while (checkbox.firstChild) {
            checkbox.removeChild(checkbox.lastChild);
          }
          checkbox.innerHTML = '';
          voicePermissions.forEach((Permission) => {
            const dom = document.createElement('select');
            checkbox.innerHTML += `${permissionsName[Permission]}:<br>`;
            dom.id = Permission;
            dom.className = 'round';
            option2.forEach((option, index) => {
              const op = document.createElement('option');
              op.innerHTML = option;
              op.value = option;
              dom.add(op);
            });
            checkbox.appendChild(dom);
            checkbox.innerHTML += '<br>';
          });
          break;
      }
    };
    glob.targetChange(document.getElementById('targetType'));
    glob.typeChange(document.getElementById('type'));
  },

  async action(cache) {
    const data = cache.actions[cache.index];
    const type = parseInt(data.type, 10);
    const { Permissions } = this.getDBM().DiscordJS;
    let permissions = {};
    switch (type) {
      case 0: {
        permissions = new Permissions(this.evalMessage(data.bitFields, cache));
        break;
      }
      case 1: {
        const permsArray = [
          'ADMINISTRATOR',
          'CREATE_INSTANT_INVITE',
          'KICK_MEMBERS',
          'BAN_MEMBERS',
          'MANAGE_CHANNELS',
          'MANAGE_GUILD',
          'ADD_REACTIONS',
          'VIEW_AUDIT_LOG',
          'PRIORITY_SPEAKER',
          'STREAM',
          'VIEW_CHANNEL',
          'SEND_MESSAGES',
          'SEND_TTS_MESSAGES',
          'MANAGE_MESSAGES',
          'EMBED_LINKS',
          'ATTACH_FILES',
          'READ_MESSAGE_HISTORY',
          'MENTION_EVERYONE',
          'USE_EXTERNAL_EMOJIS',
          'CONNECT',
          'SPEAK',
          'MUTE_MEMBERS',
          'DEAFEN_MEMBERS',
          'MOVE_MEMBERS',
          'USE_VAD',
          'CHANGE_NICKNAME',
          'MANAGE_NICKNAMES',
          'MANAGE_ROLES',
          'MANAGE_WEBHOOKS',
          'MANAGE_EMOJIS',
        ];
        const allow = [];
        const disallow = [];
        const inherit = [];
        permsArray.forEach((perms) => {
          if (data[perms] === 'Allow') {
            allow.push(perms);
          } else if (data[perms] === 'Disallow') {
            disallow.push(perms);
          } else if (data[perms] === 'Inherit') {
            inherit.push(perms);
          }
        });
        if (allow.length !== 0) permissions.allow = new Permissions(allow);
        if (disallow.length !== 0) permissions.disallow = new Permissions(disallow);
        if (inherit.length !== 0) permissions.inherit = inherit;
        break;
      }
      default:
        break;
    }
    const storage = parseInt(data.storage, 10);
    const varName = this.evalMessage(data.varName, cache);
    this.storeValue(permissions, storage, varName, cache);
    this.callNextAction(cache);
  },

  mod() {},
};
