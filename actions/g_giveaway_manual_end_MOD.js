module.exports = {
  // ---------------------------------------------------------------------
  // region Action Name
  // ---------------------------------------------------------------------

  name: 'Giveaway Manual End',

  // ---------------------------------------------------------------------
  // region Action Section
  // ---------------------------------------------------------------------

  section: 'Giveaway System',

  // ---------------------------------------------------------------------
  // Action Subtitle
  // ---------------------------------------------------------------------

  subtitle(data, presets) {
    const giveaway = data.varName || data.giveawayIdInput || 'Unknown Giveaway';
    return `End giveaway manually (${giveaway})`;
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
    return [data.varName2, 'Winners'];
  },

  // ---------------------------------------------------------------------
  // region Action Fields
  // ---------------------------------------------------------------------

  fields: ['storage', 'varName', 'giveawayDrawWinner', 'giveawayIdInput', 'storage2', 'varName2'],

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

<span class="dbminputlabel">Giveaway Draw Winner</span><br>
<select id="giveawayDrawWinner" class="round">
  <option value="0" selected>True</option>
  <option value="1">False</option>
</select>

<br><br><br><br><br>

<store-in-variable allowNone dropdownLabel="Store In" selectId="storage2" variableContainerId="varNameContainer2" variableInputId="varName2"></store-in-variable>

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
    const { GiveawayManualEnd } = require('discord-giveaways-s');

    // /////////////////////////////////////////////////////
    let gId;
    if (data.storage === 'giveawayById') {
      gId = this.evalMessage(data.giveawayIdInput, cache);
    } else {
      const type = parseInt(data.storage, 10);
      const varName = this.evalMessage(data.varName, cache);
      gId = this.getVariable(type, varName, cache);
    }

    const gDrawWinner = this.evalMessage(data.giveawayDrawWinner, cache) === '0';
    // /////////////////////////////////////////////////////

    const winners = GiveawayManualEnd({
      storage: './data/giveaways.json',
      giveawayId: gId,
      drawWinner: gDrawWinner,
    });

    const varName2 = this.evalMessage(data.varName2, cache);
    const storage = parseInt(data.storage2, 10);
    this.storeValue(winners, storage, varName2, cache);
    this.callNextAction(cache);
  },

  // ---------------------------------------------------------------------
  // region Action Bot Mod
  // ---------------------------------------------------------------------

  mod() {},
};
