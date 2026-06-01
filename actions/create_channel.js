module.exports = {
  // ---------------------------------------------------------------------
  // Action Name
  //
  // This is the name of the action displayed in the editor.
  // ---------------------------------------------------------------------

  name: 'Create Text Channel',

  // ---------------------------------------------------------------------
  // Action Section
  //
  // This is the section the action will fall into.
  // ---------------------------------------------------------------------

  section: 'Channel Control',

  // ---------------------------------------------------------------------
  // Action Subtitle
  //
  // This function generates the subtitle displayed next to the name.
  // ---------------------------------------------------------------------

  subtitle(data, presets) {
    return `${data.channelName}`;
  },

  // ---------------------------------------------------------------------
  // Action Storage Function
  //
  // Stores the relevant variable info for the editor.
  // ---------------------------------------------------------------------

  variableStorage(data, varType) {
    const type = parseInt(data.storage, 10);
    if (type !== varType) return;
    return [data.varName, 'Channel'];
  },

  // ---------------------------------------------------------------------
  // Action Meta Data
  //
  // Helps check for updates and provides info if a custom mod.
  // If this is a third-party mod, please set "author" and "authorUrl".
  //
  // It's highly recommended "preciseCheck" is set to false for third-party mods.
  // This will make it so the patch version (0.0.X) is not checked.
  // ---------------------------------------------------------------------

  meta: { version: '2.2.0', preciseCheck: true, author: null, authorUrl: null, downloadUrl: null },

  // ---------------------------------------------------------------------
  // Action Fields
  //
  // These are the fields for the action. These fields are customized
  // by creating elements with corresponding IDs in the HTML. These
  // are also the names of the fields stored in the action's JSON data.
  // ---------------------------------------------------------------------

  fields: ['channelName', 'topic', 'position', 'storage', 'varName', 'categoryID', 'reason'],

  // ---------------------------------------------------------------------
  // Command HTML
  //
  // This function returns a string containing the HTML used for
  // editing actions.
  //
  // The "isEvent" parameter will be true if this action is being used
  // for an event. Due to their nature, events lack certain information,
  // so edit the HTML to reflect this.
  // ---------------------------------------------------------------------

  html(isEvent, data) {
    return `
<span class="dbminputlabel">Name</span><br>
<input id="channelName" class="round" type="text">
<br>

<span class="dbminputlabel">Category ID</span><br>
<input id= "categoryID" class="round" type="text" placeholder="Leave blank for default!">
<br>

<div style="float: left; width: calc(50% - 12px);">
	<span class="dbminputlabel">Topic</span><br>
	<input id="topic" class="round" type="text"><br>
</div>
<div style="float: right; width: calc(50% - 12px);">
	<span class="dbminputlabel">Position</span><br>
	<input id="position" class="round" type="text" placeholder="Leave blank for default!"><br>
</div>

<br><br><br><br>

<hr class="subtlebar" style="margin-top: 0px;">
<br>

<div>
	<span class="dbminputlabel">Reason</span>
	<input id="reason" placeholder="Optional" class="round" type="text">
</div>
<br>

<store-in-variable allowNone selectId="storage" variableInputId="varName" variableContainerId="varNameContainer"></store-in-variable>`;
  },

  // ---------------------------------------------------------------------
  // Action Editor Init Code
  //
  // When the HTML is first applied to the action editor, this code
  // is also run. This helps add modifications or setup reactionary
  // functions for the DOM elements.
  // ---------------------------------------------------------------------

  init() {},

  // ---------------------------------------------------------------------
  // Action Bot Function
  //
  // This is the function for the action within the Bot's Action class.
  // Keep in mind event calls won't have access to the "msg" parameter,
  // so be sure to provide checks for variable existence.
  // ---------------------------------------------------------------------

  action(cache) {
    const data = cache.actions[cache.index];
    const server = cache.server;
    if (!server?.channels?.create) {
      this.callNextAction(cache);
      return;
    }

    const channelData = {
      reason: this.evalMessage(data.reason, cache),
      name: this.evalMessage(data.channelName, cache),
    };
    if (data.topic) {
      channelData.topic = this.evalMessage(data.topic, cache);
    }
    if (data.position) {
      channelData.position = parseInt(this.evalMessage(data.position, cache), 10);
    }
    if (data.categoryID) {
      channelData.parent = this.evalMessage(data.categoryID, cache);
    }

    server.channels
      .create(channelData)
      .then((channel) => {
        const storage = parseInt(data.storage, 10);
        const varName = this.evalMessage(data.varName, cache);
        this.storeValue(channel, storage, varName, cache);
        this.callNextAction(cache);
      })
      .catch((err) => this.displayError(data, cache, err));
  },

  // ---------------------------------------------------------------------
  // Action Bot Mod
  //
  // Upon initialization of the bot, this code is run. Using the bot's
  // DBM namespace, one can add/modify existing functions if necessary.
  // In order to reduce conflicts between mods, be sure to alias
  // functions you wish to overwrite.
  // ---------------------------------------------------------------------

  mod() {},
};
