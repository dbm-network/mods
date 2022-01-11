module.exports = {
  name: 'Compare Permissions',

  section: 'Permission Control',
  meta: {
    version: '2.0.11',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/compare_permissions_MOD.js',
  },

  subtitle(data) {
    const variables = ['', 'Temp Variable', 'Server Variable', 'Global Variable'];
    return `Compare ${variables[data.storage]} (${data.varName}) To ${variables[data.storage2]} (${data.varName2})`;
  },

  variableStorage(data, varType) {
    if (parseInt(data.storage3, 10) !== varType) return;
    return [data.varName3, 'Array of Permissions'];
  },

  fields: ['storage', 'varName', 'storage2', 'varName2', 'storage3', 'varName3'],

  html(_isEvent, data) {
    return `
<div>
  <div style="float: left; width: 35%;">
    Old Permissions:<br>
    <select id="storage" class="round" onchange="glob.refreshVariableList(this)">
      ${data.variables[1]}
    </select><br>
  </div>
  <div style="float: right; width: 60%;">
    Variable Name:<br>
    <input id="varName" class="round" type="text" list="variableList"><br>
  </div>
</div><br><br><br>
<div>
  <div style="float: left; width: 35%;">
    New Permissions:<br>
    <select id="storage2" class="round" onchange="glob.refreshVariableList(this)">
      ${data.variables[1]}
    </select><br>
  </div>
  <div style="float: right; width: 60%;">
    Variable Name:<br>
    <input id="varName2" class="round" type="text" list="variableList"><br>
  </div>
</div><br><br><br>
<div style="padding-top: 8px;">
  <div style="float: left; width: 35%;">
    Store In:<br>
    <select id="storage3" class="round">
      ${data.variables[1]}
    </select>
  </div>
  <div style="float: right; width: 60%;">
    Variable Name:<br>
    <input id="varName3" class="round" type="text">
  </div>
</div>`;
  },

  init() {
    const { glob, document } = this;
    glob.refreshVariableList(document.getElementById('storage'));
    glob.refreshVariableList(document.getElementById('storage2'));
  },

  async action(cache) {
    const data = cache.actions[cache.index];
    const { Permissions } = this.getDBM().DiscordJS;
    const varName = this.evalMessage(data.varName, cache);
    const storage = parseInt(data.storage, 10);
    let oldPermissions = this.getVariable(storage, varName, cache);

    const varName2 = this.evalMessage(data.varName2, cache);
    const storage2 = parseInt(data.storage2, 10);
    let newPermissions = this.getVariable(storage2, varName2, cache);

    if (oldPermissions.allow && oldPermissions.allow.bitfield) {
      oldPermissions = oldPermissions.allow;
    } else if (!isNaN(oldPermissions)) {
      oldPermissions = new Permissions(oldPermissions);
    }
    if (newPermissions.allow && newPermissions.allow.bitfield) {
      newPermissions = newPermissions.allow;
    } else if (!isNaN(newPermissions)) {
      newPermissions = new Permissions(newPermissions);
    }

    if (oldPermissions.bitfield && newPermissions.bitfield) {
      try {
        const result = newPermissions.missing(oldPermissions.bitfield);
        const storage3 = parseInt(data.storage3, 10);
        const varName3 = this.evalMessage(data.varName3, cache);
        this.storeValue(result, storage3, varName3, cache);
        this.callNextAction(cache);
      } catch (err) {
        console.error(err);
      }
    } else if (!oldPermissions.bitfield && !newPermissions.bitfield) {
      console.error('Old permissions and new permissions not found.');
    } else if (!oldPermissions.bitfield) {
      console.error('Old permissions not found.');
    } else if (!newPermissions.bitfield) {
      console.error('New permissions not found.');
    } else {
      console.error('Something error!!!');
    }
  },

  mod() {},
};
