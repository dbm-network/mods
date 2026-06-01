module.exports = {
  name: 'Control Channel Data',
  section: 'Data',

  subtitle(data, presets) {
    let symbol = '=';
    if (data.changeType === '1') symbol = '+=';
    else if (data.changeType === '2') symbol = '-=';
    return `${presets.getChannelText(data.channel, data.varName)} (${data.dataName}) ${symbol} ${data.value}`;
  },

  meta: {
    version: '2.2.0',
    preciseCheck: true,
    author: 'Shadow',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadUrl: 'https://github.com/dbm-network/mods',
  },

  fields: ['channel', 'varName', 'dataName', 'changeType', 'value'],

  html(isEvent, data) {
    return `
    <channel-input dropdownLabel="Channel" selectId="channel" variableContainerId="varNameContainer" variableInputId="varName"></channel-input>
    
    <br><br><br>
    
    <div style="padding-top: 8px;">
      <div style="float: left; width: calc(50% - 12px);">
        <span class="dbminputlabel">Data Name</span><br>
        <input id="dataName" class="round" type="text">
      </div>
      <div style="float: right; width: calc(50% - 12px);">
        <span class="dbminputlabel">Control Type</span><br>
        <select id="changeType" class="round">
          <option value="0" selected>Set Value</option>
          <option value="1">Add Value</option>
          <option value="2">Subtract Value</option>
        </select>
      </div>
    </div>
    
    <br><br><br>
    
    <div style="padding-top: 8px;">
      <span class="dbminputlabel">Value</span><br>
      <input id="value" class="round" type="text" name="is-eval"><br>
    </div>`;
  },

  init() {},

  async action(cache) {
    const data = cache.actions[cache.index];
    const channel = await this.getChannelFromData(data.channel, data.varName, cache);
    if (!channel) return this.callNextAction(cache);

    const dataName = this.evalMessage(data.dataName, cache);
    const changeType = data.changeType;
    let val = this.evalMessage(data.value, cache);

    try {
      val = this.eval(val, cache);
    } catch (e) {
      this.displayError(data, cache, e);
    }

    if (isNaN(val)) return this.callNextAction(cache);

    const fs = require('fs');
    const path = require('path');
    const folderPath = path.join(process.cwd(), 'data');
    const filePath = path.join(folderPath, 'channels.json');

    if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath);

    let fileData = {};
    if (fs.existsSync(filePath)) {
      fileData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }

    const id = channel.id;
    fileData[id] ??= {};
    const current = Number(fileData[id][dataName]) || 0;

    switch (changeType) {
      case '1': // Add
        fileData[id][dataName] = current + Number(val);
        break;
      case '2': // Subtract
        fileData[id][dataName] = current - Number(val);
        break;
      default: // Set
        fileData[id][dataName] = Number(val);
    }

    fs.writeFileSync(filePath, JSON.stringify(fileData, null, 2));
    this.callNextAction(cache);
  },

  mod() {},
};
