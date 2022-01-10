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
    if (data.consoleMessage.length > 0) {
      return `${data.consoleMessage}`;
    }
    return 'Please enter a message!';
  },

  fields: ['consoleMessage'],

  html() {
    return `
      <div>
        <div style="padding: 8px;">
          Message to send:<br>
          <textarea id="consoleMessage" rows="16" style="width: 99%; font-family: monospace; white-space: nowrap; resize: none;"></textarea>
        </div>
      </div>`;
  },

  init() {},

  action(cache) {
    const data = cache.actions[cache.index];
    const send = this.evalMessage(data.consoleMessage, cache);

    console.log(send);
    this.callNextAction(cache);
  },

  mod(DBM) {
    DBM.Actions['Send Message to Console (Logs)'] = DBM.Actions['Send Message to Console'];
  },
};
