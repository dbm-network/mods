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
    return `${presets.getChannelText(data.channel, data.channelVarNameContainer)} - ${target === 0 ? presets.getRoleText(data.role, data.varName2) : presets.getMemberText(data.member, data.varName3)}`;
  },

  fields: ['channel', 'channelVarNameContainer', 'target', 'role', 'varName2', 'member', 'varName3', 'storage3', 'varName4'],

  html(isEvent, data) {
    return `
<div style="padding-top: 8px;">
<channel-input dropdownLabel="Source Channel" selectId="channel" variableContainerId="channelVarNameContainer" variableInputId="channelVarName"></channel-input>
</div><br><br><br>
<div style="padding-top: 8px;">
  <div style="float: left; width: 35%;">
    Target Type:<br>
    <select id="target" class="round" onchange="glob.targetChange(this)">
      <option value="0" selected>Role</option>
      <option value="1">Member</option>
    </select>
  </div>
</div><br><br><br>
<div id="roleHolder" style="padding-top: 8px;">
  <div style="float: left; width: 35%;">
    Source Role:<br>
    <select id="role" class="round" onchange="glob.roleChange(this, 'varNameContainer2')">
      ${data.roles[isEvent ? 1 : 0]}
    </select>
  </div>
  <div id="varNameContainer2" style="display: none; float: right; width: 60%;">
    Variable Name:<br>
    <input id="varName2" class="round" type="text" list="variableList"><br>
  </div>
</div>
<div id="memberHolder" style="display: none; padding-top: 8px;">
  <div style="float: left; width: 35%;">
    Source Member:<br>
    <select id="member" class="round" onchange="glob.memberChange(this, 'varNameContainer3')">
      ${data.members[isEvent ? 1 : 0]}
    </select>
  </div>
  <div id="varNameContainer3" style="display: none; float: right; width: 60%;">
    Variable Name:<br>
    <input id="varName3" class="round" type="text" list="variableList">
  </div>
</div><br><br><br>
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

    glob.roleChange(document.getElementById('role'), 'varNameContainer2');
    glob.memberChange(document.getElementById('member'), 'varNameContainer3');

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

    const targetChannel = await this.getChannelFromData(data.channel, data.channelVarNameContainer, cache)

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
