module.exports = {
  name: 'Check If Member',
  section: 'Conditions',
  meta: {
    version: '2.1.7',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/check_if_member_MOD.js',
  },

  subtitle(data, presets) {
    const info = [
      'Is Bot?',
      'Is Bannable?',
      'Is Kickable?',
      'Is In Voice Channel?',
      'Is In Voice Channel?',
      'Is User Manageable?',
      'Is Bot Owner?',
      'Is Muted?',
      'Is Deafened?',
      'Is Command Author?',
      'Is Current Server Owner?',
      'Is Boosting Current Server?',
      'Is in timeout?',
    ];
    return `${presets.getMemberText(data.member, data.varName)} - ${info[parseInt(data.info, 10)]}`;
  },

  fields: ['member', 'varName', 'info', 'varName2', 'branch'],

  html(isEvent) {
    return `
    <member-input dropdownLabel="Member" selectId="member" variableContainerId="varNameContainer" variableInputId="varName"></member-input>
    <br><br><br>

<div style="padding-top: 8px;">
  <div style="float: left; width: 35%;">
    <span class="dbminputlabel">Check If Member</span>
    <select id="info" class="round">
      <option value="0" selected>Is Bot?</option>
      <option value="1">Is Bannable?</option>
      <option value="2">Is Kickable?</option>
      <option value="4">Is In Voice Channel?</option>
      <option value="5">Is User Manageable?</option>
      <option value="6">Is Bot Owner?</option>
      <option value="7">Is Muted?</option>
      <option value="8">Is Deafened?</option>
      ${!isEvent && '<option value="9">Is Command Author?</option>'}
      ${!isEvent && '<option value="10">Is Current Server Owner?</option>'}
      ${!isEvent && '<option value="11">Is Boosting Current Server?</option>'}
      <option value="12">Is in timeout?</option>
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
    const info = parseInt(data.info, 10);
    const { Files } = this.getDBM();
    const { msg, interaction } = cache;
    const member = await this.getMemberFromData(data.member, data.varName, cache);

    if (!member) {
      console.error('You need to provide a member of some sort to the "Check If Member" action');
      return this.executeResults(false, data?.branch ?? data, cache);
    }

    let result = false;
    switch (info) {
      case 0:
        result = member.user?.bot;
        break;
      case 1:
        result = member.bannable;
        break;
      case 2:
        result = member.kickable;
        break;
      case 4:
        result = Boolean(member.voice?.channel);
        break;
      case 5:
        result = member.manageable;
        break;
      case 6: {
        const fs = require('fs');
        const filePath = require('path').join(__dirname, '..', 'data', 'multiple_bot_owners.json');
        if (!fs.existsSync(filePath)) {
          result = member.id === Files.data.settings.ownerId;
        } else {
          result =
            JSON.parse(fs.readFileSync(filePath, 'utf8')).includes(member.id) ||
            member.id === Files.data.settings.ownerId;
        }
        break;
      }
      case 7:
        result = Boolean(member.voice?.mute);
        break;
      case 8:
        result = Boolean(member.voice?.deaf);
        break;
      case 9:
        result = member.id === (msg?.author.id ?? interaction.user.id);
        break;
      case 10:
        result = member.id === (msg ?? interaction).guild.ownerId;
        break;
      case 11:
        result = Boolean(member.premiumSinceTimestamp);
        break;
      case 12:
        result = member.isCommunicationDisabled();
        break;
      default:
        console.log('Please check your "Check if Member" action! There is something wrong...');
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
