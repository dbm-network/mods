module.exports = {
  // ---------------------------------------------------------------------
  // Action Name
  //
  // This is the name of the action displayed in the editor.
  // ---------------------------------------------------------------------

  name: 'Set Role Icon',

  // ---------------------------------------------------------------------
  // Action Section
  //
  // This is the section the action will fall into.
  // ---------------------------------------------------------------------

  section: 'Role Control',

  // ---------------------------------------------------------------------
  // Action Subtitle
  //
  // This function generates the subtitle displayed next to the name.
  // ---------------------------------------------------------------------

  subtitle(data, presets) {
    return `Set Icon of ${presets.getRoleText(data.role, data.roleVarName)} to ${presets.getVariableText(
      data.image,
      data.imageVarName,
    )}`;
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

  fields: ['role', 'roleVarName', 'image', 'imageVarName', 'reason'],

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
	<p>
		<u>Note:</u><br>
		Role icons only work in servers with a boost of level 2 or higher. If you are having issues, please ensure you are able to set role icons yourself before attempting with the bot.
	</p>
</div>
<br>

<hr class="subtlebar">
<br>

<role-input dropdownLabel="Source Role" selectId="role" variableContainerId="varNameContainer" variableInputId="roleVarName"></role-input>

<br><br><br><br>

<retrieve-from-variable dropdownLabel="Source Image/Emoji" selectId="image" variableContainerId="varNameContainer2" variableInputId="imageVarName"></retrieve-from-variable>

<br><br><br><br>

<span class="dbminputlabel">Reason</span>
<input id="reason" placeholder="Optional" class="round" type="text">`;
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
    const reason = this.evalMessage(data.reason, cache);
    const role = await this.getRoleFromData(data.role, data.roleVarName, cache);

    const imageStorage = parseInt(data.image, 10);
    const imageVarName = this.evalMessage(data.imageVarName, cache);
    var imageOrEmoji = this.getVariable(imageStorage, imageVarName, cache);

    const Images = this.getDBM().Images;
    const DiscordJS = this.getDBM().DiscordJS;

    if (Images.isImage(imageOrEmoji)) {
      imageOrEmoji = await Images.createBuffer(imageOrEmoji);
    } else if (imageOrEmoji instanceof DiscordJS.Emoji) {
      // do nothing, setIcon accepts Emoji class
    } else if (typeof imageOrEmoji === 'string') {
      if (imageOrEmoji.startsWith('http')) {
        imageOrEmoji = await Images.getImage(imageOrEmoji);
      } else {
        // otherwise, the string could be Emoji-resolvable, so do nothing
      }
    }

    if (Array.isArray(role)) {
      this.callListFunc(role, 'setIcon', [imageOrEmoji, reason]).then(() => this.callNextAction(cache));
    } else if (role?.setIcon) {
      role
        .setIcon(imageOrEmoji, reason)
        .then(() => this.callNextAction(cache))
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
