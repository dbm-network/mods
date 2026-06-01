module.exports = {
  name: 'Loop Queue',
  section: 'Audio Control',
  requiresAudioLibraries: true,
  meta: {
    version: '2.1.6',
    preciseCheck: true,
    author: 'DBM Extended',
    authorUrl: 'https://github.com/DBM-Extended/mods',
    downloadURL: 'https://github.com/DBM-Extended/mods',
  },

  subtitle(data) {
    const actions = ['Loop Whole Queue', 'Loop Current Item'];
    return `${actions[parseInt(data.loop, 10)]}`;
  },

  fields: ['server', 'varName', 'status', 'loop'],

  html() {
    return `
    <server-input dropdownLabel="Source Server" selectId="server" variableContainerId="varNameContainer" variableInputId="varName"></server-input>

<br><br><br>

<div style="float: left; width: 45%; padding-top: 8px;">
  Loop Setting:<br>
  <select id="status" class="round" onchange="glob.onChange(this)">
    <option value="0" selected>Enable</option>
    <option value="1">Disable</option>
  </select>
</div>
<div style="float: right; width: 50%; padding-top: 8px;">
  Loop Operation:<br>
  <select id="loop" class="round">
    <option value="0" selected>Loop Whole Queue</option>
    <option value="1">Loop Current Item</option>
  </select><br>
</div>
<div style="float: left; width: 100%; padding-top: 8px;">
  <p>
    Please put the Welcome action into a Bot Initialization event to be able to store the current song!
  </p>
</div>`;
  },

  init() {},

  async action(cache) {
    const data = cache.actions[cache.index];
    const { Audio } = this.getDBM();
    const targetServer = await this.getServerFromData(data.server, data.varName, cache);
    if (!targetServer) {
      return this.callNextAction(cache);
    }

    const status = parseInt(data.status, 10);
    const loop = parseInt(data.loop, 10);

    switch (status) {
      case 0: // Enable
        switch (loop) {
          case 0: // Loop Queue
            Audio.loopQueue[targetServer.id] = true;
            break;
          case 1: // Loop Item
            Audio.loopItem[targetServer.id] = true;
            break;
          default:
            break;
        }
        break;
      case 1: // Disable
        switch (loop) {
          case 0: // Loop Queue
            Audio.loopQueue[targetServer.id] = false;
            break;
          case 1: // Loop Item
            Audio.loopItem[targetServer.id] = false;
            break;
          default:
            break;
        }
        break;
      default:
        break;
    }

    this.callNextAction(cache);
  },

  mod() {},
};
