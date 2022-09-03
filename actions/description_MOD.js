module.exports = {
  name: 'Command Description',
  section: 'Other Stuff',
  meta: {
    version: '2.1.6',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/description_MOD.js',
  },

  subtitle() {
    return 'Command Description';
  },

  fields: ['description', 'restrictedTo'],

  html() {
    return `
<div width="540" height="360" overflow-y="scroll">
  <div style="padding-top: 8px;">
    Description:<br>
    <textarea id="description" rows="9" placeholder="Insert description here." style="width: 99%; font-family: monospace; white-space: nowrap; resize: none;"></textarea>
  </div><br>
  <div style="padding-top: 8px;">
    Restricted to:<br>
    <select id="restrictedTo" class="round">
      <option value="none" selected>Everybody</option>
      <option value="botOwner">Bot Owner</option>
    </select>
  </div>
</div>`;
  },

  init() {},

  async action(cache) {
    this.callNextAction(cache);
  },

  mod() {},
};
