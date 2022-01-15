module.exports = {
  name: 'Stop RSS Feed Watcher',
  section: 'Other Stuff',
  meta: {
    version: '2.0.11',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/stop_rss_feed_MOD.js',
  },

  subtitle(data) {
    return `${data.url}`;
  },

  fields: ['storage', 'varName'],

  html(isEvent, data) {
    return `
<div>
  <div style="float: left; width: 35%;">
    RSS Feed Source:<br>
    <select id="storage" class="round" onchange="glob.refreshVariableList(this)">
      ${data.variables[1]}
    </select>
  </div>
  <div id="varNameContainer" style="float: right; width: 60%;">
    Variable Name:<br>
    <input id="varName" class="round" type="text" list="variableList"><br>
  </div>
</div>`;
  },

  init() {},

  async action(cache) {
    const data = cache.actions[cache.index];
    const varName = this.evalMessage(data.varName, cache);
    const storage = parseInt(data.storage, 10);
    const stor = storage + varName;
    const res = this.getVariable(storage, stor, cache);

    res.stop();

    this.callNextAction(cache);
  },

  mod() {},
};
