module.exports = {
  name: 'Check If Message',
  section: 'Conditions',
  meta: {
    version: '2.1.7',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/check_if_message_MOD.js',
  },

  subtitle(data, presets) {
    return `${presets.getConditionsText(data)}`;
  },

  fields: ['message', 'varName', 'info', 'varName2', 'branch'],

  html() {
    return `
<div>
  <message-input dropdownLabel="Source Message" selectId="message" variableContainerId="varNameContainer" variableInputId="varName"></message-input>

  <br><br><br><br>
  <div style="float: left; width: 40%;">
    <span class="dbminputlabel">Check If Message</span>
    <select id="info" class="round">
      <option value="0">Is Pinnable?</option>
      <option value="1">Is Pinned?</option>
      <option value="2">Is Deletable?</option>
      <option value="3">Is Deleted?</option>
      <option value="4">Is TTS?</option>
      <option value="5">Is Of Discord?</option>
      <option value="6">Includes @everyone Mention?</option>
    </select>
  </div>
  <div id="varNameContainer2" style="display: none; float: right; width: 60%;">
    <span class="dbminputlabel">Variable Name</span>
    <input id="varName2" class="round" type="text" list="variableList2"><br>
  </div>
</div>
<br><br><br>

<conditional-input id="branch" style="padding-top: 8px;"></conditional-input>`;
  },

  init() {},

  async action(cache) {
    const data = cache.actions[cache.index];
    const msg = await this.getMessageFromData(data.message, data.varName, cache);

    const info = parseInt(data.info, 10);
    let result = false;
    switch (info) {
      case 0:
        result = msg.pinnable;
        break;
      case 1:
        result = msg.pinned;
        break;
      case 2:
        result = msg.deletable;
        break;
      case 3:
        result = msg.deleted;
        break;
      case 4:
        result = msg.tts;
        break;
      case 5:
        result = msg.system;
        break;
      case 6:
        result = msg.mentions.everyone;
        break;
      default:
        break;
    }

    this.executeResults(result, data?.branch ?? data, cache);
  },

  modInit(data) {
    this.prepareActions(data.branch?.iftrueActions);
    this.prepareActions(data.branch?.iffalseActions);
  },

  mod() {},
};
