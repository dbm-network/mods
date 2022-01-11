module.exports = {
  name: 'Set Role Voice Channel Perms',
  section: 'Channel Control',
  meta: {
    version: '2.0.11',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/set_role_voice_channel_perms_MOD.js',
  },

  subtitle(data) {
    const names = [
      "Command Author's Voice Ch.",
      "Mentioned User's Voice Ch.",
      'Default Voice Channel',
      'Temp Variable',
      'Server Variable',
      'Global Variable',
    ];
    const index = parseInt(data.vchannel, 10);
    return index < 3 ? `${names[index]}` : `${names[index]} - ${data.varName}`;
  },

  fields: ['vchannel', 'varName', 'role', 'varName2', 'permission', 'state'],

  html(isEvent, data) {
    return `
<div>
  <div style="float: left; width: 35%;">
    Source Voice Channel:<br>
    <select id="vchannel" class="round" onchange="glob.voiceChannelChange(this, 'varNameContainer')">
      ${data.voiceChannels[isEvent ? 1 : 0]}
    </select>
  </div>
  <div id="varNameContainer" style="display: none; float: right; width: 60%;">
    Variable Name:<br>
    <input id="varName" class="round" type="text" list="variableList"><br>
  </div>
</div><br><br><br>
<div style="padding-top: 8px;">
  <div style="float: left; width: 35%;">
    Source Role:<br>
    <select id="role" name="second-list" class="round" onchange="glob.roleChange(this, 'varNameContainer2')">
      ${data.roles[isEvent ? 1 : 0]}
    </select>
  </div>
  <div id="varNameContainer2" style="display: none; float: right; width: 60%;">
    Variable Name:<br>
    <input id="varName2" class="round" type="text" list="variableList2"><br>
  </div>
</div><br><br><br>
<div style="padding-top: 8px;">
  <div style="float: left; width: 45%;">
    Permission:<br>
    <select id="permission" class="round">
      ${data.permissions[1]}
    </select>
  </div>
  <div style="padding-left: 5%; float: left; width: 55%;">
    Change To:<br>
    <select id="state" class="round">
      <option value="0" selected>Allow</option>
      <option value="1">Inherit</option>
      <option value="2">Disallow</option>
    </select>
  </div>
</div>`;
  },

  init() {
    const { glob, document } = this;

    glob.voiceChannelChange(document.getElementById('vchannel'), 'varNameContainer');
    glob.roleChange(document.getElementById('role'), 'varNameContainer2');
  },

  async action(cache) {
    const data = cache.actions[cache.index];
    const storage = parseInt(data.vchannel, 10);
    const varName = this.evalMessage(data.varName, cache);
    const channel = await this.getChannel(storage, varName, cache);
    const storage2 = parseInt(data.role, 10);
    const varName2 = this.evalMessage(data.varName2, cache);
    const role = await this.getRole(storage2, varName2, cache);
    const options = {};

    options[data.permission] = data.state === '0' ? true : data.state === '2' ? false : null;

    if (role && role.id) {
      if (channel?.permissionOverwrites.edit) {
        channel.permissionOverwrites
          .edit(role.id, options, { type: 0 })
          .then(() => {
            this.callNextAction(cache);
          })
          .catch(this.displayError.bind(this, data, cache));
      }
      this.callNextAction(cache);
    }
    this.callNextAction(cache);
  },

  mod() {},
};
