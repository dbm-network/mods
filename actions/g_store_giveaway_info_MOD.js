module.exports = {
  // ---------------------------------------------------------------------
  // region Action Name
  // ---------------------------------------------------------------------

  name: 'Store Giveaway Info',

  // ---------------------------------------------------------------------
  // region Action Section
  // ---------------------------------------------------------------------

  section: 'Giveaway System',

  // ---------------------------------------------------------------------
  // Action Subtitle
  // ---------------------------------------------------------------------

  subtitle(data, presets) {
    const giveaway = data.varName || data.giveawayIdInput || 'Unknown Giveaway';
    let resultInfo;
    switch (parseInt(data.giveawayInfo, 10)) {
      case 0:
        resultInfo = 'Giveaway ID';
        break;
      case 1:
        resultInfo = 'Giveaway Full ID';
        break;
      case 2:
        resultInfo = 'Guild ID';
        break;
      case 3:
        resultInfo = 'Channel ID';
        break;
      case 4:
        resultInfo = 'Message ID';
        break;
      case 5:
        resultInfo = 'Host ID';
        break;
      case 6:
        resultInfo = 'Start Timestamp';
        break;
      case 7:
        resultInfo = 'End Timestamp';
        break;
      case 8:
        resultInfo = 'Duration';
        break;
      case 9:
        resultInfo = 'Prize';
        break;
      case 10:
        resultInfo = 'Description';
        break;
      case 11:
        resultInfo = 'Winner Count';
        break;
      case 12:
        resultInfo = 'Participant Count';
        break;
      case 13:
        resultInfo = 'Min Participant';
        break;
      case 14:
        resultInfo = 'Max Participant';
        break;
      case 15:
        resultInfo = 'Reroll Count';
        break;
      case 16:
        resultInfo = 'Participants';
        break;
      case 17:
        resultInfo = 'Winners';
        break;
      case 18:
        resultInfo = 'Rerolled Winners';
        break;
      case 19:
        resultInfo = 'Allowed Roles';
        break;
      case 20:
        resultInfo = 'Allowed Members';
        break;
      case 21:
        resultInfo = 'Blacklisted Roles';
        break;
      case 22:
        resultInfo = 'Blacklisted Members';
        break;
      case 23:
        resultInfo = 'Ended';
        break;
      case 24:
        resultInfo = 'Status';
        break;
      case 25:
        resultInfo = 'Host (object)';
        break;
      case 26:
        resultInfo = 'Guild (object)';
        break;
      case 27:
        resultInfo = 'Channel (object)';
        break;
      case 28:
        resultInfo = 'Message (object)';
        break;
      case 29:
        resultInfo = 'Start Timestamp Unix';
        break;
      case 30:
        resultInfo = 'End Timestamp Unix';
        break;
      case 31:
        resultInfo = 'Start Timestamp Relative';
        break;
      case 32:
        resultInfo = 'End Timestamp Relative';
        break;

      default:
        break;
    }
    const info = resultInfo || 'Unknown Info';

    return `Get info from giveaway (${giveaway}): ${info}`;
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
  // region Action Storage Function
  // ---------------------------------------------------------------------

  variableStorage(data, varType) {
    const type = parseInt(data.storage2, 10);
    if (type !== varType) return;

    let resultInfo;
    switch (parseInt(data.giveawayInfo, 10)) {
      case 0:
        resultInfo = 'Giveaway ID';
        break;
      case 1:
        resultInfo = 'Giveaway Full ID';
        break;
      case 2:
        resultInfo = 'Guild ID';
        break;
      case 3:
        resultInfo = 'Channel ID';
        break;
      case 4:
        resultInfo = 'Message ID';
        break;
      case 5:
        resultInfo = 'Host ID';
        break;
      case 6:
        resultInfo = 'Timestamp';
        break;
      case 7:
        resultInfo = 'Timestamp';
        break;
      case 8:
        resultInfo = 'Duration';
        break;
      case 9:
        resultInfo = 'Prize';
        break;
      case 10:
        resultInfo = 'Description';
        break;
      case 11:
        resultInfo = 'Winner Count';
        break;
      case 12:
        resultInfo = 'Participant Count';
        break;
      case 13:
        resultInfo = 'Min Participant';
        break;
      case 14:
        resultInfo = 'Max Participant';
        break;
      case 15:
        resultInfo = 'Reroll Count';
        break;
      case 16:
        resultInfo = 'Participants';
        break;
      case 17:
        resultInfo = 'Winners';
        break;
      case 18:
        resultInfo = 'Rerolled Winners';
        break;
      case 19:
        resultInfo = 'Allowed Roles';
        break;
      case 20:
        resultInfo = 'Allowed Members';
        break;
      case 21:
        resultInfo = 'Blacklisted Roles';
        break;
      case 22:
        resultInfo = 'Blacklisted Members';
        break;
      case 23:
        resultInfo = 'Ended';
        break;
      case 24:
        resultInfo = 'Status';
        break;
      case 25:
        resultInfo = 'Host (object)';
        break;
      case 26:
        resultInfo = 'Guild (object)';
        break;
      case 27:
        resultInfo = 'Channel (object)';
        break;
      case 28:
        resultInfo = 'Message (object)';
        break;
      case 29:
        resultInfo = 'Timestamp Unix';
        break;
      case 30:
        resultInfo = 'Timestamp Unix';
        break;
      case 31:
        resultInfo = 'Timestamp Relative';
        break;
      case 32:
        resultInfo = 'Timestamp Relative';
        break;

      default:
        break;
    }
    const info = resultInfo || 'Unknown Info';

    return [data.varName2, info];
  },

  // ---------------------------------------------------------------------
  // region Action Fields
  // ---------------------------------------------------------------------

  fields: ['storage', 'varName', 'giveawayIdInput', 'giveawayInfo', 'storage2', 'varName2'],

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

<br><br><br>
<hr class="subtlebar" style="margin-top: 4px; margin-bottom: 4px; width: 100%;">
<br>

<div style="padding-top: 5px;">
  <span class="dbminputlabel">Source Info</span><br>
  <select id="giveawayInfo" class="round">
    <option value="0" selected>Giveaway ID</option>
    <option value="1">Giveaway Full ID</option>
    <option value="2">Guild ID</option>
    <option value="3">Channel ID</option>
    <option value="4">Message ID</option>
    <option value="5">Host ID</option>
    <option value="25">Host (object)</option>
    <option value="26">Guild (object)</option>
    <option value="27">Channel (object)</option>
    <option value="28">Message (object)</option>
    <option value="6">Start Timestamp</option>
    <option value="7">End Timestamp</option>
    <option value="29">Start Timestamp Unix</option>
    <option value="30">End Timestamp Unix</option>
    <option value="31">Start Timestamp Relative</option>
    <option value="32">End Timestamp Relative (countdown)</option>
    <option value="8">Duration</option>
    <option value="9">Prize</option>
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

<br><br><br><br>

<store-in-variable dropdownLabel="Store In" selectId="storage2" variableContainerId="varNameContainer2" variableInputId="varName2"></store-in-variable>

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
    const { GiveawayInfo, GiveawayInfoFields } = require('discord-giveaways-s');

    // /////////////////////////////////////////////////////
    const giveawayInfo = parseInt(data.giveawayInfo, 10);
    let gId;
    if (data.storage === 'giveawayById') {
      gId = this.evalMessage(data.giveawayIdInput, cache);
    } else {
      const type = parseInt(data.storage, 10);
      const varName = this.evalMessage(data.varName, cache);
      gId = this.getVariable(type, varName, cache);
    }
    // /////////////////////////////////////////////////////
    let resultInfo;
    switch (giveawayInfo) {
      case 0:
        resultInfo = GiveawayInfoFields.GIVEAWAY_ID;
        break;
      case 1:
        resultInfo = GiveawayInfoFields.GIVEAWAY_FULL_ID;
        break;
      case 2:
        resultInfo = GiveawayInfoFields.GUILD_ID;
        break;
      case 3:
        resultInfo = GiveawayInfoFields.CHANNEL_ID;
        break;
      case 4:
        resultInfo = GiveawayInfoFields.MESSAGE_ID;
        break;
      case 5:
        resultInfo = GiveawayInfoFields.HOST_ID;
        break;
      case 6:
        resultInfo = GiveawayInfoFields.START_TIMESTAMP;
        break;
      case 7:
        resultInfo = GiveawayInfoFields.END_TIMESTAMP;
        break;
      case 8:
        resultInfo = GiveawayInfoFields.DURATION;
        break;
      case 9:
        resultInfo = GiveawayInfoFields.PRIZE;
        break;
      case 10:
        resultInfo = GiveawayInfoFields.DESCRIPTION;
        break;
      case 11:
        resultInfo = GiveawayInfoFields.WINNER_COUNT;
        break;
      case 12:
        resultInfo = GiveawayInfoFields.PARTICIPANT_COUNT;
        break;
      case 13:
        resultInfo = GiveawayInfoFields.MIN_PARTICIPANT;
        break;
      case 14:
        resultInfo = GiveawayInfoFields.MAX_PARTICIPANT;
        break;
      case 15:
        resultInfo = GiveawayInfoFields.REROLL_COUNT;
        break;
      case 16:
        resultInfo = GiveawayInfoFields.PARTICIPANTS;
        break;
      case 17:
        resultInfo = GiveawayInfoFields.WINNERS;
        break;
      case 18:
        resultInfo = GiveawayInfoFields.REROLLED_WINNERS;
        break;
      case 19:
        resultInfo = GiveawayInfoFields.ALLOWED_ROLES;
        break;
      case 20:
        resultInfo = GiveawayInfoFields.ALLOWED_MEMBERS;
        break;
      case 21:
        resultInfo = GiveawayInfoFields.BLACKLISTED_ROLES;
        break;
      case 22:
        resultInfo = GiveawayInfoFields.BLACKLISTED_MEMBERS;
        break;
      case 23:
        resultInfo = GiveawayInfoFields.ENDED;
        break;
      case 24:
        resultInfo = GiveawayInfoFields.STATUS;
        break;
      case 25: // Host (object)
        {
          try {
            const tempHostId = GiveawayInfo({
              storage: './data/giveaways.json',
              giveawayId: gId,
              info: GiveawayInfoFields.HOST_ID,
            });
            resultInfo = await this.getMemberFromData(101, tempHostId, cache);
          } catch {
            resultInfo = null;
          }
        }
        break;
      case 26: // Guild (object)
        {
          try {
            const tempGuildId = GiveawayInfo({
              storage: './data/giveaways.json',
              giveawayId: gId,
              info: GiveawayInfoFields.GUILD_ID,
            });

            resultInfo = await this.getServerFromData(101, tempGuildId, cache);
          } catch {
            resultInfo = null;
          }
        }
        break;
      case 27: // Channel (object)
        {
          try {
            const tempChannelId = GiveawayInfo({
              storage: './data/giveaways.json',
              giveawayId: gId,
              info: GiveawayInfoFields.CHANNEL_ID,
            });
            resultInfo = await this.getChannelFromData(101, tempChannelId, cache);
          } catch {
            resultInfo = null;
          }
        }
        break;
      case 28: // Message (object)
        {
          try {
            const tempChannelId = GiveawayInfo({
              storage: './data/giveaways.json',
              giveawayId: gId,
              info: GiveawayInfoFields.CHANNEL_ID,
            });
            const tempChannel = await this.getChannelFromData(101, tempChannelId, cache);
            const tempMessageId = GiveawayInfo({
              storage: './data/giveaways.json',
              giveawayId: gId,
              info: GiveawayInfoFields.MESSAGE_ID,
            });
            const tempMessage = await tempChannel.messages.fetch(tempMessageId);
            resultInfo = tempMessage;
          } catch {
            resultInfo = null;
          }
        }
        break;
      case 29:
        resultInfo = GiveawayInfoFields.START_TIMESTAMP_UNIX;
        break;
      case 30:
        resultInfo = GiveawayInfoFields.END_TIMESTAMP_UNIX;
        break;
      case 31:
        resultInfo = GiveawayInfoFields.START_TIMESTAMP_RELATIVE;
        break;
      case 32:
        resultInfo = GiveawayInfoFields.END_TIMESTAMP_RELATIVE;
        break;

      default:
        break;
    }
    // /////////////////////////////////////////////////////

    const info =
      GiveawayInfo({
        storage: './data/giveaways.json',
        giveawayId: gId,
        info: resultInfo,
      }) || resultInfo;

    const varName2 = this.evalMessage(data.varName2, cache);
    const storage = parseInt(data.storage2, 10);
    this.storeValue(info, storage, varName2, cache);
    this.callNextAction(cache);
  },

  // ---------------------------------------------------------------------
  // region Action Bot Mod
  // ---------------------------------------------------------------------

  mod() {},
};
