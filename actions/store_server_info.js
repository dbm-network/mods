module.exports = {
  // ---------------------------------------------------------------------
  // Action Name
  //
  // This is the name of the action displayed in the editor.
  // ---------------------------------------------------------------------

  name: 'Store Server Info',

  // ---------------------------------------------------------------------
  // Action Section
  //
  // This is the section the action will fall into.
  // ---------------------------------------------------------------------

  section: 'Server Control',

  // ---------------------------------------------------------------------
  // Action Subtitle
  //
  // This function generates the subtitle displayed next to the name.
  // ---------------------------------------------------------------------

  subtitle(data, presets) {
    const info = [
      'Server Object',
      'Server ID',
      'Server Name',
      'Server Name Acronym',
      'Server Region (Removed)',
      'Server Icon URL',
      'Server Verification Level',
      'Server Default Channel',
      'Server AFK Channel',
      'Server System Channel',
      'Server Default Role',
      'Server Owner Object',
      'Server Bot Member',
      'Server Channels List',
      'Server Roles List',
      'Server Members List',
      'Server Emojis List',
      'Server Member Count',
      'Server Created At',
      'Server AFK Timeout',
      'Server Available',
      'Server Large',
      'Server Joined At',
      'Server Channels Count',
      'Server Emojis Count',
      'Server Embed Enabled',
      'Server Do Not Disturb Members Count',
      'Server Online Members Count',
      'Server Offline Members Count',
      'Server Idle Members Count',
      'Server Bot Count',
      'Server Channels IDs List',
      'Server Roles IDs List',
      'Server Members IDs List',
      '',
      'Server Human Count',
      '',
      'Server Roles Count',
      'Server Text Channels Count',
      'Server Voice Channels Count',
      'Server Verified',
      'Server Bans List',
      'Server Invites List',
      'Server Explicit Content Filter',
      'Server Boosts Count',
      'Server Boost Tier',
      'Server Banner URL',
      'Server Features List',
      'Server Owner ID',
      'Server Vanity URL Code',
      'Server Widget Channel ID',
    ];
    return `${presets.getServerText(data.server, data.varName)} - ${info[parseInt(data.info, 10)]}`;
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
        dataType = 'Server';
        break;
      case 1:
        dataType = 'Server ID';
        break;
      case 2:
      case 3:
      case 5:
        dataType = 'Icon URL';
        break;
      case 6:
        dataType = 'Text';
        break;
      case 7:
      case 8:
      case 9:
        dataType = 'Channel';
        break;
      case 10:
        dataType = 'Role';
        break;
      case 11:
        dataType = 'Server Member';
        break;
      case 12:
        dataType = 'Server Member';
        break;
      case 13:
        dataType = 'Channels List';
        break;
      case 14:
        dataType = 'Roles List';
        break;
      case 15:
        dataType = 'Members List';
        break;
      case 16:
        dataType = 'Emojis List';
        break;
      case 17:
        dataType = 'Number';
        break;
      case 18:
        dataType = 'Date';
        break;
      case 19:
        dataType = 'Number';
        break;
      case 20:
      case 21:
        dataType = 'Boolean';
        break;
      case 22:
        dataType = 'Date';
        break;
      case 23:
      case 24:
        dataType = 'Number';
        break;
      case 25:
        dataType = 'Boolean';
        break;
      case 26:
      case 27:
      case 28:
      case 29:
      case 30:
        dataType = 'Number';
        break;
      case 31:
      case 32:
      case 33:
        dataType = 'IDs List';
        break;
      case 35:
        dataType = 'Number';
        break;
      case 37:
      case 38:
      case 39:
        dataType = 'Number';
        break;
      case 40:
        dataType = 'Boolean';
        break;
      case 41:
        dataType = 'Bans List';
        break;
      case 42:
        dataType = 'Invites List';
        break;
      case 43:
        dataType = 'Text';
        break;
      case 44:
      case 45:
        dataType = 'Number';
        break;
      case 46:
        dataType = 'Banner URL';
        break;
      case 47:
        dataType = 'Server Features List';
        break;
      case 48:
      case 49:
        dataType = 'Text';
        break;
      case 50:
        dataType = 'Channel ID';
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

  fields: ['server', 'varName', 'info', 'storage', 'varName2'],

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
<server-input dropdownLabel="Source Server" selectId="server" variableContainerId="varNameContainer" variableInputId="varName"></server-input>

<br><br><br>

<div>
	<div style="padding-top: 8px; width: 100%;">
		<span class="dbminputlabel">Source Info</span><br>
		<select id="info" class="round">
			<option value="0">Server Object</options>
			<option value="1">Server ID</options>
			<option value="2">Server Name</options>
			<option value="3">Server Name Acronym</options>
			<option value="17">Server Member Count</options>
			<option value="4">Server Region (Removed)</options>
			<option value="5">Server Icon URL</options>
			<option value="6">Server Verification Level</options>
			<option value="7">Server Default Channel</options>
			<option value="9">Server System Channel</options>
			<option value="43">Server Explicit Content Filter</options>
			<option value="8">Server AFK Channel</options>
			<option value="19">Server AFK Timeout</options>
			<option value="10">Server Default Role</options>
			<option value="48">Server Owner ID</options>
			<option value="11">Server Owner Object</options>
			<option value="12">Server Bot Member</options>
			<option value="18">Server Created At</options>
			<option value="22">Server Joined At</options>
			<option value="20">Server Available</options>
			<option value="21">Server Large</options>
			<option value="40">Server Verified</options>
			<option value="23">Server Channels Count</options>
			<option value="13">Server Channels List</options>
			<option value="31">Server Channels IDs List</options>
			<option value="37">Server Roles Count</options>
			<option value="14">Server Roles List</options>
			<option value="32">Server Roles IDs List</options>
			<option value="30">Server Bot Count</options>
			<option value="35">Server Human Count</options>
			<option value="15">Server Members List</options>
			<option value="33">Server Members IDs List</options>
			<option value="16">Server Emojis List</options>
			<option value="24">Server Emojis Count</options>
			<option value="25">Server Embed Enabled</options>
			<option value="27">Server Online Members Count</options>
			<option value="29">Server Idle Members Count</options>
			<option value="26">Server Do Not Disturb Members Count</options>
			<option value="28">Server Offline Members Count</options>
			<option value="38">Server Text Channels Count</options>
			<option value="39">Server Voice Channels Count</options>
			<option value="41">Server Bans List</options>
			<option value="42">Server Invites List</options>
			<option value="44">Server Boosts Count</options>
			<option value="45">Server Boost Tier</options>
			<option value="46">Server Banner URL</options>
			<option value="47">Server Features List</options>
			<option value="49">Server Vanity URL Code</options>
			<option value="50">Server Widget Channel ID</options>
		</select>
	</div>
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
    const targetServer = await this.getServerFromData(data.server, data.varName, cache);

    if (!targetServer) {
      this.callNextAction(cache);
      return;
    }

    const fetchMembers = async (withPresences = false) => {
      if (targetServer.memberCount !== targetServer.members.cache.size) {
        await targetServer.members.fetch({ withPresences });
      }
    };

    const info = parseInt(data.info, 10);

    let result;
    switch (info) {
      case 0:
        result = targetServer;
        break;
      case 1:
        result = targetServer.id;
        break;
      case 2:
        result = targetServer.name;
        break;
      case 3:
        result = targetServer.nameAcronym;
        break;
      case 4: // Server region
        result = 'unknown';
        break;
      case 5:
        result = targetServer.iconURL({ dynamic: true, format: 'png', size: 4096 });
        break;
      case 6:
        result = targetServer.verificationLevel;
        break;
      case 7:
        result = targetServer.getDefaultChannel();
        break;
      case 8:
        result = targetServer.afkChannel;
        break;
      case 9:
        result = targetServer.systemChannel;
        break;
      case 10:
        result = targetServer.roles.resolve(targetServer.id);
        break;
      case 11:
        try {
          result = await targetServer.fetchOwner();
        } catch (err) {
          result = null;
        }
        break;
      case 12:
        result = targetServer.members.me;
        break;
      case 13:
        result = [...targetServer.channels.cache.values()];
        break;
      case 14:
        result = [...targetServer.roles.cache.values()];
        break;
      case 15:
        result = [...targetServer.members.cache.values()];
        break;
      case 16:
        result = [...targetServer.emojis.cache.values()];
        break;
      case 17:
        result = targetServer.memberCount;
        break;
      case 18:
        result = targetServer.createdAt;
        break;
      case 19:
        result = targetServer.afkTimeout ?? 0;
        break;
      case 20:
        result = targetServer.available;
        break;
      case 21:
        result = targetServer.large;
        break;
      case 22:
        result = targetServer.joinedAt;
        break;
      case 23:
        result = targetServer.channels.cache.size;
        break;
      case 24:
        result = targetServer.emojis.cache.size;
        break;
      case 25:
        result = Boolean(targetServer.widgetEnabled);
        break;
      case 26:
        await fetchMembers(true);
        result = targetServer.members.cache.filter((m) => m.presence?.status === 'dnd').size;
        break;
      case 27:
        await fetchMembers(true);
        result = targetServer.members.cache.filter((m) => m.presence?.status === 'online').size;
        break;
      case 28:
        await fetchMembers(true);
        result = targetServer.members.cache.filter((m) => m.presence?.status === 'offline').size;
        break;
      case 29:
        await fetchMembers(true);
        result = targetServer.members.cache.filter((m) => m.presence?.status === 'idle').size;
        break;
      case 30:
        result = targetServer.members.cache.filter((m) => m.user?.bot).size;
        break;
      case 31:
        result = [...targetServer.channels.cache.keys()];
        break;
      case 32:
        result = [...targetServer.roles.cache.keys()];
        break;
      case 33:
        await fetchMembers();
        result = [...targetServer.members.cache.keys()];
        break;
      case 35:
        await fetchMembers();
        result = targetServer.members.cache.filter((m) => !m.user?.bot).size;
        break;
      case 37:
        result = targetServer.roles.cache.size;
        break;
      case 38: {
        const { ChannelType } = this.getDBM().DiscordJS;
        result = targetServer.channels.cache.filter(
          (c) => c.type === ChannelType.GuildText || c.type === ChannelType.GuildAnnouncement,
        ).size;
        break;
      }
      case 39: {
        const { ChannelType } = this.getDBM().DiscordJS;
        result = targetServer.channels.cache.filter((c) => c.type === ChannelType.GuildVoice).size;
        break;
      }
      case 40:
        result = targetServer.verified;
        break;
      case 41:
        const bans = await targetServer.bans.fetch();
        result = [...bans.values()];
        break;
      case 42:
        const invites = await targetServer.invites.fetch();
        result = [...invites.values()];
        break;
      case 43:
        result = targetServer.explicitContentFilter;
        break;
      case 44:
        result = targetServer.premiumSubscriptionCount ?? 0;
        break;
      case 45:
        result = targetServer.premiumTier;
        break;
      case 46:
        result = targetServer.bannerURL({ format: 'png', size: 4096 });
        break;
      case 47:
        result = targetServer.features;
        break;
      case 48:
        result = targetServer.ownerId;
        break;
      case 49:
        result = targetServer.vanityURLCode;
        break;
      case 50:
        result = targetServer.widgetChannelId;
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
