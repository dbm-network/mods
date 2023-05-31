module.exports = {
  name: 'Run Command in Console',
  section: 'Other Stuff',
  meta: {
    version: '2.1.7',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/run_command_in_console_MOD.js',
  },

  subtitle(data) {
    return `${data.varName} - Run Command in Console`;
  },

  fields: ['storage', 'varName', 'messageToSend'],

  html() {
    return `
<div>
  <p>
    Run a command in your console.<strong> THIS IS VERY DANGEROUS. SET THIS TO "BOT OWNER ONLY"</strong><br><br>
  </p>
</div>
<div>
  <span class="dbminputlabel">Command to run</span>
  <input id="messageToSend" class="round" type="text"><br>
</div>
<div>
  <store-in-variable dropdownLabel="Store In" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></store-in-variable>
</div>`;
  },

  init() {},

  async action(cache) {
    const data = cache.actions[cache.index];
    const messageToSend = this.evalMessage(data.messageToSend, cache);
    const response = require('child_process').execSync(messageToSend).toString();
    const storage = parseInt(data.storage, 10);
    const varName = this.evalMessage(data.varName, cache);

    if (response) this.storeValue(response, storage, varName, cache);
    this.callNextAction(cache);
  },

  mod() {},
};
