module.exports = {
  name: 'Check if JSON Title Exists',
  section: 'Json Data',
  meta: {
    version: '2.1.7',
    author: 'DBM Mods',
  },

  subtitle(data) {
    return `Check if JSON Title "${data.title}" exists in File Path "${data.filePath}"`;
  },

  fields: ['filePath', 'title', 'branch'],

  html(isEvent, data) {
    return `
<div>
  <span class="dbminputlabel">File Path</span>
  <input id="filePath" class="round" type="text">
</div>

<br><br><br>

<div>
  <span class="dbminputlabel">Title to Check</span>
  <input id="title" class="round" type="text">
</div>

<br><br><br>

<hr class="subtlebar">

<br>

<conditional-input id="branch" style="padding-top: 8px;"></conditional-input>`;
  },

  init() {},

  action(cache) {
    const data = cache.actions[cache.index];
    const filePath = this.evalMessage(data.filePath, cache);
    const titleToCheck = this.evalMessage(data.title, cache);
    let result = false;

    try {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const jsonData = JSON.parse(fileContent);

      if (jsonData && jsonData instanceof Object) {
        result = jsonData.hasOwnProperty(titleToCheck);
      }
    } catch (error) {
      console.error(`Error reading or parsing JSON file: ${error}`);
    }

    this.executeResults(result, data.branch ?? data, cache);
  },

  mod() {},
};