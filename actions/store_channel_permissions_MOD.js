module.exports = {
  name: 'Store Channel Permissions',

  section: 'Permission Control',
  meta: {
    version: '2.1.7',
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

  html() {
    return `
<div style="padding-top: 8px;">
  <any-channel-input dropdownLabel="Source Channel" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></any-channel-input>
</div>
<br><br><br>

<div style="padding-top: 8px;">
  <div style="float: left; width: 35%;">
    <span class="dbminputlabel">Target Type</span><br>
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
  <store-in-variable dropdownLabel="Store In" selectId="storage2" variableContainerId="varNameContainer4" variableInputId="varName4"></store-in-variable>
</div>`;
  },

  init() {},

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
