module.exports = {
  // ---------------------------------------------------------------------
  // Action Name
  //
  // This is the name of the action displayed in the editor.
  // ---------------------------------------------------------------------

  name: 'Add Items to Object',

  // ---------------------------------------------------------------------
  // Action Section
  //
  // This is the section the action will fall into.
  // ---------------------------------------------------------------------

  section: 'JSON Things',

  // ---------------------------------------------------------------------
  // Action Subtitle
  //
  // This function generates the subtitle displayed next to the name.
  // ---------------------------------------------------------------------

  subtitle(data, presets) {
    const storage = presets.variables;
    return `Add ${Object.entries(data.entriess).length} item${
      Object.entries(data.entriess).length === 1 ? '' : 's'
    } entries to ${storage[parseInt(data.storage, 10)]} (${data.varName})`;
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
    version: '2.1.7',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/add_items_to_object_MOD.js',
  },

  // ---------------------------------------------------------------------
  // Action Fields
  //
  // These are the fields for the action. These fields are customized
  // by creating elements with corresponding IDs in the HTML. These
  // are also the names of the fields stored in the action's JSON data.
  // ---------------------------------------------------------------------

  fields: ['storage', 'varName', 'entriess'],

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
<retrieve-from-variable dropdownLabel="Source Object" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></retrieve-from-variable>

<br><br><br><br>

<dialog-list id="entriess" fields='["key", "value"]' dialogTitle="Add Entry" dialogWidth="360" dialogHeight="170" listLabel="Entries" listStyle="height: calc(100vh - 285px);" itemName="Entry" itemCols="2" itemHeight="40px;" itemStyle="padding: 10px; text-align: left; " itemTextFunction="data.key ? data.value ? data.key + ': ' + data.value : 'Clear \\'' + data.key + '\\'' : '<a style=\\'color:red\\'>Missing key</a>'">
  <div style="display:flex; padding: 16px; width:100%">
    <div style="flex:1 1 auto">
      <span class="dbminputlabel">Key</span><br>
      <input id="key" class="round" type="text"><br>
    </div>
    <div style="flex:1 1 auto; padding-left: 23px">
      <span class="dbminputlabel">Value</span><br>
      <input id="value" class="round" placeholder="Leave blank to clear" type="text" name="is-eval">
    </div>
  </div>
</dialog-list>


`;
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
    const list = this.getVariable(storage, varName, cache);

    for (let i = 0; i < data.entriess.length; i++) {
      const key = this.evalMessage(data.entriess[i].key, cache);
      let val = this.evalMessage(data.entriess[i].value, cache);
      if (!key) continue;
      if (!val) {
        delete list[key];
        continue;
      } else {
        try {
          val = this.eval(val, cache);
        } catch (e) {
          this.displayError(data, cache, e);
        }
        list[key] = val;
      }
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
