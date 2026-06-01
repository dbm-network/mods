module.exports = {
  // ---------------------------------------------------------------------
  // region Action Name
  // ---------------------------------------------------------------------

  name: 'Convert Giveaway Winners List',

  // ---------------------------------------------------------------------
  // region Action Section
  // ---------------------------------------------------------------------

  section: 'Giveaway System',

  // ---------------------------------------------------------------------
  // Action Subtitle
  // ---------------------------------------------------------------------

  subtitle(data, presets) {
    const formats = [
      'IDs (comma)',
      'IDs (lines)',
      'Nicknames (comma)',
      'Nicknames (lines)',
      'Mentions (comma)',
      'Mentions (lines)',
    ];
    const idx = parseInt(data.convertType, 10);
    return `Convert winners list to: ${formats[idx] || formats[0]}`;
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

  fields: ['storage', 'varName', 'convertType', 'storage2', 'varName2'],

  // ---------------------------------------------------------------------
  // region Command HTML
  // ---------------------------------------------------------------------

  html(isEvent, data) {
    return `
<div style="position:fixed;bottom:0;left:0;padding:5px;padding-top:5px;padding-bottom:5px;font:13px sans-serif;border-radius:10px;background:rgba(0,0,0,0.7);color:#999;border:1px solid rgba(50,50,50,.7);z-index:999999;opacity:0.5;transition:all .3s" onmouseover="this.style.opacity='1';this.style.borderColor='gray'" onmouseout="this.style.opacity='0.5';this.style.borderColor='rgba(50,50,50,.7)'">Creator: Shadow<br><br>Help: <a href='https://discord.gg/9HYB4n3Dz4' target='_blank' style='color:#07f;text-decoration:none'>Discord</a></div><div style="position:fixed;bottom:0;right:0;padding:5px;font:20px sans-serif;border-radius:10px;background:rgba(0,0,0,0.7);color:#999;border:1px solid rgba(50,50,50,.7);z-index:999999;opacity:0.5;transition:all .3s" onmouseover="this.style.opacity='1';this.style.borderColor='gray'" onmouseout="this.style.opacity='0.5';this.style.borderColor='rgba(50,50,50,.7)'"><a href='https://dbm-polska.github.io/DBM-14/' target='_blank' style='color:#07f;text-decoration:none'><!--Version-->3.1</a></div>

<retrieve-from-variable allowSlashParams dropdownLabel="Variable" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></retrieve-from-variable>

<br><br><br>
<hr class="subtlebar" style="margin-top: 4px; margin-bottom: 4px; width: 100%;">
<br>

<span class="dbminputlabel">Convert To</span><br>
<select id="convertType" class="round">
  <option value="0" selected>List Of IDs (after comma)</option>
  <option value="1">List Of IDs (each on a new line)</option>
  <option value="2">List Of Nicknames (after comma)</option>
  <option value="3">List Of Nicknames (each on a new line)</option>
  <option value="4">List Of Mentions (after comma)</option>
  <option value="5">List Of Mentions (each on a new line)</option>
</select>

<br><br>

<store-in-variable dropdownLabel="Store In" selectId="storage2" variableContainerId="varNameContainer2" variableInputId="varName2"></store-in-variable>
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
    const bot = this.getDBM().Bot.bot;

    // /////////////////////////////////////////////////////
    const type = parseInt(data.storage, 10);
    const varName = this.evalMessage(data.varName, cache);
    let list = this.getVariable(type, varName, cache);

    // /////////////////////////////////////////////////////

    if (typeof list === 'string') {
      try {
        list = JSON.parse(list);
      } catch {}
    }
    if (!Array.isArray(list)) list = [];

    const mode = parseInt(data.convertType, 10);
    const separator = mode % 2 === 0 ? ', ' : '\n';

    const results = await Promise.all(
      list.map(async (id) => {
        if (mode < 2) {
          return id;
        }

        const guild = bot.guilds.cache.first();
        const member = guild?.members.cache.get(id) || (guild ? await guild.members.fetch(id).catch(() => null) : null);
        if (!member) return id;
        if (mode < 4) {
          return member.displayName || member.user.username;
        }
        return `<@${id}>`;
      }),
    );
    const output = results.join(separator);
    const storage = parseInt(data.storage2, 10);
    const varName2 = this.evalMessage(data.varName2, cache);
    this.storeValue(output, storage, varName2, cache);
    this.callNextAction(cache);
  },

  // ---------------------------------------------------------------------
  // region Action Bot Mod
  // ---------------------------------------------------------------------

  mod() {},
};
