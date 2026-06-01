module.exports = {
  // ---------------------------------------------------------------------
  // Action Name
  // ---------------------------------------------------------------------

  name: 'Create Forum Post',

  // ---------------------------------------------------------------------
  // Action Section
  // ---------------------------------------------------------------------

  section: 'Channel Control',

  // ---------------------------------------------------------------------
  // Action Subtitle
  // ---------------------------------------------------------------------

  subtitle(data, presets) {
    return `${data.postName || 'Unnamed Post'}`;
  },

  // ---------------------------------------------------------------------
  // Action Storage Function
  // ---------------------------------------------------------------------

  variableStorage(data, varType) {
    const type = parseInt(data.storage, 10);
    if (type !== varType) return;
    return [data.varName, 'Forum Post'];
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

  fields: ['forumChannel', 'varName', 'postName', 'message', 'tags', 'storage', 'varName2'],

  // ---------------------------------------------------------------------
  // Command HTML
  // ---------------------------------------------------------------------

  html(isEvent, data) {
    return `
<channel-input dropdownLabel="Forum Channel" selectId="forumChannel" variableContainerId="varNameContainer" variableInputId="varName"></channel-input>

<br><br><br>

<div style="padding-top: 8px;">
  <span class="dbminputlabel">Post Name</span><br>
  <input id="postName" class="round" type="text" placeholder="Enter post name...">
</div>

<br>

<div style="padding-top: 8px;">
  <span class="dbminputlabel">Message Content</span><br>
  <textarea id="message" class="dbm_monospace" rows="5" placeholder="Enter message content..." style="white-space: nowrap; resize: none;"></textarea>
</div>

<br>

<div style="padding-top: 8px;">
  <span class="dbminputlabel">Tags (comma-separated tag IDs, leave blank for none)</span><br>
  <input id="tags" class="round" type="text" placeholder="tag-id-1, tag-id-2">
</div>

<br>

<store-in-variable dropdownLabel="Store Post In" selectId="storage" variableContainerId="varNameContainer2" variableInputId="varName2"></store-in-variable>`;
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
      const name = this.evalMessage(data.postName, cache);
      const message = this.evalMessage(data.message, cache);
      const tagsInput = this.evalMessage(data.tags, cache);

      // Parse tags
      let appliedTags = [];
      if (tagsInput && tagsInput.trim()) {
        appliedTags = tagsInput
          .split(',')
          .map((tag) => tag.trim())
          .filter((tag) => tag);
      }

      // Create forum post
      // v13 and v14 use the same API for forum posts
      const post = await channel.threads.create({
        name,
        message: {
          content: message,
        },
        appliedTags,
      });

      const storage = parseInt(data.storage, 10);
      const varName2 = this.evalMessage(data.varName2, cache);
      this.storeValue(post, storage, varName2, cache);
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
