module.exports = {
  name: 'Top Members',
  section: 'Economy',

  subtitle(data, presets) {
    return `Top ${data.topCount || 5} members (${data.dataName})`;
  },

  meta: {
    version: '2.2.0',
    preciseCheck: true,
    author: 'Shadow',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadUrl: 'https://github.com/dbm-network/mods',
  },

  fields: [
    'dataName',
    'topCount',
    'useNumbers',
    'showValues',
    'suffix',
    'suffix2',
    'suffix3',
    'suffix4',
    'filterBots',
    'reversedOrder',
    'boldNumbers',
    'boldData',
    'italicNumbers',
    'italicData',
    'strikethroughNumbers',
    'strikethroughData',
    'codeNumbers',
    'codeData',
    'boldNick',
    'italicNick',
    'strikethroughNick',
    'codeNick',
    'usePrefix',
    'enableRankingTitle',
    'rankingTitle',
    'storage',
    'varName',
  ],

  html(isEvent, data) {
    return `
  <div style="position:fixed;bottom:0;left:0;padding:5px;padding-top:5px;padding-bottom:5px;font:13px sans-serif;border-radius:10px;background:rgba(0,0,0,0.7);color:#999;border:1px solid rgba(50,50,50,.7);z-index:999999;opacity:0.5;transition:all .3s" onmouseover="this.style.opacity='1';this.style.borderColor='gray'" onmouseout="this.style.opacity='0.5';this.style.borderColor='rgba(50,50,50,.7)'">Creator: Shadow<br><br>Help: <a href='https://discord.gg/9HYB4n3Dz4' target='_blank' style='color:#07f;text-decoration:none'>Discord</a></div><div style="position:fixed;bottom:0;right:0;padding:5px;font:20px sans-serif;border-radius:10px;background:rgba(0,0,0,0.7);color:#999;border:1px solid rgba(50,50,50,.7);z-index:999999;opacity:0.5;transition:all .3s" onmouseover="this.style.opacity='1';this.style.borderColor='gray'" onmouseout="this.style.opacity='0.5';this.style.borderColor='rgba(50,50,50,.7)'"><a href='https://dbm-polska.github.io/DBM-14/' target='_blank' style='color:#07f;text-decoration:none'><!--Version-->2.1</a></div>

      
<tab-system>
  <tab label="General" icon="cogs">
    <div style="display: flex; gap: 10px; padding: 10px;">
      <div style="flex: 1;">
        <span class="dbminputlabel">Data Name</span><br>
        <input id="dataName" class="round" type="text" placeholder="">
      </div>
      <div style="flex: 1;">
        <span class="dbminputlabel">Number of Members</span><br>
        <input id="topCount" class="round" type="number" placeholder="Default 5" min="1">
      </div>
    </div>

    <div style="display: flex; gap: 10px; padding: 10px;">
      <div style="flex: 1;">
        <span class="dbminputlabel">Number The Members</span><br>
        <select id="useNumbers" class="round">
          <option value="true" selected>Yes</option>
          <option value="false">No</option>
        </select>
      </div>
      <div style="flex: 1;">
        <span class="dbminputlabel">Show Data Value</span><br>
        <select id="showValues" class="round">
          <option value="true" selected>Yes</option>
          <option value="false">No</option>
        </select>
      </div>
    </div>

    <hr class="subtlebar" style="margin-top: 50px; margin-bottom: 50px;">

    <store-in-variable dropdownLabel="Store In" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></store-in-variable>
  </tab>


  <tab label="Advanced" icon="sliders">
    <div style="display: flex; gap: 10px; padding: 10px;">
      <div style="flex: 1;">
        <span class="dbminputlabel">Use Prefix "> "</span><br>
        <select id="usePrefix" class="round">
          <option value="true">Yes</option>
          <option value="false" selected>No</option>
        </select>
      </div>
    </div>

    <div style="display: flex; gap: 10px; padding: 10px;">
  <div style="flex: 1;">
    <span class="dbminputlabel">Text 1</span><br>
    <input id="suffix" class="round" type="text" placeholder="Leave blank for none...">
  </div>

  <div style="flex: 1;">
    <span class="dbminputlabel">Text 2</span><br>
    <input id="suffix2" class="round" type="text" placeholder="Leave blank for none...">
  </div>

  <div style="flex: 1;">
    <span class="dbminputlabel">Text 3</span><br>
    <input id="suffix3" class="round" type="text" placeholder="Leave blank for none...">
  </div>

  <div style="flex: 1;">
    <span class="dbminputlabel">Text 4</span><br>
    <input id="suffix4" class="round" type="text" placeholder="Leave blank for none...">
  </div>
</div>

    <div style="display: flex; gap: 10px; padding: 10px;">
      <div style="flex: 1;">
         <span class="dbminputlabel">Filter Bots</span><br>
         <select id="filterBots" class="round">
            <option value="true">Yes</option>
            <option value="false" selected>No</option>
         </select>
      </div>
    </div>

    <div style="display: flex; gap: 10px; padding: 10px;">
      <div style="flex: 1;">
        <span class="dbminputlabel">Reversed Order</span><br>
        <select id="reversedOrder" class="round">
          <option value="true">Yes</option>
          <option value="false" selected>No</option>
        </select>
      </div>
    </div>

    <div style="display: flex; align-items: center; gap: 20px; padding: 10px;">
  <!-- Enable Ranking Title -->
  <div style="flex: 1;">
    <span class="dbminputlabel">Enable Ranking Title</span><br>
    <select id="enableRankingTitle" class="round">
      <option value="true">Yes</option>
      <option value="false" selected>No</option>
    </select>
  </div>

  <div style="flex: 2;">
    <span class="dbminputlabel">Ranking Title</span><br>
    <input id="rankingTitle" class="round" type="text" placeholder="Default: '🏆 Top Members 🏆'">
  </div>
</div>
  </tab>


  <tab label="Font" icon="font">
  <div style="display: flex; gap: 10px; padding: 10px;">

    <div style="flex: 1;">
      <dbm-checkbox id="boldNumbers" label="Numbers (Bold)" style="margin-bottom: 10px;"></dbm-checkbox>
      <dbm-checkbox id="italicNumbers" label="Numbers (Italic)" style="margin-bottom: 10px;"></dbm-checkbox>
      <dbm-checkbox id="strikethroughNumbers" label="Numbers (Strike)" style="margin-bottom: 10px;"></dbm-checkbox>
      <dbm-checkbox id="codeNumbers" label="Numbers (Code)"></dbm-checkbox>
    </div>

    <div style="flex: 1;">
      <dbm-checkbox id="boldData" label="Data Value (Bold)" style="margin-bottom: 10px;"></dbm-checkbox>
      <dbm-checkbox id="italicData" label="Data Value (Italic)" style="margin-bottom: 10px;"></dbm-checkbox>
      <dbm-checkbox id="strikethroughData" label="Data Value (Strike)" style="margin-bottom: 10px;"></dbm-checkbox>
      <dbm-checkbox id="codeData" label="Data Value (Code)"></dbm-checkbox>
    </div>


    <div style="flex: 1;">
  <dbm-checkbox id="boldNick" label="Nickname (Bold)" style="margin-bottom: 10px;"></dbm-checkbox>
  <dbm-checkbox id="italicNick" label="Nickname (Italic)" style="margin-bottom: 10px;"></dbm-checkbox>
  <dbm-checkbox id="strikethroughNick" label="Nickname (Strike)" style="margin-bottom: 10px;"></dbm-checkbox>
  <dbm-checkbox id="codeNick" label="Nickname (Code)"></dbm-checkbox>
</div>


    
  </div>
</tab>

    `;
  },

  variableStorage(data, varType) {
    const storageType = parseInt(data.storage, 10);
    if (storageType !== varType) return;
    return [data.varName, 'Top Members'];
  },

  async action(cache) {
    const fs = require('fs');
    const path = require('path');
    const data = cache.actions[cache.index];
    const filePath = path.join(__dirname, '../data/players.json');

    const dataName = this.evalMessage(data.dataName, cache) || 'bank';
    const topCount = parseInt(this.evalMessage(data.topCount, cache), 10) || 5;

    const useNumbers = this.evalMessage(data.useNumbers, cache) === 'true';
    const showValues = this.evalMessage(data.showValues, cache) === 'true';
    const filterBots = this.evalMessage(data.filterBots, cache) === 'true';
    const reversedOrder = this.evalMessage(data.reversedOrder, cache) === 'true';
    const usePrefix = this.evalMessage(data.usePrefix, cache) === 'true';
    const enableRankingTitle = this.evalMessage(data.enableRankingTitle, cache) === 'true';
    const rankingTitle = enableRankingTitle ? this.evalMessage(data.rankingTitle, cache) || '🏆 Top Members 🏆' : '';

    const suffix = this.evalMessage(data.suffix, cache) || '';
    const suffix2 = this.evalMessage(data.suffix2, cache) || '';
    const formattedSuffix2 = suffix2 ? `${suffix2} ` : '';
    const suffix3 = this.evalMessage(data.suffix3, cache) || '';
    const formattedSuffix3 = suffix3 ? ` ${suffix3}` : '';
    const suffix4 = this.evalMessage(data.suffix4, cache) || '';
    const formattedSuffix4 = suffix4 ? ` ${suffix4}` : '';

    const boldNick = Boolean(data.boldNick);
    const italicNick = Boolean(data.italicNick);
    const strikethroughNick = Boolean(data.strikethroughNick);
    const codeNick = Boolean(data.codeNick);
    const boldNumbers = Boolean(data.boldNumbers);
    const boldData = Boolean(data.boldData);
    const boldSuffix = Boolean(data.boldSuffix);
    const italicNumbers = Boolean(data.italicNumbers);
    const italicData = Boolean(data.italicData);
    const italicSuffix = Boolean(data.italicSuffix);
    const strikethroughNumbers = Boolean(data.strikethroughNumbers);
    const strikethroughData = Boolean(data.strikethroughData);
    const strikethroughSuffix = Boolean(data.strikethroughSuffix);
    const codeNumbers = Boolean(data.codeNumbers);
    const codeData = Boolean(data.codeData);
    const codeSuffix = Boolean(data.codeSuffix);

    let playerData;
    try {
      playerData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (err) {
      console.error('Error reading the players.json file:', err);
      return this.callNextAction(cache);
    }

    const guild = cache.interaction.guild;
    if (!guild) {
      console.error('Guild is undefined. Cannot access members.');
      return this.callNextAction(cache);
    }

    const allMembers = await guild.members.fetch();

    const validPlayers = Object.entries(playerData).filter(([userId, data]) => {
      const member = allMembers.get(userId);
      if (!member) return false;
      if (filterBots && member.user.bot) return false;
      return data[dataName] !== undefined && data[dataName] !== null;
    });

    if (validPlayers.length === 0) {
      this.storeValue(
        'No members to display in the ranking.',
        parseInt(data.storage, 10),
        this.evalMessage(data.varName, cache),
        cache,
      );
      return this.callNextAction(cache);
    }

    const sortedPlayers = validPlayers.sort(([, a], [, b]) =>
      reversedOrder ? a[dataName] - b[dataName] : b[dataName] - a[dataName],
    );
    const topPlayers = sortedPlayers.slice(0, topCount);

    let response = '';

    if (enableRankingTitle) {
      response += `**${rankingTitle}**\n\n`;
    }

    topPlayers.forEach(([userId, data], index) => {
      const prefix = usePrefix ? '> ' : '';
      let number = useNumbers ? `${index + 1}. ` : '';
      let value = showValues ? `${data[dataName]}` : '';
      let formattedSuffix = suffix ? ` ${suffix}` : '';
      let formattedNick = `<@${userId}>`;

      if (boldNumbers && useNumbers) number = `**${number}**`;
      if (boldData && showValues) value = `**${value}**`;
      if (boldSuffix && suffix) formattedSuffix = ` **${suffix}**`;

      if (italicNumbers && useNumbers) number = `*${number}*`;
      if (italicData && showValues) value = `*${value}*`;
      if (italicSuffix && suffix) formattedSuffix = ` *${suffix}*`;

      if (strikethroughNumbers && useNumbers) number = `~~${number}~~`;
      if (strikethroughData && showValues) value = `~~${value}~~`;
      if (strikethroughSuffix && suffix) formattedSuffix = ` ~~${suffix}~~`;

      if (codeNumbers && useNumbers) number = `\`${number}\``;
      if (codeData && showValues) value = `\`${value}\``;
      if (codeSuffix && suffix) formattedSuffix = ` \`${suffix}\``;

      if (boldNick) formattedNick = `**${formattedNick}**`;
      if (italicNick) formattedNick = `*${formattedNick}*`;
      if (strikethroughNick) formattedNick = `~~${formattedNick}~~`;
      if (codeNick) formattedNick = `\`${formattedNick}\``;

      response += `${formattedSuffix} ${prefix}${number}${formattedSuffix2}${formattedNick} ${formattedSuffix3} ${value}${formattedSuffix4}\n`;
    });

    if (response === '\n') {
      response = 'No members to display in the ranking.';
    }

    const storage = parseInt(data.storage, 10);
    const varName = this.evalMessage(data.varName, cache);
    this.storeValue(response, storage, varName, cache);
    this.callNextAction(cache);
  },

  mod() {},
};
