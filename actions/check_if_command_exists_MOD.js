module.exports = {
  name: 'Check If Command Exists',
  section: 'Conditions',
  meta: {
    version: '2.1.7',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/check_if_command_exists_MOD.js',
  },

  subtitle(data, presets) {
    return `${presets.getConditionsText(data)}`;
  },

  fields: ['commandName', 'branch'],

  html() {
    return `
<div style="width: 45%">
  <span class="dbminputlabel">Command Name</span>
  <input id="commandName" type="text" class="round">
</div>
<br>

<conditional-input id="branch" style="padding-top: 8px;"></conditional-input>`;
  },

  init() {},

  async action(cache) {
    const data = cache.actions[cache.index];
    const fs = require('fs');
    const jp = this.getMods().require('jsonpath');

    let commandName = this.evalMessage(data.commandName, cache);

    if (commandName.startsWith(cache.server.tag)) {
      commandName = commandName.slice(cache.server.tag.length).split(/ +/).shift();
    } else if (commandName.startsWith(this.getDBM().Files.data.settings.tag)) {
      commandName = commandName.slice(this.getDBM().Files.data.settings.tag.length).split(/ +/).shift();
    }

    const commandsFile = JSON.parse(fs.readFileSync('./data/commands.json', 'utf-8'));
    const commands = jp.query(commandsFile, '$[*].name');
    const commandsAliases = jp.query(commandsFile, '$[*]._aliases');

    if (commandName === '')
      return console.log("Please put something in 'Command Name' in the 'Check If Command Exists' action...");

    const check = commands.indexOf(commandName);
    const check2 = commandsAliases.indexOf(commandName);
    const result = !check !== -1 || check2 !== -1;

    this.executeResults(result, data?.branch ?? data, cache);
  },

  modInit(data) {
    this.prepareActions(data.branch?.iftrueActions);
    this.prepareActions(data.branch?.iffalseActions);
  },

  mod() {},
};
