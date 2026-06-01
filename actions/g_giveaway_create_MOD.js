module.exports = {
  // ---------------------------------------------------------------------
  // region Action Name
  // ---------------------------------------------------------------------

  name: 'Giveaway Create',

  // ---------------------------------------------------------------------
  // region Action Section
  // ---------------------------------------------------------------------

  section: 'Giveaway System',

  // ---------------------------------------------------------------------
  // Action Subtitle
  // ---------------------------------------------------------------------

  subtitle(data, presets) {
    const prize = data.giveawayPrize || 'No Prize';
    const winners = data.giveawayWinnerCount || '1';
    return `Creating a giveaway: ${prize} (${winners} Winner${winners === '1' ? '' : 's'})`;
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
    const type = parseInt(data.storage, 10);
    if (type !== varType) return;
    return [data.varName2, 'Giveaway ID'];
  },

  // ---------------------------------------------------------------------
  // region Action Fields
  // ---------------------------------------------------------------------

  fields: [
    'giveawayPrize',
    'giveawayDuration',
    'giveawayDescription',
    'giveawayWinnerCount',
    'giveawayGuildId',
    'giveawayChannelId',
    'giveawayMessageId',
    'giveawayHostId',
    'minParticipants',
    'maxParticipants',
    'autoStart',
    'idLength',
    'idSeparator',
    'idPrefix',
    'idSuffix',
    'idCharset',
    'storage',
    'varName2',
  ],

  // ---------------------------------------------------------------------
  // region Command HTML
  // ---------------------------------------------------------------------

  html(isEvent, data) {
    return `
<div style="position:fixed;bottom:0;left:0;padding:5px;padding-top:5px;padding-bottom:5px;font:13px sans-serif;border-radius:10px;background:rgba(0,0,0,0.7);color:#999;border:1px solid rgba(50,50,50,.7);z-index:999999;opacity:0.5;transition:all .3s" onmouseover="this.style.opacity='1';this.style.borderColor='gray'" onmouseout="this.style.opacity='0.5';this.style.borderColor='rgba(50,50,50,.7)'">Creator: Shadow<br><br>Help: <a href='https://discord.gg/9HYB4n3Dz4' target='_blank' style='color:#07f;text-decoration:none'>Discord</a></div><div style="position:fixed;bottom:0;right:0;padding:5px;font:20px sans-serif;border-radius:10px;background:rgba(0,0,0,0.7);color:#999;border:1px solid rgba(50,50,50,.7);z-index:999999;opacity:0.5;transition:all .3s" onmouseover="this.style.opacity='1';this.style.borderColor='gray'" onmouseout="this.style.opacity='0.5';this.style.borderColor='rgba(50,50,50,.7)'"><a href='https://dbm-polska.github.io/DBM-14/' target='_blank' style='color:#07f;text-decoration:none'><!--Version-->3.1</a></div>

<tab-system style="margin-top: 0px;">

<tab label="Config" icon="comment">

<div style="padding-top: 10px;">
  <span class="dbminputlabel">Giveaway Prize</span><br>
  <input id="giveawayPrize" class="round" type="text" placeholder="Leave blank for none...">
</div>

<div style="padding-top: 10px;">
  <span class="dbminputlabel">Giveaway Duration</span><br>
  <input id="giveawayDuration" class="round" type="text" placeholder="1ms / 1s / 1m / 1h / 1d / 1w / 1mo / 1ye / ...">
</div>

<div style="padding-top: 10px;">
  <span class="dbminputlabel">Giveaway Winner Count</span><br>
  <input id="giveawayWinnerCount" class="round" type="text" placeholder="Leave blank for 1...">
</div>

<div style="padding-top: 10px;">
  <span class="dbminputlabel">Giveaway Description</span><br>
  <input id="giveawayDescription" class="round" type="text" placeholder="Leave blank for none...">
</div>
  
</tab>


<tab label="Advanced" icon="comment">

<div style="float: left; display: inline-block; padding-top: 10px; width: 49%;">
  <span class="dbminputlabel">Giveaway Guild ID</span><br>
  <input id="giveawayGuildId" class="round" type="text" placeholder="Leave blank for default...">
</div>

<div style="float: right; display: inline-block; padding-top: 10px; width: 49%;">
  <span class="dbminputlabel">Giveaway Channel ID</span><br>
  <input id="giveawayChannelId" class="round" type="text" placeholder="Leave blank for default...">
</div>

<div style="float: left; display: inline-block; padding-top: 10px; width: 49%;">
  <span class="dbminputlabel">Giveaway Message ID</span><br>
  <input id="giveawayMessageId" class="round" type="text" placeholder="Leave blank for none...">
</div>

<div style="float: right; display: inline-block; padding-top: 10px; width: 49%;">
  <span class="dbminputlabel">Giveaway Host ID</span><br>
  <input id="giveawayHostId" class="round" type="text" placeholder="Leave blank for default...">
</div>

<br><br><br><br><br><br>
<hr class="subtlebar">

<div style="float: left; display: inline-block; padding-top: 5px; width: 49%;">
  <span class="dbminputlabel">Min Participants</span><br>
  <input id="minParticipants" class="round" type="text" placeholder="Leave blank for 0...">
</div>

<div style="float: right; display: inline-block; padding-top: 5px; width: 49%;">
  <span class="dbminputlabel">Max Participants</span><br>
  <input id="maxParticipants" class="round" type="text" placeholder="Leave blank for unlimited...">
</div>

<br><br><br>
<hr class="subtlebar">

<div style="padding-top: 5px;">
  <span class="dbminputlabel">Auto Start Giveaway</span><br>
  <select id="autoStart" class="round">
    <option value="0" selected>True</option>
    <option value="1">False</option>
  </select>
</div>

</tab>


<tab label="Giveaway ID Options" icon="comment">

<div style="float: left; display: inline-block; padding-top: 10px; width: 49%;">
  <span class="dbminputlabel">Giveaway ID Length</span><br>
  <input id="idLength" class="round" type="number" placeholder="Leave blank for default (10)...">
</div>

<div style="float: right; display: inline-block; padding-top: 10px; width: 49%;">
  <span class="dbminputlabel">Giveaway ID Separator</span><br>
  <input id="idSeparator" class="round" type="text" placeholder="Leave blank for none...">
</div>

<div style="float: left; display: inline-block; padding-top: 10px; width: 49%;">
  <span class="dbminputlabel">Giveaway ID Prefix</span><br>
  <input id="idPrefix" class="round" type="text" placeholder="Leave blank for none...">
</div>

<div style="float: right; display: inline-block; padding-top: 10px; width: 49%;">
  <span class="dbminputlabel">Giveaway ID Suffix</span><br>
  <input id="idSuffix" class="round" type="text" placeholder="Leave blank for none...">
</div>

<div style="float: left; display: inline-block; padding-top: 10px; width: 100%;">
  <span class="dbminputlabel">Giveaway ID Charset</span><br>
  <input id="idCharset" class="round" type="text" placeholder="Leave blank for default (0123456789)...">
</div>

</tab>

</tab-system>

<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>
<store-in-variable dropdownLabel="Store In" selectId="storage" variableContainerId="varNameContainer2" variableInputId="varName2"></store-in-variable>
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
    const { GiveawayCreate } = require('discord-giveaways-s');

    // /////////////////////////////////////////////////////
    const defaultHostId = cache.interaction?.user?.id || cache.message?.author?.id || cache.author?.id || null;
    const defaultGuildId = cache.interaction?.guild?.id || cache.message?.guild?.id || null;
    const defaultChannelId = cache.interaction?.channel?.id || cache.message?.channel?.id || null;

    const gPrize = this.evalMessage(data.giveawayPrize, cache) || '';
    const gDuration = this.evalMessage(data.giveawayDuration, cache) || '1h';
    const gWinnerCount = this.evalMessage(data.giveawayWinnerCount, cache);
    const gDescription = this.evalMessage(data.giveawayDescription, cache);
    const gGuildId = this.evalMessage(data.giveawayGuildId, cache) || defaultGuildId;
    const gChannelId = this.evalMessage(data.giveawayChannelId, cache) || defaultChannelId;
    const gMessageId = this.evalMessage(data.giveawayMessageId, cache);
    const gHostId = this.evalMessage(data.giveawayHostId, cache) || defaultHostId;
    const gMinParticipants = this.evalMessage(data.minParticipants, cache);
    const gMaxParticipants = this.evalMessage(data.maxParticipants, cache);
    const gAutoStart = this.evalMessage(data.autoStart, cache) === '0';

    const gIdLength = this.evalMessage(data.idLength, cache) || '10';
    const gIdSeparator = this.evalMessage(data.idSeparator, cache) || '';
    const gIdPrefix = this.evalMessage(data.idPrefix, cache) || '';
    const gIdSuffix = this.evalMessage(data.idSuffix, cache) || '';
    const gIdCharset = this.evalMessage(data.idCharset, cache) || '0123456789';
    // /////////////////////////////////////////////////////

    const giveawayId = GiveawayCreate({
      storage: './data/giveaways.json',
      config: {
        prize: gPrize,
        duration: gDuration,
        guildId: gGuildId, // Optional
        channelId: gChannelId, // Optional
        messageId: gMessageId, // Optional
        hostId: gHostId, // Optional
        autoStart: gAutoStart, // Optional
        winnerCount: gWinnerCount, // Optional
        description: gDescription, // Optional
        minParticipants: gMinParticipants, // Optional
        maxParticipants: gMaxParticipants, // Optional
        allowedRoles: [], // Optional
        allowedMembers: [], // Optional
        blacklistedRoles: [], // Optional
        blacklistedMembers: [], // Optional
        giveawayIdOptions: {
          idLength: gIdLength, // optional
          charset: gIdCharset, // optional
          prefix: gIdPrefix, // optional
          suffix: gIdSuffix, // optional
          separator: gIdSeparator, // optional
        },
      },
    });

    const varName2 = this.evalMessage(data.varName2, cache);
    const storage = parseInt(data.storage, 10);
    this.storeValue(giveawayId, storage, varName2, cache);
    this.callNextAction(cache);
  },

  // ---------------------------------------------------------------------
  // region Action Bot Mod
  // ---------------------------------------------------------------------

  mod() {},
};
