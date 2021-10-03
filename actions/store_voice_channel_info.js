module.exports = {
  name: 'Store Voice Channel Info',
  section: 'Channel Control',

  subtitle(data) {
    const channels = [
      "Command Author's Voice Ch.",
      "Mentioned User's Voice Ch.",
      'Default Voice Channel',
      'Temp Variable',
      'Server Variable',
      'Global Variable',
    ];
    const info = [
      'Voice Channel Object',
      'Voice Channel ID',
      'Voice Channel Name',
      'Voice Channel Position',
      'Voice Channel User Limit',
      'Voice Channel Bitrate',
      'Bot can speak?',
      'Bot can join?',
      'Bot can delete VC?',
      'Members connected',
      'Is VC Full',
      'VC Guild',
      'Can Bot Manage',
      'VC Parent',
    ];
    return `${channels[parseInt(data.channel, 10)]} - ${info[parseInt(data.info, 10)]}`;
  },

  variableStorage(data, varType) {
    if (parseInt(data.storage, 10) !== varType) return;
    let dataType = 'Unknown Type';
    switch (parseInt(data.info, 10)) {
      case 0:
        dataType = 'Voice Channel';
        break;
      case 1:
        dataType = 'Voice Channel ID';
        break;
      case 2:
        dataType = 'Text';
        break;
      case 3:
      case 4:
      case 5:
        dataType = 'Number';
        break;
      case 6:
      case 7:
      case 8:
      case 10:
      case 12:
        dataType = 'Boolean';
        break;
      case 9:
        dataType = 'Array';
        break;
      case 11:
        dataType = 'Guild Object';
        break;
      default:
        break;
    }
    return [data.varName2, dataType];
  },

  fields: ['channel', 'varName', 'info', 'storage', 'varName2'],

  html(isEvent, data) {
    return `
<div><p>This action has been modified by DBM Mods.</p></div><br>
<div>
  <div style="float: left; width: 35%;">
    Source Channel:<br>
    <select id="channel" class="round" onchange="glob.voiceChannelChange(this, 'varNameContainer')">
      ${data.voiceChannels[isEvent ? 1 : 0]}
    </select>
  </div>
  <div id="varNameContainer" style="display: none; float: right; width: 60%;">
    Variable Name:<br>
    <input id="varName" class="round" type="text" list="variableList"><br>
  </div>
</div><br><br><br>
<div>
  <div style="padding-top: 8px; width: 70%;">
    Source Info:<br>
    <select id="info" class="round">
      <option value="0" title="VC as a object" selected>Object</option>
      <option value="1" title="The ID of a VC">ID</option>
      <option value="2" title="The name of the VC">Name</option>
      <option value="3" title="The position of the VC in the list">Position</option>
      <option value="4" title="The maximum amount of members allowed in the VC (0 means unlimited)">User Limit</option>
      <option value="5" title="The bitrate of the VC">Voice Channel Bitrate</option>
      <option value="11" title="Gets the VC's guild">Guild (object)</option>
      <option value="9" title="The members in the VC">Connected Members</option>
      <option value="13" title="The category this VC's in">Parent (object)</option>
      <option value="6" title="Checks if the Bot has permission to send audio to the VC">Can Bot Speak?</option>
      <option value="7" title="checks if the Bot has permission to join the VC">Can Bot Join VC?</option>
      <option value="8" title="checks if the Bot has permission to delete the VC">Can Bot Delete VC?</option>
      <option value="12" title="checks if the Bot has permission to manage the VC">Can Bot Manage?</option>
      <option value="10" title="Checks if the VC is full">Is VC Full?</option>
    </select>
  </div>
</div><br>
<div>
  <div style="float: left; width: 35%;">
    Store In:<br>
    <select id="storage" class="round">
      ${data.variables[1]}
    </select>
  </div>
  <div id="varNameContainer2" style="float: right; width: 60%;">
    Variable Name:<br>
    <input id="varName2" class="round" type="text"><br>
  </div>
</div>`;
  },

  init() {
    const { glob, document } = this;
    glob.voiceChannelChange(document.getElementById('channel'), 'varNameContainer');
  },

  action(cache) {
    const data = cache.actions[cache.index];
    const channel = parseInt(data.channel, 10);
    const varName = this.evalMessage(data.varName, cache);
    const info = parseInt(data.info, 10);
    const targetChannel = this.getVoiceChannel(channel, varName, cache);

    if (!targetChannel) return this.callNextAction(cache);

    let result;
    switch (info) {
      case 0:
        result = targetChannel;
        break;
      case 1:
        result = targetChannel.id;
        break;
      case 2:
        result = targetChannel.name;
        break;
      case 3:
        result = targetChannel.position;
        break;
      case 4:
        result = targetChannel.userLimit;
        break;
      case 5:
        result = targetChannel.bitrate;
        break;
      case 6:
        result = targetChannel.speakable;
        break;
      case 7:
        result = targetChannel.joinable;
        break;
      case 8:
        result = targetChannel.deletable;
        break;
      case 9:
        result = targetChannel.members.array();
        break;
      case 10:
        result = targetChannel.full;
        break;
      case 11:
        result = targetChannel.guild;
        break;
      case 12:
        result = targetChannel.manageable;
        break;
      case 13:
        result = targetChannel.parent;
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
