module.exports = {
  name: 'Get Text From Image',

  section: 'Other Stuff',

  fields: ['image', 'langs', 'storage', 'debug', 'varName'],

  meta: {
    version: '3.0.0',
    preciseCheck: true,
    author: 'DBM Extended',
    authorUrl: 'https://github.com/DBM-Extended/mods',
    downloadURL: 'https://github.com/DBM-Extended/mods',
  },

  subtitle(data) {
    return `Take text from <b>${data.image}</b> and store in <b>${data.varName}</b>`;
  },

  variableStorage(data, varType) {
    if (parseInt(data.storage, 10) !== varType) return;
    return [data.varName, 'Text from image'];
  },

  html(data, isEvent) {
    return `
          <span class="dbminputlabel">Image link / File path</span><br>
           <input id="image" class="round" type="text" ><br>
           <span class="dbminputlabel">Languages</span><br>
           <input id="langs" class="round" placeholder="eng+rus" type="text" ><br>
           <span class="dbminputlabel">Show progress</span><br>
           <select id="debug" class="round" style="">
             <option value="0">Yes</option>
             <option value="1" selected>None</option>
           </select><br>
           <store-in-variable id="strvar" dropdownLabel="Save in" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></store-in-variable>
          `;
  },

  async init() {},

  async action(cache) {
    const data = cache.actions[cache.index];
    const image = this.evalMessage(data.image, cache);
    const langs = this.evalMessage(data.langs, cache);

    const { createWorker } = require('tesseract.js');

    const worker = createWorker({
      logger: (m) => {
        if (data.debug === '0') {
          console.log(`${m.status}: ${m.progress}`);
        }
      }, // Add logger here
    });

    (async () => {
      await worker.load();
      await worker.loadLanguage(langs);
      await worker.initialize(langs);
      await worker.recognize(image).then((text) => {
        this.storeValue(text.data.text, parseInt(data.storage, 10), data.varName, cache);
        this.callNextAction(cache);
      });
      await worker.terminate();
    })();
  },

  // (useless)
  mod() {},
};
