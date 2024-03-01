module.exports = {
  name: 'Read JSON Data',
  section: 'Json Data',
  meta: {
    version: '2.1.8',
    author: 'Raikin',
  },

  subtitle(data) {
    return `Read JSON Data from "${data.filename}"`;
  },

  variableStorage(data, varType) {
    if (parseInt(data.storage, 10) !== varType) return;
    return [data.varName, 'String'];
  },

  fields: ['filename', 'title', 'contentTitle', 'storage', 'varName'],

  html() {
    return `
<div>
  <span class="dbminputlabel">File Path</span>
  <input id="filename" class="round" type="text">
</div>
<br><br>

<div>
  <span class="dbminputlabel">Title</span>
  <input id="title" class="round" type="text">
</div>
<br>

<div>
  <span class="dbminputlabel">Content Title</span>
  <input id="contentTitle" class="round" type="text">
</div>
<br>

<div>
  <store-in-variable dropdownLabel="Store In" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></store-in-variable>
</div>
`;
  },

  async action(cache) {
    const data = cache.actions[cache.index];
    const { readFileSync, existsSync } = require('fs');
    const path = this.evalMessage(data.filename, cache);
    const title = this.evalMessage(data.title, cache);
    const contentTitle = this.evalMessage(data.contentTitle, cache);
    const varName = this.evalMessage(data.varName, cache);

    try {
      if (path) {
        let jsonData = [];

        if (existsSync(path)) {
          const existingContent = readFileSync(path, 'utf8');

          try {
            jsonData = JSON.parse(existingContent);
          } catch (err) {
            console.error(`Error parsing existing JSON data: ${err}`);
          }
        }

        const entry = jsonData.find((item) => item.Title === title);

        if (entry && entry[contentTitle] !== undefined) {
          const content = entry[contentTitle];
          this.storeValue(content, parseInt(data.storage, 10), varName, cache);
        } else {
          console.warn(`Content not found for title "${title}" and content title "${contentTitle}"`);
          this.storeValue('', parseInt(data.storage, 10), varName, cache);
        }
      } else {
        console.log('File path is missing from Read JSON Data action!');
      }
    } catch (err) {
      console.error(`ERROR! ${err.stack || err}`);
    }

    this.callNextAction(cache);
  },

  mod() {},
};