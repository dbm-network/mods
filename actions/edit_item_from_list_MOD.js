module.exports = {
  name: 'Edit Item from List MOD',
  displayName: 'Edit Item from List',
  section: 'Lists and Loops',
  meta: {
    version: '2.2.0',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/edit_item_from_list_MOD.js',
  },

  subtitle(data) {
    return `Edit "${data.value}" at position ${data.position}`;
  },

  fields: ['storage', 'varName', 'position', 'value'],

  html() {
    return `
<div>
  <retrieve-from-variable dropdownLabel="Source List" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></retrieve-from-variable>
</div>
<br><br><br>

<div style="padding-top: 8px">
  <div style="float: left; width: 35%;">
    <span class="dbminputlabel">Position</span>
    <input id="position" class="round" type="text">
  </div>
  <div style="float: right; width: 60%;">
    <span class="dbminputlabel">Value</span>
    <input id="value" class="round" type="text">
  </div>
</div>`;
  },

  init() {},

  async action(cache) {
    const data = cache.actions[cache.index];
    const storage = parseInt(data.storage, 10);
    const varName = this.evalMessage(data.varName, cache);
    const list = this.getVariable(storage, varName, cache);
    const position = parseInt(this.evalMessage(data.position, cache), 10);
    const val = this.evalMessage(data.value, cache);

    if (list.length > position) list[position] = val;

    this.callNextAction(cache);
  },

  mod() {},
};
