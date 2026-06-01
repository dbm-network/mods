module.exports = {
  // ---------------------------------------------------------------------
  // Action Name
  //
  // This is the name of the action displayed in the editor.
  // ---------------------------------------------------------------------

  name: 'Remove Item from List',

  // ---------------------------------------------------------------------
  // Action Section
  //
  // This is the section the action will fall into.
  // ---------------------------------------------------------------------

  section: 'Lists and Loops',

  // ---------------------------------------------------------------------
  // Action Subtitle
  //
  // This function generates the subtitle displayed next to the name.
  // ---------------------------------------------------------------------

  subtitle(data, presets) {
    const storage = presets.variables;
    return `Remove Item from ${storage[parseInt(data.storage, 10)]} (${data.varName})`;
  },

  // ---------------------------------------------------------------------
  // Action Storage Function
  //
  // Stores the relevant variable info for the editor.
  // ---------------------------------------------------------------------

  variableStorage(data, varType) {
    const type = parseInt(data.storage2, 10);
    if (type !== varType) return;
    return [data.varName2, 'Unknown Type'];
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

  fields: ['storage', 'varName', 'removeType', 'position', 'storage2', 'varName2'],

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
<retrieve-from-variable dropdownLabel="Source List" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></retrieve-from-variable>

<br><br><br>

<div style="padding-top: 8px;">
	<div style="float: left; width: 45%;">
		<span class="dbminputlabel">Remove Type</span><br>
		<select id="removeType" class="round" onchange="glob.onChange1(this)">
			<option value="0" selected>Remove from End</option>
			<option value="1">Remove from Front</option>
			<option value="2">Remove from Specific Position</option>
		</select>
	</div>
	<div id="positionHolder" style="float: right; width: 50%; display: none;">
		<span class="dbminputlabel">Position</span><br>
		<input id="position" class="round" type="text">
	</div>
</div><br><br><br>
<store-in-variable allowNone style="padding-top: 8px;" selectId="storage2" variableInputId="varName2" variableContainerId="varNameContainer2"></store-in-variable>`;
  },

  // ---------------------------------------------------------------------
  // Action Editor Init Code
  //
  // When the HTML is first applied to the action editor, this code
  // is also run. This helps add modifications or setup reactionary
  // functions for the DOM elements.
  // ---------------------------------------------------------------------

  init() {
    const { glob, document } = this;

    glob.onChange1 = function (event) {
      const value = parseInt(event.value, 10);
      const dom = document.getElementById('positionHolder');
      if (value < 2) {
        dom.style.display = 'none';
      } else {
        dom.style.display = null;
      }
    };

    glob.onChange1(document.getElementById('removeType'));
  },

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
    const list = this.getVariable(storage, varName, cache);

    const type = parseInt(data.removeType, 10);

    let result = null;
    switch (type) {
      case 0:
        result = list.pop();
        break;
      case 1:
        result = list.shift();
        break;
      case 2:
        const position = parseInt(this.evalMessage(data.position, cache), 10);
        if (position < 0) {
          result = list.shift();
        } else if (position >= list.length) {
          result = list.pop();
        } else {
          result = list[position];
          list.splice(position, 1);
        }
        break;
    }

    if (result) {
      const varName2 = this.evalMessage(data.varName2, cache);
      const storage2 = parseInt(data.storage2, 10);
      this.storeValue(result, storage2, varName2, cache);
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
