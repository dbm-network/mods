module.exports = {
  // ---------------------------------------------------------------------
  // Action Name
  //
  // This is the name of the action displayed in the editor.
  // ---------------------------------------------------------------------

  name: 'Multi-Check Variable',

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
    return `Check ${presets.getVariableText(data.storage, data.varName)} with ${data.branches.length} Branches`;
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

  meta: {
    version: '2.1.6',
    preciseCheck: true,
    author: 'DBM Extended',
    authorUrl: 'https://github.com/DBM-Extended/mods',
    downloadURL: 'https://github.com/DBM-Extended/mods',
  },

  // ---------------------------------------------------------------------
  // Action Fields
  //
  // These are the fields for the action. These fields are customized
  // by creating elements with corresponding IDs in the HTML. These
  // are also the names of the fields stored in the action's JSON data.
  // ---------------------------------------------------------------------

  fields: ['storage', 'varName', 'branches'],

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

<br><br><br><br>

<dialog-list id="branches" fields='["comparison", "value", "actions"]' dialogResizable dialogTitle="Check Variable Info" dialogWidth="600" dialogHeight="400" listLabel="Comparisons and Actions" listStyle="height: calc(100vh - 290px);" itemName="Condition" itemHeight="28px;" itemTextFunction="glob.formatItem(data)" itemStyle="line-height: 28px;">
  <div style="padding: 16px;">
    <div style="float: left; width: 35%;">
      <span class="dbminputlabel">Comparison Type</span><br>
      <select id="comparison" class="round" onchange="glob.onComparisonChanged(this)">
			<option value="0">Exists</option>
			<option value="1" selected>Equals</option>
			<option value="2">Equals Exactly</option>
			<option value="3">Less Than</option>
			<option value="13">Less Than or Equal to</option>
			<option value="4">Greater Than</option>
			<option value="14">Greater Than or Equal to</option>
			<option value="5">Includes</option>
			<option value="6">Matches Regex</option>
			<option value="12">Matches Full Regex</option>
			<option value="7">Length is Bigger Than</option>
			<option value="8">Length is Smaller Than</option>
			<option value="9">Length is Equals</option>
			<option value="10">Starts With</option>
			<option value="11">Ends With</option>
      </select>
    </div>
    <div style="float: right; width: 60%;">
      <span class="dbminputlabel">Value to Compare to</span><br>
      <input id="value" class="round" type="text" name="is-eval">
    </div>

    <br><br><br><br>

    <action-list-input id="actions" height="calc(100vh - 220px)"></action-list-input>

  </div>
</dialog-list>`;
  },

  // ---------------------------------------------------------------------
  // Action Editor Init Code
  //
  // When the HTML is first applied to the action editor, this code
  // is also run. This helps add modifications or setup reactionary
  // functions for the DOM elements.
  // ---------------------------------------------------------------------

  init() {
    const { glob } = this;

    glob.formatItem = function (data) {
      let result = '<div style="display: inline-block; width: 200px; padding-left: 8px;">VAR ';
      const comp = data.comparison;
      switch (comp) {
        case '0':
          result += 'Exists';
          break;
        case '1':
          result += `= ${data.value}`;
          break;
        case '2':
          result += `= ${data.value}`;
          break;
        case '3':
          result += `< ${data.value}`;
          break;
        case '4':
          result += `> ${data.value}`;
          break;
        case '5':
          result += `Includes ${data.value}`;
          break;
        case '6':
          result += `Matches Regex ${data.value}`;
          break;
        case '7':
          result += `Length is Bigger Than ${data.value}`;
          break;
        case '8':
          result += `Length is Smaller Than ${data.value}`;
          break;
        case '9':
          result += `Length is Equals ${data.value}`;
          break;
        case '10':
          result += `Starts With ${data.value}`;
          break;
        case '11':
          result += `Ends With ${data.value}`;
          break;
        case '12':
          result += `Matches Full Regex ${data.value}`;
          break;
        case '13':
          result += `<=${data.value}`;
          break;
        case '14':
          result += `>= ${data.value}`;
          break;
      }
      result += `</div><span>Call ${data.actions.length} Actions</span>`;
      return result;
    };
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
    if (variable) {
      const val1 = variable;
      const branches = data.branches;
      for (let i = 0; i < branches.length; i++) {
        const branch = branches[i];
        const compare = parseInt(branch.comparison, 10);
        let val2 = branch.value;
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
            if (typeof val1.includes === 'function') {
              result = val1.includes(val2);
            }
            break;
          case 6:
            result = Boolean(val1.match(new RegExp(`^${val2}$`, 'i')));
            break;
          case 7:
            result = val1.length > val2;
            break;
          case 8:
            result = val1.length < val2;
            break;
          case 9:
            result = val1.length === val2;
            break;
          case 10:
            result = val1.startsWith(val2);
            break;
          case 11:
            result = val1.endsWith(val2);
            break;
          case 12:
            result = Boolean(val1.match(new RegExp(val2)));
            break;
          case 13:
            result = val1 <= val2;
            break;
          case 14:
            result = val1 >= val2;
            break;
        }
        if (result) {
          this.executeSubActionsThenNextAction(branch.actions, cache);
          break;
        }
      }
    }
    if (!result) {
      this.callNextAction(cache);
    }
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
    if (Array.isArray(data?.branches)) {
      for (let i = 0; i < data.branches.length; i++) {
        const branch = data.branches[i];
        this.prepareActions(branch.actions);
      }
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
