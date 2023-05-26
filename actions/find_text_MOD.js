module.exports = {
  name: 'Find Text',
  section: 'Other Stuff',
  meta: {
    version: '2.1.7',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/find_text_MOD.js',
  },

  subtitle(data) {
    return `Find "${data.wordtoFind}"`;
  },

  variableStorage(data, varType) {
    if (parseInt(data.storage, 10) !== varType) return;
    return [data.varName, 'Number'];
  },
  fields: ['text', 'wordtoFind', 'position', 'storage', 'varName'],

  html() {
    return `
<div style="float: left; width: 65%; padding-top: 8px;">
  <span class="dbminputlabel">Text to Find</span>
  <input id="wordtoFind" class="round" type="text">
</div>

<div style="float: left; width: 29%; padding-top: 8px; padding-left: 1%;">
  <span class="dbminputlabel">Position</span>
  <select id="position" class="round">
    <option value="0" selected>Position at Start</option>
    <option value="1">Position at End</option>
  </select>
</div>
<div style="float: left; width: 99%; padding-top: 8px;">
  <span class="dbminputlabel">Source Text</span>
  <textarea id="text" rows="3" placeholder="Insert text here..." style="width: 95%; font-family: monospace; white-space: nowrap; resize: none;"></textarea>
</div>
<br><br><br>

<div style="float: left; display: flex; width: 99%; padding-top: 8px;">
  <store-in-variable dropdownLabel="Store In" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></store-in-variable>
</div>

<div style="float: left; width: 99%; padding-top: 8px;">
  <p>
  This action will output the position of the text depending of your choice.<br>
  If you choose <b>Position at End</b>, it will find the position of the last character of your text.<br>
  If you choose <b>Position at Start</b>, it will find the position of the first character of your text.
  <b>Example</b>: We search word "a" | <u>This is<b> *</b>a<b>- </b>test</u> | * is the start (8) | - is the end (9)
  </p>
</div>`;
  },

  init() {},

  async action(cache) {
    const data = cache.actions[cache.index];
    const text = this.evalMessage(data.text, cache);
    const wordToFind = this.evalMessage(data.wordtoFind, cache);
    const position = parseInt(data.position, 10);

    if (!wordToFind) return console.log('Find Text: Text to find is missing!');
    if (!text) return console.log('Find Text: Source text is missing!');
    if (!text.includes(wordToFind))
      console.log(
        `Find Text: The requested text wasn't found in the source text!\nSource text: ${text}\nText to find: ${wordToFind}`,
      );

    let result;
    switch (position) {
      case 0:
        result = text.indexOf(wordToFind);
        break;
      case 1:
        result = wordToFind.length + text.indexOf(wordToFind);
        break;
      default:
        break;
    }

    const storage = parseInt(data.storage, 10);
    const varName = this.evalMessage(data.varName, cache);
    this.storeValue(result, storage, varName, cache);
    this.callNextAction(cache);
  },

  mod() {},
};
