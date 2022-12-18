module.exports = {
  name: 'Set Voice Channel Perms',
  section: 'Channel Control',
  meta: {
    version: '2.1.6',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/set_voice_channel_permissions_MOD.js',
  },

  subtitle(data, presets) {
    return `${presets.getVoiceChannelText(data.storage, data.varName)}`;
  },

  fields: ['storage', 'varName', 'permission', 'state'],

  html(_isEvent, data) {
    return `
      <div>
        <voice-channel-input
          dropdownLabel="Voice Channel"
          selectId="storage"
          variableContainerId="varNameContainer"
          variableInputId="varName"
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
            <option value="2">Inherit</option>
            <option value="1">Disallow</option>
          </select>
        </div>
      </div>
      <br><br><br><br>

      <span>
        Note: This modifies the everyone role in the voice channel only.
        In order to edit another roles permission use the Set Role Voice Channel Perms action.
      </span>`;
  },

  init() {},

  async action(cache) {
    const data = cache.actions[cache.index];
    const { server } = cache;
    const storage = parseInt(data.storage, 10);
    const varName = this.evalMessage(data.varName, cache);
    const channel = await this.getVoiceChannel(storage, varName, cache);

    if (!server) return this.callNextAction(cache);

    const options = {};
    options[data.permission] = data.state === '0' ? true : data.state === '1' ? false : null;
    channel.permissionOverwrites
      // providing the server id is the same as providing the everyone role id;
      .edit(server.id, options, { type: 0 })
      .then(() => this.callNextAction(cache))
      .catch((err) => this.displayError(data, cache, err));
  },
  mod() {},
};
