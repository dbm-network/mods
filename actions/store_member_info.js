module.exports = {
  // ---------------------------------------------------------------------
  // Action Name
  //
  // This is the name of the action displayed in the editor.
  // ---------------------------------------------------------------------

  name: 'Store Member Info',

  // ---------------------------------------------------------------------
  // Action Section
  //
  // This is the section the action will fall into.
  // ---------------------------------------------------------------------

  section: 'Member Control',

  // ---------------------------------------------------------------------
  // Action Subtitle
  //
  // This function generates the subtitle displayed next to the name.
  // ---------------------------------------------------------------------

  subtitle(data, presets) {
    const info = [
      'Member Object',
      'Member ID',
      'Member Username',
      'Member Display Name',
      'Member Color',
      'Member Server',
      'Member Last Message (Removed)',
      'Member Highest Role',
      'Member Hoist Role',
      'Member Color Role',
      'Member Is Owner?',
      'Member Is Muted?',
      'Member Is Deafened?',
      'Member Is Bannable?',
      'Member Playing Status Name',
      'Member Status',
      'Member Avatar URL',
      'Member Roles List',
      'Member Roles Amount',
      'Member Voice Channel',
      'Member Discriminator',
      'Member Tag',
      'Member Created At',
      'Member Created Timestamp',
      'Member Joined At',
      'Member Joined Timestamp',
      'Last Message Id (Removed)',
      'Member Permission List',
      'Member Flags List',
      'Member Client Status',
      'Member Custom Status',
      'Member Server Avatar URL',
      'Member Timed Out At',
      'Member Timed Out Timestamp',
    ];
    return `${presets.getMemberText(data.member, data.varName)} - ${info[parseInt(data.info, 10)]}`;
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
        dataType = 'Server Member';
        break;
      case 1:
        dataType = 'Member ID';
        break;
      case 2:
      case 3:
        dataType = 'Text';
        break;
      case 4:
        dataType = 'Color';
        break;
      case 5:
        dataType = 'Server';
        break;
      case 7:
      case 8:
      case 9:
        dataType = 'Role';
        break;
      case 10:
      case 11:
      case 12:
      case 13:
        dataType = 'Boolean';
        break;
      case 14:
      case 15:
        dataType = 'Text';
        break;
      case 16:
      case 31:
        dataType = 'Image URL';
        break;
      case 17:
        dataType = 'List of Roles';
        break;
      case 18:
        dataType = 'Number';
        break;
      case 19:
        dataType = 'Voice Channel';
        break;
      case 20:
        dataType = 'Member Discriminator';
        break;
      case 21:
        dataType = 'Member Tag';
        break;
      case 22:
        dataType = 'Date';
        break;
      case 23:
        dataType = 'Timestamp';
        break;
      case 24:
        dataType = 'Date';
        break;
      case 25:
        dataType = 'Timestamp';
        break;
      case 27:
      case 28:
      case 29:
        dataType = 'List';
        break;
      case 30:
        dataType = 'Text';
        break;
      case 32:
        dataType = 'Timestamp';
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

  fields: ['member', 'varName', 'info', 'storage', 'varName2'],

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
<member-input dropdownLabel="Source Member" selectId="member" variableContainerId="varNameContainer" variableInputId="varName"></member-input>

<br><br><br>

<div style="padding-top: 8px;">
	<span class="dbminputlabel">Source Info</span><br>
	<select id="info" class="round">
		<option value="0" selected>Member Object</option>
		<option value="1">Member ID</option>
		<option value="2">Member Username</option>
		<option value="3">Member Display Name</option>
		<option value="4">Member Color</option>
		<option value="15">Member Status</option>
		<option value="16">Member Avatar URL</option>
		<option value="31">Member Server Avatar URL</option>
		<option value="5">Member Server</option>
		<option value="6">Member Last Message (Removed)</option>
		<option value="26">Member Last Message Id (Removed)</option>
		<option value="17">Member Role List</option>
		<option value="7">Member Highest Role</option>
		<option value="8">Member Hoist Role</option>
		<option value="9">Member Color Role</option>
		<option value="10">Member Is Owner?</option>
		<option value="11">Member Is Muted?</option>
		<option value="12">Member Is Deafened?</option>
		<option value="13">Member Is Bannable?</option>
		<option value="14">Member Playing Status Name</option>
		<option value="30">Member Custom Status</option>
		<option value="17">Member Roles List</option>
		<option value="18">Member Roles Amount</option>
		<option value="19">Member Voice Channel</option>
		<option value="20">Member Discriminator</option>
		<option value="21">Member Tag</option>
		<option value="22">Member Created At</option>
		<option value="23">Member Created Timestamp</option>
		<option value="24">Member Joined At</option>
		<option value="25">Member Joined Timestamp</option>
		<option value="27">Member Permission List</option>
		<option value="28">Member Flags List</option>
		<option value="29">Member Client Status</option>
		<option value="22">Member Timed Out At</option>
		<option value="23">Member Timed Out Timestamp</option>
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
    const member = await this.getMemberFromData(data.member, data.varName, cache);

    if (!member) {
      this.callNextAction(cache);
      return;
    }

    const info = parseInt(data.info, 10);

    let result;
    switch (info) {
      case 0:
        result = member;
        break;
      case 1:
        result = member.id;
        break;
      case 2:
        result = member.user?.username;
        break;
      case 3:
        result = member.displayName;
        break;
      case 4:
        result = member.displayHexColor;
        break;
      case 5:
        result = member.guild;
        break;
      case 7:
        result = member.roles.highest;
        break;
      case 8:
        result = member.roles.hoist;
        break;
      case 9:
        result = member.roles.color;
        break;
      case 10:
        result = member.id === member.guild?.ownerId;
        break;
      case 11:
        result = member.voice.mute;
        break;
      case 12:
        result = member.voice.deaf;
        break;
      case 13:
        result = member.bannable;
        break;
      case 14:
        if (member.presence?.activities.length) {
          const { ActivityType } = this.getDBM().DiscordJS;
          const status = member.presence.activities.filter((s) => s.type !== ActivityType.Custom);
          result = status[0]?.name;
        }
        break;
      case 15:
        if (member.presence?.status) {
          const status = member.presence.status;
          switch (status) {
            case 'online': {
              result = 'Online';
              break;
            }
            case 'offline': {
              result = 'Offline';
              break;
            }
            case 'idle': {
              result = 'Idle';
              break;
            }
            case 'dnd': {
              result = 'Do Not Disturb';
              break;
            }
          }
        }
        break;
      case 16:
        if (member.user) {
          result = member.user.displayAvatarURL({ extension: 'png', size: 4096 });
        }
        break;
      case 17:
        result = [...member.roles.cache.values()];
        break;
      case 18:
        result = member.roles.cache.size;
        break;
      case 19:
        result = member.voice.channel;
        break;
      case 20:
        result = member.user?.discriminator;
        break;
      case 21:
        result = member.user?.tag;
        break;
      case 22:
        result = member.user?.createdAt;
        break;
      case 23:
        result = member.user?.createdTimestamp;
        break;
      case 24:
        result = member.joinedAt;
        break;
      case 25:
        result = member.joinedTimestamp;
        break;
      case 27:
        result = member.permissions.toArray();
        break;
      case 28:
        result = member.user?.flags?.toArray() ?? (await member.user?.fetchFlags())?.toArray();
        break;
      case 29:
        const status = member.presence?.clientStatus;
        result = status && Object.keys(status);
        break;
      case 30: {
        const { ActivityType } = this.getDBM().DiscordJS;
        result = member.presence?.activities.find((s) => s.type === ActivityType.Custom)?.state;
        break;
      }
      case 31:
        result = member.displayAvatarURL({ extension: 'png', size: 4096 });
        break;
      case 32:
        result = member.communicationDisabledUntil;
        break;
      case 33:
        result = member.communicationDisabledUntilTimestamp;
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
