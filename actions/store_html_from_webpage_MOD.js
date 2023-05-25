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

  html(isEvent, data) {
    return `
  <div>
    <div style="float: left; width: 100%;">
      <span class="dbminputlabel">Webpage URL</span>
      <textarea id="url" class="round" style="resize: none;" type="textarea" rows="4" cols="20"></textarea>
    </div>
    <div style="float: left; width: 35%; padding-top: 16px;">
      <span class="dbminputlabel">Store In</span>
      <select id="storage" class="round" onchange="glob.variableChange(this, 'varNameContainer')">
        ${data.variables[1]}
      </select>
    </div>
    <div id="varNameContainer" style="float: right; width: 60%; padding-top: 16px;">
      <span class="dbminputlabel">Storage Variable Name</span>
      <input id="varName" class="round" type="text">
    </div>
  </div>`;
  },

  init() {
    const { glob, document } = this;

    glob.variableChange(document.getElementById('storage'), 'varNameContainer');
  },

  async action(cache) {
    const Mods = this.getMods();
    const fetch = Mods.require('node-fetch');

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
