module.exports = {
  name: 'Server Ban List',
  section: 'Other Stuff',

  subtitle(data) {
    return 'Fetch the list of banned users from a server';
  },

  meta: {
    version: '2.2.0',
    preciseCheck: true,
    author: 'Shadow',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadUrl: 'https://github.com/dbm-network/mods',
  },

  fields: ['server', 'varName', 'storage', 'varName2', 'format'],

  html() {
    return `
<div style="position:fixed;bottom:0;left:0;padding:5px;padding-top:5px;padding-bottom:5px;font:13px sans-serif;border-radius:10px;background:rgba(0,0,0,0.7);color:#999;border:1px solid rgba(50,50,50,.7);z-index:999999;opacity:0.5;transition:all .3s" onmouseover="this.style.opacity='1';this.style.borderColor='gray'" onmouseout="this.style.opacity='0.5';this.style.borderColor='rgba(50,50,50,.7)'">Creator: Shadow<br><br>Help: <a href='https://discord.gg/9HYB4n3Dz4' target='_blank' style='color:#07f;text-decoration:none'>Discord</a></div><div style="position:fixed;bottom:0;right:0;padding:5px;font:20px sans-serif;border-radius:10px;background:rgba(0,0,0,0.7);color:#999;border:1px solid rgba(50,50,50,.7);z-index:999999;opacity:0.5;transition:all .3s" onmouseover="this.style.opacity='1';this.style.borderColor='gray'" onmouseout="this.style.opacity='0.5';this.style.borderColor='rgba(50,50,50,.7)'"><a href='https://dbm-polska.github.io/DBM-14/' target='_blank' style='color:#07f;text-decoration:none'><!--Version-->1.0</a></div>
  

        <server-input 
          dropdownLabel="Source Server" 
          selectId="server" 
          variableContainerId="varNameContainer" 
          variableInputId="varName">
        </server-input>

        <br><br><br>
  
        <div style="padding-top: 8px;">
          <span class="dbminputlabel">Format List</span>
          <select id="format" class="round">
            <option value="inline">Inline (comma-separated)</option>
            <option value="newline">New Line</option>
          </select>
        </div>

        <br><br><br>
  
        <store-in-variable 
          dropdownLabel="Store In" 
          selectId="storage" 
          variableContainerId="varNameContainer2" 
          variableInputId="varName2">
        </store-in-variable>
      `;
  },

  variableStorage(data, varType) {
    const type = parseInt(data.storage, 10);
    if (type !== varType) return;
    return [data.varName2, 'Text'];
  },

  async action(cache) {
    const data = cache.actions[cache.index];
    const server = await this.getServerFromData(data.server, data.varName, cache);
    const format = data.format || 'inline';

    if (!server) {
      return this.callNextAction(cache);
    }

    try {
      const bans = await server.bans.fetch();
      let bannedUsers = bans.map((ban) => ban.user.username);

      if (format === 'inline') {
        bannedUsers = bannedUsers.join(', ');
      } else {
        bannedUsers = bannedUsers.join('\n');
      }

      const storage = parseInt(data.storage, 10);
      const varName = this.evalMessage(data.varName2, cache);
      this.storeValue(bannedUsers, storage, varName, cache);
    } catch (err) {
      console.error('[ERROR] Failed to fetch banned users:', err);
    }

    this.callNextAction(cache);
  },

  mod() {},
};
