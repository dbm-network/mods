module.exports = {
  name: 'Google Search',
  section: 'Other Stuff',
  meta: {
    version: '2.1.7',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/google_search_MOD.js',
  },

  subtitle(data) {
    const info = ['Title', 'URL', 'Snippet'];
    return `Google Result ${info[parseInt(data.info, 10)]}`;
  },

  variableStorage(data, varType) {
    if (parseInt(data.storage, 10) !== varType) return;
    let dataType = 'Unknown Google Type';
    switch (parseInt(data.info, 10)) {
      case 0:
        dataType = 'Google Result Title';
        break;
      case 1:
        dataType = 'Google Result URL';
        break;
      case 2:
        dataType = 'Google Result Snippet';
        break;
    }
    return [data.varName, dataType];
  },

  fields: ['string', 'info', 'resultNo', 'storage', 'varName'],

  html() {
    return `
  <div style="width: 95%; padding-top: 8px;">
    <span class="dbminputlabel">String(s) to Search on Google</span>
    <textarea id="string" rows="5" placeholder="Write something or use variables to Google search it..." style="width: 100%; font-family: monospace; white-space: nowrap; resize: none;"></textarea>
  </div><br>
<div style="float: left; width: 45%; padding-top: 8px;">
  <span class="dbminputlabel">Source Info</span>
  <select id="info" class="round">
    <option value="0">Result Title</option>
    <option value="1">Result URL</option>
    <option value="2">Result Snippet (Description)</option>
  </select>
</div>
<div style="float: left; width: 50%; padding-left: 10px; padding-top: 8px;">
  <span class="dbminputlabel">Result Number</span>
  <select id="resultNo" class="round">
    <option value="0">1st Result</option>
    <option value="1">2nd Result</option>
    <option value="2">3rd Result</option>
    <option value="3">4th Result</option>
    <option value="4">5th Result</option>
    <option value="5">6th Result</option>
    <option value="6">7th Result</option>
    <option value="7">8th Result</option>
    <option value="8">9th Result</option>
    <option value="9">10th Result</option>
  </select>
</div>
<br><br><br>

<div style="float: left; clear: both; width: 100%; padding-top: 8px;">
  <store-in-variable dropdownLabel="Store In" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></store-in-variable>
</div>`;
  },

  init() {},

  async action(cache) {
    const data = cache.actions[cache.index];
    const info = parseInt(data.info, 10);
    const string = this.evalMessage(data.string, cache).replace(/[\u{0080}-\u{FFFF}]/gu, ''); // The replace thing is very new, it's just replacing the invalid characters so command won't stuck when you use other languages.
    const resultNumber = parseInt(data.resultNo, 10);

    if (!string) return console.log('Please write something to Google it!');

    const Mods = this.getMods();
    const googleIt = Mods.require('google-it');

    googleIt({ query: `${string}`, 'no-display': 1, limit: 10 })
      .then((results) => {
        let result;
        switch (info) {
          case 0:
            result = results[resultNumber].title;
            break;
          case 1:
            result = results[resultNumber].link;
            break;
          case 2:
            result = results[resultNumber].snippet;
            break;
          default:
            break;
        }
        if (result !== undefined) {
          const storage = parseInt(data.storage, 10);
          const varName2 = this.evalMessage(data.varName, cache);
          this.storeValue(result, storage, varName2, cache);
          this.callNextAction(cache);
        } else {
          this.callNextAction(cache);
        }
      })
      .catch((e) => {
        console.log(`An error in Google Search MOD: ${e}`);
        this.callNextAction(cache);
      });
  },

  mod() {},
};
