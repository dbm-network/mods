const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'Pick Random JSON Item',
  section: 'File Stuff',
  fields: ['filepath', 'title', 'storage', 'varName'],
  meta: {
    version: '2.1.7',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
  },

  subtitle(data) {
    return `Pick random item from JSON file "${data.filepath}"`;
  },

  variableStorage(data, varType) {
    if (parseInt(data.storage, 10) !== varType) return;
    return [data.varName, 'Text'];
  },

  html() {
    return `
    <div>
      <div style="padding: 10px;">
        <span class="dbminputlabel">File Path</span>
        <input id="filepath" class="round" type="text" placeholder="[EXAMPLE]: ./data.json">
      </div>
      <div style="padding: 10px;">
        <span class="dbminputlabel">Title</span>
        <input id="title" class="round" type="text" placeholder="Title (optional)">
      </div>
      <div style="padding: 10px;">
        <store-in-variable dropdownLabel="Store Result In" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></store-in-variable>
      </div>
    </div>
    `;
  },

  init() {},

  async action(cache) {
    const data = cache.actions[cache.index];
    let filepath = this.evalMessage(data.filepath, cache);
    const title = this.evalMessage(data.title, cache);
    const storage = parseInt(data.storage, 10);
    const varName = this.evalMessage(data.varName, cache);

    if (filepath.startsWith('./')) {
      filepath = path.join(__dirname, '..', filepath.substring(2));
    }

    let jsonData;

    try {
      if (fs.existsSync(filepath)) {
        const fileData = fs.readFileSync(filepath);
        if (fileData.length === 0) {
          console.warn('JSON file is empty.');
          this.storeValue(undefined, storage, varName, cache);
          return this.callNextAction(cache);
        }
        jsonData = JSON.parse(fileData);
      } else {
        throw new Error('File does not exist');
      }
    } catch (error) {
      console.error(`Error reading JSON file: ${error}`);
      this.storeValue(undefined, storage, varName, cache);
      return this.callNextAction(cache);
    }

    let result;

    try {
      if (title) {
        const titleData = jsonData.find((item) => item.Title === title);
        if (!titleData) throw new Error('Title not found');

        const keys = Object.keys(titleData).filter((key) => key !== 'Title');
        if (keys.length === 0) throw new Error('No items found under specified title');

        const randomKey = keys[Math.floor(Math.random() * keys.length)];
        result = randomKey;
      } else {
        const items = jsonData.flatMap((item) => Object.keys(item).filter((key) => key !== 'Title'));
        if (items.length === 0) throw new Error('No items found in JSON');

        const randomItem = items[Math.floor(Math.random() * items.length)];
        result = randomItem;
      }
    } catch (error) {
      console.error(`Error accessing data: ${error}`);
      this.storeValue(undefined, storage, varName, cache);
      return this.callNextAction(cache);
    }

    this.storeValue(result, storage, varName, cache);
    this.callNextAction(cache);
  },

  mod() {},
};
