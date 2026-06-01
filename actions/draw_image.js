module.exports = {
  // ---------------------------------------------------------------------
  // Action Name
  //
  // This is the name of the action displayed in the editor.
  // ---------------------------------------------------------------------

  name: 'Draw Image on Image',

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
    const storeTypes = presets.variables;
    return `${storeTypes[parseInt(data.storage2, 10)]} (${data.varName2}) -> ${
      storeTypes[parseInt(data.storage, 10)]
    } (${data.varName})`;
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

  fields: ['storage', 'varName', 'storage2', 'varName2', 'x', 'y', 'mask'],

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

<retrieve-from-variable style="padding-top: 8px;" dropdownLabel="Image that is Drawn" selectId="storage2" variableContainerId="varNameContainer2" variableInputId="varName2"></retrieve-from-variable>

<br><br><br>

<div style="padding-top: 8px;">
	<div style="float: left; width: calc(50% - 12px);">
		<span class="dbminputlabel">X Position</span><br>
		<input id="x" class="round" type="text" value="0"><br>
	</div>
	<div style="float: right; width: calc(50% - 12px);">
		<span class="dbminputlabel">Y Position</span><br>
		<input id="y" class="round" type="text" value="0"><br>
	</div>
</div>

<br><br><br>

<div style="padding-top: 8px; width: calc(50% - 12px)">
	<span class="dbminputlabel">Draw Effect</span><br>
	<select id="mask" class="round">
		<option value="0" selected>Overlay</option>
		<option value="1">Replace</option>
		<option value="2">Mask</option>
	</select>
</div>`;
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
    const storage = parseInt(data.storage, 10);
    const varName = this.evalMessage(data.varName, cache);
    const image = this.getVariable(storage, varName, cache);
    if (!image || !image.composite) {
      this.callNextAction(cache);
      return;
    }

    const storage2 = parseInt(data.storage2, 10);
    const varName2 = this.evalMessage(data.varName2, cache);
    const image2 = this.getVariable(storage2, varName2, cache);
    if (!image2) {
      this.callNextAction(cache);
      return;
    }

    const x = parseInt(this.evalMessage(data.x, cache), 10);
    const y = parseInt(this.evalMessage(data.y, cache), 10);
    const mask = data.mask;

    if (mask === '2') {
      image.mask(image2, x, y);
    } else if (mask === '1') {
      this.getDBM().Images.drawImageOnImage(image, image2, x, y);
    } else {
      image.composite(image2, x, y);
    }
    this.callNextAction(cache);
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
