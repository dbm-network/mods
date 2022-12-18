module.exports = {
  name: 'Set AFK Channel',
  section: 'Server Control',
  meta: {
    version: '2.1.6',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/set_afk_channel_MOD.js',
  },

  subtitle(data) {
    const channels = [
      "Command Author's Voice Ch.",
      "Mentioned User's Voice Ch.",
      'Default Voice Channel',
      'Temp Variable',
      'Server Variable',
      'Global Variable',
    ];
    return `${channels[parseInt(data.afkchannel, 10)]}`;
  },

  fields: ['server', 'varName', 'afkchannel', 'varNameChannel'],

  html() {
    return `
<server-input dropdownLabel="Source Server" selectId="server" variableContainerId="varNameContainer" variableInputId="varName"></server-input>
<br><br><br>

<voice-channel-input dropdownLabel="Set AFK Channel To:" selectId="afkchannel" variableContainerId="varNameContainerr" variableInputId="varNameChannel"></voice-channel-input>
`;
  },

  init() {},

  async action(cache) {
    const data = cache.actions[cache.index];
    const server = await this.getServerFromData(data.server, data.varName, cache);
    const channel = await this.getVoiceChannelFromData(data.afkchannel, data.varNameChannel, cache);

    if (!channel) return this.callNextAction(cache);

    if (Array.isArray(server)) {
      this.callListFunc(server, 'setAFKChannel', channel).then(() => {
        this.callNextAction(cache);
      });
    } else if (server && server.setAFKChannel) {
      server
        .setAFKChannel(channel)
        .then(() => {
          this.callNextAction(cache);
        })
        .catch(this.displayError.bind(this, data, cache));
    }
    this.callNextAction(cache);
  },

  mod() {},
};
