module.exports = {
  // ---------------------------------------------------------------------
  // region Action Name
  // ---------------------------------------------------------------------

  name: 'Edit Giveaway',

  // ---------------------------------------------------------------------
  // region Action Section
  // ---------------------------------------------------------------------

  section: 'Giveaway System',

  // ---------------------------------------------------------------------
  // Action Subtitle
  // ---------------------------------------------------------------------

  subtitle(data, presets) {
    const giveaway = data.varName || data.giveawayIdInput || 'Unknown Giveaway';
    const newValue = data.varName || data.newValue || '';
    let resultoptionsToEdit;
    switch (parseInt(data.optionsToEdit, 10)) {
      case 0:
        resultoptionsToEdit = 'Giveaway ID';
        break;
      case 1:
        resultoptionsToEdit = 'Giveaway Full ID';
        break;
      case 2:
        resultoptionsToEdit = 'Guild ID';
        break;
      case 3:
        resultoptionsToEdit = 'Channel ID';
        break;
      case 4:
        resultoptionsToEdit = 'Message ID';
        break;
      case 5:
        resultoptionsToEdit = 'Host ID';
        break;
      case 6:
        resultoptionsToEdit = 'Start Timestamp';
        break;
      case 7:
        resultoptionsToEdit = 'End Timestamp';
        break;
      case 8:
        resultoptionsToEdit = 'Duration';
        break;
      case 9:
        resultoptionsToEdit = 'Prize';
        break;
      case 10:
        resultoptionsToEdit = 'Description';
        break;
      case 11:
        resultoptionsToEdit = 'Winner Count';
        break;
      case 12:
        resultoptionsToEdit = 'Participant Count';
        break;
      case 13:
        resultoptionsToEdit = 'Min Participant';
        break;
      case 14:
        resultoptionsToEdit = 'Max Participant';
        break;
      case 15:
        resultoptionsToEdit = 'Reroll Count';
        break;
      case 16:
        resultoptionsToEdit = 'Participants';
        break;
      case 17:
        resultoptionsToEdit = 'Winners';
        break;
      case 18:
        resultoptionsToEdit = 'Rerolled Winners';
        break;
      case 19:
        resultoptionsToEdit = 'Allowed Roles';
        break;
      case 20:
        resultoptionsToEdit = 'Allowed Members';
        break;
      case 21:
        resultoptionsToEdit = 'Blacklisted Roles';
        break;
      case 22:
        resultoptionsToEdit = 'Blacklisted Members';
        break;
      case 23:
        resultoptionsToEdit = 'Ended';
        break;
      case 24:
        resultoptionsToEdit = 'Status';
        break;
      case 25:
        resultoptionsToEdit = 'Start Timestamp Unix';
        break;
      case 26:
        resultoptionsToEdit = 'End Timestamp Unix';
        break;
      case 27:
        resultoptionsToEdit = 'Start Timestamp Relative';
        break;
      case 28:
        resultoptionsToEdit = 'End Timestamp Relative';
        break;

      default:
        break;
    }
    const option = resultoptionsToEdit || 'Unknown Option';

    return `Edit (${option}) in giveaway (${giveaway}): ${newValue}`;
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

  fields: ['storage', 'varName', 'giveawayIdInput', 'optionsToEdit', 'newValue'],

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

<br><br>
<hr class="subtlebar" style="margin-top: 4px; margin-bottom: 4px; width: 100%;">
<br>

<div style="padding-top: 5px;">
  <span class="dbminputlabel">Options To Edit</span><br>
  <select id="optionsToEdit" class="round">
    <option value="0">Giveaway ID</option>
    <option value="1">Giveaway Full ID</option>
    <option value="2">Guild ID</option>
    <option value="3">Channel ID</option>
    <option value="4">Message ID</option>
    <option value="5">Host ID</option>
    <option value="6">Start Timestamp</option>
    <option value="7">End Timestamp</option>
    <option value="25">Start Timestamp Unix</option>
    <option value="26">End Timestamp Unix</option>
    <option value="27">Start Timestamp Relative</option>
    <option value="28">End Timestamp Relative</option>
    <option value="8">Duration</option>
    <option value="9" selected>Prize</option>
    <option value="10">Description</option>
    <option value="11">Winner Count</option>
    <option value="12">Participant Count</option>
    <option value="13">Min Participant</option>
    <option value="14">Max Participant</option>
    <option value="15">Reroll Count</option>
    <option value="16">Participants</option>
    <option value="17">Winners</option>
    <option value="18">Rerolled Winners</option>
    <option value="19">Allowed Roles</option>
    <option value="20">Allowed Members</option>
    <option value="21">Blacklisted Roles</option>
    <option value="22">Blacklisted Members</option>
    <option value="23">Ended</option>
    <option value="24">Status</option>
  </select>
</div>

<br>

<div style="padding-top: 10px;">
  <span class="dbminputlabel">New Value</span><br>
  <input id="newValue" class="round" type="text" placeholder="Leave blank for none...">
</div>

      `;
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
    const { GiveawayEdit, GiveawayInfoFields } = require('discord-giveaways-s');

    // /////////////////////////////////////////////////////
    const newValue = this.evalMessage(data.newValue, cache);
    const optionsToEdit = parseInt(data.optionsToEdit, 10);
    let gId;
    if (data.storage === 'giveawayById') {
      gId = this.evalMessage(data.giveawayIdInput, cache);
    } else {
      const type = parseInt(data.storage, 10);
      const varName = this.evalMessage(data.varName, cache);
      gId = this.getVariable(type, varName, cache);
    }
    // /////////////////////////////////////////////////////
    let resultoptionsToEdit;
    switch (optionsToEdit) {
      case 0:
        resultoptionsToEdit = GiveawayInfoFields.GIVEAWAY_ID;
        break;
      case 1:
        resultoptionsToEdit = GiveawayInfoFields.GIVEAWAY_FULL_ID;
        break;
      case 2:
        resultoptionsToEdit = GiveawayInfoFields.GUILD_ID;
        break;
      case 3:
        resultoptionsToEdit = GiveawayInfoFields.CHANNEL_ID;
        break;
      case 4:
        resultoptionsToEdit = GiveawayInfoFields.MESSAGE_ID;
        break;
      case 5:
        resultoptionsToEdit = GiveawayInfoFields.HOST_ID;
        break;
      case 6:
        resultoptionsToEdit = GiveawayInfoFields.START_TIMESTAMP;
        break;
      case 7:
        resultoptionsToEdit = GiveawayInfoFields.END_TIMESTAMP;
        break;
      case 8:
        resultoptionsToEdit = GiveawayInfoFields.DURATION;
        break;
      case 9:
        resultoptionsToEdit = GiveawayInfoFields.PRIZE;
        break;
      case 10:
        resultoptionsToEdit = GiveawayInfoFields.DESCRIPTION;
        break;
      case 11:
        resultoptionsToEdit = GiveawayInfoFields.WINNER_COUNT;
        break;
      case 12:
        resultoptionsToEdit = GiveawayInfoFields.PARTICIPANT_COUNT;
        break;
      case 13:
        resultoptionsToEdit = GiveawayInfoFields.MIN_PARTICIPANT;
        break;
      case 14:
        resultoptionsToEdit = GiveawayInfoFields.MAX_PARTICIPANT;
        break;
      case 15:
        resultoptionsToEdit = GiveawayInfoFields.REROLL_COUNT;
        break;
      case 16:
        resultoptionsToEdit = GiveawayInfoFields.PARTICIPANTS;
        break;
      case 17:
        resultoptionsToEdit = GiveawayInfoFields.WINNERS;
        break;
      case 18:
        resultoptionsToEdit = GiveawayInfoFields.REROLLED_WINNERS;
        break;
      case 19:
        resultoptionsToEdit = GiveawayInfoFields.ALLOWED_ROLES;
        break;
      case 20:
        resultoptionsToEdit = GiveawayInfoFields.ALLOWED_MEMBERS;
        break;
      case 21:
        resultoptionsToEdit = GiveawayInfoFields.BLACKLISTED_ROLES;
        break;
      case 22:
        resultoptionsToEdit = GiveawayInfoFields.BLACKLISTED_MEMBERS;
        break;
      case 23:
        resultoptionsToEdit = GiveawayInfoFields.ENDED;
        break;
      case 24:
        resultoptionsToEdit = GiveawayInfoFields.STATUS;
        break;
      case 25:
        resultoptionsToEdit = GiveawayInfoFields.START_TIMESTAMP_UNIX;
        break;
      case 26:
        resultoptionsToEdit = GiveawayInfoFields.END_TIMESTAMP_UNIX;
        break;
      case 27:
        resultoptionsToEdit = GiveawayInfoFields.START_TIMESTAMP_RELATIVE;
        break;
      case 28:
        resultoptionsToEdit = GiveawayInfoFields.END_TIMESTAMP_RELATIVE;
        break;

      default:
        break;
    }
    // /////////////////////////////////////////////////////

    GiveawayEdit({
      storage: './data/giveaways.json',
      giveawayId: gId,
      edit: {
        [resultoptionsToEdit]: newValue,
      },
    });

    this.callNextAction(cache);
  },

  // ---------------------------------------------------------------------
  // region Action Bot Mod
  // ---------------------------------------------------------------------

  mod() {},
};
