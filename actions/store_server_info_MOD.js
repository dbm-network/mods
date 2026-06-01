module.exports = {
  name: 'Store Server Info MOD',
  section: 'Server Control',
  meta: {
    version: '2.1.6',
    preciseCheck: true,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods',
  },

  subtitle(data, presets) {
    const info = [
      'Server Object',
      'Server ID',
      'Server Name',
      'Server Name Acronym',
      'Server Preferred Language',
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
      'Server AFK Channel ID',
      'Server Progress Bar Enable',
      'Server Description',
      'Server Partnered',
      'Server Rule Channel',
      'Server Rule Channel ID',
      'Server Widget Channel',
      'Server System Channel ID',
      'Server NSFW Level',
      'Server MFA/2FA Level',
      'Server Timestamp',
      'Template URL',
      'Template Code',
      'Template Name',
      'Template Description',
      'Times the Template has been used',
      'Template creator ID',
      'Timestamp of Template creation',
      'Timestamp of Template update',
      'Total members in the voice channel',
      'List of members by ID present in the voice channels',
      'List of members present in the voice channels',
    ];
    return `${presets.getServerText(data.server, data.varName)} - ${info[parseInt(data.info, 10)]}`;
  },

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
        dataType = 'Text';
        break;
      case 3:
        dataType = 'Text';
        break;
      case 4:
        dataType = 'Text';
        break;
      case 5:
        dataType = 'Icon URL';
        break;
      case 6:
        dataType = 'Text';
        break;
      case 7:
        dataType = 'Channel';
        break;
      case 8:
        dataType = 'Channel';
        break;
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
        dataType = 'Boolean';
        break;
      case 21:
        dataType = 'Boolean';
        break;
      case 22:
        dataType = 'Date';
        break;
      case 23:
        dataType = 'Number';
        break;
      case 24:
        dataType = 'Number';
        break;
      case 25:
        dataType = 'Boolean';
        break;
      case 26:
        dataType = 'Number';
        break;
      case 27:
        dataType = 'Number';
        break;
      case 28:
        dataType = 'Number';
        break;
      case 29:
        dataType = 'Number';
        break;
      case 30:
        dataType = 'Number';
        break;
      case 31:
        dataType = 'IDs List';
        break;
      case 32:
        dataType = 'IDs List';
        break;
      case 33:
        dataType = 'IDs List';
        break;
      case 35:
        dataType = 'Number';
        break;
      case 37:
        dataType = 'Number';
        break;
      case 38:
        dataType = 'Number';
        break;
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
        dataType = 'Number';
        break;
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
        dataType = 'Server Member ID';
        break;
      case 49:
        dataType = 'Text';
        break;
      case 50:
        dataType = 'Channel ID';
        break;
      case 51:
        dataType = 'Channel ID';
        break;
      case 52:
        dataType = 'Boolean';
        break;
      case 53:
        dataType = 'Text';
        break;
      case 54:
        dataType = 'Boolean';
        break;
      case 55:
        dataType = 'Channel';
        break;
      case 56:
        dataType = 'Channel ID';
        break;
      case 57:
        dataType = 'Channel';
        break;
      case 58:
        dataType = 'Channel ID';
        break;
      case 59:
        dataType = 'Text';
        break;
      case 60:
        dataType = 'Text';
        break;
      case 61:
        dataType = 'Timestamp';
        break;
      case 62:
        dataType = 'URL';
        break;
      case 63:
        dataType = 'Code';
        break;
      case 64:
        dataType = 'Text';
        break;
      case 65:
        dataType = 'Text';
        break;
      case 66:
        dataType = 'Number';
        break;
      case 67:
        dataType = 'ID User';
        break;
      case 68:
        dataType = 'Timestamp';
        break;
      case 69:
        dataType = 'Timestamp';
        break;
      case 70:
        dataType = 'Number';
        break;
      case 71:
        dataType = 'List';
        break;
      case 72:
        dataType = 'List';
        break;
    }
    return [data.varName2, dataType];
  },

  fields: ['server', 'varName', 'info', 'storage', 'varName2'],

  html(isEvent, data) {
    return `
    <div style="position:absolute;bottom:0px;border: 1px solid #222;background:#000;color:#999;padding:3px;right:0px;z-index:999999">Version 1.1</div>
    <div style="position:absolute;bottom:0px;border: 1px solid #222;background:#000;color:#999;padding:3px;left:0px;z-index:999999">DBM Extended</div>

<server-input dropdownLabel="Servidor" selectId="server" variableContainerId="varNameContainer" variableInputId="varName"></server-input>

<br><br><br>

<div>
	<div style="padding-top: 8px; width: 100%;">
		<span class="dbminputlabel">Source Info</span><br>
		<select id="info" class="round">
      <optgroup label="Server General Info">
      <option value="0">Server Object</options>
      <option value="1">Server ID</options>
      <option value="2">Server Name</options>
      <option value="3">Server Name Acronym</options>
      <option value="53">Server Description</options>
      <option value="5">Server Icon URL</options>
      <option value="7">Server Default Channel</options>
      <option value="58">Server System Channel ID</options>
      <option value="9">Server System Channel</options>
      <option value="21">Server Large</options>
      <option value="43">Server Explicit Content Filter</options>
      <option value="10">Server Default Role</options>
      <option value="12">Server Bot Member</options>
      <option value="20">Server Available</options>
      </optgroup>
      <optgroup label="Server AFK Info">
      <option value="8">Server AFK Channel</options>
      <option value="51">Server AFK Channel ID</options>
      <option value="19">Server AFK Timeout</options>
      </optgroup>
      <optgroup label="Server Boost Info">
      <option value="44">Server Boosts Count</options>
      <option value="45">Server Boost Tier</options>
      </optgroup>
      <optgroup label="Server Counts">
      <option value="17">Server Member Count</options>
      <option value="35">Server Human Count</options>
      <option value="30">Server Bot Count</options>
      <option value="24">Server Emojis Count</options>
      <option value="37">Server Roles Count</options>
      <option value="23">Server Channels Count</options>
      <option value="38">Server Text Channels Count</options>
      <option value="39">Server Voice Channels Count</options>
      <option value="70">Server Members On Voice Channels Count</options>
      </optgroup>
      <optgroup label="Server Community Info"">
      <option value="54">Server Partnered</options>
      <option value="55">Server Rule Channel</options>
      <option value="56">Server Rule Channel ID</options>
      <option value="4">Server Preferred Language</options>
      <option value="40">Server Verified</options>
      <option value="52">Server Premium Progress Bar Enabled</options>
      <option value="46">Server Banner URL</options>
      <option value="47">Server Features List</options>
      <option value="49">Server Vanity URL Code</options>
      <option value="57">Server Widget Channel</options>
      <option value="50">Server Widget Channel ID</options>
      <option value="25">Server Embed Enabled</options>
      </optgroup>
      <optgroup label="Server Dates Info">
      <option value="61">Server Timestamp</options>
      <option value="18">Server Created At</options>
      <option value="22">Server Joined At</options>
      </optgroup>
      <optgroup label="Server Levels">
      <option value="59">Server NSFW Level</options>
      <option value="6">Server Verification Level</options>
      <option value="60">Server MFA/2FA Level</options>
      </optgroup>
      <optgroup label="Server List Info">
      <option value="15">Server Members List</options>
      <option value="33">Server Members IDs List</options>
      <option value="13">Server Channels List</options>
      <option value="31">Server Channels IDs List</options>
      <option value="16">Server Emojis List</options>
      <option value="14">Server Roles List</options>
      <option value="32">Server Roles IDs List</options>
      <option value="41">Server Bans List</options>
      <option value="42">Server Invites List</options>
	  <option value="72">Server Members On Voice Channels List</options>
      <option value="71">Server Members On Voice Channels IDs List</options>
      </optgroup>
      <optgroup label="Server Owner Info">
      <option value="48">Server Owner ID</options>
      <option value="11">Server Owner Object</options>
      </optgroup>
      <optgroup label="Server Status Count">
      <option value="27">Server Online Members Count</options>
      <option value="29">Server Idle Members Count</options>
      <option value="26">Server Do Not Disturb Members Count</options>
      <option value="28">Server Offline Members Count</options>
      </optgroup>
      <optgroup label="Server Template">
      <option value="62">Template URL</options>
      <option value="63">Template Code</options>
      <option value="64">Template Name</options>
      <option value="65">Template Description</options>
      <option value="66">Template Use Count</options>
      <option value="67">Template Creator ID</options>
      <option value="68">Template Creation Timestamp</options>
      <option value="69">Template Update Timestamp</options>
      </optgroup>
		</select>
	</div>
</div>

<br>

<store-in-variable dropdownLabel="Store In" selectId="storage" variableContainerId="varNameContainer2" variableInputId="varName2"></store-in-variable>`;
  },

  init() {},

  async action(cache) {
    const data = cache.actions[cache.index];
    const targetServer = await this.getServerFromData(data.server, data.varName, cache);

    if (!targetServer) {
      return this.callNextAction(cache);
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
      case 4:
        result = targetServer.preferredLocale;
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
        } catch (error) {
          // Handle case where owner cannot be fetched (e.g., owner left server, bot doesn't have permissions)
          console.warn(`[Store Server Info] Could not fetch owner for server ${targetServer.id}:`, error.message);
          result = null;
        }
        break;
      case 12:
        result = targetServer.me;
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
      case 38:
        result = targetServer.channels.cache.filter((c) => c.type === 'GUILD_TEXT' || c.type === 'GUILD_NEWS').size;
        break;
      case 39:
        result = targetServer.channels.cache.filter((c) => c.type === 'GUILD_VOICE').size;
        break;
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
      case 51:
        result = targetServer.afkChannelId;
        break;
      case 52:
        result = targetServer.premiumProgressBarEnabled;
        break;
      case 53:
        result = targetServer.description;
        break;
      case 54:
        result = targetServer.partnered;
        break;
      case 55:
        result = targetServer.rulesChannel;
        break;
      case 56:
        result = targetServer.rulesChannelId;
        break;
      case 57:
        result = targetServer.widgetChannel;
        break;
      case 58:
        result = targetServer.systemChannelId;
        break;
      case 59:
        result = targetServer.nsfwLevel;
        break;
      case 60:
        result = targetServer.mfaLevel;
        break;
      case 61:
        result = targetServer.createdTimestamp;
        break;
      case 62:
        result = `https://discord.new/${(await targetServer.fetchTemplates()).map((v) => v.code)}`;
        break;
      case 63:
        result = `${(await targetServer.fetchTemplates()).map((v) => v.code)}`;
        break;
      case 64:
        result = `${(await targetServer.fetchTemplates()).map((v) => v.name)}`;
        break;
      case 65:
        result = `${(await targetServer.fetchTemplates()).map((v) => v.description)}`;
        break;
      case 66:
        result = `${(await targetServer.fetchTemplates()).map((v) => v.usageCount)}`;
        break;
      case 67:
        result = `${(await targetServer.fetchTemplates()).map((v) => v.creatorId)}`;
        break;
      case 68:
        result = `${(await targetServer.fetchTemplates()).map((v) => v.createdAt)}`;
        break;
      case 69:
        result = `${(await targetServer.fetchTemplates()).map((v) => v.updatedAt)}`;
        break;
      case 70:
        result = targetServer.channels.cache
          .filter((c) => c.type === 'GUILD_VOICE')
          .map((c) => c.members.size)
          .reduce((s, a) => s + a, 0);
        break;
      case 71:
        const str = targetServer.channels.cache
          .filter((c) => c.type === 'GUILD_VOICE')
          .map((c) => c.members.map((member) => `${member.user.id},`).join(''))
          .join('');
        result = str.substring(0, str.length - 1).split(new RegExp(','));
        break;
      case 72:
        result = targetServer.channels.cache
          .filter((d) => d.type === 'GUILD_VOICE')
          .map((d) => d.members.map((member) => member.user).join(''))
          .join('');
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
