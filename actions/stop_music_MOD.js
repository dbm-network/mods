module.exports = {
  name: 'Stop Music',
  section: 'Audio Control',
  meta: {
    version: '2.1.7',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/stop_music_MOD.js',
  },
  requiresAudioLibraries: true,

  subtitle() {
    return 'Stop music and clear queue';
  },

  fields: [],

  html() {
    return `
    <div>
      <p>This action stops the music and clears the queue.</p>
    </div>`;
  },

  init() {},

  async action(cache) {
    const { Bot } = this.getDBM();
    const server = cache.msg?.guildId ?? cache.interaction?.guildId;
    const queue = Bot.bot.player.getQueue(server);
    if (queue) queue.destroy();
    this.callNextAction(cache);
  },

  mod() {},
};
