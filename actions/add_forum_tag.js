module.exports = {
  // ---------------------------------------------------------------------
  // Action Name
  // ---------------------------------------------------------------------

  name: 'Add Forum Tag',

  // ---------------------------------------------------------------------
  // Action Section
  // ---------------------------------------------------------------------

  section: 'Channel Control',

  // ---------------------------------------------------------------------
  // Action Subtitle
  // ---------------------------------------------------------------------

  subtitle(data, presets) {
    return `Add tag: ${data.tagName || 'Unnamed Tag'}`;
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

  fields: ['forumChannel', 'varName', 'tagName', 'emoji', 'moderated'],

  // ---------------------------------------------------------------------
  // Command HTML
  // ---------------------------------------------------------------------

  html(isEvent, data) {
    return `
<channel-input dropdownLabel="Forum Channel" selectId="forumChannel" variableContainerId="varNameContainer" variableInputId="varName"></channel-input>

<br><br><br>

<div style="padding-top: 8px;">
  <span class="dbminputlabel">Tag Name</span><br>
  <input id="tagName" class="round" type="text" placeholder="Enter tag name...">
</div>

<br>

<div style="padding-top: 8px;">
  <span class="dbminputlabel">Emoji (optional, leave blank for none)</span><br>
  <input id="emoji" class="round" type="text" placeholder="🎉 or emoji ID">
</div>

<br>

<div style="padding-top: 8px;">
  <span class="dbminputlabel">Moderated Tag (only moderators can use)</span><br>
  <select id="moderated" class="round">
    <option value="false" selected>No</option>
    <option value="true">Yes</option>
  </select>
</div>`;
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
      const tagName = this.evalMessage(data.tagName, cache);
      const emojiInput = this.evalMessage(data.emoji, cache);
      const moderated = data.moderated === 'true';

      if (!tagName || !tagName.trim()) {
        this.displayError(data, cache, new Error('Tag name is required'));
        return;
      }

      // Prepare tag data
      const tagData = {
        name: tagName.trim(),
        moderated,
      };

      // Add emoji if provided
      if (emojiInput && emojiInput.trim()) {
        // Try to resolve emoji (could be unicode or custom emoji ID)
        const emoji = emojiInput.trim();
        if (emoji.match(/^\d+$/)) {
          // Custom emoji ID
          tagData.emojiId = emoji;
        } else {
          // Unicode emoji or custom emoji format
          tagData.emojiName = emoji;
        }
      }

      // Add tag to forum channel
      // v13 and v14 use the same API
      const currentTags = channel.availableTags || [];
      const updatedTags = [...currentTags, tagData];

      await channel.setAvailableTags(updatedTags);

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
