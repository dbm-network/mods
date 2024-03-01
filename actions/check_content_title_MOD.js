module.exports = {
  name: 'Check if JSON Title Exists',
  section: 'Json Data',
  meta: {
    version: '2.1.8',
    author: 'DBM Mods',
  },

  subtitle(data) {
    return `Check if JSON File Title "${data.title}" exists in File "${data.filePath}"`;
  },

  fields: ['filePath', 'title', 'branch'],

  html(isEvent, data) {
    return `
<div>
  <span class="dbminputlabel">JSON File Path</span>
  <input id="filePath" class="round" type="text">
</div>

<br><br><br>

<div>
  <span class="dbminputlabel">Title to Check</span>
  <input id="title" class="round" type="text">
</div>

<br><br><br><br>

<hr class="subtlebar">

<br>

<conditional-input id="branch" style="padding-top: 8px;"></conditional-input>`;
  },

  init() {},

  action(cache) {
    const data = cache.actions[cache.index];
    const filePath = this.evalMessage(data.filePath, cache);
    const titleToCheck = this.evalMessage(data.title, cache);

    let jsonData;
    try {
      jsonData = require(filePath);
    } catch (error) {
      console.error(`Error reading JSON file: ${error.message}`);
    }

    let result = false;

    if (jsonData && jsonData instanceof Object) {
      result = jsonData.hasOwnProperty(titleToCheck);
    }

    this.executeResults(result, data.branch ?? data, cache);
  },

  modInit(data) {
    this.prepareActions(data.branch?.iftrueActions);
    this.prepareActions(data.branch?.iffalseActions);
  },

  mod() {},
};