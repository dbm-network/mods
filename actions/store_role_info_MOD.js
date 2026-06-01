module.exports = {
  name: 'Store Role Info',
  section: 'Role Control',
  meta: {
    version: '2.1.6',
    preciseCheck: true,
    author: 'DBM Extended',
    authorUrl: 'https://github.com/DBM-Extended/mods',
    downloadURL: 'https://github.com/DBM-Extended/mods',
  },

  subtitle(data, presets) {
    const info = [
      'Role Object',
      'Role ID',
      'Position Name',
      'Position Color',
      'Position of Position',
      'Timestamp of Job creation',
      'Is the Position mentionable?',
      'Is the job separate from the others?',
      'Is the Role manageable',
      "The Role's member list",
      'Role creation date',
      "Role's permission list",
      'Number of members of the Role',
      'Role Icon',
      'Position Tag',
      'Position Server',
      "Position's Server ID",
      'Is the Position editable?',
      'List of member IDs of the Position',
    ];
    return `${presets.getRoleText(data.role, data.varName)} - ${info[parseInt(data.info, 10)]} to (${data.varName2})`;
  },

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
        dataType = 'Number';
        break;
      case 5:
        dataType = 'Timestamp';
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
      case 14:
        dataType = 'Object';
        break;
      case 15:
        dataType = 'Server';
        break;
      case 16:
        dataType = 'Server ID';
        break;
      case 17:
        dataType = 'Boolean';
        break;
      case 18:
        dataType = 'List';
        break;
    }
    return [data.varName2, dataType];
  },

  fields: ['role', 'varName', 'info', 'storage', 'varName2'],

  html(isEvent, data) {
    return `
<role-input dropdownLabel="Source function" selectId="role" variableContainerId="varNameContainer" variableInputId="varName"></role-input>

<br><br><br>

<div style="padding-top: 8px;">
	<span class="dbminputlabel">Source Information</span><br>
	<select id="info" class="round">
	<optgroup label="Position Information">
	 <option value="0" selected>Position - Object</option>
	 <option value="1">Job ID</option>
	 <option value="2">Job Name</option>
	 <option value="3">Position Color</option>
	 <option value="4">Position Position</option>
     <option value="14">Position Tag</option>
     <option value="13">Position Icon</option>
     <option value="12">Position Membership Number</option>
    </optgroup>
    <optgroup label="Position Conditions">
<option value="6">Is the title mentionable?</option>
<option value="17">Is the title editable?</option>
     <option value="7">Is the Position separate from others?</option>
     <option value="8">Is the role managed by the bot/integration?</option>
     </optgroup>
     <optgroup label="Position Dates">
<option value="5">Position creation timestamp</option>
     <option value="10">Position creation date</option>
     </optgroup>
     <optgroup label="Position Information">
     <option value="15">Position Server</option>
     <option value="16">Position Server ID</option>
     </optgroup>
     <optgroup label="Position Information in Lists">
     <option value="9">Position Member List</option>
     <option value="18">Position Member ID List</option>
     <option value="11">Position Whitelist</option>
    </optgroup>
	</select>
</div>

<br>

<store-in-variable dropdownLabel="Store in" selectId="storage" variableContainerId="varNameContainer2" variableInputId="varName2"></store-in-variable>`;
  },

  init() {},

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
        result = targetRole.permissions.toArray().join(', ').replace(/_/g, ' ').toLowerCase();
        break;
      case 12:
        result = targetRole.members.size;
        break;
      case 13:
        result = targetRole.iconURL({ dynamic: true, format: 'png', size: 4096 });
        break;
      case 14:
        result = targetRole.tags;
        break;
      case 15:
        result = targetRole.guild;
        break;
      case 16:
        result = targetRole.guild.id;
        break;
      case 17:
        result = targetRole.editable;
        break;
      case 18:
        result = [...targetRole.members.keys()];
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

  mod() {},
};
