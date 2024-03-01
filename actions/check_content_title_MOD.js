module.exports = {
  name: 'Check if JSON Content Title Exists',
  section: 'Json Data',
  meta: {
    version: '2.1.7',
    author: 'DBM Mods',
  },

  subtitle(data) {
    return `Check if Content Title "${data.contentTitle}" exists in Title "${data.title}" of JSON File "${data.filePath}"`;
  },

  fields: ['filePath', 'title', 'contentTitle', 'branch'],

  html(isEvent, data) {
    return `
<div>
  <span class="dbminputlabel">JSON File Path</span>
  <input id="filePath" class="round" type="text">
</div>

<br>

<div>
  <span class="dbminputlabel">Title to Check</span>
  <input id="title" class="round" type="text">
</div>

<br>

<div>
  <span class="dbminputlabel">Content Title to Check</span>
  <input id="contentTitle" class="round" type="text">
</div>

<br><br>

<hr class="subtlebar" style="margin-top: 8px; margin-bottom: 8px;">

<br>

<conditional-input id="branch" style="padding-top: 8px;"></conditional-input>`;
  },

  init() {},

  action(cache) {
    const data = cache.actions[cache.index];
    const filePath = this.evalMessage(data.filePath, cache);
    const titleToCheck = this.evalMessage(data.title, cache);
    const contentTitleToCheck = this.evalMessage(data.contentTitle, cache);

    let jsonData;
    try {
      jsonData = require(filePath);
    } catch (error) {
      console.error(`Error reading JSON file: ${error.message}`);
    }

    let result = false;

    if (jsonData && jsonData[titleToCheck] && this.checkNestedContent(jsonData[titleToCheck], contentTitleToCheck)) {
      result = true;
    }

    this.executeResults(result, data.branch ?? data, cache);
  },

  checkNestedContent(obj, contentTitle) {
    const titles = contentTitle.split('/');
    let currentObj = obj;

    for (const title of titles) {
      if (!currentObj.hasOwnProperty(title)) {
        return false;
      }
      currentObj = currentObj[title];
    }

    return true;
  },

  modInit(data) {
    this.prepareActions(data.branch?.iftrueActions);
    this.prepareActions(data.branch?.iffalseActions);
  },

  mod() {},
};
