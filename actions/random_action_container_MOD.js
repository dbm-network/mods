module.exports = {
  // ---------------------------------------------------------------------
  // Action Name
  // ---------------------------------------------------------------------

  name: 'Random Action Container (%)',

  // ---------------------------------------------------------------------
  // Action Section
  // ---------------------------------------------------------------------

  section: 'Other Stuff',

  // ---------------------------------------------------------------------
  // Action Subtitle
  // ---------------------------------------------------------------------

  subtitle(data) {
    const branches = data.actionContainers?.length || 0;
    const chances = (data.actionContainers || []).map((c) => parseFloat(c.chance || 0)).filter((v) => !isNaN(v));
    const totalChance = chances.reduce((a, b) => a + b, 0);
    return `Action Containers: ${branches},ᅠ|ᅠTotal Chance: ${totalChance}%`;
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

  fields: ['actionContainers'],

  // ---------------------------------------------------------------------
  // Command HTML
  // ---------------------------------------------------------------------

  html(isEvent, data) {
    return `
<div style="position:fixed;bottom:0;left:0;padding:5px;padding-top:5px;padding-bottom:5px;font:13px sans-serif;border-radius:10px;background:rgba(0,0,0,0.7);color:#999;border:1px solid rgba(50,50,50,.7);z-index:999999;opacity:0.5;transition:all .3s" onmouseover="this.style.opacity='1';this.style.borderColor='gray'" onmouseout="this.style.opacity='0.5';this.style.borderColor='rgba(50,50,50,.7)'">Creator: Shadow<br><br>Help: <a href='https://discord.gg/9HYB4n3Dz4' target='_blank' style='color:#07f;text-decoration:none'>Discord</a></div><div style="position:fixed;bottom:0;right:0;padding:5px;font:20px sans-serif;border-radius:10px;background:rgba(0,0,0,0.7);color:#999;border:1px solid rgba(50,50,50,.7);z-index:999999;opacity:0.5;transition:all .3s" onmouseover="this.style.opacity='1';this.style.borderColor='gray'" onmouseout="this.style.opacity='0.5';this.style.borderColor='rgba(50,50,50,.7)'"><a href='https://dbm-polska.github.io/DBM-14/' target='_blank' style='color:#07f;text-decoration:none'><!--Version-->1.0</a></div>

<dialog-list id="actionContainers" fields='["actionContainerName", "chance", "actions"]' saveButtonText="Save Action Container", dialogResizable dialogTitle="Action Container Info" dialogWidth="600" dialogHeight="500" listLabel="Action Containers" listStyle="height: calc(110vh - 290px);" itemName="Action Container" itemHeight="35px;" itemTextFunction="glob.formatItem(data)" itemStyle="line-height: 35px;">
  <div style="padding: 16px;">

  <div style="float: right; width: 100%;">
      <span class="dbminputlabel">Action Container Name</span><br>
      <input id="actionContainerName" class="round" type="text" placeholder="Leave blank for none..." name="is-eval">
    </div>

    <br><br><br>
    
    <div style="float: right; width: 100%;">
      <span class="dbminputlabel">Chance in %</span><br>
      <input id="chance" class="round" type="text" placeholder="e.g. 50% or 50">
    </div>


    <br><br><br><br>

    <action-list-input id="actions" height="calc(100vh - 280px)"></action-list-input>

  </div>
</dialog-list>
`;
  },

  // ---------------------------------------------------------------------
  // Action Editor Init Code
  // ---------------------------------------------------------------------

  init() {
    const { glob } = this;

    glob.formatItem = function (data) {
      const name = data.actionContainerName?.trim() || '';
      let chance = data.chance?.trim() || '0';

      if (chance.includes('%')) {
        chance = chance.replace(/%/g, '');
      }

      return `
      <div style="display: flex; justify-content: space-between; width: 99%;">
        <span>${name}</span>
        <span style="opacity: 0.7;">Chance: ${chance}%</span>
      </div>
    `;
    };
  },

  // ---------------------------------------------------------------------
  // Action Bot Function
  // ---------------------------------------------------------------------

  action(cache) {
    const data = cache.actions[cache.index];
    const containers = data.actionContainers;
    if (!Array.isArray(containers) || containers.length === 0) return this.callNextAction(cache);

    const chances = containers.map((c, i) => {
      const raw = this.evalMessage(c.chance, cache);
      const value = parseFloat(raw);
      if (isNaN(value)) console.warn(`Invalid chance at container ${i}:`, raw);
      return value || 0;
    });

    const totalChance = chances.reduce((a, b) => a + b, 0);

    if (totalChance <= 0) {
      return this.callNextAction(cache);
    }

    const roll = Math.random() * totalChance;

    let cumulative = 0;
    for (let i = 0; i < chances.length; i++) {
      cumulative += chances[i];
      if (roll <= cumulative) {
        const branch = containers[i];
        if (branch && Array.isArray(branch.actions)) {
          this.executeSubActions(branch.actions, cache);
          return;
        }
      }
    }

    this.callNextAction(cache);
  },

  // ---------------------------------------------------------------------
  // Action Bot Mod Init
  // ---------------------------------------------------------------------

  modInit(data) {
    if (Array.isArray(data?.actionContainers)) {
      for (const container of data.actionContainers) {
        this.prepareActions(container.actions);
      }
    }
  },

  // ---------------------------------------------------------------------
  // Action Bot Mod
  // ---------------------------------------------------------------------

  mod() {},
};
