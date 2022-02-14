module.exports = {
  name: 'Check Permissions',
  section: 'Permission Control',
  meta: {
    version: '2.0.11',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/check_permissions_MOD.js',
  },

  subtitle(data) {
    const variables = ['', 'Temp Variable', 'Server Variable', 'Global Variable'];
    return `For ${variables[parseInt(data.storage, 10)]} (${data.varName})`;
  },

  variableStorage(data, varType) {
    if (parseInt(data.storage2, 10) !== varType) return;
    return [data.varName2, 'Array of Permissions'];
  },

  fields: [
    'storage',
    'varName',
    'storage2',
    'varName2',
    'iftrue',
    'iftrueVal',
    'iffalse',
    'iffalseVal',
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
    <div id="checkbox" style="float: left; width: 80%;">
    </div>
  </div>
  <div id="conditions" style="padding-top: 8px;">
    ${data.conditions[0]}
  </div><br><br><br>
  <div style="padding-top: 8px;">
    <div style="float: left; width: 35%;">
      Missing Permissions:<br>
      <select id="storage2" class="round" onchange="glob.variableChange(this, 'varNameContainer')">
        ${data.variables[0]}
      </select>
    </div>
    <div id="varNameContainer" style="float: right; width: 60%;">
      Variable Name:<br>
      <input id="varName2" class="round" type="text">
    </div>
  </div>
</div>`;
  },

  init() {
    const { glob, document } = this;

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
    const options = ['Not Check', 'Allow', 'Disallow', 'Inherit'];
    const options2 = ['Not Check', 'Allow', 'Disallow'];
    const allPermissions = [
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
    const permissionsList = {
      'All Permissions': allPermissions,
      'Role Permissions': rolePermissions,
      'Category Channel Permissions': categoryPermissions,
      'Text Channel Permissions': textPermissions,
      'Voice Channel Permissions': voicePermissions,
    };

    const varName = document.getElementById('varName');
    const list = document.getElementById('variableList');
    const checkbox = document.getElementById('checkbox');
    const conditions = document.getElementById('conditions');

    varName.oninput = function oninput() {
      if (list.children.length === 0) return;
      let dataType;
      for (let i = 0; i < list.children.length; i++) {
        if (list.children[i].value === varName.value) {
          dataType = list.children[i].innerHTML;
          break;
        }
      }
      if (!dataType) dataType = 'All Permissions';
      checkbox.innerHTML = '';
      permissionsList[dataType].forEach((Permission) => {
        const dom = document.createElement('select');
        checkbox.innerHTML += `${permissionsName[Permission]}:<br>`;
        dom.id = Permission;
        dom.className = 'round';
        let option = options;
        if (dataType === 'Role Permissions') option = options2;
        option.forEach((option) => {
          const op = document.createElement('option');
          op.innerHTML = option;
          op.value = option;
          dom.add(op);
        });
        checkbox.appendChild(dom);
        checkbox.innerHTML += '<br>';
      });
      conditions.style['padding-top'] = `${permissionsList[dataType].length * 66}px`;
    };

    let dataType;
    if (list.children.length !== 0) {
      for (let i = 0; i < list.children.length; i++) {
        if (list.children[i].value === varName.value) {
          dataType = list.children[i].innerHTML;
          break;
        }
      }
    }
    if (!dataType) dataType = 'All Permissions';
    checkbox.innerHTML = '';
    permissionsList[dataType].forEach((Permission) => {
      const dom = document.createElement('select');
      checkbox.innerHTML += `${permissionsName[Permission]}:<br>`;
      dom.id = Permission;
      dom.className = 'round';
      options.forEach((option) => {
        const op = document.createElement('option');
        op.innerHTML = option;
        op.value = option;
        dom.add(op);
      });
      checkbox.appendChild(dom);
      checkbox.innerHTML += '<br>';
    });
    conditions.style['padding-top'] = `${permissionsList[dataType].length * 66}px`;

    glob.variableChange(document.getElementById('storage2'), 'varNameContainer');
    glob.refreshVariableList(document.getElementById('storage'));

    const option = document.createElement('OPTION');
    option.value = '4';
    option.text = 'Jump to Anchor';
    const iffalse = document.getElementById('iffalse');
    if (iffalse.length === 4) iffalse.add(option);

    const option2 = document.createElement('OPTION');
    option2.value = '4';
    option2.text = 'Jump to Anchor';
    const iftrue = document.getElementById('iftrue');
    if (iftrue.length === 4) iftrue.add(option2);

    glob.onChangeTrue = function onChangeTrue(event) {
      switch (parseInt(event.value, 10)) {
        case 0:
        case 1:
          document.getElementById('iftrueContainer').style.display = 'none';
          break;
        case 2:
          document.getElementById('iftrueName').innerHTML = 'Action Number';
          document.getElementById('iftrueContainer').style.display = null;
          break;
        case 3:
          document.getElementById('iftrueName').innerHTML = 'Number of Actions to Skip';
          document.getElementById('iftrueContainer').style.display = null;
          break;
        case 4:
          document.getElementById('iftrueName').innerHTML = 'Anchor ID';
          document.getElementById('iftrueContainer').style.display = null;
          break;
        default:
          break;
      }
    };
    glob.onChangeFalse = function onChangeFalse(event) {
      switch (parseInt(event.value, 10)) {
        case 0:
        case 1:
          document.getElementById('iffalseContainer').style.display = 'none';
          break;
        case 2:
          document.getElementById('iffalseName').innerHTML = 'Action Number';
          document.getElementById('iffalseContainer').style.display = null;
          break;
        case 3:
          document.getElementById('iffalseName').innerHTML = 'Number of Actions to Skip';
          document.getElementById('iffalseContainer').style.display = null;
          break;
        case 4:
          document.getElementById('iffalseName').innerHTML = 'Anchor ID';
          document.getElementById('iffalseContainer').style.display = null;
          break;
        default:
          break;
      }
    };
    glob.onChangeTrue(document.getElementById('iftrue'));
    glob.onChangeFalse(document.getElementById('iffalse'));
  },

  async action(cache) {
    const data = cache.actions[cache.index];
    const storage = parseInt(data.storage, 10);
    const varName = this.evalMessage(data.varName, cache);
    const permissions = this.getVariable(storage, varName, cache);
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
    const yes = [];
    const no = [];

    permsArray.forEach((perms) => {
      if (data[perms] === 'Allow') {
        permissions.allow.has(perms) ? yes.push(perms) : no.push(perms);
      } else if (data[perms] === 'Disallow') {
        permissions.disallow.has(perms) ? yes.push(perms) : no.push(perms);
      } else if (data[perms] === 'Inherit') {
        permissions.allow.has(perms) || permissions.disallow.has(perms) ? no.push(perms) : yes.push(perms);
      }
    });

    const storage2 = parseInt(data.storage2, 10);
    const varName2 = this.evalMessage(data.varName2, cache);
    if (storage2 && varName2 && no.length !== 0) this.storeValue(no, storage2, varName2, cache);

    this.executeResults(no.length <= 0, data, cache);
  },

  mod() {},
};
