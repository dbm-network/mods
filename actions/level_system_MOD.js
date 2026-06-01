module.exports = {
  // ---------------------------------------------------------------------
  // Action Name
  // ---------------------------------------------------------------------

  name: 'Level System',

  // ---------------------------------------------------------------------
  // Action Section
  // ---------------------------------------------------------------------

  section: 'Economy',

  // ---------------------------------------------------------------------
  // Action Subtitle
  // ---------------------------------------------------------------------

  subtitle(data, presets) {
    return `Level and XP management`;
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

  fields: ['xpPerMessage', 'xpToLevelUp', 'actions'],

  // ---------------------------------------------------------------------
  // Command HTML
  // ---------------------------------------------------------------------

  html(isEvent, data) {
    return `
<div style="position:fixed;bottom:0;left:0;padding:5px;padding-top:5px;padding-bottom:5px;font:13px sans-serif;border-radius:10px;background:rgba(0,0,0,0.7);color:#999;border:1px solid rgba(50,50,50,.7);z-index:999999;opacity:0.5;transition:all .3s" onmouseover="this.style.opacity='1';this.style.borderColor='gray'" onmouseout="this.style.opacity='0.5';this.style.borderColor='rgba(50,50,50,.7)'">Creator: Shadow<br><br>Help: <a href='https://discord.gg/9HYB4n3Dz4' target='_blank' style='color:#07f;text-decoration:none'>Discord</a></div><div style="position:fixed;bottom:0;right:0;padding:5px;font:20px sans-serif;border-radius:10px;background:rgba(0,0,0,0.7);color:#999;border:1px solid rgba(50,50,50,.7);z-index:999999;opacity:0.5;transition:all .3s" onmouseover="this.style.opacity='1';this.style.borderColor='gray'" onmouseout="this.style.opacity='0.5';this.style.borderColor='rgba(50,50,50,.7)'"><a href='https://dbm-polska.github.io/DBM-14/' target='_blank' style='color:#07f;text-decoration:none'><!--Version-->1.0</a></div>
  

    <tab-system style="margin-top: 20px;">
      <!-- General Tab -->
      <tab label="General" icon="cogs">
        <div style="margin-top: 12px; display: flex; gap: 20px;">
          <div style="flex: 1;">
            <span class="dbminputlabel">XP per Message</span>
            <input id="xpPerMessage" class="round" type="text">
          </div>
          <div style="flex: 1;">
            <span class="dbminputlabel">XP to Level Up</span>
            <input id="xpToLevelUp" class="round" type="text">
          </div>
        </div>
      </tab>

      <!-- Action Tab -->
      <tab label="Level UP" icon="cogs">
        <action-list-input id="actions" height="calc(100vh - 300px)"></action-list-input>
      </tab>
    </tab-system>
    `;
  },

  // ---------------------------------------------------------------------
  // Action Storage Function
  // ---------------------------------------------------------------------

  variableStorage(data, varType) {
    const storageType = parseInt(data.storage, 10);
    if (storageType !== varType) return;
    return [data.varName, 'Text'];
  },

  // ---------------------------------------------------------------------
  // Action Editor Init Code
  // ---------------------------------------------------------------------

  init() {},

  // ---------------------------------------------------------------------
  // Action Bot Function
  // ---------------------------------------------------------------------

  async action(cache) {
    const fs = require('fs');
    const path = require('path');
    const data = cache.actions[cache.index];
    const xpPerMessage = parseInt(this.evalMessage(data.xpPerMessage, cache), 10);
    const xpToLevelUp = parseInt(this.evalMessage(data.xpToLevelUp, cache), 10);

    const economyFilePath = path.join(__dirname, '..', 'data', 'players.json');

    let economyData = {};
    if (fs.existsSync(economyFilePath)) {
      economyData = JSON.parse(fs.readFileSync(economyFilePath, 'utf-8'));
    } else {
      fs.writeFileSync(economyFilePath, JSON.stringify(economyData, null, 2), 'utf-8');
    }

    const member = cache.msg.guild.members.cache.get(cache.msg.author.id);
    if (!member) {
      console.error('Could not find member.');
      return this.callNextAction(cache);
    }
    const memberId = member.id;
    const currentXP = economyData[memberId]?.xp || 0;
    let newXP = currentXP + xpPerMessage;
    let currentLevel = economyData[memberId]?.level || 0;

    let levelUp = false;
    if (newXP >= xpToLevelUp) {
      newXP = 0;
      currentLevel += 1;
      levelUp = true;
    }

    if (!economyData[memberId]) {
      economyData[memberId] = {
        username: member.user.username,
        xp: newXP,
        level: currentLevel,
      };
    } else {
      economyData[memberId].username = member.user.username;
      economyData[memberId].xp = newXP;
      economyData[memberId].level = currentLevel;
    }
    fs.writeFileSync(economyFilePath, JSON.stringify(economyData, null, 2), 'utf-8');

    if (levelUp) {
      const actions = data.actions ? data.actions : [];
      if (actions.length > 0) {
        this.executeSubActionsThenNextAction(actions, cache);
        return;
      }
    }

    this.callNextAction(cache);
  },

  // ---------------------------------------------------------------------
  // Action Bot Mod
  // ---------------------------------------------------------------------

  mod() {},
};
