module.exports = {
  // ---------------------------------------------------------------------
  // Action Name
  //
  // This is the name of the action displayed in the editor.
  // ---------------------------------------------------------------------

  name: 'Send Image',

  // ---------------------------------------------------------------------
  // Action Section
  //
  // This is the section the action will fall into.
  // ---------------------------------------------------------------------

  section: 'Image Editing',

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

  fields: ['storage', 'varName', 'channel', 'varName2', 'message', 'storage2', 'varName3'],

  // ---------------------------------------------------------------------
  // Action Storage Function << added
  //
  // Stores the relevant variable info for the editor.
  // ---------------------------------------------------------------------

  variableStorage(data, varType) {
    const type = parseInt(data.storage2, 10);
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
<retrieve-from-variable dropdownLabel="Source Image" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></retrieve-from-variable>

<br><br><br>

<send-target-input style="padding-top: 8px;" dropdownLabel="Send To" selectId="channel" variableContainerId="varNameContainer2" variableInputId="varName2"></send-target-input>

<br><br><br>

<div style="padding-top: 8px;">
	<span class="dbminputlabel">Message</span><br>
	<textarea id="message" class="dbm_monospace" rows="7" placeholder="Insert message here..." style="white-space: nowrap; resize: none;"></textarea>
</div>

<br>

<store-in-variable allowNone selectId="storage2" variableInputId="varName3" variableContainerId="varNameContainer3"></store-in-variable>`;
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
    const { DiscordJS, Images } = this.getDBM();

    const storage = parseInt(data.storage, 10);
    const varName = this.evalMessage(data.varName, cache);
    const image = this.getVariable(storage, varName, cache);
    if (!image) {
      this.callNextAction(cache);
      return;
    }

    const target = await this.getSendTargetFromData(data.channel, data.varName2, cache);

    const varName3 = this.evalMessage(data.varName3, cache);
    const storage2 = parseInt(data.storage2, 10);

    if (!Array.isArray(target) && !target?.send) {
      this.callNextAction(cache);
      return;
    }

    Images.createBuffer(image)
      .then((buffer) => {
        const obj = {
          files: [new DiscordJS.AttachmentBuilder(buffer, { name: 'image.png' })],
        };

        if (data.message) {
          obj.content = this.evalMessage(data.message, cache);
        }

        if (Array.isArray(target)) {
          this.callListFunc(target, 'send', [obj])
            .then((msgList) => {
              this.storeValue(msgList, storage2, varName3, cache);
              this.callNextAction(cache);
            })
            .catch((err) => this.displayError(data, cache, err));
        } else if (target?.send) {
          target
            .send(obj)
            .then((msg) => {
              this.storeValue(msg, storage2, varName3, cache);
              this.callNextAction(cache);
            })
            .catch((err) => this.displayError(data, cache, err));
        }
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
