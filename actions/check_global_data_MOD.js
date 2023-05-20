module.exports = {
  //---------------------------------------------------------------------
  // Action Name
  //
  // This is the name of the action displayed in the editor.
  //---------------------------------------------------------------------

  name: 'Check Global Data',

  //---------------------------------------------------------------------
  // Action Section
  //
  // This is the section the action will fall into.
  //---------------------------------------------------------------------

  section: 'Data',

  //---------------------------------------------------------------------
  // Action Subtitle
  //
  // This function generates the subtitle displayed next to the name.
  //---------------------------------------------------------------------

  subtitle(data) {
    const comparison = ['Exists', 'Equals', 'Equals Exactly', 'Less Than', 'Greater Than', 'Includes', 'Matches Regex'];
    return `${data.dataName} ${comparison[parseInt(data.comparison, 10)]} ${data.value}`;
  },

  //---------------------------------------------------------------------
  // Action Meta Data
  //
  // Helps check for updates and provides info if a custom mod.
  // If this is a third-party mod, please set "author" and "authorUrl".
  //
  // It's highly recommended "preciseCheck" is set to false for third-party mods.
  // This will make it so the patch version (0.0.X) is not checked.
  //---------------------------------------------------------------------

  meta: {
    version: '2.1.7',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/check_global_data_MOD.js',
  },

  //---------------------------------------------------------------------
  // Action Fields
  //
  // These are the fields for the action. These fields are customized
  // by creating elements with corresponding IDs in the HTML. These
  // are also the names of the fields stored in the action's JSON data.
  //---------------------------------------------------------------------

  fields: ['dataName', 'comparison', 'value', 'iftrue', 'iftrueVal', 'iffalse', 'iffalseVal', 'Jump to Anchor'],

  //---------------------------------------------------------------------
  // Command HTML
  //
  // This function returns a string containing the HTML used for
  // editing actions.
  //
  // The "isEvent" parameter will be true if this action is being used
  // for an event. Due to their nature, events lack certain information,
  // so edit the HTML to reflect this.
  //---------------------------------------------------------------------

  html(_isEvent, data) {
    return `
<div style="padding-top: 8px;">
  <div style="float: left; width: calc(50% - 12px);">
    <span class="dbminputlabel">Data Name</span><br>
    <input id="dataName" class="round" type="text">
  </div>
  <div style="float: right; width: calc(50% - 12px);">
    <span class="dbminputlabel">Comparison Type</span><br>
    <select id="comparison" class="round" onchange="glob.onComparisonChanged(this)">
      <option value="0">Exists</option>
      <option value="1" selected>Equals</option>
      <option value="2">Equals Exactly</option>
      <option value="3">Less Than</option>
      <option value="4">Greater Than</option>
      <option value="5">Includes</option>
      <option value="6">Matches Regex</option>
    </select>
  </div>
</div>

<br><br><br>

<div id="directValue" style="padding-top: 8px;">
  <span class="dbminputlabel">Value to Compare to</span><br>
  <input id="value" class="round" type="text" name="is-eval">
</div>

<br>

<hr class="subtlebar">

<conditional-input id="branch" style="padding-top: 16px;"></conditional-input>`;
  },

  //---------------------------------------------------------------------
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
  //---------------------------------------------------------------------

  init() {
    const { glob, document } = this;

    glob.onComparisonChanged = function (event) {
      if (event.value === "0") {
        document.getElementById("directValue").style.display = "none";
      } else {
        document.getElementById("directValue").style.display = null;
      }
    };

    glob.onComparisonChanged(document.getElementById("comparison"));
  },

  //---------------------------------------------------------------------
  // Action Bot Function
  //
  // This is the function for the action within the Bot's Action class.
  // Keep in mind event calls won't have access to the "msg" parameter,
  // so be sure to provide checks for variable existence.
  //---------------------------------------------------------------------

  async action(cache) {
    const data = cache.actions[cache.index];
    const dataName = this.evalMessage(data.dataName, cache);
    const compare = parseInt(data.comparison, 10);
    const { Globals } = this.getDBM();
    const val1 = Globals.data(dataName);
    let val2 = this.evalMessage(data.value, cache);
    if (compare !== 6) val2 = this.eval(val2, cache);
    if (val2 === false) val2 = this.evalMessage(data.value, cache);

    let result = false;
    switch (compare) {
      case 0:
        result = val1 !== undefined;
        break;
      case 1:
        result = val1 == val2;
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
      default:
        break;
    }
    this.executeResults(result, data, cache);
  },

  //---------------------------------------------------------------------
  // Action Bot Mod
  //
  // Upon initialization of the bot, this code is run. Using the bot's
  // DBM namespace, one can add/modify existing functions if necessary.
  // In order to reduce conflicts between mods, be sure to alias
  // functions you wish to overwrite.
  //---------------------------------------------------------------------

  mod() {},
};
