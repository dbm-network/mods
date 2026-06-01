module.exports = {
  // ---------------------------------------------------------------------
  // region Action Name
  // ---------------------------------------------------------------------

  name: 'Check If Member In Giveaway',

  // ---------------------------------------------------------------------
  // region Action Section
  // ---------------------------------------------------------------------

  section: 'Giveaway System',

  // ---------------------------------------------------------------------
  // Action Subtitle
  // ---------------------------------------------------------------------

  subtitle(data, presets) {
    const giveaway = data.varName || data.giveawayIdInput || 'Unknown Giveaway';
    return `${presets.getMemberText(data.member, data.varName)} join to giveaway: ${giveaway}`;
  },

  // ---------------------------------------------------------------------
  // region Action Meta Data
  // ---------------------------------------------------------------------

  meta: {
    version: '2.2.0',
    preciseCheck: true,
    author: 'Shadow',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadUrl: 'https://github.com/dbm-network/mods',
  },

  // ---------------------------------------------------------------------
  // region Action Fields
  // ---------------------------------------------------------------------

  fields: ['storage', 'varName', 'member', 'memberVarName', 'giveawayIdInput', 'branch'],

  // ---------------------------------------------------------------------
  // region Command HTML
  // ---------------------------------------------------------------------

  html(isEvent, data) {
    return `
<div style="position:fixed;bottom:0;left:0;padding:5px;padding-top:5px;padding-bottom:5px;font:13px sans-serif;border-radius:10px;background:rgba(0,0,0,0.7);color:#999;border:1px solid rgba(50,50,50,.7);z-index:999999;opacity:0.5;transition:all .3s" onmouseover="this.style.opacity='1';this.style.borderColor='gray'" onmouseout="this.style.opacity='0.5';this.style.borderColor='rgba(50,50,50,.7)'">Creator: Shadow<br><br>Help: <a href='https://discord.gg/9HYB4n3Dz4' target='_blank' style='color:#07f;text-decoration:none'>Discord</a></div><div style="position:fixed;bottom:0;right:0;padding:5px;font:20px sans-serif;border-radius:10px;background:rgba(0,0,0,0.7);color:#999;border:1px solid rgba(50,50,50,.7);z-index:999999;opacity:0.5;transition:all .3s" onmouseover="this.style.opacity='1';this.style.borderColor='gray'" onmouseout="this.style.opacity='0.5';this.style.borderColor='rgba(50,50,50,.7)'"><a href='https://dbm-polska.github.io/DBM-14/' target='_blank' style='color:#07f;text-decoration:none'><!--Version-->3.1</a></div>

<retrieve-from-variable allowSlashParams dropdownLabel="Source Giveaway" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName">
<option value="giveawayById">Giveaway (by ID)</option>
</retrieve-from-variable>

<div id="giveawayIdInputContainer" style="float: right; width: 60%; display:none;">
  <span class="dbminputlabel">Giveaway ID</span><br>
  <input id="giveawayIdInput" class="round" type="text" placeholder="Enter ID manually..." />
</div>

<br><br><br><br>

<member-input dropdownLabel="Source Member" selectId="member" variableContainerId="memberVarNameContainer" variableInputId="memberVarName"></member-input>

<br><br><br>
<hr class="subtlebar" style="margin-top: 4px; margin-bottom: 4px; width: 100%;">
<br><br><br>

<conditional-input id="branch" style="padding-top: 8px;"></conditional-input>

      `;
  },

  // ---------------------------------------------------------------------
  // region Action Editor Pre-Init Code
  // ---------------------------------------------------------------------

  preInit(data, formatters) {
    return formatters.compatibility_2_0_0_iftruefalse_to_branch(data);
  },

  // ---------------------------------------------------------------------
  // region Action Editor Init Code
  // ---------------------------------------------------------------------

  init() {
    const { glob, document } = this;
    function toggleIdField() {
      const mode = document.getElementById('storage').value;
      const varCont = document.getElementById('varNameContainer');
      const idCont = document.getElementById('giveawayIdInputContainer');
      if (mode === 'giveawayById') {
        varCont.style.display = 'none';
        idCont.style.display = null;
      } else {
        varCont.style.display = null;
        idCont.style.display = 'none';
      }
    }
    glob.onChangeStorage = toggleIdField;
    document.getElementById('storage').addEventListener('change', toggleIdField);
    toggleIdField();
  },

  // ---------------------------------------------------------------------
  // region Action Bot Function
  // ---------------------------------------------------------------------

  async action(cache) {
    const data = cache.actions[cache.index];
    const { CheckIfMemberInGiveaway } = require('discord-giveaways-s');

    // /////////////////////////////////////////////////////
    let gId;
    if (data.storage === 'giveawayById') {
      gId = this.evalMessage(data.giveawayIdInput, cache);
    } else {
      const type = parseInt(data.storage, 10);
      const varName = this.evalMessage(data.varName, cache);
      gId = this.getVariable(type, varName, cache);
    }

    const member = await this.getMemberFromData(data.member, data.memberVarName, cache);
    let memberId;
    if (member && typeof member === 'object' && 'id' in member) {
      memberId = member.id;
    } else {
      memberId = this.evalMessage(data.memberVarName, cache);
    }
    // /////////////////////////////////////////////////////

    const isMemberInGiveaway = CheckIfMemberInGiveaway({
      storage: './data/giveaways.json',
      giveawayId: gId,
      memberId,
    });

    this.executeResults(isMemberInGiveaway, data?.branch ?? data, cache);
  },

  // ---------------------------------------------------------------------
  // region Action Bot Mod-Init
  // ---------------------------------------------------------------------

  modInit(data) {
    this.prepareActions(data.branch?.iftrueActions);
    this.prepareActions(data.branch?.iffalseActions);
  },

  // ---------------------------------------------------------------------
  // region Action Bot Mod
  // ---------------------------------------------------------------------

  mod() {},
};
