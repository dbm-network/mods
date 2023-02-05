module.exports = {
  name: 'RSS Feed Watcher',
  section: 'Other Stuff',
  meta: {
    version: '2.1.6',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/start_rss_feed_MOD.js',
  },

  subtitle(data) {
    return `${data.url}`;
  },

  variableStorage(data, varType) {
    if (parseInt(data.storage, 10) !== varType) return;
    return [data.varName, 'RSS Feed'];
  },

  fields: ['path', 'url', 'storage', 'varName'],

  html(_isEvent, data) {
    return `
<div style="padding-top: 8px;">
  <div style="float:left">
    <u>Note:</u>
    <b>This action will not stop watching the feed until bot restarts or using Stop RSS Feed Watcher action!</b>
  </div><br><br>
  <div style="float:left"><b>The next actions will be called on feed update!</b></div><br>
    <div>
      Local/Web URL:<br>
      <input id="url" class="round" type="text" placeholder="eg. https://github.com/dbm-mods.atom"><br>
    </div>
    <div>
      Json Path:<br>
      <input id="path" class="round" type="text" placeholder="Leave Blank if not needed."><br>
    </div>
    <div>
      <div style="float: left; width: 35%;">
        Store In:<br>
        <select id="storage" class="round">
          ${data.variables[1]}
        </select>
      </div>
      <div id="varNameContainer" style="float: right; width: 60%;">
        Variable Name:<br>
        <input id="varName" class="round" type="text"><br>
      </div>
    </div>
  </div>
</div>`;
  },

  init() {},

  async action(cache) {
    const data = cache.actions[cache.index];
    const url = this.evalMessage(data.url, cache);
    const varName = this.evalMessage(data.varName, cache);
    const storage = parseInt(data.storage, 10);
    const path = parseInt(data.path, 10);
    const { Actions } = this.getDBM();
    const stor = storage + varName;
    const Mods = this.getMods();
    const { JSONPath } = Mods.require('jsonpath-plus');
    const Watcher = Mods.require('feed-watcher');
    const feed = url;
    const interval = 10; // seconds

    // if not interval is passed, 60s would be set as default interval.
    const watcher = new Watcher(feed, interval);
    this.storeValue(watcher, storage, stor, cache);

    // Check for new entries every n seconds.
    watcher.on('new entries', (entries) => {
      entries.forEach((entry) => {
        if (path) {
          const res = JSONPath({
            path,
            json: entry,
          });
          Actions.storeValue(res, storage, varName, cache);
        } else if (!path) {
          Actions.storeValue(entry, storage, varName, cache);
        }
        Actions.callNextAction(cache);
      });
    });

    watcher
      .start()
      .then(() => {
        console.log('Starting watching...');
      })
      .catch(console.error);
  },

  mod() {},
};
