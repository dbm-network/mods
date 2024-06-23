const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'Read JSON File',
  section: 'File Stuff',
  fields: ['filepath', 'title', 'contentTitle', 'storage', 'varName'],
  meta: {
    version: '2.1.7',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
  },

  subtitle(data) {
    return `Read JSON file "${data.filepath}"`;
  },

  variableStorage(data, varType) {
    if (parseInt(data.storage, 10) !== varType) return;
    return [data.varName, 'Unknown'];
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
        <input id="title" class="round" type="text" placeholder="Title">
      </div>
      <div style="padding: 10px;">
        <span class="dbminputlabel">Content Title</span>
        <input id="contentTitle" class="round" type="text" placeholder="Content Title (Use / to check content inside content)">
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
    const contentTitle = this.evalMessage(data.contentTitle, cache);
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
      const titleData = jsonData.find((item) => item.Title === title);
      if (!titleData) throw new Error('Title not found');

      if (contentTitle && contentTitle.includes('/')) {
        const contentKeys = contentTitle.split('/');
        let nestedValue = titleData;
        for (const key of contentKeys) {
          if (nestedValue[key] !== undefined) {
            nestedValue = nestedValue[key];
          } else {
            throw new Error(`Content key '${key}' not found`);
          }
        }
        result = nestedValue;
      } else {
        if (titleData[contentTitle] === undefined) throw new Error('Content Title not found');
        result = titleData[contentTitle];
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
