module.exports = {
  // ---------------------------------------------------------------------
  // Action Name
  //
  // This is the name of the action displayed in the editor.
  // ---------------------------------------------------------------------

  name: 'Store Role Info',

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
    const info = [
      'Role Object',
      'Role ID',
      'Role Name',
      'Role Color',
      'Role Position',
      'Role Timestamp',
      'Role Is Mentionable?',
      'Role Is Separate From Others?',
      'Role Is Managed?',
      'Role Members List',
      'Role Creation Date',
      'Role Permissions',
      'Role Members Amount',
      'Role Icon',
    ];
    return `${presets.getRoleText(data.role, data.varName)} - ${info[parseInt(data.info, 10)]}`;
  },

  // ---------------------------------------------------------------------
  // Action Storage Function
  //
  // Stores the relevant variable info for the editor.
  // ---------------------------------------------------------------------

  variableStorage(data, varType) {
    const type = parseInt(data.storage, 10);
    if (type !== varType) return;
    const info = parseInt(data.info, 10);
    let dataType = 'Unknown Type';
    switch (info) {
      case 0:
        dataType = 'Role';
        break;
      case 1:
        dataType = 'Role ID';
        break;
      case 2:
        dataType = 'Text';
        break;
      case 3:
        dataType = 'Color';
        break;
      case 4:
      case 5:
        dataType = 'Text';
        break;
      case 6:
      case 7:
        dataType = 'Boolean';
        break;
      case 8:
        dataType = 'Boolean';
        break;
      case 9:
        dataType = 'Member List';
        break;
      case 10:
        dataType = 'Date';
        break;
      case 11:
      case 12:
        dataType = 'Number';
        break;
      case 13:
        dataType = 'Image URL';
        break;
    }
    return [data.varName2, dataType];
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

  fields: ['role', 'varName', 'info', 'storage', 'varName2'],

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
<role-input dropdownLabel="Source Role" selectId="role" variableContainerId="varNameContainer" variableInputId="varName"></role-input>

<br><br><br>

<div style="padding-top: 8px;">
	<span class="dbminputlabel">Source Info</span><br>
	<select id="info" class="round">
		<option value="0" selected>Role Object</option>
		<option value="1">Role ID</option>
		<option value="2">Role Name</option>
		<option value="3">Role Color</option>
		<option value="4">Role Position</option>
		<option value="5">Role Timestamp</option>
		<option value="6">Role Is Mentionable?</option>
		<option value="7">Role Is Separate From Others?</option>
		<option value="8">Role Is Managed By Bot/Integration</option>
		<option value="9">Role Members</option>
		<option value="10">Role Creation Date</option>
		<option value="11">Role Permissions</option>
		<option value="12">Role Members Amount</option>
		<option value="13">Role Icon URL</option>
	</select>
</div>

<br>

<store-in-variable dropdownLabel="Store In" selectId="storage" variableContainerId="varNameContainer2" variableInputId="varName2"></store-in-variable>`;
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
    const targetRole = await this.getRoleFromData(data.role, data.varName, cache);
    const info = parseInt(data.info, 10);
    if (!targetRole) {
      this.callNextAction(cache);
      return;
    }

    let result;
    switch (info) {
      case 0:
        result = targetRole;
        break;
      case 1:
        result = targetRole.id;
        break;
      case 2:
        result = targetRole.name;
        break;
      case 3:
        result = targetRole.hexColor;
        break;
      case 4:
        result = targetRole.position;
        break;
      case 5:
        result = targetRole.createdTimestamp;
        break;
      case 6:
        result = targetRole.mentionable;
        break;
      case 7:
        result = targetRole.hoist;
        break;
      case 8:
        result = targetRole.managed;
        break;
      case 9:
        result = [...targetRole.members.values()];
        break;
      case 10:
        result = targetRole.createdAt;
        break;
      case 11:
        result = targetRole.permissions.toArray();
        break;
      case 12:
        result = targetRole.members.size;
        break;
      case 13:
        result = targetRole.iconURL({ dynamic: true, format: 'png', size: 4096 });
        break;
      default:
        break;
    }
    if (result !== undefined) {
      const storage = parseInt(data.storage, 10);
      const varName2 = this.evalMessage(data.varName2, cache);
      this.storeValue(result, storage, varName2, cache);
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
