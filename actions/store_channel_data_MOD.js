module.exports = {
  name: 'Store Channel Data',
  section: 'Data',

  subtitle(data, presets) {
    return `${presets.getChannelText(data.channel, data.varName)} -> ${presets.getVariableText(
      data.storage,
      data.varName2,
    )}`;
  },

  variableStorage(data, varType) {
    const type = parseInt(data.storage, 10);
    if (type !== varType) return;
    return [data.varName2, 'Unknown Type'];
  },

  meta: {
    version: '2.2.0',
    preciseCheck: true,
    author: 'Shadow',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadUrl: 'https://github.com/dbm-network/mods',
  },

  fields: ['channel', 'varName', 'dataName', 'defaultVal', 'storage', 'varName2'],

  html(isEvent, data) {
    return `
    <channel-input dropdownLabel="Channel" selectId="channel" variableContainerId="varNameContainer" variableInputId="varName"></channel-input>
  
    <br><br><br>
  
    <div style="padding-top: 8px;">
      <div style="float: left; width: calc(35% - 12px);">
        <span class="dbminputlabel">Data Name</span><br>
        <input id="dataName" class="round" type="text">
      </div>
      <div style="float: right; width: calc(65% - 12px);">
        <span class="dbminputlabel">Default Value (if data doesn't exist)</span><br>
        <input id="defaultVal" class="round" type="text" value="0">
      </div>
    </div>
  
    <br><br><br>
  
    <store-in-variable style="padding-top: 8px;" dropdownLabel="Store In" selectId="storage" variableContainerId="varNameContainer2" variableInputId="varName2"></store-in-variable>`;
  },

  init() {},

  async action(cache) {
    const data = cache.actions[cache.index];
    const channel = await this.getChannelFromData(data.channel, data.varName, cache);
    if (!channel) return this.callNextAction(cache);

    const dataName = this.evalMessage(data.dataName, cache);
    const defVal = this.eval(this.evalMessage(data.defaultVal, cache), cache);

    const fs = require('fs');
    const path = require('path');
    const filePath = path.join(__dirname, '..', 'data', 'channels.json');

    let fileData = {};
    if (fs.existsSync(filePath)) {
      fileData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }

    const id = channel.id;
    fileData[id] ??= {};
    const result = fileData[id][dataName] !== undefined ? fileData[id][dataName] : defVal ?? 0;

    const storage = parseInt(data.storage, 10);
    const varName2 = this.evalMessage(data.varName2, cache);
    this.storeValue(result, storage, varName2, cache);

    this.callNextAction(cache);
  },

  mod() {},
};
