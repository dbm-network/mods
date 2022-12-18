module.exports = {
  name: 'Set Permissions',

  section: 'Permission Control',
  meta: {
    version: '2.1.6',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/set_permissions_MOD.js',
  },

  subtitle(data, presets) {
    const way = ['Update', 'Set'];
    return `${way[data.way]} ${presets.getRoleText(data.storage, data.varName)} ${
      !data.reason ? '' : `with Reason: <i>${data.reason}<i>`
    }`;
  },

  fields: ['way', 'storage', 'varName', 'storage2', 'varName2', 'reason'],

  html(isEvent, data) {
    return `
<div style="padding-top: 8px;">
  <div style="float: left; width: 60%;">
    Permission Way:<br>
    <select id="way" class="round">
      <option value="0" selected>Update</option>
      <option value="1">Set</option>
    </select>
  </div>
</div>
<br><br><br>

<role-input dropdownLabel="Source Role" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></role-input>

<br><br><br>

<div style="padding-top: 8px;">
  <div style="float: left; width: 35%;">
    Source Permissions:<br>
    <select id="storage2" class="round" onchange="glob.refreshVariableList(this)">
      ${data.variables[1]}
    </select><br>
  </div>
  <div style="float: right; width: 60%;">
    Variable Name:<br>
    <input id="varName2" class="round" type="text" list="variableList"><br>
  </div>
</div>

<br><br><br>

<div style="padding-top: 8px;">
  Reason:<br>
  <textarea id="reason" rows="2" placeholder="Insert reason here... (optional)" style="width: 99%; font-family: monospace; white-space: nowrap; resize: none;"></textarea>
</div>`;
  },

  init() {
    const { glob, document } = this;
    glob.refreshVariableList(document.getElementById('storage2'));
  },

  async action(cache) {
    const data = cache.actions[cache.index];
    const role = await this.getRoleFromData(data.storage, data.varName, cache);
    const varName2 = this.evalMessage(data.varName2, cache);
    const storage2 = parseInt(data.storage2, 10);
    let permissions = this.getVariable(storage2, varName2, cache);
    const reason = this.evalMessage(data.reason, cache);
    const way = parseInt(data.way, 10);

    if (way === 0) {
      const { Permissions } = this.getDBM().DiscordJS;
      const tempPermissions = new Permissions();
      tempPermissions.add(role.permissions);
      if (permissions.allow) {
        tempPermissions.add(permissions.allow);
      }
      if (permissions.disallow) {
        tempPermissions.remove(permissions.disallow);
      }
      permissions = tempPermissions;
    } else {
      permissions = permissions.allow;
    }

    role
      .setPermissions(permissions, reason)
      .then(() => {
        this.callNextAction(cache);
      })
      .catch(this.displayError.bind(this, data, cache));
  },

  mod() {},
};
