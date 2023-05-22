module.exports = {
  name: 'Skip Song',
  section: 'Audio Control',
  meta: {
    version: '2.1.7',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/skip_song_MOD.js',
  },
  requiresAudioLibraries: true,
  fields: [],

  subtitle() {
    return 'Skip current song';
  },

  html() {
    return `
    <div>
      <p>Skip the current song</p>
    </div>`;
  },

  init() {},

  async action(cache) {
    const { Bot } = this.getDBM();
    const server = cache.msg?.guildId ?? cache.interaction?.guildId;
    const queue = Bot.bot.player.getQueue(server);
    if (queue) queue.skip();
    this.callNextAction(cache);
  },

  mod() {},
};
