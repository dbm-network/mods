module.exports = {
  name: 'Send Message to Console',
  section: 'Other Stuff',

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

  action(cache) {
    const Mods = this.getMods();
    const chalk = Mods.require('chalk');
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
