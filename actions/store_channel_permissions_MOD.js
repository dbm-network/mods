module.exports = {
  name: 'Store Channel Permissions',

  section: 'Permission Control',
  meta: {
    version: '2.1.6',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/store_channel_permissions_MOD.js',
  },

  subtitle(data, presets) {
    const target = parseInt(data.target, 10);
    return `${presets.getChannelText(data.storage, data.varName)} - ${
      target === 0 ? presets.getRoleText(data.role, data.varName2) : presets.getMemberText(data.member, data.varName3)
    }`;
  },

  fields: ['storage', 'varName', 'target', 'role', 'varName2', 'member', 'varName3', 'storage3', 'varName4'],

  html(isEvent, data) {
    return `
<div style="padding-top: 8px;">
  <channel-input dropdownLabel="Source Channel" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></channel-input>
</div>
<br><br><br>

<div style="padding-top: 8px;">
  <div style="float: left; width: 35%;">
    Target Type:<br>
    <select id="target" class="round" onchange="glob.targetChange(this)">
      <option value="0" selected>Role</option>
      <option value="1">Member</option>
    </select>
  </div>
</div>
<br><br><br>

<div id="roleHolder" style="padding-top: 8px;">
  <role-input dropdownLabel="Source Role" selectId="role" variableContainerId="varNameContainer2" variableInputId="varName2"></role-input>
</div>

<div id="memberHolder" style="display: none; padding-top: 8px;">
  <member-input dropdownLabel="Source Member" selectId="member" variableContainerId="varNameContainer3" variableInputId="varName3"></member-input>
</div>
<br><br><br>

<div style="padding-top: 8px;">
  <div style="float: left; width: 35%;">
    Store In:<br>
    <select id="storage2" class="round">
      ${data.variables[1]}
    </select>
  </div>
  <div style="float: right; width: 60%;">
    Variable Name:<br>
    <input id="varName4" class="round" type="text">
  </div>
</div>`;
  },

  init() {
    const { glob, document } = this;

    const roleHolder = document.getElementById('roleHolder');
    const memberHolder = document.getElementById('memberHolder');
    glob.targetChange = function targetChange(target) {
      if (target.value === '0') {
        roleHolder.style.display = null;
        memberHolder.style.display = 'none';
      } else if (target.value === '1') {
        roleHolder.style.display = 'none';
        memberHolder.style.display = null;
      }
    };
    glob.targetChange(document.getElementById('target'));
  },

  async action(cache) {
    const data = cache.actions[cache.index];

    const type = parseInt(data.target, 10);
    let target;
    if (type === 0) {
      target = await this.getRoleFromData(data.role, data.varName2, cache);
    } else {
      target = await this.getMemberFromData(data.member, data.varName3, cache);
    }

    const targetChannel = await this.getChannelFromData(data.storage, data.varName, cache);

    const allow = target.permissionsIn(targetChannel);
    const permissions = {};
    permissions.allow = allow;

    const { Permissions } = this.getDBM().DiscordJS;
    const disallow = new Permissions();
    disallow.add(target.permissions);
    disallow.remove(allow);
    permissions.disallow = disallow;

    const varName4 = this.evalMessage(data.varName4, cache);
    const storage2 = parseInt(data.storage2, 10);
    this.storeValue(permissions, storage2, varName4, cache);
    this.callNextAction(cache);
  },

  mod() {},
};
