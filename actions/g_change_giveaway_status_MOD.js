module.exports = {
  // ---------------------------------------------------------------------
  // region Action Name
  // ---------------------------------------------------------------------

  name: 'Change Giveaway Status',

  // ---------------------------------------------------------------------
  // region Action Section
  // ---------------------------------------------------------------------

  section: 'Giveaway System',

  // ---------------------------------------------------------------------
  // Action Subtitle
  // ---------------------------------------------------------------------

  subtitle(data, presets) {
    const giveaway = data.varName || data.giveawayIdInput || 'Unknown Giveaway';
    let resultStatus;
    switch (parseInt(data.newGiveawayStatus, 10)) {
      case 0:
        resultStatus = 'Waiting';
        break;
      case 1:
        resultStatus = 'Scheduled';
        break;
      case 2:
        resultStatus = 'Running';
        break;
      case 3:
        resultStatus = 'Paused';
        break;
      case 4:
        resultStatus = 'Ended';
        break;
      case 5:
        resultStatus = 'Cancelled';
        break;
      case 6:
        resultStatus = 'Rerolled';
        break;
      case 7:
        resultStatus = 'Expired';
        break;
      case 8:
        resultStatus = 'Locked';
        break;
      case 9:
        resultStatus = 'Archived';
        break;
      case 10:
        resultStatus = 'Error';
        break;
      default:
        break;
    }
    const status = resultStatus || 'Unknown Status';

    return `Change giveaway (${giveaway}) status to: ${status}`;
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

  fields: ['storage', 'varName', 'giveawayIdInput', 'newGiveawayStatus'],

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
  <span class="dbminputlabel">New Giveaway Status</span><br>
  <select id="newGiveawayStatus" class="round">
    <option value="0" selected>Waiting</option>
    <option value="1">Scheduled</option>
    <option value="2">Running</option>
    <option value="3">Paused</option>
    <option value="4">Ended</option>
    <option value="5">Cancelled</option>
    <option value="6">Rerolled</option>
    <option value="7">Expired</option>
    <option value="8">Locked</option>
    <option value="9">Archived</option>
    <option value="10">Error</option>
  </select>
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
    const { GiveawayChangeStatus, GiveawayStatusFields } = require('discord-giveaways-s');

    // /////////////////////////////////////////////////////
    const newGiveawayStatus = parseInt(data.newGiveawayStatus, 10);
    let gId;
    if (data.storage === 'giveawayById') {
      gId = this.evalMessage(data.giveawayIdInput, cache);
    } else {
      const type = parseInt(data.storage, 10);
      const varName = this.evalMessage(data.varName, cache);
      gId = this.getVariable(type, varName, cache);
    }
    // /////////////////////////////////////////////////////
    let resultStatus;
    switch (newGiveawayStatus) {
      case 0:
        resultStatus = GiveawayStatusFields.WAITING;
        break;
      case 1:
        resultStatus = GiveawayStatusFields.SCHEDULED;
        break;
      case 2:
        resultStatus = GiveawayStatusFields.RUNNING;
        break;
      case 3:
        resultStatus = GiveawayStatusFields.PAUSED;
        break;
      case 4:
        resultStatus = GiveawayStatusFields.ENDED;
        break;
      case 5:
        resultStatus = GiveawayStatusFields.CANCELLED;
        break;
      case 6:
        resultStatus = GiveawayStatusFields.REROLLED;
        break;
      case 7:
        resultStatus = GiveawayStatusFields.EXPIRED;
        break;
      case 8:
        resultStatus = GiveawayStatusFields.LOCKED;
        break;
      case 9:
        resultStatus = GiveawayStatusFields.ARCHIVED;
        break;
      case 10:
        resultStatus = GiveawayStatusFields.ERROR;
        break;
      default:
        break;
    }
    // /////////////////////////////////////////////////////

    GiveawayChangeStatus({
      storage: './data/giveaways.json',
      giveawayId: gId,
      newStatus: resultStatus,
    });

    this.callNextAction(cache);
  },

  // ---------------------------------------------------------------------
  // region Action Bot Mod
  // ---------------------------------------------------------------------

  mod() {},
};
