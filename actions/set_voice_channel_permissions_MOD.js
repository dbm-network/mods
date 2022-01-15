module.exports = {
  name: 'Set Voice Channel Perms',
  section: 'Channel Control',
  meta: {
    version: '2.0.11',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/set_voice_channel_permissions_MOD.js',
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
    const index = parseInt(data.storage, 10);
    return index < 3 ? `${names[index]}` : `${names[index]} - ${data.varName}`;
  },

  fields: ['storage', 'varName', 'permission', 'state'],

  html(isEvent, data) {
    return `
<div>
  <div style="float: left; width: 45%;">
    Source Voice Channel:<br>
    <select id="storage" class="round" onchange="glob.channelChange(this, 'varNameContainer')">
      ${data.voiceChannels[isEvent ? 1 : 0]}
    </select>
  </div>
  <div id="varNameContainer" style="padding-left: 5%; float: left; width: 55%;">
    Variable Name:<br>
    <input id="varName" class="round" type="text" list="variableList"><br>
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
      <option value="1">Disallow</option>
    </select>
  </div>
</div>`;
  },

  init() {
    const { glob, document } = this;
    glob.channelChange(document.getElementById('storage'), 'varNameContainer');
  },

  async action(cache) {
    const data = cache.actions[cache.index];
    const { server } = cache;
    const storage = parseInt(data.storage, 10);
    const varName = this.evalMessage(data.varName, cache);
    const channel = await this.getChannel(storage, varName, cache);

    if (!server) return this.callNextAction(cache);

    const options = {};
    options[data.permission] = Boolean(data.state === '0');
    if (Array.isArray(channel)) {
      this.callListFunc(channel, 'updateOverwrite', [server.id, options]).then(() => {
        this.callNextAction(cache);
      });
    } else if (channel && channel.updateOverwrite) {
      channel
        .updateOverwrite(server.id, options)
        .then(() => {
          this.callNextAction(cache);
        })
        .catch(this.displayError.bind(this, data, cache));
    }
    this.callNextAction(cache);
  },
  mod() {},
};
