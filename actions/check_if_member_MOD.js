module.exports = {
  name: 'Check If Member',
  section: 'Conditions',
  meta: {
    version: '2.1.6',
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

  fields: ['member', 'varName', 'info', 'varName2', 'iftrue', 'iftrueVal', 'iffalse', 'iffalseVal'],

  html(isEvent, data) {
    return `
<div>
  <member-input dropdownLabel="Member" selectId="member" variableContainerId="varNameContainer" variableInputId="varName"></member-input>
</div><br><br><br>
<div style="padding-top: 20px;">
  <div style="float: left; width: 35%;">
    Check if Member:<br>
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
    Variable Name:<br>
    <input id="varName2" class="round" type="text" list="variableList2"><br>
  </div>
</div><br><br><br>
<div style="padding-top: 8px;">
  ${data.conditions[0]}
</div>`;
  },

  init() {
    const { glob, document } = this;
    const option = document.createElement('OPTION');
    option.value = '4';
    option.text = 'Jump to Anchor';
    const iffalse = document.getElementById('iffalse');
    if (iffalse.length === 4) {
      iffalse.add(option);
    }
    const option2 = document.createElement('OPTION');
    option2.value = '4';
    option2.text = 'Jump to Anchor';
    const iftrue = document.getElementById('iftrue');
    if (iftrue.length === 4) {
      iftrue.add(option2);
    }
    glob.onChangeTrue = function onChangeTrue(event) {
      switch (parseInt(event.value, 10)) {
        case 0:
        case 1:
          document.getElementById('iftrueContainer').style.display = 'none';
          break;
        case 2:
          document.getElementById('iftrueName').innerHTML = 'Action Number';
          document.getElementById('iftrueContainer').style.display = null;
          break;
        case 3:
          document.getElementById('iftrueName').innerHTML = 'Number of Actions to Skip';
          document.getElementById('iftrueContainer').style.display = null;
          break;
        case 4:
          document.getElementById('iftrueName').innerHTML = 'Anchor ID';
          document.getElementById('iftrueContainer').style.display = null;
          break;
        default:
          break;
      }
    };
    glob.onChangeFalse = function onChangeFalse(event) {
      switch (parseInt(event.value, 10)) {
        case 0:
        case 1:
          document.getElementById('iffalseContainer').style.display = 'none';
          break;
        case 2:
          document.getElementById('iffalseName').innerHTML = 'Action Number';
          document.getElementById('iffalseContainer').style.display = null;
          break;
        case 3:
          document.getElementById('iffalseName').innerHTML = 'Number of Actions to Skip';
          document.getElementById('iffalseContainer').style.display = null;
          break;
        case 4:
          document.getElementById('iffalseName').innerHTML = 'Anchor ID';
          document.getElementById('iffalseContainer').style.display = null;
          break;
        default:
          break;
      }
    };
    glob.memberChange(document.getElementById('member'), 'varNameContainer');
    glob.onChangeTrue(document.getElementById('iftrue'));
    glob.onChangeFalse(document.getElementById('iffalse'));
  },

  async action(cache) {
    const data = cache.actions[cache.index];
    const member = await this.getMemberFromData(data.member, data.varName, cache);
    const info = parseInt(data.info, 10);
    const { Files } = this.getDBM();
    const { msg, interaction } = cache;

    if (!member) {
      console.error('You need to provide a member of some sort to the "Check If Member" action');
      return this.executeResults(false, data, cache);
    }

    let result = false;
    switch (info) {
      case 0:
        result = member.user?.bot || member.bot;
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
        const filePath = require('path').join(__dirname, '../data', 'multiple_bot_owners.json');
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
    this.executeResults(result, data, cache);
  },

  mod() {},
};
