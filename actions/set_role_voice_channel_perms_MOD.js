module.exports = {
  name: 'Set Role Voice Channel Perms',
  section: 'Channel Control',
  meta: {
    version: '2.1.6',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/set_role_voice_channel_perms_MOD.js',
  },

  subtitle(data, presets) {
    return `${presets.getVoiceChannelText(data.vchannel, data.varName)}`;
  },

  fields: ['vchannel', 'varName', 'role', 'varName2', 'permission', 'state'],

  html(_isEvent, data) {
    return `
      <div>
        <voice-channel-input
          dropdownLabel="Voice Channel"
          selectId="vchannel"
          variableContainerId="varNameContainer"
          variableInputId="varName"
          selectWidth="45%"
          variableInputWidth="50%"/>
      </div>
      <br><br><br>
      
      <div>
        <role-input
          dropdownLabel="Role"
          selectId="role"
          variableContainerId="varNameContainer2"
          variableInputId="varName2"
          selectWidth="45%"
          variableInputWidth="50%"/>
      </div>
      <br><br><br>
      
      <div style="padding-top: 8px;">
        <div style="float: left; width: 45%;">
        <span class="dbminputlabel">Permission</span><br>
          <select id="permission" class="round">
            ${data.permissions[1]}
          </select>
        </div>
        <div style="padding-left: 5%; float: left; width: 55%;">
        <span class="dbminputlabel">Change To</span><br>
          <select id="state" class="round">
            <option value="0" selected>Allow</option>
            <option value="1">Inherit</option>
            <option value="2">Disallow</option>
          </select>
        </div>
      </div>`;
  },

  init() {},

  async action(cache) {
    const data = cache.actions[cache.index];
    const channel = await this.getVoiceChannelFromData(data.vchannel, data.varName, cache);
    const role = await this.getRoleFromData(data.role, data.varName2, cache);
    const options = {};

    options[data.permission] = data.state === '0' ? true : data.state === '2' ? false : null;

    if (role?.id) {
      channel.permissionOverwrites
        .edit(role.id, options, { type: 0 })
        .then(() => this.callNextAction(cache))
        .catch((err) => this.displayError(data, cache, err));
    } else {
      this.callNextAction(cache);
    }
  },

  mod() {},
};
