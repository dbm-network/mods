module.exports = {
  // ---------------------------------------------------------------------
  // Action Name
  //
  // This is the name of the action displayed in the editor.
  // ---------------------------------------------------------------------

  name: 'Check Variable',

  // ---------------------------------------------------------------------
  // Action Section
  //
  // This is the section the action will fall into.
  // ---------------------------------------------------------------------

  section: 'Conditions',

  // ---------------------------------------------------------------------
  // Action Subtitle
  //
  // This function generates the subtitle displayed next to the name.
  // ---------------------------------------------------------------------

  subtitle(data, presets) {
    return `${presets.getConditionsText(data)}`;
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

  fields: ['storage', 'varName', 'comparison', 'value', 'branch'],

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
<retrieve-from-variable allowSlashParams dropdownLabel="Variable" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></retrieve-from-variable>

<br><br><br>

<div style="padding-top: 8px;">
	<div style="float: left; width: 35%;">
		<span class="dbminputlabel">Comparison Type</span><br>
		<select id="comparison" class="round" onchange="glob.onComparisonChanged(this)">
			<option value="0">Exists</option>
			<option value="1" selected>Equals</option>
			<option value="2">Equals Exactly</option>
			<option value="3">Less Than</option>
			<option value="4">Greater Than</option>
			<option value="5">Includes</option>
			<option value="6">Matches Regex</option>
			<option value="7">Starts With</option>
			<option value="8">Ends With</option>
			<option value="9">Length Equals</option>
			<option value="10">Length is Greater Than</option>
			<option value="11">Length is Less Than</option>
		</select>
	</div>
	<div style="float: right; width: 60%;" id="directValue">
		<span class="dbminputlabel">Value to Compare to</span><br>
		<input id="value" class="round" type="text" name="is-eval">
	</div>
</div>

<br><br><br><br>

<hr class="subtlebar">

<br>

<conditional-input id="branch" style="padding-top: 8px;"></conditional-input>`;
  },

  // ---------------------------------------------------------------------
  // Action Editor Pre-Init Code
  //
  // Before the fields from existing data in this action are applied
  // to the user interface, this function is called if it exists.
  // The existing data is provided, and a modified version can be
  // returned. The returned version will be used if provided.
  // This is to help provide compatibility with older versions of the action.
  //
  // The "formatters" argument contains built-in functions for formatting
  // the data required for official DBM action compatibility.
  // ---------------------------------------------------------------------

  preInit(data, formatters) {
    return formatters.compatibility_2_0_0_iftruefalse_to_branch(data);
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

    glob.onComparisonChanged = function (event) {
      if (event.value === '0') {
        document.getElementById('directValue').style.display = 'none';
      } else {
        document.getElementById('directValue').style.display = null;
      }
    };

    glob.onComparisonChanged(document.getElementById('comparison'));
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
    const type = parseInt(data.storage, 10);
    const varName = this.evalMessage(data.varName, cache);
    const variable = this.getVariable(type, varName, cache);
    let result = false;

    const val1 = variable;
    const compare = parseInt(data.comparison, 10);
    let val2 = data.value;
    if (compare !== 6) val2 = this.evalIfPossible(val2, cache);
    switch (compare) {
      case 0:
        result = val1 !== undefined;
        break;
      case 1:
        result = val1 === val2;
        break;
      case 2:
        result = val1 === val2;
        break;
      case 3:
        result = val1 < val2;
        break;
      case 4:
        result = val1 > val2;
        break;
      case 5:
        if (typeof val1?.includes === 'function') {
          result = val1.includes(val2);
        }
        break;
      case 6:
        if (typeof val1?.match === 'function') {
          result = Boolean(val1.match(new RegExp(`^${val2}$`, 'i')));
        }
        break;
      case 7:
        if (typeof val1?.startsWith === 'function') {
          result = Boolean(val1.startsWith(val2));
        }
        break;
      case 8:
        if (typeof val1?.endsWith === 'function') {
          result = Boolean(val1.endsWith(val2));
        }
        break;
      case 9:
        if (typeof val1?.length === 'number') {
          result = Boolean(val1.length === val2);
        }
        break;
      case 10:
        if (typeof val1?.length === 'number') {
          result = Boolean(val1.length > val2);
        }
        break;
      case 11:
        if (typeof val1?.length === 'number') {
          result = Boolean(val1.length < val2);
        }
        break;
    }

    this.executeResults(result, data?.branch ?? data, cache);
  },

  // ---------------------------------------------------------------------
  // Action Bot Mod Init
  //
  // An optional function for action mods. Upon the bot's initialization,
  // each command/event's actions are iterated through. This is to
  // initialize responses to interactions created within actions
  // (e.g. buttons and select menus for Send Message).
  //
  // If an action provides inputs for more actions within, be sure
  // to call the `this.prepareActions` function to ensure all actions are
  // recursively iterated through.
  // ---------------------------------------------------------------------

  modInit(data) {
    this.prepareActions(data.branch?.iftrueActions);
    this.prepareActions(data.branch?.iffalseActions);
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
