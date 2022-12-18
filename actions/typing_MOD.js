module.exports = {
  name: 'Bot Typing',
  section: 'Bot Client Control',
  meta: {
    version: '2.1.6',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/typing_MOD.js',
  },

  subtitle(data, presets) {
    const names2 = ['Starts Typing', 'Stops Typing'];
    const index2 = parseInt(data.typing, 10);
    const index = parseInt(data.storage, 10);
    return index < 3
      ? `${presets.getChannelText(data.storage, data.varName)} - ${names2[index2]}`
      : `${presets.getChannelText(data.storage, data.varName)} - ${data.varName} - ${names2[index2]}`;
  },

  fields: ['storage', 'varName', 'typing'],

  html() {
    return `
<div>
  <div style="float: left; width: 35%;">
    Typing Option:<br>
    <select id="typing" class="round">
      <option value="0" selected>Start Typing</option>
      <option value="1">Stop Typing</option>
    </select>
  </div><br>
</div>
<br>
<br>

<channel-input dropdownLabel="Channel to start typing in:" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></channel-input>
<br><br><br>`;
  },

  init() {},

  async action(cache) {
    const data = cache.actions[cache.index];
    const channel = await this.getChannelFromData(data.storage, data.varName, cache);

    try {
      data.typing === '0' ? channel.startTyping() : channel.stopTyping();
    } catch (e) {
      console.error(`ERROR! ${e}${e.stack}`);
    }

    this.callNextAction(cache);
  },

  mod() {},
};
