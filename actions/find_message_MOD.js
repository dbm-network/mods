module.exports = {
  name: 'Find Message',
  section: 'Messaging',
  meta: {
    version: '2.0.11',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/find_message_MOD.js',
  },

  subtitle(data) {
    const channels = [
      'Same Channel',
      'Mentioned Channel',
      '1st Server Channel',
      'Temp Variable',
      'Server Variable',
      'Global Variable',
    ];
    const info = ['Find by Content', 'Find by ID'];
    return `${channels[parseInt(data.channel, 10)]} - ${info[parseInt(data.info, 10)]}`;
  },

  variableStorage(data, varType) {
    if (parseInt(data.storage, 10) !== varType) return;
    return [data.varName2, 'Message'];
  },

  fields: ['channel', 'varName', 'info', 'search', 'storage', 'varName2'],

  html(isEvent, data) {
    return `
<div id ="wrexdiv" style="width: 550px; height: 350px; overflow-y: scroll;">
<div>
  <div style="float: left; width: 35%;">
    Source Channel:<br>
    <select id="channel" class="round" onchange="glob.channelChange(this, 'varNameContainer')">
      ${data.channels[isEvent ? 1 : 0]}
    </select>
  </div>
  <div id="varNameContainer" style="display: none; float: right; width: 60%;">
    Variable Name:<br>
    <input id="varName" class="round" type="text" list="variableList"><br>
  </div>
</div><br><br><br>
<div>
  <div style="float: left; width: 70%;">
    Find by:<br>
    <select id="info" class="round">
      <option value="0" selected>Find by Content</option>
      <option value="1">Find by ID</option>
    </select>
  </div><br><br><br>
  <div style="float: left; width: 70%;">
    Search for:<br>
    <input id="search" class="round" type="text"><br>
  </div>
</div><br>
<div>
  <div style="float: left; width: 35%;">
    Store In:<br>
    <select id="storage" class="round">
      ${data.variables[1]}
    </select>
  </div>
  <div id="varNameContainer2" style="float: right; width: 60%;">
    Variable Name:<br>
    <input id="varName2" class="round" type="text"><br>
  </div>
</div><br><br><br>
<div>
  <p>
  <u>Note:</u><br>
  This mod can only find messages by <b>content</b> within the last 100 messages.<br>
  If there are multiple messages with the same content, the bot is always using the oldest message (after start).
</div>`;
  },

  init() {
    const { glob, document } = this;
    glob.channelChange(document.getElementById('channel'), 'varNameContainer');
  },

  async action(cache) {
    const data = cache.actions[cache.index];
    const channel = parseInt(data.channel, 10);
    const varName = this.evalMessage(data.varName, cache);
    const info = parseInt(data.info, 10);
    const search = this.evalMessage(data.search, cache);
    const targetChannel = await this.getChannel(channel, varName, cache);
    const storage = parseInt(data.storage, 10);
    const varName2 = this.evalMessage(data.varName2, cache);

    if (!targetChannel) return this.callNextAction(cache);
    if (!search) {
      console.error('Error: Please input something to search for in the Find Message action.');
      return this.callNextAction(cache);
    }

    switch (info) {
      case 0:
        targetChannel.messages
          .fetch({ limit: 100 })
          .then((messages) => {
            const message = messages.find((el) => el.content.includes(search));
            if (message !== undefined) {
              this.storeValue(message, storage, varName2, cache);
            }
            this.callNextAction(cache);
          })
          .catch((err) => {
            console.error(err);
            this.callNextAction(cache);
          });
        break;
      case 1:
        targetChannel.messages
          .fetch(search)
          .then((message) => {
            if (message !== undefined) {
              this.storeValue(message, storage, varName2, cache);
            }
            this.callNextAction(cache);
          })
          .catch((err) => {
            console.error(err);
            this.callNextAction(cache);
          });
        break;
      default:
        this.callNextAction(cache);
    }
  },

  mod() {},
};
