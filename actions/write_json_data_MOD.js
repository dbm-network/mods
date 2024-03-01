module.exports = {
  name: 'Write JSON Data',
  section: 'Json Data',
  meta: {
    version: '2.1.8',
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
  <input id="contentTitle" class="round" type="text">
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

    try {
      if (path) {
        let jsonData = [];

        // Check if the file already exists
        if (existsSync(path)) {
          // Read existing content
          const existingContent = readFileSync(path, 'utf8');

          try {
            // Parse existing JSON data
            jsonData = JSON.parse(existingContent);
          } catch (err) {
            console.error(`Error parsing existing JSON data: ${err}`);
          }
        }

        // Find the entry with the specified title
        const entry = jsonData.find((item) => item.Title === title);

        // If the contentTitle already exists, replace it
        if (contentTitle.includes('/')) {
          const nestedTitles = contentTitle.split('/');
          let currentContent = entry || jsonData;

          for (let i = 0; i < nestedTitles.length; i++) {
            const nestedTitle = nestedTitles[i];

            if (i === nestedTitles.length - 1) {
              currentContent[nestedTitle] = contentText;
            } else {
              currentContent[nestedTitle] = currentContent[nestedTitle] || {};
              currentContent = currentContent[nestedTitle];
            }
          }
        } else {
          // If the title doesn't exist, create a new entry
          const newEntry = {
            Title: title,
          };

          newEntry[contentTitle] = contentText;

          // Push the new entry to JSON data
          jsonData.push(newEntry);
        }

        // Write the updated JSON data back to the file
        writeFileSync(path, JSON.stringify(jsonData, null, 2), 'utf8');
      } else {
        console.log('File path is missing from Write JSON Data action!');
      }
    } catch (err) {
      console.error(`ERROR! ${err.stack || err}`);
    }

    this.callNextAction(cache);
  },

  mod() {},
};