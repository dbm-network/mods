module.exports = {
  name: 'Set Member Voice Channel Perms',
  section: 'Channel Control',
  meta: {
    version: '2.1.6',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/set_member_voice_channel_perms_MOD.js',
  },

  subtitle(data, presets) {
    return `${presets.getVoiceChannelText(data.vchannel, data.varName)}`;
  },

  fields: ['vchannel', 'varName', 'member', 'varName2', 'permission', 'state'],

  html(_isEvent, data) {
    return `
  <div>
    <voice-channel-input
      style="padding-top: 8px;"
      dropdownLabel="Source Voice Channel"
      selectId="vchannel"
      variableContainerId="varNameContainer2"
      variableInputId="varName"
      selectWidth="45%"
      variableInputWidth="50%"/><br><br><br>

    <member-input style="padding-top: 8px;"
      dropdownLabel="Source Member"
      selectId="member"
      variableContainerId="varNameContainer"
      variableInputId="varName2"
      selectWidth="45%"
      variableInputWidth="50%"/>
  </div><br><br><br>

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
    </div>`;
  },

  init() {
    const { glob, document } = this;
    glob.voiceChannelChange(document.getElementById('vchannel'), 'varNameContainer');
    glob.memberChange(document.getElementById('member'), 'varNameContainer2');
  },

  async action(cache) {
    const data = cache.actions[cache.index];
    const channel = await this.getVoiceChannelFromData(data.vchannel, data.varName, cache);
    const member = await this.getMemberFromData(data.member, data.varName2, cache);

    if (!member || !channel) return this.callNextAction(cache);

    const options = {};
    options[data.permission] = data.state === '0' ? true : data.state === '2' ? false : null;

    channel.permissionOverwrites
      .edit(member.id, options, { type: 1 })
      .then(() => this.callNextAction(cache))
      .catch((err) => this.displayError(data, cache, err));
  },

  mod() {},
};
