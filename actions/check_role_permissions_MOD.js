module.exports = {
  name: 'Check Role Permissions',
  section: 'Conditions',
  meta: {
    version: '2.2.0',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/check_role_permissions_MOD.js',
  },

  subtitle(data, presets) {
    return `${presets.getRoleText(data.role, data.varName)} has ${data.permission}?`;
  },

  fields: ['role', 'varName', 'permission', 'iftrue', 'iftrueVal', 'iffalse', 'iffalseVal'],

  html(isEvent, data) {
    return `
  <role-input dropdownLabel="Source Role" selectId="role" variableContainerId="varNameContainer" variableInputId="varName"></role-input>
  <br><br><br>

  <div style="padding-top: 8px; width: 80%;">
    <span class="dbminputlabel">Permission</span>
    <select id="permission" class="round">
      ${data.permissions[2]}
    </select>
  </div><br>
  <div>
    ${data.conditions[0]}
  </div>

  <conditional-input id="branch" style="padding-top: 16px;"></conditional-input`;
  },

  init() {},

  async action(cache) {
    const data = cache.actions[cache.index];
    const role = await this.getRoleFromData(data.role, data.varName, cache);
    let result;

    if (role) result = role.permissions.has(data.permission);
    this.executeResults(result, data?.branch ?? data, cache);
  },

  modInit(data) {
    this.prepareActions(data.branch?.iftrueActions);
    this.prepareActions(data.branch?.iffalseActions);
  },

  mod() {},
};
