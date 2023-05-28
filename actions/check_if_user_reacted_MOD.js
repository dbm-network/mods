module.exports = {
  name: 'Check If User Reacted',
  section: 'Conditions',
  meta: {
    version: '2.1.7',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/check_if_user_reacted_MOD.js',
  },

  subtitle(data, presets) {
    const reaction = ['Temp Variable', 'Server Variable', 'Global Variable'];
    return `${presets.getMemberText(data.member, data.varName)} - ${reaction[parseInt(data.reaction, 10) - 1]}`;
  },

  fields: ['member', 'varName', 'reaction', 'varName2', 'branch'],

  html() {
    return `
<member-input dropdownLabel="Source Member" selectId="member" variableContainerId="varNameContainer" variableInputId="varName"></member-input>
<br><br><br><br>

<store-in-variable dropdownLabel="Source Reaction" selectId="reaction" variableContainerId="varNameContainer2" variableInputId="varName2"></store-in-variable>
<br><br><br>

<conditional-input id="branch" style="padding-top: 8px;"></conditional-input>`;
  },

  init() {},

  async action(cache) {
    const data = cache.actions[cache.index];
    const member = await this.getMemberFromData(data.member, data.varName, cache);

    const type2 = parseInt(data.reaction, 10);
    const varName2 = this.evalMessage(data.varName2, cache);
    const reaction = this.getMods().getReaction(type2, varName2, cache);

    let result;
    if (Array.isArray(member)) {
      result = member.every((user) => user && reaction?.users?.cache.has(user.id));
    } else if (reaction?.users?.cache && member) {
      result = reaction.users.cache.has(member.id);
    }
    this.executeResults(result, data?.branch ?? data, cache);
  },

  modInit(data) {
    this.prepareActions(data.branch?.iftrueActions);
    this.prepareActions(data.branch?.iffalseActions);
  },

  mod() {},
};
