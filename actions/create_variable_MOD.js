module.exports = {
  // ---------------------------------------------------------------------
  // Action Name
  // ---------------------------------------------------------------------

  name: 'Create Variable',

  // ---------------------------------------------------------------------
  // Action Section
  // ---------------------------------------------------------------------

  section: 'Other Stuff',

  // ---------------------------------------------------------------------
  // Action Meta Data
  // ---------------------------------------------------------------------

  meta: {
    version: '2.2.0',
    preciseCheck: true,
    author: 'Shadow',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods',
  },

  // ---------------------------------------------------------------------
  // Action Subtitle
  // ---------------------------------------------------------------------

  subtitle(data) {
    let variableType;
    switch (parseInt(data.storage, 10)) {
      case 1: // Temp Variable
        variableType = 'Temp Variable';
        break;
      case 2: // Server Variable
        variableType = 'Server Variable';
        break;
      case 3: // Global Variable
        variableType = 'Global Variable';
        break;
      default: // Default Variable
        variableType = 'Variable';
    }

    return `Create ${variableType}: ${data.varName2}`;
  },

  // ---------------------------------------------------------------------
  // Action Storage Function
  // ---------------------------------------------------------------------

  variableStorage(data, varType) {
    if (parseInt(data.storage, 10) !== varType) return;
    return [data.varName2, data.variableDescription];
  },

  // ---------------------------------------------------------------------
  // Action Fields
  // ---------------------------------------------------------------------

  fields: ['variableValue', 'variableType', 'variableDescription', 'storage', 'varName2'],

  // ---------------------------------------------------------------------
  // Command HTML
  // ---------------------------------------------------------------------

  html() {
    return `
<div style="position:fixed;bottom:0;left:0;padding:5px;padding-top:5px;padding-bottom:5px;font:13px sans-serif;border-radius:10px;background:rgba(0,0,0,0.7);color:#999;border:1px solid rgba(50,50,50,.7);z-index:999999;opacity:0.5;transition:all .3s" onmouseover="this.style.opacity='1';this.style.borderColor='gray'" onmouseout="this.style.opacity='0.5';this.style.borderColor='rgba(50,50,50,.7)'">Creator: Shadow<br><br>Help: <a href='https://discord.gg/9HYB4n3Dz4' target='_blank' style='color:#07f;text-decoration:none'>Discord</a></div><div style="position:fixed;bottom:0;right:0;padding:5px;font:20px sans-serif;border-radius:10px;background:rgba(0,0,0,0.7);color:#999;border:1px solid rgba(50,50,50,.7);z-index:999999;opacity:0.5;transition:all .3s" onmouseover="this.style.opacity='1';this.style.borderColor='gray'" onmouseout="this.style.opacity='0.5';this.style.borderColor='rgba(50,50,50,.7)'"><a href='https://dbm-polska.github.io/DBM-14/' target='_blank' style='color:#07f;text-decoration:none'><!--Version-->1.0</a></div>

<div style="width: 100%; padding:8px;height: calc(100vh - 350px);overflow:auto">
      <span class="dbminputlabel">Variable Value</span><br>
      <textarea id="variableValue" class="dbm_monospace" rows="10" placeholder="Insert message here..." style="height: calc(100vh - 400px); white-space: nowrap;"></textarea>
</div>

<div style="float: left; width: calc(50% - 12px);">
    <span class="dbminputlabel">Variable Type</span><br>
    <select id="variableType" class="round">
        <option value="0" selected>String</option>
        <option value="1">Number</option>
        <option value="2">Boolean</option>
        <option value="3">Undefined</option>
        <option value="4">Null</option>
    </select>
</div>

<div style="float: right; width: calc(50% - 12px);">
    <span class="dbminputlabel">Variable Description</span><br>
    <input id="variableDescription" class="round" type="text">
</div>

<br><br><br><br><br>

<store-in-variable dropdownLabel="Store In" selectId="storage" variableContainerId="varNameContainer2" variableInputId="varName2"></store-in-variable>
    `;
  },

  // ---------------------------------------------------------------------
  // Action Editor Init Code
  // ---------------------------------------------------------------------

  init() {},

  // ---------------------------------------------------------------------
  // Action Bot Function
  // ---------------------------------------------------------------------

  async action(cache) {
    const data = cache.actions[cache.index];

    const variableValue = this.evalMessage(data.variableValue, cache);
    const variableType = parseInt(data.variableType, 10);
    let value;

    switch (variableType) {
      case 0: // String
        value = String(variableValue);
        break;
      case 1: // Number
        value = Number(variableValue);
        break;
      case 2: // Boolean
        if (typeof variableValue === 'string') {
          const lower = variableValue.toLowerCase().trim();
          if (lower === 'true' || lower === '1') {
            value = true;
          } else if (lower === 'false' || lower === '0') {
            value = false;
          } else {
            value = lower.length > 0;
          }
        } else {
          value = Boolean(variableValue);
        }
        break;

      case 3: // Undefined
        value = undefined;
        break;
      case 4: // Null
        value = null;
        break;
      default:
        value = variableValue;
    }

    const varName2 = this.evalMessage(data.varName2, cache);
    const storage = parseInt(data.storage, 10);
    this.storeValue(value, storage, varName2, cache);
    this.callNextAction(cache);
  },

  // ---------------------------------------------------------------------
  // Action Bot Mod
  // ---------------------------------------------------------------------

  mod() {},
};
