module.exports = {
  name: 'Write JSON Data',
  section: 'Json Data',
  meta: {
    version: '2.1.7',
    author: 'DBM Mods',
  },

  subtitle(data) {
    return `Write JSON Data to "${data.filename}"`;
  },

  fields: ['filename', 'title', 'contentTitle', 'contentText'],

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
  <input id="contentTitle" class="round" type="text" placeholder="Use / to nest content inside content">
</div>
<br>

<div>
  <span class="dbminputlabel">Content Text</span>
  <textarea id="contentText" rows="3" style="width: 95%; white-space: nowrap; resize: none;"></textarea>
</div>
`;
  },

  async action(cache) {
    const data = cache.actions[cache.index];
    const { writeFileSync, readFileSync, existsSync } = require('fs');
    const path = this.evalMessage(data.filename, cache);
    const title = this.evalMessage(data.title, cache);
    const contentTitle = this.evalMessage(data.contentTitle, cache);
    const contentText = this.evalMessage(data.contentText, cache);

    // Handle placeholder behavior
    if (contentTitle === "Use / to nest content inside content") {
      console.log('Please provide a valid content title');
      return;
    }

    try {
      // Rest of the code remains unchanged
      // ...
    } catch (err) {
      console.error(`ERROR! ${err.stack || err}`);
    }

    this.callNextAction(cache);
  },

  mod() {},
};
