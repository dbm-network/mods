module.exports = {
  name: 'Google Image Search',
  section: 'Other Stuff',
  meta: {
    version: '2.0.11',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/google_image_search_MOD.js',
  },

  subtitle(data) {
    const info = ['Title', 'URL', 'Snippet'];
    return `Google Image Result ${info[parseInt(data.info, 10)]}`;
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

  fields: ['string', 'apikey', 'clientid', 'info', 'resultNo', 'storage', 'varName'],

  html(_isEvent, data) {
    return `
<div style="height: 350px; width: 550px; overflow-y: scroll;">
  <div style="width: 95%; padding-top: 2px;">
    Google Image Search Text:<br />
    <textarea id="string" style="width: 100%; font-family: monospace; white-space: nowrap; resize: none;" rows="4" placeholder="Write something here or insert a variable..."></textarea>
  </div><br>
  <div style="float: left; width: 95%; padding-top: 2px;">
    API Key:<br />
    <input id="apikey" placeholder="xxxxxxxxxxxxxxxxxxxx-xxxxxxxxxxxxxxxxxxx" class="round" type="text" style="width: 100%;"/>
  </div><br>
  <div style="float: left; width: 95%; padding-right: 10px padding-top: 2px;">
    Client ID:<br />
    <input placeholder="000000000000000000000:aaaaaaaaaaa" id="clientid" class="round" type="text" style="width: 100%;"/>
  </div><br>
  <br />
  <div style="float: left; width: 45%; padding-top: 2px;">
    Result Info:<br />
    <select id="info" class="round">
      <option value="0">Result Title</option>
      <option value="1">Result URL</option>
      <option value="2">Result Thumbnail URL</option>
    </select>
  </div>
  <div style="float: left; width: 50%; padding-left: 10px; padding-top: 2px;">
    Result Number:<br />
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
      <option value="10">11th Result</option>
      <option value="11">12th Result</option>
    </select>
  </div><br /><br />
  <div style="float: left; width: 45%; padding-top: 8px;">
    Store In:<br />
    <select id="storage" class="round" onchange="glob.variableChange(this, 'varNameContainer')">
      ${data.variables[0]}
    </select>
  </div>
  <div id="varNameContainer" style="float: right; padding-right: 0px; width: 53%; padding-top: 8px;">
    Variable Name:<br />
    <input id="varName" class="round" type="text" />
  </div>
  <div style="text-align: left;"><br><br><br><br><br><br><br><br><br>
    https://github.com/RigidStudios/underground-rd/wiki/Google-Image-Search-Tutorial < Walkthrough
  </div>
</div>`;
  },

  init() {
    const { glob, document } = this;
    glob.variableChange(document.getElementById('storage'), 'varNameContainer');
  },

  async action(cache) {
    const data = cache.actions[cache.index];
    const info = parseInt(data.info, 10);
    const string = this.evalMessage(data.string, cache).replace(/[\u{0080}-\u{FFFF}]/gu, '');
    const resultNumber = parseInt(data.resultNo, 10);
    const clientid = this.evalMessage(data.clientid, cache);
    const apikey = this.evalMessage(data.apikey, cache);
    const index = parseInt(cache.index + 1, 10);

    if (!string)
      return console.error(
        `There was an error in Google Image Search MOD (#${index}): \nPlease write something to Google it!`,
      );
    if (!clientid)
      return console.error(`There was an error in Google Image Search MOD (#${index}): \nPlease provide a Client ID!`);
    if (!apikey)
      return console.error(`There was an error in Google Image Search MOD (#${index}): \nPlease provide an API Key`);

    const Mods = this.getMods();
    const ImgSearch = Mods.require('image-search-google');
    const imgClient = new ImgSearch(`${clientid}`, `${apikey}`);
    const options = { page: 1 };
    imgClient
      .search(string, options)
      .then((result) => {
        switch (info) {
          case 0:
            result = result[resultNumber].snippet;
            break;
          case 1:
            result = result[resultNumber].url;
            break;
          case 2:
            result = result[resultNumber].thumbnailLink;
            break;
          default:
            result = 'Check Console.';
            console.error(
              `There was an error in Google Image Search MOD (#${index}): \nDesired Search Type does not exist.`,
            );
            break;
        }
        if (result !== undefined) {
          const storage = parseInt(data.storage, 10);
          const varName2 = this.evalMessage(data.varName, cache);
          this.storeValue(result, storage, varName2, cache);
          this.callNextAction(cache);
        } else {
          console.error(`There was an error in Google Image Search MOD (#${cache.index}): \nNo Result was provided.`);
          this.callNextAction(cache);
        }
      })
      .catch((error) => {
        console.error(`There was an error in Google Image Search MOD (#${cache.index}): \n${error}`);
        this.callNextAction(cache);
      });
  },

  mod() {},
};
