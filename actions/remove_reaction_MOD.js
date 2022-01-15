module.exports = {
  name: 'Remove Reaction',
  section: 'Reaction Control',
  meta: {
    version: '2.0.11',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/remove_reaction_MOD.js',
  },

  subtitle(data) {
    const names = ['Mentioned User', 'Command Author', 'Temp Variable', 'Server Variable', 'Global Variable'];
    return `${names[parseInt(data.member, 10)]}`;
  },

  fields: ['reaction', 'varName', 'member', 'varName2'],

  html(isEvent, data) {
    return `
<div>
  <div style="float: left; width: 35%;">
    Source Reaction:<br>
    <select id="reaction" class="round" onchange="glob.refreshVariableList(this)">
      ${data.variables[1]}
    </select>
  </div>
  <div id="varNameContainer" style="float: right; width: 60%;">
    Variable Name:<br>
    <input id="varName" class="round" type="text" list="variableList"><br>
  </div>
</div><br><br><br><br>
<div>
  <div style="float: left; width: 35%;">
    Source Member:<br>
    <select id="member" class="round" onchange="glob.memberChange(this, 'varNameContainer2')">
      ${data.members[isEvent ? 1 : 0]}
    </select>
  </div>
  <div id="varNameContainer2" style="display: none; float: right; width: 60%;">
    Variable Name:<br>
    <input id="varName2" class="round" type="text" list="variableList"><br>
  </div>
</div>`;
  },

  init() {
    const { glob, document } = this;

    glob.refreshVariableList(document.getElementById('reaction'));
    glob.memberChange(document.getElementById('member'), 'varNameContainer2');
  },

  async action(cache) {
    const data = cache.actions[cache.index];

    const reaction = parseInt(data.reaction, 10);
    const varName = this.evalMessage(data.varName, cache);
    const Mods = this.getMods();
    const rea = Mods.getReaction(reaction, varName, cache);

    const type = parseInt(data.member, 10);
    const varName2 = this.evalMessage(data.varName2, cache);
    const member = await this.getMember(type, varName2, cache);

    if (!rea) return this.callNextAction(cache);

    if (member) rea.users.remove(member);
    this.callNextAction(cache);
  },

  mod() {},
};
