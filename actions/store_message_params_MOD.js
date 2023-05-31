module.exports = {
  name: 'Store Message Params',
  section: 'Messaging',
  meta: {
    version: '2.1.7',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/store_message_params_MOD.js',
  },

  subtitle(data, presets) {
    const info = [
      'One Parameter',
      'Multiple Parameters',
      'Mentioned User',
      'Mentioned Member',
      'Mentioned Role',
      'Mentioned Channel',
    ];
    return `${presets.getMessageText(data.message, data.varName)} - ${info[parseInt(data.info, 10)]} #${data.ParamN}`;
  },

  variableStorage(data, varType) {
    if (parseInt(data.storage, 10) !== varType) return;
    let dataType = 'Unknown Type';
    switch (parseInt(data.info, 10)) {
      case 0:
        dataType = 'String';
        break;
      case 1:
        dataType = 'String';
        break;
      case 2:
        dataType = 'User';
        break;
      case 3:
        dataType = 'Member';
        break;
      case 4:
        dataType = 'Role';
        break;
      case 5:
        dataType = 'Channel';
        break;
    }
    return [data.varName2, dataType];
  },

  fields: ['message', 'varName', 'info', 'ParamN', 'separator', 'storage', 'varName2', 'count'],

  html() {
    return `
  <div id="DiVScroll" style="height: 350px; overflow-y: scroll; overflow-x: hidden;">

    <div style="float: left; width: 100%; padding-top: 8px;">
      <message-input dropdownLabel="Source Message" selectId="message" variableContainerId="varNameContainer" variableInputId="varName"></message-input>
    </div>
  
    <div style="float: left; padding-top: 16px; width: 100%;">
      <div style="float: left; width: 35%; margin-right: 8px;">
        <span class="dbminputlabel">Source Info</span>
        <select id="info" class="round" onchange="glob.onChange1(this)">
          <option value="0" selected>One Parameter</option>
          <option value="1">Multiple Parameters</option>
          <option value="2">Mentioned User</option>
          <option value="3">Mentioned Member</option>
          <option value="4">Mentioned Role</option>
          <option value="5">Mentioned Channel</option>
        </select>
      </div>
      <div style="float: right; width: 60%;">
        <span class="dbminputlabel" id="infoCountLabel">Parameter Number</span>
        <input id="ParamN" class="round" type="text" value="1"></input>
      </div>
    </div>
  
    <div id="DiVcount" style="float: left; padding-top: 16px; width: 100%;">
      <div style="float: left; width: 100%;">
        <span class="dbminputlabel">Parameter Count</span>
        <input id="count" placeholder="Leave blank for all..." class="round" type="text"></input>
      </div>
    </div>
  
    <div id="DiVseparator" style="float: left; padding-top: 16px; width: 100%;">
      <div style="float: left; width: 100%;">
        <span class="dbminputlabel">Custom Parameter Separator</span>
        <span class="dbminputlabel">
          <span title='• Leave the "Custom Parameter Separator" empty if you want to use the\nDefault "Parameter Separator" set in your bots "Settings" page.\n• "Custom Parameter Separator" supports Regex.'>Hover over me to read <b>Notes</b></span></span>
  
        <input id="separator" placeholder="Read the Note below | Default Parameter Separator:" class="round" type="text"></input>
      </div>
    </div>
  
    <div style="float: left; padding-top: 8px; width: 100%; padding-top: 16px;">
      <store-in-variable dropdownLabel="Store In" selectId="storage" variableContainerId="varNameContainer2" variableInputId="varName2"></store-in-variable>
    </div>
  </div>
`;
  },

  init() {
    const { glob, document } = this;

    document.getElementById('separator').placeholder = `Read the Note below | Default Parameter Separator: "${
      JSON.parse(
        require('fs').readFileSync(
          `${
            JSON.parse(
              require('fs').readFileSync(
                `${__dirname.substr(0, __dirname.lastIndexOf('\\') + 1)}settings.json`,
                'utf8',
              ),
            )['current-project']
          }\\data\\settings.json`,
          'utf8',
        ),
      ).separator
    }"`;

    glob.onChange1 = function onChange1(event) {
      const value = parseInt(event.value, 10);
      const infoCountLabel = document.getElementById('infoCountLabel');
      switch (value) {
        case 0:
          infoCountLabel.innerHTML = 'Parameter Number:';
          document.getElementById('DiVseparator').style.display = null;
          document.getElementById('DiVScroll').style.overflowY = 'scroll';
          document.getElementById('DiVcount').style.display = 'none';
          break;
        case 1:
          infoCountLabel.innerHTML = 'Starting From Parameter Number:';
          document.getElementById('DiVseparator').style.display = null;
          document.getElementById('DiVScroll').style.overflowY = 'scroll';
          document.getElementById('DiVcount').style.display = null;
          break;
        case 2:
          infoCountLabel.innerHTML = 'User Mention Number:';
          document.getElementById('DiVseparator').style.display = 'none';
          document.getElementById('DiVScroll').style.overflowY = 'hidden';
          document.getElementById('DiVcount').style.display = 'none';
          break;
        case 3:
          infoCountLabel.innerHTML = 'Member Mention Number:';
          document.getElementById('DiVseparator').style.display = 'none';
          document.getElementById('DiVScroll').style.overflowY = 'hidden';
          document.getElementById('DiVcount').style.display = 'none';
          break;
        case 4:
          infoCountLabel.innerHTML = 'Role Mention Number:';
          document.getElementById('DiVseparator').style.display = 'none';
          document.getElementById('DiVScroll').style.overflowY = 'hidden';
          document.getElementById('DiVcount').style.display = 'none';
          break;
        case 5:
          infoCountLabel.innerHTML = 'Channel Mention Number:';
          document.getElementById('DiVseparator').style.display = 'none';
          document.getElementById('DiVScroll').style.overflowY = 'hidden';
          document.getElementById('DiVcount').style.display = 'none';
          break;
        default:
          infoCountLabel.innerHTML = '';
          break;
      }
    };

    glob.onChange1(document.getElementById('info'));
  },

  async action(cache) {
    const data = cache.actions[cache.index];
    const msg = await this.getMessageFromData(data.message, data.varName, cache);
    const count = this.evalMessage(data.count, cache);

    if (!msg) {
      console.log(`Action: #${cache.index + 1} | Store Message Params ERROR: Message doesn't exist`);
      this.callNextAction(cache);
      return;
    }

    const ParamN = this.evalMessage(data.ParamN, cache);
    const infoType = parseInt(data.info, 10);

    if (ParamN === '') {
      console.log(`Action: #${cache.index + 1} | Store Message Params ERROR: Parameter Number has nothing`);
      this.callNextAction(cache);
      return;
    }
    if (!/^[0-9]+$/.test(ParamN)) {
      console.log(`Action: #${cache.index + 1} | Store Message Params ERROR: Parameter Number isn't a number`);
      this.callNextAction(cache);
      return;
    }

    const separator = data.separator
      ? this.evalMessage(data.separator, cache)
      : this.getDBM().Files.data.settings.separator;

    if (separator === '') {
      console.log(`Action: #${cache.index + 1} | Store Message Params ERROR: Parameter Separator has nothing`);
      this.callNextAction(cache);
      return;
    }

    let result;
    switch (infoType) {
      case 0:
        result = msg.content.split(new RegExp(separator))[ParamN] || undefined;
        break;
      case 1:
        if (data.count) {
          result = msg.content.split(new RegExp(separator, 'g')).slice(ParamN).slice(0, count).join(' ') || undefined;
        } else {
          result = msg.content.split(new RegExp(separator, 'g')).slice(ParamN).join(' ') || undefined;
        }
        break;
      case 2:
        result = msg.mentions.users.at(ParamN - 1);
        break;
      case 3:
        result = msg.mentions.members.at(ParamN - 1);
        break;
      case 4:
        result = msg.mentions.roles.at(ParamN - 1);
        break;
      case 5:
        result = msg.mentions.channels.at(ParamN - 1);
        break;
      default:
        break;
    }
    if (result) {
      const storage = parseInt(data.storage, 10);
      const varName2 = this.evalMessage(data.varName2, cache);
      this.storeValue(result, storage, varName2, cache);
    }
    this.callNextAction(cache);
  },

  mod() {},
};
