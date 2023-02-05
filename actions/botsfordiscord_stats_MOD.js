module.exports = {
  name: 'Send Stats to BFD',
  section: 'Other Stuff',
  meta: {
    version: '2.1.6',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/botsfordiscord_stats_MOD.js',
  },

  subtitle() {
    return 'Send server count to BFD!';
  },

  fields: ['BFDToken', 'ClientID', 'info'],

  html() {
    return `
<div>
  <p>
    <u>Send Server Stats To BFD</u><br>
    This will send your bot server count to Bots For Discord
  </p>
</div>
<div id="modinfo">
<div style="float: left; width: 99%; padding-top: 8px;">
  Your BFD token:<br>
  <input id="BFDToken" class="round" type="text"><br>
  Your bot ID:<br>
  <input id="ClientID" class="round" type="text">
  <br>Please make sure you don't put this action on a short interval - it can cause 429 (rate limit) errors!
</div><br>`;
  },

  init() {},

  async action(cache) {
    const data = cache.actions[cache.index];
    const token = this.evalMessage(data.BFDToken, cache);
    const clientid = this.evalMessage(data.ClientID, cache);
    const Mods = this.getMods();
    const BFD = Mods.require('bfd-api');
    const bfd = new BFD(token);
    bfd.postCount(this.getDBM().Bot.bot.guilds.cache.size, clientid);
    this.callNextAction(cache);
  },

  mod() {},
};
