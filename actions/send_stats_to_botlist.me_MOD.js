module.exports = {
  name: 'Sends Stats to Botlist.me',
  displayname: 'Sends Stats to Botlist.me',
  section: 'Other Stuff',
  meta: {
    version: '2.1.6',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/send_stats_to_botlist.me_MOD.js',
  },

  subtitle(data) {
    const info = ['Only Server Count', 'Shard & Server Count'];
    return `Send ${info[parseInt(data.info, 10)]} to Botlist.me!`;
  },

  fields: ['token', 'info'],

  html() {
    return `
  <div id="modinfo">
    <div style="float: left; width: 99%; padding-top: 8px;">
      Your Botlist.me Authorization Token:<br>
      <input id="token" class="round" type="text">
    </div><br>
    <div style="float: left; width: 90%; padding-top: 8px;">
      Info to Send:<br>
      <select id="info" class="round">
      <option value="0">Send Server Count Only</option>
      <option value="1">Send Shard & Server Count</option>
    </select><br>
    <p>
      • Do not send anything about shards if you don't shard your bot, otherwise it'll crash your bot!
    </p>
    </div>
  </div>`;
  },

  init() {},

  async action(cache) {
    const data = cache.actions[cache.index];
    const token = this.evalMessage(data.token, cache);
    const info = parseInt(data.info, 10);
    const Mods = this.getMods();
    const fetch = Mods.require('node-fetch');
    const client = this.getDBM().Bot.bot;

    const body = { server_count: client.guilds.cache.size };
    if (info === 1) body.shard_count = client.shard.count;

    const response = await fetch(`https://api.botlist.me/api/v1/bots/${client.user.id}/stats?from=DBM`, {
      body,
      headers: { authorization: token },
      method: 'POST',
    }).catch((err) => this.displayError(data, cache, err));
    if (response) {
      const res = await response.json();
      if (res.error) this.displayError(data, cache, res.error);
    }
    this.callNextAction(cache);
  },

  mod() {},
};
