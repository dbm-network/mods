const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'JSON File Control',
  section: 'File Stuff',
  fields: ['filepath', 'action', 'title', 'contentTitle', 'contentText', 'newTitle', 'oldTitle', 'deleteContentTitle'],
  meta: {
    version: '2.1.7',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
  },

  subtitle(data) {
    return `Perform JSON operations on ${data.filepath}`;
  },

  html() {
    return `
    <div>
      <div style="padding: 10px;">
        <span class="dbminputlabel">File Path</span>
        <input id="filepath" class="round" type="text" placeholder="[EXAMPLE]: ./data.json">
      </div>
      <div style="padding: 10px;">
        <span class="dbminputlabel">Action</span>
        <select id="action" class="round" onchange="glob.onChangeAction(this)">
          <option value="addTitle" selected>Add Title</option>
          <option value="addContent">Add Content</option>
          <option value="renameContent">Rename Content</option>
          <option value="renameTitle">Rename Title</option>
          <option value="deleteContent">Delete Content</option>
          <option value="deleteTitle">Delete Title</option>
        </select>
      </div>
      <div id="titleSection" style="padding: 10px;">
        <span class="dbminputlabel">Title</span>
        <input id="title" class="round" type="text">
      </div>
      <div id="contentSection" style="padding: 10px; display: none;">
        <span class="dbminputlabel">Content Title</span>
        <input id="contentTitle" class="round" type="text" placeholder="Content Title (Use / to check content inside content)">
        <br>
        <span class="dbminputlabel">Content Text</span>
        <input id="contentText" class="round" type="text">
      </div>
      <div id="renameSection" style="padding: 10px; display: none;">
        <span class="dbminputlabel">Old Title</span>
        <input id="oldTitle" class="round" type="text">
        <br>
        <span class="dbminputlabel">New Title</span>
        <input id="newTitle" class="round" type="text">
      </div>
      <div id="deleteSection" style="padding: 10px; display: none;">
        <span class="dbminputlabel">Content Title to Delete</span>
        <input id="deleteContentTitle" class="round" type="text">
      </div>
    </div>
    `;
  },

  init() {
    const { glob, document } = this;

    glob.onChangeAction = function onChangeAction(event) {
      const value = event.value;
      document.getElementById('titleSection').style.display =
        value === 'addTitle' || value === 'addContent' || value === 'renameContent' ? 'block' : 'none';
      document.getElementById('contentSection').style.display = value === 'addContent' ? 'block' : 'none';
      document.getElementById('renameSection').style.display =
        value === 'renameContent' || value === 'renameTitle' ? 'block' : 'none';
      document.getElementById('deleteSection').style.display = value === 'deleteContent' ? 'block' : 'none';
    };

    glob.onChangeAction(document.getElementById('action'));
  },

  async action(cache) {
    const data = cache.actions[cache.index];
    let filepath = this.evalMessage(data.filepath, cache);

    if (filepath.startsWith('./')) {
      filepath = path.join(__dirname, '..', filepath.substring(2));
    }

    const action = data.action;
    const title = this.evalMessage(data.title, cache);
    const contentTitle = this.evalMessage(data.contentTitle, cache);
    const contentText = this.evalMessage(data.contentText, cache);
    const oldTitle = this.evalMessage(data.oldTitle, cache);
    const newTitle = this.evalMessage(data.newTitle, cache);
    const deleteContentTitle = this.evalMessage(data.deleteContentTitle, cache);

    // Load JSON file
    let jsonData;
    try {
      if (fs.existsSync(filepath)) {
        const fileData = fs.readFileSync(filepath);
        jsonData = JSON.parse(fileData);
      } else {
        jsonData = [];
      }
    } catch (error) {
      console.error(`Error reading JSON file: ${error}`);
      jsonData = [];
    }

    let target;

    switch (action) {
      case 'addTitle':
        if (title) {
          jsonData.push({ Title: title });
        }
        break;
      case 'addContent':
        target = jsonData.find((item) => item.Title === title);
        if (!target) {
          target = { Title: title };
          jsonData.push(target);
        }
        if (contentTitle.includes('/')) {
          const keys = contentTitle.split('/');
          keys.reduce(function addNestedContent(obj, key, index) {
            if (index === keys.length - 1) {
              obj[key] = isNaN(contentText) ? contentText : parseFloat(contentText);
            } else {
              obj[key] = obj[key] || {};
            }
            return obj[key];
          }, target);
        } else {
          target[contentTitle] = isNaN(contentText) ? contentText : parseFloat(contentText);
        }
        break;
      case 'renameContent':
        jsonData.forEach((item) => {
          if (item.Title === title && item[contentTitle]) {
            item[newTitle] = item[contentTitle];
            delete item[contentTitle];
          }
        });
        break;
      case 'renameTitle':
        jsonData.forEach((item) => {
          if (item.Title === oldTitle) {
            item.Title = newTitle;
          }
        });
        break;
      case 'deleteContent':
        jsonData.forEach((item) => {
          if (item.Title === title) {
            if (deleteContentTitle.includes('/')) {
              const keys = deleteContentTitle.split('/');
              keys.reduce(function deleteNestedContent(obj, key, index) {
                if (index === keys.length - 1) {
                  delete obj[key];
                } else {
                  return obj[key];
                }
                return obj;
              }, item);
            } else {
              delete item[deleteContentTitle];
            }
          }
        });
        break;
      case 'deleteTitle':
        jsonData = jsonData.filter((item) => item.Title !== title);
        break;
    }

    // Save JSON file
    try {
      fs.writeFileSync(filepath, JSON.stringify(jsonData, null, 2));
    } catch (error) {
      console.error(`Error writing JSON file: ${error}`);
    }

    this.callNextAction(cache);
  },

  mod() {},
};
