module.exports = {
  name: 'Stop RSS Feed Watcher',
  section: 'Other Stuff',
  meta: {
    version: '2.1.7',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/stop_rss_feed_MOD.js',
  },

  subtitle(data) {
    return `${data.url}`;
  },

  fields: ['storage', 'varName'],

  html() {
    return `
<div>
  <store-in-variable dropdownLabel="RSS Feed Source" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></store-in-variable>
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
