const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'Check JSON File',

  section: 'File Stuff',

  subtitle(data) {
    return `Check JSON file "${data.filepath}"`;
  },

  meta: {
    version: '2.1.7',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
  },

  fields: ['filepath', 'checkType', 'title', 'contentTitle', 'branch'],

  html() {
    return `
    <div style="padding: 10px;">
      <span class="dbminputlabel">File Path</span>
      <input id="filepath" class="round" type="text" placeholder="[EXAMPLE]: ./data.json">
    </div>
    <div style="padding: 10px;">
      <span class="dbminputlabel">Check Type</span><br>
      <select id="checkType" class="round" onchange="glob.onCheckTypeChanged(this)">
        <option value="0">Check if File is JSON Formatted</option>
        <option value="1">Check if Title Exists</option>
        <option value="2">Check if Content Exists Under Title</option>
      </select>
    </div>
    <div id="titleSection" style="padding: 10px; display: none;">
      <span class="dbminputlabel">Title</span>
      <input id="title" class="round" type="text" placeholder="Title">
    </div>
    <div id="contentTitleSection" style="padding: 10px; display: none;">
      <span class="dbminputlabel">Content Title</span>
      <input id="contentTitle" class="round" type="text" placeholder="Content Title (Use / to check content inside content)">
    </div>
    <conditional-input id="branch" style="padding-top: 8px;"></conditional-input>`;
  },

  init() {
    const { glob, document } = this;

    glob.onCheckTypeChanged = function handleCheckTypeChange(event) {
      const titleSection = document.getElementById('titleSection');
      const contentTitleSection = document.getElementById('contentTitleSection');
      switch (event.value) {
        case '0':
          titleSection.style.display = 'none';
          contentTitleSection.style.display = 'none';
          break;
        case '1':
          titleSection.style.display = null;
          contentTitleSection.style.display = 'none';
          break;
        case '2':
          titleSection.style.display = null;
          contentTitleSection.style.display = null;
          break;
      }
    };

    glob.onCheckTypeChanged(document.getElementById('checkType'));
  },

  async action(cache) {
    const data = cache.actions[cache.index];
    let filepath = this.evalMessage(data.filepath, cache);
    const checkType = parseInt(data.checkType, 10);
    const title = this.evalMessage(data.title, cache);
    const contentTitle = this.evalMessage(data.contentTitle, cache);

    if (filepath.startsWith('./')) {
      filepath = path.join(__dirname, '..', filepath.substring(2));
    }

    let jsonData;

    if (fs.existsSync(filepath)) {
      try {
        const fileData = fs.readFileSync(filepath);
        if (fileData.length === 0) throw new Error('JSON file is empty.');
        jsonData = JSON.parse(fileData);
      } catch (error) {
        console.error(`Error reading JSON file: ${error}`);
        this.executeResults(false, data.branch, cache);
        return;
      }
    } else {
      this.executeResults(false, data.branch, cache);
      return;
    }

    let result = false;

    try {
      switch (checkType) {
        case 0:
          result = true;
          break;
        case 1: {
          result = jsonData.some((item) => item.Title === title);
          break;
        }
        case 2: {
          const titleData = jsonData.find((item) => item.Title === title);
          if (!titleData) throw new Error('Title not found');
          const nestedTitles = contentTitle.split('/');
          let nestedData = titleData;
          for (const nestedTitle of nestedTitles) {
            if (!(nestedTitle in nestedData)) {
              throw new Error('Content title not found');
            }
            nestedData = nestedData[nestedTitle];
          }
          result = true;
          break;
        }
      }
    } catch (error) {
      console.error(`Error checking JSON data: ${error}`);
    }

    this.executeResults(result, data.branch, cache);
  },

  mod() {},
};
