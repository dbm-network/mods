module.exports = {
  // ---------------------------------------------------------------------
  // region Action Name
  // ---------------------------------------------------------------------

  name: 'Giveaway Restore From Backup',

  // ---------------------------------------------------------------------
  // region Action Section
  // ---------------------------------------------------------------------

  section: 'Giveaway System',

  // ---------------------------------------------------------------------
  // Action Subtitle
  // ---------------------------------------------------------------------

  subtitle(data, presets) {
    return `Restore backup of all giveaways`;
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

  fields: ['backupFileName'],

  // ---------------------------------------------------------------------
  // region Command HTML
  // ---------------------------------------------------------------------

  html(isEvent, data) {
    return `
<div style="position:fixed;bottom:0;left:0;padding:5px;padding-top:5px;padding-bottom:5px;font:13px sans-serif;border-radius:10px;background:rgba(0,0,0,0.7);color:#999;border:1px solid rgba(50,50,50,.7);z-index:999999;opacity:0.5;transition:all .3s" onmouseover="this.style.opacity='1';this.style.borderColor='gray'" onmouseout="this.style.opacity='0.5';this.style.borderColor='rgba(50,50,50,.7)'">Creator: Shadow<br><br>Help: <a href='https://discord.gg/9HYB4n3Dz4' target='_blank' style='color:#07f;text-decoration:none'>Discord</a></div><div style="position:fixed;bottom:0;right:0;padding:5px;font:20px sans-serif;border-radius:10px;background:rgba(0,0,0,0.7);color:#999;border:1px solid rgba(50,50,50,.7);z-index:999999;opacity:0.5;transition:all .3s" onmouseover="this.style.opacity='1';this.style.borderColor='gray'" onmouseout="this.style.opacity='0.5';this.style.borderColor='rgba(50,50,50,.7)'"><a href='https://dbm-polska.github.io/DBM-14/' target='_blank' style='color:#07f;text-decoration:none'><!--Version-->3.1</a></div>

<div style="float: left; display: inline-block; padding-top: 10px; width: 100%;">
  <span class="dbminputlabel">Giveaway Backup File Name</span><br>
  <input id="backupFileName" class="round" type="text" placeholder="Leave blank for backup_giveaways.json..." value="backup_giveaways.json">
</div>

<br><br><br>
<hr class="subtlebar">

This action is used to restore a backup copy of the json file where all the information about each giveaway is saved, (To restore a backup copy you must first create it using the "Giveaway Create Backup" action).
`;
  },

  // ---------------------------------------------------------------------
  // region Action Editor Init Code
  // ---------------------------------------------------------------------

  init() {},

  // ---------------------------------------------------------------------
  // region Action Bot Function
  // ---------------------------------------------------------------------

  async action(cache) {
    const data = cache.actions[cache.index];
    const { GiveawayRestoreFromBackup } = require('discord-giveaways-s');
    const backupFileName = this.evalMessage(data.backupFileName, cache) || 'backup_giveaways.json';

    GiveawayRestoreFromBackup({
      storage: './data/giveaways.json',
      backupPath: `./data/backup/${backupFileName}`,
    });

    this.callNextAction(cache);
  },

  // ---------------------------------------------------------------------
  // region Action Bot Mod
  // ---------------------------------------------------------------------

  mod() {},
};
