module.exports = {
  name: 'Store User Info',
  section: 'User Control',
  meta: {
    version: '2.1.6',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/store_user_info_MOD.js',
  },

  subtitle(data) {
    const users = ['Mentioned User', 'Command Author', 'Temp Variable', 'Server Variable', 'Global Variable'];
    const info = [
      'Object',
      'ID',
      'Username',
      'Status',
      'Avatar URL',
      'Last Message',
      'Last Message ID',
      'Playing Status Name',
      'Custom Status',
      'Discriminator',
      'Tag',
      'Created At',
      'Created Timestamp',
      'Flags List',
      'Client Status',
    ];
    return `${users[parseInt(data.user, 10)]} - User ${info[parseInt(data.info, 10)]}`;
  },

  variableStorage(data, varType) {
    if (parseInt(data.storage, 10) !== varType) return;
    let dataType = 'Unknown Type';
    switch (parseInt(data.info, 10)) {
      case 0:
        dataType = 'User';
        break;
      case 1:
        dataType = 'User ID';
        break;
      case 2:
      case 3:
      case 5:
      case 7:
      case 8:
        dataType = 'Text';
        break;
      case 4:
        dataType = 'Image URL';
        break;
      case 6:
        dataType = 'Message ID';
        break;
      case 9:
        dataType = 'User Discriminator';
        break;
      case 10:
        dataType = 'User Tag';
        break;
      case 11:
        dataType = 'Date';
        break;
      case 12:
        dataType = 'Timestamp';
        break;
      case 13:
      case 14:
        dataType = 'List';
        break;
      default:
        break;
    }
    return [data.varName2, dataType];
  },

  fields: ['user', 'varName', 'info', 'storage', 'varName2'],

  html(isEvent, data) {
    return `
  <div>
  <member-input dropdownLabel="Source Member" selectId="user" variableContainerId="varNameContainer" variableInputId="varName"></member-input>
  </div>
  <br><br><br>

  <div>
    <div style="padding-top: 8px; width: 70%">
      Source Info:<br>
      <select id="info" class="round">
        <option value="0" selected>User Object</option>
        <option value="1">User ID</option>
        <option value="2">Username</option>
        <option value="3">User Status</option>
        <option value="4">User Avatar URL</option>
        <option value="5">User Last Message</option>
        <option value="6">User Last Message ID</option>
        <option value="7">User Playing Status Name</option>
        <option value="8">User Custom Status</option>
        <option value="9">User Discriminator</option>
        <option value="10">User Tag</option>
        <option value="11">User Created At</option>
        <option value="12">User Created Timestamp</option>
        <option value="13">User Flags List</option>
        <option value="14">User Client Status</option>'
      </select>
    </div>
  </div>
  <br>
  
  <div>
    <div style="float: left; width: 35%">
      Store In:<br>
      <select id="storage" class="round">
        ${data.variables[1]}
      </select>
    </div>
    <div id="varNameContainer2" style="float: right; width: 60%">
      Variable Name:<br>
      <input id="varName2" class="round" type="text"><br>
    </div>
  </div>`;
  },

  init() {},

  async action(cache) {
    const data = cache.actions[cache.index];
    const info = parseInt(data.info, 10);
    let user = await this.getMemberFromData(data.user, data.varName, cache);
    if (!user) return this.callNextAction(cache);
    if (user.user) user = user.user;

    let result;
    switch (info) {
      case 0: // User Object
        result = user;
        break;
      case 1: // User ID
        result = user.id;
        break;
      case 2: // Username
        result = user.username;
        break;
      case 3: // User Status
        if (user.presence?.status) {
          const { status } = user.presence;
          if (status === 'online') result = 'Online';
          else if (status === 'offline') result = 'Offline';
          else if (status === 'idle') result = 'Idle';
          else if (status === 'dnd') result = 'Do Not Disturb';
        }
        break;
      case 4: // User Avatar
        result = user.displayAvatarURL({
          dynamic: true,
          format: 'png',
          size: 4096,
        });
        break;
      case 5: // User last Message
        result = user.lastMessage;
        break;
      case 6: // User Last Message ID
        result = user.lastMessageID;
        break;
      case 7: // User Activities
        if (user.presence?.activities.length) {
          const status = user.presence.activities.find((s) => s.type !== 'CUSTOM_STATUS');
          result = status?.name;
        }
        break;
      case 8: // User Custom Status
        if (user.presence?.activities.length) {
          const status = user.presence.activities.find((s) => s.type === 'CUSTOM_STATUS');
          result = status?.state;
        }
        break;
      case 9: // User Discriminator
        result = user.discriminator;
        break;
      case 10: // User Tag
        result = user.tag;
        break;
      case 11: // User Created At
        result = user.createdAt;
        break;
      case 12: // User Created Timestamp
        result = user.createdTimestamp;
        break;
      case 13: {
        // User Flags
        const { flags } = user;
        result = flags && flags.toArray();
        break;
      }
      case 14: {
        // User Status
        const status = user.presence?.clientStatus;
        result = status && Object.keys(status);
        break;
      }
      default:
        break;
    }
    if (result !== undefined) {
      const storage = parseInt(data.storage, 10);
      const varName2 = this.evalMessage(data.varName2, cache);
      this.storeValue(result, storage, varName2, cache);
    }
    this.callNextAction(cache);
  },

  mod() {},
};
