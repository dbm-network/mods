module.exports = {
  name: 'Command Description',
  section: 'Other Stuff',
  meta: {
    version: '2.1.7',
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
<div width="540" height="360" overflow-y="scroll">
  <div style="padding-top: 8px;">
    <span class="dbminputlabel">Description</span>
    <textarea id="description" rows="9" placeholder="Insert description here." style="width: 99%; font-family: monospace; white-space: nowrap; resize: none;"></textarea>
  </div>
</div>`;
  },

  init() {},

  async action(cache) {
    this.callNextAction(cache);
  },

  mod() {},
};
