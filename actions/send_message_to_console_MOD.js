module.exports = {
  name: 'Send Message to Console',
  section: 'Other Stuff',
  meta: {
    version: '2.0.11',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/send_message_to_console_MOD.js',
  },

  subtitle(data) {
    if (data.tosend.length > 0) {
      return `<font color="${data.color}">${data.tosend}</font>`;
    }
    return 'Please enter a message!';
  },

  fields: ['tosend', 'color'],

  html() {
    return `
<div>
  Color:<br>
  <input type="color" id="color" value="#f2f2f2">
</div><br>
<div style="padding-top: 8px;">
  Message to send:<br>
  <textarea id="tosend" rows="4" style="width: 99%; font-family: monospace; white-space: nowrap; resize: none;"></textarea>
</div>`;
  },

  init() {},

  async action(cache) {
    const { default: chalk } = await import('chalk');
    const data = cache.actions[cache.index];
    const send = this.evalMessage(data.tosend, cache);

    const color = this.evalMessage(data.color, cache);
    console.log(chalk.hex(color)(send));
    this.callNextAction(cache);
  },

  mod(DBM) {
    DBM.Actions['Send Message to Console (Logs)'] = DBM.Actions['Send Message to Console'];
  },
};
