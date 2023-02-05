module.exports = {
  name: 'Store Reaction Info',
  section: 'Reaction Control',
  meta: {
    version: '2.1.6',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/store_reaction_info_MOD.js',
  },

  subtitle(data) {
    const reaction = ['You cheater!', 'Temp Variable', 'Server Variable', 'Global Variable'];
    const info = [
      'Message Object',
      'Bot reacted?',
      'Users Who Reacted List',
      'Emoji Name',
      'Reaction Count',
      'First User to React',
      'Random User to React',
      'Last User to React',
    ];
    return `${reaction[parseInt(data.reaction, 10)]} - ${info[parseInt(data.info, 10)]}`;
  },

  variableStorage(data, varType) {
    if (parseInt(data.storage, 10) !== varType) return;
    let dataType = 'Unknown Type';
    switch (parseInt(data.info, 10)) {
      case 0:
        dataType = 'Message';
        break;
      case 1:
        dataType = 'Boolean';
        break;
      case 2:
        dataType = 'List';
        break;
      case 3:
        dataType = 'String';
        break;
      case 4:
        dataType = 'Number';
        break;
      case 5:
        dataType = 'User';
        break;
      case 6:
        dataType = 'User';
        break;
      case 7:
        dataType = 'User';
        break;
      default:
        break;
    }
    return [data.varName2, dataType];
  },

  fields: ['reaction', 'varName', 'info', 'storage', 'varName2'],

  html(isEvent, data) {
    return `
<div>
  <div style="float: left; width: 35%;">
    Source Reaction:<br>
    <select id="reaction" class="round" onchange="glob.refreshVariableList(this)">
      ${data.variables[1]}
    </select>
  </div>
  <div id="varNameContainer" style="float: right; width: 60%;">
    Variable Name:<br>
    <input id="varName" class="round" type="text" list="variableList"><br>
  </div>
</div><br><br><br>
<div>
  <div style="padding-top: 8px; width: 70%;">
    Source Info:<br>
    <select id="info" class="round">
      <option value="0" selected>Message Object</option>
      <option value="5">First User to React</option>
      <option value="6">Random User to React</option>
      <option value="7">Last User to React</option>
      <option value="1">Bot Reacted?</option>
      <option value="2">User Who Reacted List</option>
      <option value="3">Emoji Name</option>
      <option value="4">Reaction Count</option>
    </select>
  </div>
</div><br>
<div>
  <div style="float: left; width: 35%;">
    Store In:<br>
    <select id="storage" class="round">
      ${data.variables[1]}
    </select>
  </div>
  <div id="varNameContainer2" style="float: right; width: 60%;">
    Variable Name:<br>
    <input id="varName2" class="round" type="text"><br>
  </div>
</div>`;
  },

  init() {
    const { glob, document } = this;
    glob.refreshVariableList(document.getElementById('reaction'));
  },

  async action(cache) {
    const data = cache.actions[cache.index];
    const reaction = parseInt(data.reaction, 10);
    const varName = this.evalMessage(data.varName, cache);
    const info = parseInt(data.info, 10);
    const Mods = this.getMods();
    const rea = Mods.getReaction(reaction, varName, cache);

    if (!rea) return this.callNextAction(cache);

    let result;
    switch (info) {
      case 0: {
        result = rea.message; // Message Object
        break;
      }
      case 1: {
        result = Boolean(rea.me); // This bot reacted?
        break;
      }
      case 2: {
        result = rea.users.cache.array(); // All users who reacted list
        break;
      }
      case 3: {
        result = rea.emoji.name; // Emoji (/Reaction) name
        break;
      }
      case 4: {
        result = rea.count; // Number (user+bots) who reacted like this
        break;
      }
      case 5: {
        const firstid = rea.users.cache.firstKey(); // Stores first user ID reacted
        result = cache.server.members.cache.get(firstid);
        break;
      }
      case 6: {
        const randomid = rea.users.cache.randomKey(); // Stores random user ID reacted
        result = cache.server.members.cache.get(randomid);
        break;
      }
      case 7: {
        const lastid = rea.users.cache.lastKey(); // Stores last user ID reacted
        result = cache.server.members.cache.get(lastid);
        break;
      }
      default:
        break;
    }

    if (result !== undefined) {
      const storage = parseInt(data.storage, 10);
      const varName2 = this.evalMessage(data.varName2, cache);
      this.storeValue(result, storage, varName2, cache);
    }
    this.callNextAction(cache);
  },
  mod() {},
};
