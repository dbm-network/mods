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
    return `Read JSON file ${data.filepath} content ${data.contentTitle}`;
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
        <input id="filepath" class="round" type="text" placeholder="./data.json">
      </div>
      <div style="padding: 10px;">
        <span class="dbminputlabel">Title</span>
        <input id="title" class="round" type="text" placeholder="Title">
      </div>
      <div style="padding: 10px;">
        <span class="dbminputlabel">Content Title</span>
        <input id="contentTitle" class="round" type="text" placeholder="Content Title">
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

      // Split the contentTitle by '/' to handle nested content
      const contentKeys = contentTitle.split('/');
      let nestedContent = titleData;
      for (const key of contentKeys) {
        nestedContent = nestedContent[key];
        if (nestedContent === undefined) throw new Error(`Content Key '${key}' not found`);
      }
      result = nestedContent;
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
