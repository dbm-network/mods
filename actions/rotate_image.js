module.exports = {
  // ---------------------------------------------------------------------
  // Action Name
  //
  // This is the name of the action displayed in the editor.
  // ---------------------------------------------------------------------

  name: 'Rotate Image',

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
    const mirror = ['No Mirror', 'Horizontal Mirror', 'Vertical Mirror', 'Diagonal Mirror'];
    return `${storeTypes[parseInt(data.storage, 10)]} (${data.varName}) -> [${mirror[parseInt(data.mirror, 10)]} ~ ${
      data.rotation
    }°]`;
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

  fields: ['storage', 'varName', 'rotation', 'mirror'],

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

<div style="padding-top: 8px;">
	<div style="float: left; width: calc(50% - 12px);">
		<span class="dbminputlabel">Mirror</span><br>
		<select id="mirror" class="round">
			<option value="0" selected>None</option>
			<option value="1">Horizontal Mirror</option>
			<option value="2">Vertical Mirror</option>
			<option value="3">Diagonal Mirror</option>
		</select><br>
	</div>
	<div style="float: right; width: calc(50% - 12px);">
		<span class="dbminputlabel">Rotation (degrees)</span><br>
		<input id="rotation" class="round" type="text" value="0"><br>
	</div>
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
    if (!image) {
      this.callNextAction(cache);
      return;
    }
    const mirror = parseInt(data.mirror, 10);
    switch (mirror) {
      case 0:
        image.mirror(false, false);
        break;
      case 1:
        image.mirror(true, false);
        break;
      case 2:
        image.mirror(false, true);
        break;
      case 3:
        image.mirror(true, true);
        break;
    }
    const rotation = parseInt(data.rotation, 10);
    image.rotate(rotation);
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
