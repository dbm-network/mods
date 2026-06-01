module.exports = {
  name: 'Control Permissions',
  section: 'Permission Control',
  meta: {
    version: '2.1.7',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/control_permissons_MOD.js',
  },

  subtitle(data, presets) {
    return presets.getVariableText(data.storage, data.varName);
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

  html(isEvent, data) {
    return `
<div style="width: 550px; height: 350px; overflow-y: scroll;" tabindex="-1" onfocus="if(window.glob&&window.glob.controlPermsRebuild){window.glob.controlPermsRebuild();}">
  <div style="padding-top: 8px;">
    <div style="float: left; width: 35%;">
      <span class="dbminputlabel">Source Permissions</span><br>
      <select id="storage" class="round" onchange="if(window.glob&&window.glob.controlPermsRebuild){window.glob.controlPermsRebuild();}">
        ${data.variables[1]}
      </select>
    </div>
    <div style="float: right; width: 60%;">
      <span class="dbminputlabel">Variable Name</span><br>
      <input id="varName" class="round" type="text" list="variableList" oninput="if(window.glob&&window.glob.controlPermsRebuild){window.glob.controlPermsRebuild();}">
    </div>
  </div>
  <br><br><br>

  <div style="padding-top: 8px;">
    <div id="checkbox" style="float: left; width: 80%;">
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
    const options = ['Keep', 'Inherit', 'Allow', 'Disallow'];
    const options2 = ['Keep', 'Allow', 'Disallow'];
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

    function resolveDataType(doc) {
      const varNameEl = doc.getElementById('varName');
      const list = doc.getElementById('variableList');
      if (!varNameEl || !list || list.children.length === 0) {
        return 'All Permissions';
      }
      const { value } = varNameEl;
      for (let i = 0; i < list.children.length; i++) {
        if (value && list.children[i].value === value) {
          return list.children[i].innerHTML;
        }
      }
      return 'All Permissions';
    }

    glob.controlPermsRebuild = function controlPermsRebuild() {
      const doc = document;
      const checkbox = doc.getElementById('checkbox');
      const varNameEl = doc.getElementById('varName');
      if (!checkbox || !varNameEl) return;

      while (checkbox.firstChild) {
        checkbox.removeChild(checkbox.firstChild);
      }

      const dataType = resolveDataType(doc);
      const permKeys = permissionsList[dataType] || permissionsList['All Permissions'];
      const useRoleOptions = dataType === 'Role Permissions';
      const optionSet = useRoleOptions ? options2 : options;

      permKeys.forEach((permissionKey) => {
        const label = doc.createElement('div');
        label.style.marginTop = '4px';
        label.textContent = `${permissionsName[permissionKey] || permissionKey}:`;
        checkbox.appendChild(label);

        const dom = doc.createElement('select');
        dom.id = permissionKey;
        dom.className = 'round';
        optionSet.forEach((opt) => {
          const op = doc.createElement('option');
          op.textContent = opt;
          op.value = opt;
          dom.appendChild(op);
        });
        checkbox.appendChild(dom);

        const br = doc.createElement('br');
        checkbox.appendChild(br);
      });
    };

    setTimeout(() => {
      glob.controlPermsRebuild();
    }, 100);
  },

  async action(cache) {
    const data = cache.actions[cache.index];
    const { Permissions } = this.getDBM().DiscordJS;
    const storage = parseInt(data.storage, 10);
    const varName = this.evalMessage(data.varName, cache);
    let permissions = this.getVariable(storage, varName, cache);

    if (permissions === undefined || permissions === null) {
      this.displayError(
        data,
        cache,
        new Error(
          'Control Permissions: source variable is undefined. Set the variable before this action (e.g. Create Permissions / Store Channel Permissions) and ensure the name matches (dbm-network/mods#652).',
        ),
      );
      return;
    }

    try {
      if (typeof permissions === 'bigint' || (typeof permissions === 'number' && !Number.isNaN(permissions))) {
        permissions = { allow: new Permissions(permissions) };
      } else if (
        permissions &&
        typeof permissions === 'object' &&
        Object.prototype.hasOwnProperty.call(permissions, 'bitfield') &&
        permissions.allow === undefined &&
        permissions.disallow === undefined
      ) {
        const temp = permissions;
        permissions = { allow: temp };
      } else if (typeof permissions !== 'object') {
        this.displayError(
          data,
          cache,
          new Error('Control Permissions: source variable must be a permissions object or a bitfield value.'),
        );
        return;
      }
    } catch (err) {
      this.displayError(data, cache, err);
      return;
    }

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

    permsArray.forEach((perms) => {
      if (data[perms] === 'Allow') {
        if (!permissions.allow || !permissions.allow.has(perms)) {
          if (!permissions.allow) permissions.allow = new Permissions();
          permissions.allow.add(perms);
        }
        if (permissions.disallow && permissions.disallow.has(perms)) permissions.disallow.remove(perms);
        if (permissions.inherit && permissions.inherit.includes(perms))
          permissions.inherit.splice(permissions.inherit.indexOf(perms), 1);
      } else if (data[perms] === 'Disallow') {
        if (!permissions.disallow || !permissions.disallow.has(perms)) {
          if (!permissions.disallow) permissions.disallow = new Permissions();
          permissions.disallow.add(perms);
        }
        if (permissions.allow && permissions.allow.has(perms)) permissions.allow.remove(perms);
        if (permissions.inherit && permissions.inherit.includes(perms))
          permissions.inherit.splice(permissions.inherit.indexOf(perms), 1);
      } else if (data[perms] === 'Inherit') {
        if (!permissions.inherit || !permissions.inherit.includes(perms)) {
          if (!permissions.inherit) permissions.inherit = [];
          permissions.inherit.push(perms);
        }
        if (permissions.disallow && permissions.disallow.has(perms)) permissions.disallow.remove(perms);
        if (permissions.allow && permissions.allow.has(perms)) permissions.allow.remove(perms);
      }
    });
    this.storeValue(permissions, storage, varName, cache);
    this.callNextAction(cache);
  },

  mod() {},
};
