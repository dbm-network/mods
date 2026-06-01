module.exports = {
  // ---------------------------------------------------------------------
  // Action Name
  // ---------------------------------------------------------------------

  name: 'Pin Forum Post',

  // ---------------------------------------------------------------------
  // Action Section
  // ---------------------------------------------------------------------

  section: 'Channel Control',

  // ---------------------------------------------------------------------
  // Action Subtitle
  // ---------------------------------------------------------------------

  subtitle(data, presets) {
    const action = data.action === 'pin' ? 'Pin' : 'Unpin';
    return `${action} forum post`;
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

  fields: ['post', 'varName', 'action'],

  // ---------------------------------------------------------------------
  // Command HTML
  // ---------------------------------------------------------------------

  html(isEvent, data) {
    return `
<thread-input dropdownLabel="Forum Post (Thread)" selectId="post" variableContainerId="varNameContainer" variableInputId="varName"></thread-input>

<br><br><br>

<div style="padding-top: 8px;">
  <span class="dbminputlabel">Action</span><br>
  <select id="action" class="round">
    <option value="pin" selected>Pin Post</option>
    <option value="unpin">Unpin Post</option>
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
    const thread = await this.getThreadFromData(data.post, data.varName, cache);

    if (!thread) {
      this.callNextAction(cache);
      return;
    }

    try {
      if (data.action === 'pin') {
        await thread.setPinned(true);
      } else {
        await thread.setPinned(false);
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
