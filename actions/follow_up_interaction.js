module.exports = {
  // ---------------------------------------------------------------------
  // Action Name
  // ---------------------------------------------------------------------

  name: 'Follow-Up Interaction',

  // ---------------------------------------------------------------------
  // Action Section
  // ---------------------------------------------------------------------

  section: 'Messaging',

  // ---------------------------------------------------------------------
  // Action Subtitle
  // ---------------------------------------------------------------------

  subtitle(data, presets) {
    return `Send follow-up message to interaction`;
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

  fields: ['message', 'ephemeral'],

  // ---------------------------------------------------------------------
  // Command HTML
  // ---------------------------------------------------------------------

  html(isEvent, data) {
    return `
<div style="padding-top: 8px;">
  <span class="dbminputlabel">Message</span><br>
  <textarea id="message" class="dbm_monospace" rows="5" placeholder="Insert message here..." style="white-space: nowrap; resize: none;"></textarea>
</div>

<br>

<div style="padding-top: 8px;">
  <span class="dbminputlabel">Ephemeral</span><br>
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
      const message = this.evalMessage(data.message, cache);
      const options = {
        content: message,
        ephemeral: data.ephemeral === 'true',
      };

      await interaction.followUp(options);
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
