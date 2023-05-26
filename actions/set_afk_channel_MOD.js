module.exports = {
  name: 'Set AFK Channel',
  section: 'Server Control',
  meta: {
    version: '2.1.7',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/set_afk_channel_MOD.js',
  },

  subtitle(data, presets) {
    return presets.getChannelText(data.afkchannel, data.varName);
  },

  fields: ['server', 'varName', 'afkchannel', 'varNameChannel'],

  html() {
    return `
    <div>
      <server-input dropdownLabel="Source Server" selectId="server" variableContainerId="varNameContainer" variableInputId="varName"></server-input>
    </div>
    <br><br><br>

    <div>
      <voice-channel-input dropdownLabel="Set AFK Channel To:" selectId="afkchannel" variableContainerId="varNameContainerr" variableInputId="varNameChannel"></voice-channel-input>
    </div>
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
