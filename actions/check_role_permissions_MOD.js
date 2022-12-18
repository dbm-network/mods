module.exports = {
  name: 'Check Role Permissions',
  section: 'Conditions',
  meta: {
    version: '2.1.6',
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
  Permission:<br>
  <select id="permission" class="round">
    ${data.permissions[2]}
  </select>
</div><br>
<div>
  ${data.conditions[0]}
</div>`;
  },

  init() {
    const { glob, document } = this;
    const option = document.createElement('OPTION');
    option.value = '4';
    option.text = 'Jump to Anchor';
    const iffalse = document.getElementById('iffalse');
    if (iffalse.length === 4) iffalse.add(option);

    const option2 = document.createElement('OPTION');
    option2.value = '4';
    option2.text = 'Jump to Anchor';
    const iftrue = document.getElementById('iftrue');
    if (iftrue.length === 4) iftrue.add(option2);

    glob.onChangeTrue = function onChangeTrue(event) {
      switch (parseInt(event.value, 10)) {
        case 0:
        case 1:
          document.getElementById('iftrueContainer').style.display = 'none';
          break;
        case 2:
          document.getElementById('iftrueName').innerHTML = 'Action Number';
          document.getElementById('iftrueContainer').style.display = null;
          break;
        case 3:
          document.getElementById('iftrueName').innerHTML = 'Number of Actions to Skip';
          document.getElementById('iftrueContainer').style.display = null;
          break;
        case 4:
          document.getElementById('iftrueName').innerHTML = 'Anchor ID';
          document.getElementById('iftrueContainer').style.display = null;
          break;
        default:
          break;
      }
    };
    glob.onChangeFalse = function onChangeFalse(event) {
      switch (parseInt(event.value, 10)) {
        case 0:
        case 1:
          document.getElementById('iffalseContainer').style.display = 'none';
          break;
        case 2:
          document.getElementById('iffalseName').innerHTML = 'Action Number';
          document.getElementById('iffalseContainer').style.display = null;
          break;
        case 3:
          document.getElementById('iffalseName').innerHTML = 'Number of Actions to Skip';
          document.getElementById('iffalseContainer').style.display = null;
          break;
        case 4:
          document.getElementById('iffalseName').innerHTML = 'Anchor ID';
          document.getElementById('iffalseContainer').style.display = null;
          break;
        default:
          break;
      }
    };

    glob.onChangeTrue(document.getElementById('iftrue'));
    glob.onChangeFalse(document.getElementById('iffalse'));
  },

  async action(cache) {
    const data = cache.actions[cache.index];
    const role = await this.getRoleFromData(data.role, data.varName, cache);
    let result;

    if (role) result = role.permissions.has(data.permission);
    this.executeResults(result, data, cache);
  },

  mod() {},
};
