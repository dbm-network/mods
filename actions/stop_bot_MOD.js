module.exports = {
  name: 'Stop Bot',
  section: 'Bot Client Control',
  meta: {
    version: '2.0.11',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/stop_bot_MOD.js',
  },

  subtitle() {
    return 'Stops bot';
  },

  fields: [],

  html() {
    return `
<div>
  <p>
    <u>Warning:</u><br>
    This action stops the bot. You cannot restart it with a command after this action is ran!<br>
    Choose the permissions for this command/event carefully!
  </p>
</div>`;
  },

  init() {},

  action() {
    console.log('Stopped bot!');
    this.getDBM().Bot.bot.destroy();
    process.exit();
  },

  mod() {},
};
