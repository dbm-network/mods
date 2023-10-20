module.exports = {
  name: 'Compare Permissions',

  section: 'Permission Control',
  meta: {
    version: '2.2.0',
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

  html() {
    return `
<div>
  <retrieve-from-variable dropdownLabel="Old Permissions" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></retrieve-from-variable>
</div>
<br><br><br>

<div>
  <retrieve-from-variable dropdownLabel="New Permissions" selectId="storage2" variableContainerId="varNameContainer2" variableInputId="varName2"></retrieve-from-variable>
</div>
<br><br><br>

<div style="padding-top: 8px;">
  <store-in-variable dropdownLabel="Store In" selectId="storage3" variableContainerId="varNameContainer3" variableInputId="varName3"></store-in-variable>
</div>`;
  },

  init() {},

  async action(cache) {
    const data = cache.actions[cache.index];
    const { PermissionsBitField } = this.getDBM().DiscordJS;
    const varName = this.evalMessage(data.varName, cache);
    const storage = parseInt(data.storage, 10);
    let oldPermissions = this.getVariable(storage, varName, cache);

    const varName2 = this.evalMessage(data.varName2, cache);
    const storage2 = parseInt(data.storage2, 10);
    let newPermissions = this.getVariable(storage2, varName2, cache);

    if (oldPermissions.allow && oldPermissions.allow.bitfield) {
      oldPermissions = oldPermissions.allow;
    } else if (!isNaN(oldPermissions)) {
      oldPermissions = new PermissionsBitField(oldPermissions);
    }
    if (newPermissions.allow && newPermissions.allow.bitfield) {
      newPermissions = newPermissions.allow;
    } else if (!isNaN(newPermissions)) {
      newPermissions = new PermissionsBitField(newPermissions);
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
      console.error('Something error!');
    }
  },

  mod() {},
};
