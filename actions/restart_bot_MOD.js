/* eslint-disable no-undef */
module.exports = {
  name: 'Restart Bot',
  section: 'Bot Client Control',
  meta: {
    version: '2.1.7',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/restart_bot_MOD.js',
  },

  subtitle(data) {
    return `Restarts ${data.filename}`;
  },

  fields: ['filename'],

  html() {
    return `
<div style="float: left; width: 100%;">
  <span class="dbminputlabel">Bot File</span>
  <input id="filename" class="round" type="text" value="bot.js"><br>
</div>
<br>

<div>
  <p><u>NOTE:</u><br>
  Any action that is below this mod will not be executed!</p>
</div>`;
  },

  init() {},

  async action(cache) {
    const data = cache.actions[cache.index];
    const filename = this.evalMessage(data.filename, cache);
    this.getDBM().Bot.bot.destroy();
    const child = require('child_process');
    child.spawnSync('node', [filename], { cwd: process.cwd(), stdio: 'inherit' });
    process.exit();
  },

  mod() {},
};
