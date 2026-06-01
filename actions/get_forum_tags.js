module.exports = {
  // ---------------------------------------------------------------------
  // Action Name
  // ---------------------------------------------------------------------

  name: 'Get Forum Tags',

  // ---------------------------------------------------------------------
  // Action Section
  // ---------------------------------------------------------------------

  section: 'Channel Control',

  // ---------------------------------------------------------------------
  // Action Subtitle
  // ---------------------------------------------------------------------

  subtitle(data, presets) {
    return `Get tags from forum channel`;
  },

  // ---------------------------------------------------------------------
  // Action Storage Function
  // ---------------------------------------------------------------------

  variableStorage(data, varType) {
    const type = parseInt(data.storage, 10);
    if (type !== varType) return;
    return [data.varName, 'Forum Tags List'];
  },

  // ---------------------------------------------------------------------
  // Action Meta Data
  // ---------------------------------------------------------------------

  meta: {
    version: '2.2.0',
    preciseCheck: true,
    author: null,
    authorUrl: 'https://github.com/master3395/dbm-mods',
    downloadUrl: 'https://github.com/dbm-network/mods',
  },

  // ---------------------------------------------------------------------
  // Action Fields
  // ---------------------------------------------------------------------

  fields: ['forumChannel', 'varName', 'storage', 'varName2'],

  // ---------------------------------------------------------------------
  // Command HTML
  // ---------------------------------------------------------------------

  html(isEvent, data) {
    return `
<channel-input dropdownLabel="Forum Channel" selectId="forumChannel" variableContainerId="varNameContainer" variableInputId="varName"></channel-input>

<br><br><br>

<store-in-variable dropdownLabel="Store Tags In" selectId="storage" variableContainerId="varNameContainer2" variableInputId="varName2"></store-in-variable>`;
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
    const DBM = this.getDBM();
    const DiscordJS = DBM.DiscordJS;
    const isV14 = DBM.isDiscordJSv14 ? DBM.isDiscordJSv14() : parseInt(DiscordJS.version.split('.')[0], 10) >= 14;

    const channel = await this.getChannelFromData(data.forumChannel, data.varName, cache);

    if (!channel) {
      this.callNextAction(cache);
      return;
    }

    // Check if channel is a forum channel
    const ChannelType = DBM.getChannelType ? DBM.getChannelType() : DiscordJS.ChannelType || {};
    const isForum = isV14
      ? channel.type === ChannelType.GuildForum || channel.type === 15
      : channel.type === 'GUILD_FORUM' || channel.type === 15;

    if (!isForum) {
      this.displayError(data, cache, new Error('Channel must be a forum channel'));
      return;
    }

    try {
      // Get available tags from forum channel
      // v13 and v14 use the same API
      const tags = channel.availableTags || [];

      const storage = parseInt(data.storage, 10);
      const varName2 = this.evalMessage(data.varName2, cache);
      this.storeValue(tags, storage, varName2, cache);
      this.callNextAction(cache);
    } catch (err) {
      this.displayError(data, cache, err);
    }
  },

  // ---------------------------------------------------------------------
  // Action Bot Mod
  // ---------------------------------------------------------------------

  mod() {},
};
