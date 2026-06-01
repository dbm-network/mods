module.exports = {
  name: 'Store Member Info MOD',
  section: 'Member Control',
  meta: {
    version: '2.1.6',
    preciseCheck: true,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods',
  },

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
      'Member Banner URL',
      'Member Server ID',
      'Member Boost Timestamp',
    ];
    return `${presets.getMemberText(data.member, data.varName)} - ${info[parseInt(data.info, 10)]}`;
  },

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
      case 33:
        dataType = 'Timestamp';
        break;
      case 34:
        dataType = 'Image URL';
        break;
      case 35:
        dataType = 'Server ID';
        break;
      case 36:
        dataType = 'Timestamp';
        break;
    }
    return [data.varName2, dataType];
  },

  fields: ['member', 'varName', 'info', 'storage', 'varName2'],

  html(isEvent, data) {
    return `
    <div style="position:absolute;bottom:0px;border: 1px solid #222;background:#000;color:#999;padding:3px;right:0px;z-index:999999">Version 1.0</div>
    <div style="position:absolute;bottom:0px;border: 1px solid #222;background:#000;color:#999;padding:3px;left:0px;z-index:999999">DBM Extended</div>

<member-input dropdownLabel="Membro" selectId="member" variableContainerId="varNameContainer" variableInputId="varName"></member-input>

<br><br><br>

<div style="padding-top: 8px;">
	<span class="dbminputlabel">Source Info</span><br>
	<select id="info" class="round">
		<option value="0" selected>Member Object</option>
		<option value="1">Member ID</option>
		<option value="2">Member Username</option>
		<option value="3">Member Display Name</option>
		<option value="21">Member Tag</option>
		<option value="20">Member Discriminator</option>
		<option value="4">Member Color</option>
		<option value="15">Member Status</option>
		<option value="16">Member Avatar URL</option>
		<option value="34">Member Banner URL</option>
		<option value="31">Member Server Avatar URL</option>
		<option value="5">Member Server</option>
		<option value="35">Member Server ID</option>
		<option value="6">Member Last Message (Removed)</option>
		<option value="26">Member Last Message Id (Removed)</option>
		<option value="7">Member Highest Role</option>
		<option value="8">Member Hoist Role</option>
		<option value="9">Member Color Role</option>
		<option value="17">Member Roles List</option>
		<option value="18">Member Roles Amount</option>
		<option value="10">Member Is Owner?</option>
		<option value="11">Member Is Muted?</option>
		<option value="12">Member Is Deafened?</option>
		<option value="13">Member Is Bannable?</option>
		<option value="14">Member Playing Status Name</option>
		<option value="30">Member Custom Status</option>
		<option value="19">Member Voice Channel</option>
		<option value="22">Member Created At</option>
		<option value="23">Member Created Timestamp</option>
		<option value="24">Member Joined At</option>
		<option value="25">Member Joined Timestamp</option>
		<option value="27">Member Permission List</option>
		<option value="28">Member Flags List</option>
		<option value="29">Member Client Status</option>
		<option value="32">Member Timed Out At</option>
		<option value="33">Member Timed Out Timestamp</option>
		<option value="36">Member Boost Timestamp</option>
	</select>
</div>

<br>

<store-in-variable dropdownLabel="Armazenar em" selectId="storage" variableContainerId="varNameContainer2" variableInputId="varName2"></store-in-variable>`;
  },

  init() {},

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
          const status = member.presence.activities.filter((s) => s.type !== 'CUSTOM');
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
              result = 'Ausente';
              break;
            }
            case 'dnd': {
              result = 'Ocupado';
              break;
            }
          }
        }
        break;
      case 16:
        if (member.user) {
          result = member.user.displayAvatarURL({ dynamic: true, format: 'png', size: 4096 });
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
      case 30:
        result = member.presence?.activities.find((s) => s.type === 'CUSTOM')?.state;
        break;
      case 31:
        result = member.displayAvatarURL({ dynamic: true, format: 'png', size: 4096 });
        break;
      case 32:
        result = member.communicationDisabledUntil;
        break;
      case 33:
        result = member.communicationDisabledUntilTimestamp;
        break;
      case 34:
        await member.user.fetch();
        result = member.user.bannerURL({ fomart: 'png', size: 4096, dynamic: true });
        break;
      case 35:
        result = member.guild.id;
        break;
      case 36:
        result = member.premiumSinceTimestamp;
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
