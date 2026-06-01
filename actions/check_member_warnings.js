module.exports = {
  // ---------------------------------------------------------------------
  // Action Name
  // ---------------------------------------------------------------------

  name: 'Check Member Warnings',

  // ---------------------------------------------------------------------
  // Action Section
  // ---------------------------------------------------------------------

  section: 'Conditions',

  // ---------------------------------------------------------------------
  // Action Subtitle
  // ---------------------------------------------------------------------

  subtitle(data, presets) {
    return `${presets.getMemberText(data.member, data.varName)} - ${data.comparison} ${data.warningCount}`;
  },

  // ---------------------------------------------------------------------
  // Action Meta Data
  // ---------------------------------------------------------------------

  meta: {
    version: '2.2.0',
    preciseCheck: true,
    author: null,
    authorUrl: 'https://github.com/master3395/dbm-mods',
    downloadUrl: 'https://github.com/dbm-network/mods',
  },

  // ---------------------------------------------------------------------
  // Action Fields
  // ---------------------------------------------------------------------

  fields: ['member', 'varName', 'comparison', 'warningCount', 'branch'],

  // ---------------------------------------------------------------------
  // Command HTML
  // ---------------------------------------------------------------------

  html(isEvent, data) {
    return `
<member-input dropdownLabel="Member" selectId="member" variableContainerId="varNameContainer" variableInputId="varName"></member-input>

<br><br><br>

<div style="float: left; width: calc(50% - 12px);">
  <span class="dbminputlabel">Comparison</span><br>
  <select id="comparison" class="round">
    <option value="0">Equals</option>
    <option value="1">Greater Than</option>
    <option value="2">Less Than</option>
    <option value="3">Greater or Equal</option>
    <option value="4">Less or Equal</option>
  </select>
</div>

<div style="float: right; width: calc(50% - 12px);">
  <span class="dbminputlabel">Warning Count</span><br>
  <input id="warningCount" class="round" type="text" value="0">
</div>

<br><br><br><br>

<conditional-input id="branch"></conditional-input>`;
  },

  // ---------------------------------------------------------------------
  // Action Editor Pre-Init Code
  // ---------------------------------------------------------------------

  preInit(data, formatters) {
    return formatters.compatibility_2_0_0_iftruefalse_to_branch(data);
  },

  // ---------------------------------------------------------------------
  // Action Editor Init Code
  // ---------------------------------------------------------------------

  init() {},

  // ---------------------------------------------------------------------
  // Action Bot Function
  // ---------------------------------------------------------------------

  action(cache) {
    const data = cache.actions[cache.index];
    const member = this.getMemberFromData(data.member, data.varName, cache);

    if (!member) {
      this.executeResults(false, data?.branch ?? data, cache);
      return;
    }

    const memberData = this.getMemberData(member, cache.server);
    const warningCount = memberData.warnings ? memberData.warnings.length : 0;
    const compare = parseInt(this.evalMessage(data.warningCount, cache), 10) || 0;
    const comparison = parseInt(data.comparison, 10);

    let result = false;
    switch (comparison) {
      case 0:
        result = warningCount === compare;
        break;
      case 1:
        result = warningCount > compare;
        break;
      case 2:
        result = warningCount < compare;
        break;
      case 3:
        result = warningCount >= compare;
        break;
      case 4:
        result = warningCount <= compare;
        break;
    }

    this.executeResults(result, data?.branch ?? data, cache);
  },

  // ---------------------------------------------------------------------
  // Action Bot Mod Init
  // ---------------------------------------------------------------------

  modInit(data) {
    this.prepareActions(data.branch?.iftrueActions);
    this.prepareActions(data.branch?.iffalseActions);
  },

  // ---------------------------------------------------------------------
  // Action Bot Mod
  // ---------------------------------------------------------------------

  mod() {},
};
