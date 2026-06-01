module.exports = {
  // ---------------------------------------------------------------------
  // Action Name
  // ---------------------------------------------------------------------

  name: 'Edit Forum Post',

  // ---------------------------------------------------------------------
  // Action Section
  // ---------------------------------------------------------------------

  section: 'Channel Control',

  // ---------------------------------------------------------------------
  // Action Subtitle
  // ---------------------------------------------------------------------

  subtitle(data, presets) {
    return `Edit post: ${data.postName || 'Unnamed'}`;
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

  fields: ['post', 'varName', 'postName', 'tags'],

  // ---------------------------------------------------------------------
  // Command HTML
  // ---------------------------------------------------------------------

  html(isEvent, data) {
    return `
<thread-input dropdownLabel="Forum Post (Thread)" selectId="post" variableContainerId="varNameContainer" variableInputId="varName"></thread-input>

<br><br><br>

<div style="padding-top: 8px;">
  <span class="dbminputlabel">New Post Name (leave blank to keep current)</span><br>
  <input id="postName" class="round" type="text" placeholder="Leave blank to keep current name">
</div>

<br>

<div style="padding-top: 8px;">
  <span class="dbminputlabel">Tags (comma-separated tag IDs, leave blank to keep current)</span><br>
  <input id="tags" class="round" type="text" placeholder="tag-id-1, tag-id-2">
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
    const thread = await this.getThreadFromData(data.post, data.varName, cache);

    if (!thread) {
      this.callNextAction(cache);
      return;
    }

    try {
      const editData = {};

      // Update name if provided
      const postName = this.evalMessage(data.postName, cache);
      if (postName && postName.trim()) {
        editData.name = postName.trim();
      }

      // Update tags if provided
      const tagsInput = this.evalMessage(data.tags, cache);
      if (tagsInput && tagsInput.trim()) {
        editData.appliedTags = tagsInput
          .split(',')
          .map((tag) => tag.trim())
          .filter((tag) => tag);
      }

      // Only edit if there's something to change
      if (Object.keys(editData).length > 0) {
        await thread.edit(editData);
      }

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
