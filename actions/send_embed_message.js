module.exports = {
  // ---------------------------------------------------------------------
  // Action Name
  //
  // This is the name of the action displayed in the editor.
  // ---------------------------------------------------------------------

  name: 'Send Embed Message',

  // ---------------------------------------------------------------------
  // Action Section
  //
  // This is the section the action will fall into.
  // ---------------------------------------------------------------------

  section: 'Embed Message',

  // ---------------------------------------------------------------------
  // Action Subtitle
  //
  // This function generates the subtitle displayed next to the name.
  // ---------------------------------------------------------------------

  subtitle(data, presets) {
    return `${presets.getSendTargetText(data.channel, data.varName2)}: ${data.varName}`;
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

  fields: ['storage', 'varName', 'channel', 'varName2', 'storage3', 'varName3'],

  // ---------------------------------------------------------------------
  // Action Storage Function
  //
  // Stores the relevant variable info for the editor.
  // ---------------------------------------------------------------------

  variableStorage(data, varType) {
    const type = parseInt(data.storage3, 10);
    if (type !== varType) return;
    return [data.varName3, 'Message'];
  },

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
<retrieve-from-variable dropdownLabel="Source Embed Object" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></retrieve-from-variable>

<br><br><br>

<send-target-input style="padding-top: 8px;" dropdownLabel="Send To" selectId="channel" variableContainerId="varNameContainer2" variableInputId="varName2"></send-target-input>

<br><br><br>

<hr class="subtlebar" style="margin-bottom: 0px;">

<br>

<store-in-variable allowNone selectId="storage3" variableInputId="varName3" variableContainerId="varNameContainer3"></store-in-variable>`;
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

    const storage = parseInt(data.storage, 10);
    const varName = this.evalMessage(data.varName, cache);
    const embed = this.getVariable(storage, varName, cache);
    if (!embed) {
      this.callNextAction(cache);
      return;
    }

    const target = await this.getSendTargetFromData(data.channel, data.varName2, cache);

    const varName3 = this.evalMessage(data.varName3, cache);
    const storage3 = parseInt(data.storage3, 10);

    if (Array.isArray(target)) {
      this.callListFunc(target, 'send', [{ embeds: [embed] }]).then(() => this.callNextAction(cache));
    } else if (target?.send) {
      target
        .send({ embeds: [embed] })
        .then((msg) => {
          if (varName3) this.storeValue(msg, storage3, varName3, cache);
          this.callNextAction(cache);
        })
        .catch((err) => this.displayError(data, cache, err));
    } else {
      this.callNextAction(cache);
    }
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
