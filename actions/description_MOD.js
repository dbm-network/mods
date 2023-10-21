module.exports = {
  name: 'Command Description',
  section: 'Other Stuff',
  meta: {
    version: '2.2.0',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/description_MOD.js',
  },

  subtitle() {
    return 'Command Description';
  },

  fields: ['description'],

  html() {
    return `
  <div style="padding-top: 8px;">
    <span class="dbminputlabel">Description</span>
    <textarea id="description" rows="9" placeholder="Insert description here."></textarea>
  </div>`;
  },

  init() {},

  async action(cache) {
    this.callNextAction(cache);
  },

  mod() {},
};
