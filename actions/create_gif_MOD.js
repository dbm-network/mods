module.exports = {
  name: 'Create GIF',
  section: 'Image Editing',
  meta: {
    version: '2.1.7',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/create_gif_MOD.js',
  },

  subtitle(data) {
    return `${data.url}`;
  },

  variableStorage(data, varType) {
    if (parseInt(data.storage, 10) !== varType) return;
    return [data.varName, 'GIF'];
  },

  fields: ['url', 'storage', 'varName'],

  html() {
    return `
<div>
  <span class="dbminputlabel">Local/Web URL</span>
  <input id="url" class="round" type="text" value="resources/" style="float: left; width: 504px;">
</div>
<br><br>

<div style="padding-top: 10px;">
  <store-in-variable dropdownLabel="Store In" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></store-in-variable>
</div>`;
  },

  init() {},

  async action(cache) {
    const data = cache.actions[cache.index];
    const obj = this.evalMessage(data.url, cache);

    let gif;
    if (!obj.startsWith('http')) {
      gif = this.getLocalFile(obj);
    } else {
      gif = obj;
    }

    if (!gif.includes('.gif')) return this.callNextAction(cache);

    const varName = this.evalMessage(data.varName, cache);
    const storage = parseInt(data.storage, 10);
    this.storeValue(gif, storage, varName, cache);
    this.callNextAction(cache);
  },

  mod() {},
};
