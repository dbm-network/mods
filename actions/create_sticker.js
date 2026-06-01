module.exports = {
  // ---------------------------------------------------------------------
  // Action Name
  //
  // This is the name of the action displayed in the editor.
  // ---------------------------------------------------------------------

  name: 'Create Sticker',

  // ---------------------------------------------------------------------
  // Action Section
  //
  // This is the section the action will fall into.
  // ---------------------------------------------------------------------

  section: 'Emoji/Sticker Control',

  // ---------------------------------------------------------------------
  // Action Subtitle
  //
  // This function generates the subtitle displayed next to the name.
  // ---------------------------------------------------------------------

  subtitle(data, presets) {
    return `${data.stickerName}`;
  },

  // ---------------------------------------------------------------------
  // Action Storage Function
  //
  // Stores the relevant variable info for the editor.
  // ---------------------------------------------------------------------

  variableStorage(data, varType) {
    if (parseInt(data.storage2, 10) !== varType) return;
    return [data.varName2, 'Sticker'];
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

  fields: ['stickerName', 'description', 'tag', 'storage', 'varName', 'storage2', 'varName2'],

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
<div>
	<span class="dbminputlabel">Sticker Name</span><br>
	<input id="stickerName" class="round" type="text">
</div>

<br>

<retrieve-from-variable dropdownLabel="Source Image" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></retrieve-from-variable>

<br><br><br>

<div>
	<span class="dbminputlabel">Sticker Tag</span><br>
	<input id="tag" class="round" type="text" placeholder="A standard emoji name. This is required.">
</div>

<br>

<div>
	<span class="dbminputlabel">Sticker Description</span><br>
	<input id="description" class="round" type="text" placeholder="Leave empty for none">
</div>

<br><br>

<hr class="subtlebar" style="margin-top: 0px;">

<br>

<store-in-variable allowNone style="padding-top: 8px;" selectId="storage2" variableInputId="varName2" variableContainerId="varNameContainer2"></store-in-variable>`;
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

  async action(cache) {
    const data = cache.actions[cache.index];
    const server = cache.server;
    if (!server) {
      this.callNextAction(cache);
      return;
    }

    const stickerData = { name: this.evalMessage(data.stickerName, cache) };

    const varName = this.evalMessage(data.varName, cache);
    const image = this.getVariable(parseInt(data.storage, 10), varName, cache);
    const { Images } = this.getDBM();

    try {
      stickerData.file = Images.createBuffer(image);
    } catch {
      return this.displayError(data, cache);
    }

    stickerData.tag = this.evalMessage(data.tag, cache);
    stickerData.description = this.evalMessage(data.description, cache);

    server.stickers
      .create(stickerData)
      .then((sticker) => {
        const varName2 = this.evalMessage(data.varName2, cache);
        const storage = parseInt(data.storage, 10);
        this.storeValue(sticker, storage, varName2, cache);
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
