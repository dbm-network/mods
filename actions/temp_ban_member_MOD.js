module.exports = {
  // ---------------------------------------------------------------------
  // Action Name
  // ---------------------------------------------------------------------

  name: 'Temp Ban Member',

  // ---------------------------------------------------------------------
  // Action Section
  // ---------------------------------------------------------------------

  section: 'Member Control',

  // ---------------------------------------------------------------------
  // Action Subtitle
  // ---------------------------------------------------------------------

  subtitle(data, presets) {
    return `${presets.getMemberText(data.member, data.varName)}`;
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

  fields: ['member', 'varName', 'reason', 'days', 'time', 'storage', 'varName2'],

  // ---------------------------------------------------------------------
  // Action Storage Function
  // ---------------------------------------------------------------------

  variableStorage(data, varType) {
    const type = parseInt(data.storage, 10);
    if (type !== varType) return;

    return [data.varName2, `Timestamp`];
  },

  // ---------------------------------------------------------------------
  // Command HTML
  // ---------------------------------------------------------------------

  html(isEvent, data) {
    return `
   <div style="position:fixed;bottom:0;left:0;padding:5px;padding-top:5px;padding-bottom:5px;font:13px sans-serif;border-radius:10px;background:rgba(0,0,0,0.7);color:#999;border:1px solid rgba(50,50,50,.7);z-index:999999;opacity:0.5;transition:all .3s" onmouseover="this.style.opacity='1';this.style.borderColor='gray'" onmouseout="this.style.opacity='0.5';this.style.borderColor='rgba(50,50,50,.7)'">Creator: Shadow<br><br>Help: <a href='https://discord.gg/9HYB4n3Dz4' target='_blank' style='color:#07f;text-decoration:none'>Discord</a></div><div style="position:fixed;bottom:0;right:0;padding:5px;font:20px sans-serif;border-radius:10px;background:rgba(0,0,0,0.7);color:#999;border:1px solid rgba(50,50,50,.7);z-index:999999;opacity:0.5;transition:all .3s" onmouseover="this.style.opacity='1';this.style.borderColor='gray'" onmouseout="this.style.opacity='0.5';this.style.borderColor='rgba(50,50,50,.7)'"><a href='https://dbm-polska.github.io/DBM-14/' target='_blank' style='color:#07f;text-decoration:none'><!--Version-->1.0</a></div>

<member-input dropdownLabel="Member" selectId="member" variableContainerId="varNameContainer" variableInputId="varName"></member-input>

<br><br><br>

<div style="padding-top: 8px;">
	<span class="dbminputlabel">Reason</span><br>
	<textarea id="reason" class="dbm_monospace" rows="5" placeholder="Insert reason here..." style="white-space: nowrap; resize: none;"></textarea>
</div><br>

<div>
  <span class="dbminputlabel">Number of days of messages to delete</span>
  <input id="days" placeholder="Optional" class="round" type="text">
</div><br>

<div>
  <span class="dbminputlabel">Duration of ban</span>
  <input id="time" placeholder="e.g. 1d / 1h / 1m / 1s" class="round" type="text">
</div><br>

<store-in-variable allowNone dropdownLabel="Store Timestamp In" selectId="storage" variableContainerId="varNameContainer2" variableInputId="varName2"></store-in-variable>
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
    const fs = require('fs');
    const path = require('path');

    process.on('unhandledRejection', (reason) => {
      console.error('[Temp Ban Member] Error:', reason);
      this.callNextAction(cache);
    });

    const member = await this.getMemberFromData(data.member, data.varName, cache);
    const reason = this.evalMessage(data.reason, cache);
    const days = parseInt(data.days, 10) || 0;
    const timeStr = this.evalMessage(data.time, cache).trim() || '1h';

    function parseDuration(str) {
      const match = str.match(/^(\d+)([dhms])$/i);
      if (!match) return null;
      const num = parseInt(match[1], 10);
      const unit = match[2].toLowerCase();
      switch (unit) {
        case 'd':
          return num * 24 * 60 * 60 * 1000;
        case 'h':
          return num * 60 * 60 * 1000;
        case 'm':
          return num * 60 * 1000;
        case 's':
          return num * 1000;
        default:
          return null;
      }
    }

    const recordBan = async (guildId, userId, expiresAt) => {
      try {
        const dataDir = path.resolve('data');
        const filePath = path.join(dataDir, 'bans.json');

        if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
        if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, JSON.stringify({}, null, 2));

        let bans = {};
        try {
          bans = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        } catch (err) {
          bans = {};
        }

        if (!bans[guildId]) bans[guildId] = {};
        bans[guildId][userId] = expiresAt;
        fs.writeFileSync(filePath, JSON.stringify(bans, null, 2));
      } catch (err) {
        console.error('[Temp Ban Member] Error saving ban record:', err);
      }
    };

    const onBanSuccess = () => {
      const durationMs = parseDuration(timeStr);
      if (durationMs !== null) {
        const expiresAt = Date.now() + durationMs;
        recordBan(member.guild.id, member.id, expiresAt);

        const storage = parseInt(data.storage, 10);
        const varName2 = this.evalMessage(data.varName2, cache);
        const unixSec = Math.floor(expiresAt / 1000);
        this.storeValue(unixSec, storage, varName2, cache);
      }
      this.callNextAction(cache);
    };

    if (member) {
      member
        .ban({ days, reason })
        .then(onBanSuccess)
        .catch((err) => this.displayError(data, cache, err));
    } else {
      this.callNextAction(cache);
    }
  },

  // ---------------------------------------------------------------------
  // Action Bot Mod
  // ---------------------------------------------------------------------

  mod(DBM) {
    const fs = require('fs');
    const path = require('path');

    setInterval(() => {
      const filePath = path.resolve('data', 'bans.json');
      if (!fs.existsSync(filePath)) return;
      let bans;
      try {
        bans = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      } catch {
        return;
      }
      const now = Date.now();
      let updated = false;
      const client = DBM.Bot.bot;
      for (const gid of Object.keys(bans)) {
        const guild = client.guilds.cache.get(gid);
        if (!guild) continue;
        for (const uid of Object.keys(bans[gid])) {
          if (now >= bans[gid][uid]) {
            guild.members
              .unban(uid)
              .then(() => {})
              .catch(console.error);
            delete bans[gid][uid];
            updated = true;
          }
        }
        if (Object.keys(bans[gid]).length === 0) {
          delete bans[gid];
          updated = true;
        }
      }
      if (updated) {
        fs.writeFileSync(filePath, JSON.stringify(bans, null, 2));
      }
    }, 5000);
  },
};
