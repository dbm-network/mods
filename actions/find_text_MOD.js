module.exports = {
  name: 'Find Text',
  section: 'Other Stuff',
  meta: {
    version: '2.0.11',
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

  html(_isEvent, data) {
    return `
<div style="float: left; width: 65%; padding-top: 8px;">
  Text to Find:
  <input id="wordtoFind" class="round" type="text">
</div>
<div style="float: left; width: 29%; padding-top: 8px;">
  Position:<br>
  <select id="position" class="round">
    <option value="0" selected>Position at Start</option>
    <option value="1">Position at End</option>
</select>
</div>
<div style="float: left; width: 99%; padding-top: 8px;">
  Source Text:
  <textarea id="text" rows="3" placeholder="Insert text here..." style="width: 95%; font-family: monospace; white-space: nowrap; resize: none;"></textarea>
</div>
<div style="float: left; width: 35%; padding-top: 8px;">
  Store Result In:<br>
  <select id="storage" class="round" onchange="glob.variableChange(this, 'varNameContainer')">
    ${data.variables[0]}
  </select>
</div>
<div id="varNameContainer" style="float: right; display: none; width: 60%; padding-top: 8px;">
  Variable Name:<br>
  <input id="varName" class="round" type="text" >
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

  init() {
    const { glob, document } = this;
    glob.variableChange(document.getElementById('storage'), 'varNameContainer');
  },

  async action(cache) {
    const data = cache.actions[cache.index];
    const text = this.evalMessage(data.text, cache);
    const wordToFind = this.evalMessage(data.wordtoFind, cache);
    const position = parseInt(data.position, 10);

    if (!wordToFind) return console.log('Find Text MOD: Text to find is missing!');
    if (!text) return console.log('Find Text MOD: Source text is missing!');
    if (!text.includes(wordToFind))
      console.log(
        `Find Text MOD: The requested text wasn't found in the source text!\nSource text: ${text}\nText to find: ${wordToFind}`,
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
