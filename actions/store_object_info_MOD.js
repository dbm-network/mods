module.exports = {
  // ---------------------------------------------------------------------
  // Action Name
  // ---------------------------------------------------------------------

  name: 'Store Object Info',

  // ---------------------------------------------------------------------
  // Action Section
  // ---------------------------------------------------------------------

  section: 'Other Stuff',

  // ---------------------------------------------------------------------
  // Action Subtitle
  // ---------------------------------------------------------------------

  subtitle(data, presets) {
    const info = data.info || 'full object';
    const varName = data.varName || 'unknown';
    return `Get (${info}) from (${varName}) object`;
  },

  // ---------------------------------------------------------------------
  // Action Storage Function
  // ---------------------------------------------------------------------

  variableStorage(data, varType) {
    const type = parseInt(data.storage, 10);
    if (type !== varType) return;
    return [data.varName2, 'Object Info'];
  },

  // ---------------------------------------------------------------------
  // Action Meta Data
  // ---------------------------------------------------------------------

  meta: {
    version: '2.2.0',
    preciseCheck: true,
    author: 'Shadow',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadUrl: 'https://github.com/dbm-network/mods',
  },

  // ---------------------------------------------------------------------
  // Action Fields
  // ---------------------------------------------------------------------

  fields: ['storage', 'varName', 'info', 'debugLog', 'storage2', 'varName2'],

  // ---------------------------------------------------------------------
  // Command HTML
  // ---------------------------------------------------------------------

  html(isEvent, data) {
    return `
<div style="position:fixed;bottom:0;left:0;padding:5px;padding-top:5px;padding-bottom:5px;font:13px sans-serif;border-radius:10px;background:rgba(0,0,0,0.7);color:#999;border:1px solid rgba(50,50,50,.7);z-index:999999;opacity:0.5;transition:all .3s" onmouseover="this.style.opacity='1';this.style.borderColor='gray'" onmouseout="this.style.opacity='0.5';this.style.borderColor='rgba(50,50,50,.7)'">Creator: Shadow<br><br>Help: <a href='https://discord.gg/9HYB4n3Dz4' target='_blank' style='color:#07f;text-decoration:none'>Discord</a></div><div style="position:fixed;bottom:0;right:0;padding:5px;font:20px sans-serif;border-radius:10px;background:rgba(0,0,0,0.7);color:#999;border:1px solid rgba(50,50,50,.7);z-index:999999;opacity:0.5;transition:all .3s" onmouseover="this.style.opacity='1';this.style.borderColor='gray'" onmouseout="this.style.opacity='0.5';this.style.borderColor='rgba(50,50,50,.7)'"><a href='https://dbm-polska.github.io/DBM-14/' target='_blank' style='color:#07f;text-decoration:none'><!--Version-->1.0</a></div>

<retrieve-from-variable allowSlashParams dropdownLabel="Source Object" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></retrieve-from-variable>

<br><br><br>
<dbm-checkbox id="debugLog" label="Debug Log (show full object in console)"></dbm-checkbox>
<br>

<div style="width: 100%; padding:8px; height: calc((100vh - 270px) / 2); overflow:auto">
  <span class="dbminputlabel">Info From Object</span>
  <textarea id="info" class="dbm_monospace" rows="10" placeholder="Leave blank for full object..." style="height: calc((100vh - 309px) / 3); white-space: nowrap;"></textarea>
</div>

<br>

<store-in-variable dropdownLabel="Store In" selectId="storage2" variableContainerId="varNameContainer2" variableInputId="varName2"></store-in-variable>`;
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
    const type = parseInt(data.storage, 10);
    const varName = this.evalMessage(data.varName, cache);
    const variable = this.getVariable(type, varName, cache);
    const info = this.evalMessage(data.info, cache);

    function getNestedValue(obj, path) {
      return path.split('.').reduce((acc, part) => acc?.[part], obj);
    }

    const result = getNestedValue(variable, info) || variable;

    if (data.debugLog) {
      console.log(variable);
    }

    const storage = parseInt(data.storage2, 10);
    const varName2 = this.evalMessage(data.varName2, cache);
    this.storeValue(result, storage, varName2, cache);

    this.callNextAction(cache);
  },

  // ---------------------------------------------------------------------
  // Action Bot Mod
  // ---------------------------------------------------------------------

  mod() {},
};
