module.exports = {
  // ---------------------------------------------------------------------
  // Action Name
  // ---------------------------------------------------------------------

  name: 'Defer Interaction',

  // ---------------------------------------------------------------------
  // Action Section
  // ---------------------------------------------------------------------

  section: 'Messaging',

  // ---------------------------------------------------------------------
  // Action Subtitle
  // ---------------------------------------------------------------------

  subtitle(data, presets) {
    const deferType = data.deferType === 'update' ? 'Update' : 'Reply';
    const ephemeral = data.ephemeral ? ' (Ephemeral)' : '';
    return `Defer ${deferType}${ephemeral}`;
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

  fields: ['deferType', 'ephemeral'],

  // ---------------------------------------------------------------------
  // Command HTML
  // ---------------------------------------------------------------------

  html(isEvent, data) {
    return `
<div style="padding-top: 8px;">
  <span class="dbminputlabel">Defer Type</span><br>
  <select id="deferType" class="round">
    <option value="reply" selected>Reply (for slash commands)</option>
    <option value="update">Update (for buttons/select menus)</option>
  </select>
</div>

<br>

<div style="padding-top: 8px;">
  <span class="dbminputlabel">Ephemeral (Only for Reply)</span><br>
  <select id="ephemeral" class="round">
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
    const interaction = cache.interaction;

    if (!interaction) {
      this.callNextAction(cache);
      return;
    }

    try {
      if (data.deferType === 'update') {
        // Defer update for buttons/select menus
        if (interaction.deferred || interaction.replied) {
          this.callNextAction(cache);
          return;
        }
        await interaction.deferUpdate();
      } else {
        // Defer reply for slash commands
        if (interaction.deferred || interaction.replied) {
          this.callNextAction(cache);
          return;
        }
        await interaction.deferReply({ ephemeral: data.ephemeral === 'true' });
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
