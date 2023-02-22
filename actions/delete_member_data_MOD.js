module.exports = {
  name: 'Delete Member Data',
  section: 'Data',
  meta: {
    version: '2.1.6',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/delete_member_data_MOD.js',
  },

  subtitle(data) {
    const members = ['Mentioned User', 'Command Author', 'Temp Variable', 'Server Variable', 'Global Variable'];
    return `${members[parseInt(data.member, 10)]} - ${data.dataName}`;
  },

  fields: ['member', 'varName', 'dataName'],

  html() {
    return `
<div>
<member-input dropdownLabel="Source Member" selectId="member" variableContainerId="varNameContainer" variableInputId="varName"></member-input>
</div><br><br><br>
<div style="padding-top: 8px;">
  <div style="float: left; width: 80%;">
    Data Name:<br>
    <input id="dataName" class="round" placeholder="Leave it blank to delete all data" type="text">
  </div>
</div>`;
  },

  init() {},

  async action(cache) {
    const data = cache.actions[cache.index];
    const member = await this.getMemberFromData(data.member, data.varName, cache);
    const dataName = this.evalMessage(data.dataName, cache);

    member.delData(dataName);
    this.callNextAction(cache);
  },

  mod(DBM) {
    Reflect.defineProperty(DBM.DiscordJS.GuildMember.prototype, 'delData', {
      value(name) {
        const { players } = DBM.Files.data;

        if (name && players[this.id]?.[name]) {
          delete players[this.id][name];
          DBM.Files.saveData('players');
        } else if (!name) {
          delete players[this.id];
          DBM.Files.saveData('players');
        }
      },
    });

    Reflect.defineProperty(DBM.DiscordJS.User.prototype, 'delData', {
      value(name) {
        const { players } = DBM.Files.data;

        if (name && players[this.id]?.[name]) {
          delete players[this.id][name];
          DBM.Files.saveData('players');
        } else if (!name) {
          delete players[this.id];
          DBM.Files.saveData('players');
        }
      },
    });
  },
};
