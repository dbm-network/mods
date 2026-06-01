module.exports = {
  // ---------------------------------------------------------------------
  // Action Name
  // ---------------------------------------------------------------------

  name: 'Set Channel Category',

  // ---------------------------------------------------------------------
  // Action Section
  // ---------------------------------------------------------------------

  section: 'Channel Control',

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

  subtitle(data, presets) {
    const channelText = presets.getChannelText(data.channel, data.varName1);
    const categoryText = data.categoryId || '<none>';
    const posText = data.position ? ` at position ${data.position}` : '';
    const syncText = data.syncPermissions ? ' (sync permissions)' : '';
    return `Move ${channelText} → Category: ${categoryText}${posText}${syncText}`;
  },

  // ---------------------------------------------------------------------
  // Action Fields
  // ---------------------------------------------------------------------

  fields: ['channel', 'varName1', 'categoryId', 'position', 'syncPermissions'],

  // ---------------------------------------------------------------------
  // Command HTML
  // ---------------------------------------------------------------------

  html() {
    return `
    <div style="position:fixed;bottom:0;left:0;padding:5px;padding-top:5px;padding-bottom:5px;font:13px sans-serif;border-radius:10px;background:rgba(0,0,0,0.7);color:#999;border:1px solid rgba(50,50,50,.7);z-index:999999;opacity:0.5;transition:all .3s" onmouseover="this.style.opacity='1';this.style.borderColor='gray'" onmouseout="this.style.opacity='0.5';this.style.borderColor='rgba(50,50,50,.7)'">Creator: Shadow<br><br>Help: <a href='https://discord.gg/9HYB4n3Dz4' target='_blank' style='color:#07f;text-decoration:none'>Discord</a></div><div style="position:fixed;bottom:0;right:0;padding:5px;font:20px sans-serif;border-radius:10px;background:rgba(0,0,0,0.7);color:#999;border:1px solid rgba(50,50,50,.7);z-index:999999;opacity:0.5;transition:all .3s" onmouseover="this.style.opacity='1';this.style.borderColor='gray'" onmouseout="this.style.opacity='0.5';this.style.borderColor='rgba(50,50,50,.7)'"><a href='https://dbm-polska.github.io/DBM-14/' target='_blank' style='color:#07f;text-decoration:none'><!--Version-->1.0</a></div>
    <div>
      <channel-input dropdownLabel="Source Channel" selectId="channel" variableContainerId="varNameContainer1" variableInputId="varName1"></channel-input>
    </div>

    <br><br><br><br><br>
   
    <div>
     <span class="dbminputlabel">Category ID</span>
     <input id="categoryId" placeholder="Category id to move channel to..." class="round" type="text">
    </div>

    <br>

    <div>
     <span class="dbminputlabel">Channel Position</span>
     <input id="position" placeholder="Enter a number (Leave blank for default)..." class="round" type="text">
    </div>

    <br>

     <dbm-checkbox style="float: left;" id="syncPermissions" label="Sync Channel Permissions to Category"></dbm-checkbox>
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

    const channel = await this.getChannelFromData(data.channel, data.varName1, cache);
    if (!channel) {
      this.callNextAction(cache);
      return;
    }

    const syncPermissions = data.syncPermissions;

    const posInput = data.position ? parseInt(this.evalMessage(data.position, cache), 10) : null;

    const categoryId = this.evalMessage(data.categoryId, cache);

    try {
      await channel.setParent(categoryId, { lockPermissions: syncPermissions });
      if (posInput !== null && !isNaN(posInput)) {
        const targetPosition = Math.max(posInput - 1, 0);
        await channel.setPosition(targetPosition);
      }
    } catch (error) {
      console.error('[Set Channel Category] Error moving channel:', error);
      this.callNextAction(cache);
    }

    this.callNextAction(cache);
  },

  // ---------------------------------------------------------------------
  // Action Bot Mod
  // ---------------------------------------------------------------------

  mod() {},
};
