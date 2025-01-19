module.exports = {
  name: 'Store HTML From Webpage',
  section: 'HTML/XML Things',
  meta: {
    version: '2.1.7',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/store_html_from_webpage_MOD.js',
  },

  subtitle(data) {
    return `URL: ${data.url}`;
  },

  variableStorage(data, varType) {
    if (parseInt(data.storage, 10) !== varType) return;
    return [data.varName, 'HTML Webpage'];
  },

  fields: ['url', 'storage', 'varName'],

  html() {
    return `
  <div style="float: left; width: 100%">
    <div>
      <span class="dbminputlabel">Webpage URL</span>
      <textarea id="url" class="round" style="resize: none;" type="textarea" rows="4" cols="20"></textarea>
    </div>
    <br>

    <div style="padding-top: 8px;">
      <store-in-variable dropdownLabel="Store In" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></store-in-variable>
    </div>
  </div>`;
  },

  init() {},

  async action(cache) {
    const Mods = this.getMods();
    const fetch = Mods.require('node-fetch', '2');

    const data = cache.actions[cache.index];

    const varName = this.evalMessage(data.varName, cache);
    const storage = parseInt(data.storage, 10);

    let url = this.evalMessage(data.url, cache);

    if (!Mods.checkURL(url)) url = encodeURI(url);

    if (Mods.checkURL(url)) {
      try {
        const html = await fetch(url).then((r) => r.text());
        this.storeValue(html.trim(), storage, varName, cache);
        this.callNextAction(cache);
      } catch (err) {
        console.error(err);
      }
    } else {
      console.error(`HTML Parser - URL [${url}] Is Not Valid`);
    }
  },

  mod() {},
};
