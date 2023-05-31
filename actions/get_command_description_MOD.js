module.exports = {
  name: 'Get Command Description',
  displayName: 'Get Command Description',
  section: 'Other Stuff',
  fields: ['findBy', 'commandData', 'saveTo', 'varName'],
  meta: {
    version: '2.1.7',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/get_command_description_MOD.js',
  },

  subtitle() {
    return 'Get Command Description';
  },

  html() {
    return `
<div width="540" style="height: auto;" overflow-y="scroll">
  <div style="float: left; width: 35%;">
    <span class="dbminputlabel">Find By</span>
    <select id="findBy" class="round">
      <option value="id">Command ID</option>
      <option value="name">Command Name</option>
    </select>
  </div>
  <div style="float: right; width: 60%;">
    <span class="dbminputlabel">Value</span>
    <input type="text" id="commandData" class="round" placeholder="Value"></input>
  </div>
  <br><br><br>
  
  <store-in-variable dropdownLabel="Store In" selectId="saveTo" variableContainerId="varNameContainer" variableInputId="varName"></store-in-variable>
</div>`;
  },

  init() {},

  async action(cache) {
    const data = cache.actions[cache.index];
    const { findBy } = data;
    const type = parseInt(data.saveTo, 10);
    const saveToName = this.evalMessage(data.varName, cache);
    const findByValue = this.evalMessage(data.commandData, cache);

    const { Files, Actions } = this.getDBM();
    const { commands } = Files.data;

    if (findBy === 'id') {
      let cmd;

      for (let i = 0; i < commands.length; i++) {
        cmd = commands[i];
        if (!cmd) {
          continue;
        }
        if (cmd && cmd._id === findByValue) {
          for (let j = 0; j < cmd.actions.length; j++) {
            const action = cmd.actions[j];
            if (action.name === 'Command Description') {
              Actions.storeValue(action.description, type, saveToName, cache);
              Actions.callNextAction(cache);
              return;
            }
            console.log(action.name);
          }
        }
      }

      this.callNextAction(cache);
    } else if (findBy === 'name') {
      let cmd;

      for (let i = 0; i < commands.length; i++) {
        cmd = commands[i];
        if (!cmd) {
          continue;
        }
        if (cmd && cmd.name === findByValue) {
          for (let j = 0; j < cmd.actions.length; j++) {
            const action = cmd.actions[j];
            if (action.name === 'Command Description') {
              Actions.storeValue(action.description, type, saveToName, cache);
              Actions.callNextAction(cache);
              return;
            }
            console.log(action.name);
          }
        }
      }

      this.callNextAction(cache);
    }
  },

  mod() {},
};
