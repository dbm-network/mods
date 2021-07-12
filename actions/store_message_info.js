module.exports = {
  name: 'Store Message Info',
  section: 'Messaging',

  subtitle(data) {
    const message = ['Command Message', 'Temp Variable', 'Server Variable', 'Global Variable'];
    const info = [
      'Message Object',
      'Message ID',
      'Message Text',
      'Message Author',
      'Message Channel',
      'Message Timestamp',
      'Message is Pinned',
      'Message is TTS',
      'Message Attachments List',
      'Message Edits',
      '',
      '',
      'Messages Reactions Count',
      'Mentioned Users List',
      'Mentioned Users Count',
      'Message URL',
      'Message Creation Date',
      'Message Content Length',
      'Message Attachments Count',
      'Message Guild',
      'Message Type',
      'Message Webhook ID',
      'Message Embed Object',
      'Mentioned Channels List',
      'Mentioned Channels Count',
      'Mentioned Roles list',
      'Mentioned Roles Count',
    ];
    return `${message[parseInt(data.message, 10)]} - ${info[parseInt(data.info, 10)]}`;
  },

  variableStorage(data, varType) {
    if (parseInt(data.storage, 10) !== varType) return;
    let dataType = 'Unknown Type';
    switch (parseInt(data.info, 10)) {
      case 0:
        dataType = 'Message';
        break;
      case 1:
        dataType = 'Message ID';
        break;
      case 2:
        dataType = 'Text';
        break;
      case 3:
        dataType = 'Server Member';
        break;
      case 4:
        dataType = 'Channel';
        break;
      case 5:
        dataType = 'Text';
        break;
      case 6:
      case 7:
        dataType = 'Boolean';
        break;
      case 8:
        dataType = 'Date';
        break;
      case 9:
        dataType = 'Messages List';
        break;
      case 13:
      case 23:
      case 25:
        dataType = 'Array';
        break;
      case 14:
        dataType = 'Number';
        break;
      case 15:
        dataType = 'URL';
        break;
      case 16:
        dataType = 'Date';
        break;
      case 12:
      case 17:
      case 18:
      case 24:
      case 26:
        dataType = 'Number';
        break;
      case 19:
        dataType = 'Guild';
        break;
      case 20:
        dataType = 'Message Type';
        break;
      case 21:
        dataType = 'Webhook ID';
        break;
      case 22:
        dataType = 'Embed Message';
        break;
      default:
        break;
    }
    return [data.varName2, dataType];
  },

  fields: ['message', 'varName', 'info', 'storage', 'varName2'],

  html(isEvent, data) {
    return `
<div>
<p>This action has been modified by DBM Mods.</p>
  <div style="float: left; width: 35%;">
    Source Message:<br>
    <select id="message" class="round" onchange="glob.messageChange(this, 'varNameContainer')">
      ${data.messages[isEvent ? 1 : 0]}
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
      <option value="0" selected>Message Object</option>
      <option value="1">Message ID</option>
      <option value="2">Message Text</option>
      <option value="3">Message Author</option>
      <option value="4">Message Channel</option>
      <option value="5">Message Timestamp</option>
      <option value="6">Message Is Pinned?</option>
      <option value="7">Message Is TTS?</option>
      <option value="8">Message Attachments List</option>
      <option value="9">Message Edits</option>
      <option value="12">Messages Reactions Count</option>
      <option value="13">Messages Mentioned Users List</option>
      <option value="14">Messages Mentioned Users Count</option>
      <option value="15">Message URL</option>
      <option value="16">Message Creation Date</option>
      <option value="17">Message Content Length</option>
      <option value="18">Message Attachments Count</option>
      <option value="19">Message Guild</option>
      <option value="20">Message Type</option>
      <option value="21">Message Webhook ID</option>
      <option value="22">Message Embed Object</option>
      <option value='23'>Message Mentioned Channels List</option>
      <option value='24'>Message Mentioned Channels Count</option>
      <option value='25'>Message Mentioned Roles List</option>
      <option value='26'>Message Mentioned Roles Count</option>
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

    glob.messageChange(document.getElementById('message'), 'varNameContainer');
  },

  action(cache) {
    const data = cache.actions[cache.index];
    const message = parseInt(data.message, 10);
    const varName = this.evalMessage(data.varName, cache);
    const info = parseInt(data.info, 10);
    const msg = this.getMessage(message, varName, cache);
    if (!msg) return this.callNextAction(cache);

    let result;
    switch (info) {
      case 0:
        result = msg;
        break;
      case 1:
        result = msg.id;
        break;
      case 2:
        result = msg.content;
        break;
      case 3:
        result = msg.member || msg.author;
        break;
      case 4:
        result = msg.channel;
        break;
      case 5:
        result = msg.createdTimestamp;
        break;
      case 6:
        result = msg.pinned;
        break;
      case 7:
        result = msg.tts;
        break;
      case 8:
        result = msg.attachments.array();
        break;
      case 9:
        result = msg.edits;
        break;
      case 12:
        result = msg.reactions.cache.size;
        break;
      case 13:
        result = msg.mentions.users.array();
        break;
      case 14:
        result = msg.mentions.users.size;
        break;
      case 15:
        result = msg.url;
        break;
      case 16:
        result = msg.createdAt;
        break;
      case 17:
        result = msg.content.length;
        break;
      case 18:
        result = msg.attachments.size;
        break;
      case 19:
        result = msg.guild;
        break;
      case 20:
        result = msg.type;
        break;
      case 21:
        result = msg.webhookID;
        break;
      case 22:
        result = msg.embeds[0];
        break;
      case 23:
        result = msg.mentions.channels.array();
        break;
      case 24:
        result = msg.mentions.channels.size;
        break;
      case 25:
        result = msg.mentions.roles.array();
        break;
      case 26:
        result = msg.mentions.roles.size;
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
