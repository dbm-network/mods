module.exports = {
  name: 'Auto Help',
  section: 'Other Stuff',
  meta: {
    version: '2.1.6',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/auto_help_MOD.js',
  },

  subtitle(data) {
    return `Included? ${data.Include} | ${data.Category}: ${data.Description}`;
  },

  fields: ['Category', 'Description', 'Include'],

  html() {
    return `
<div>
  <p>
    <u>Mod Info:</u><br>
    This will add an additional field to your raw data for use in an automatic help command<br>
    <a href="https://www.silversunset.net/paste/raw/230" target="_blank">This RAW DATA</a> is <b>required</b> to use this mod.<br>
  </p>
</div><br>
<div style="float: left; width: 99%;">
  Category:
  <input id="Category" class="round" type="text" style="width:99%"><br>
  Description:
  <textarea id="Description" rows="3" placeholder="Insert description here..." style="width: 99%; font-family: monospace; white-space: nowrap; resize: none;"></textarea><br>
  Include in Auto Help:
  <select style="width:33%;" id="Include" class="round">
    <option value="Yes">Yes</option>
    <option value="No">No</option>
  </select>
</div>`;
  },

  init() {
    const { glob, document } = this;

    glob.sendTargetChange(document.getElementById('Category'), 'varNameContainer');
    glob.sendTargetChange(document.getElementById('Description'), 'varNameContainer');
    glob.sendTargetChange(document.getElementById('Include'), 'varNameContainer');
  },

  async action(cache) {
    this.callNextAction(cache);
  },

  mod() {},
};
