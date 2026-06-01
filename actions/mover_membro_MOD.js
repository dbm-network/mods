module.exports = {
  name: 'Mover membro',
  section: 'Other Stuff',
  meta: {
    version: '2.1.6',
    preciseCheck: true,
    author: 'DBM Extended',
    authorUrl: 'https://github.com/DBM-Extended/mods',
    downloadURL: 'https://github.com/DBM-Extended/mods',
  },

  subtitle(data, presets) {
    return `${presets.getMemberText(data.member, data.varName)}`;
  },

  fields: ['member', 'varName', 'channel', 'varName2'],

  html(isEvent, data) {
    return `
<member-input dropdownLabel="Membro" selectId="member" variableContainerId="varNameContainer" variableInputId="varName"></member-input>

<br><br><br><br>

<voice-channel-input dropdownLabel="Voice Channel" selectId="channel" variableContainerId="varNameContainer2" variableInputId="varName2" selectWidth="45%" variableInputWidth="50%"></voice-channel-input>

`;
  },

  init() {},

  async action(cache) {
    const data = cache.actions[cache.index];
    const member = await this.getMemberFromData(data.member, data.varName, cache);
    if (!member) {
      this.callNextAction(cache);
      return;
    }
    const targetChannel = await this.getVoiceChannelFromData(data.channel, data.varName2, cache);
    if (!targetChannel) {
      this.callNextAction(cache);
      return;
    }

    member.voice.setChannel(targetChannel.id).catch((err) => {
      console.log('ERROR');
      console.ERROR(err);
    });
    this.callNextAction(cache);
  },

  mod() {},
};
