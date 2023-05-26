module.exports = {
  name: 'Remove Reaction',
  section: 'Reaction Control',
  meta: {
    version: '2.1.7',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/remove_reaction_MOD.js',
  },

  subtitle(data, presets) {
    return presets.getMemberText(data.member, data.varName);
  },

  fields: ['reaction', 'varName', 'member', 'varName2'],

  html() {
    return `
<div>
  <store-in-variable dropdownLabel="Source Reaction" selectId="reaction" variableContainerId="varNameContainer" variableInputId="varName"></store-in-variable>
</div>
<br><br><br><br>
<div>
  <member-input dropdownLabel="Source Member" selectId="member" variableContainerId="varNameContainer2" variableInputId="varName2"></member-input>
</div>`;
  },

  init() {},

  async action(cache) {
    const data = cache.actions[cache.index];

    const reaction = parseInt(data.reaction, 10);
    const varName = this.evalMessage(data.varName, cache);
    const Mods = this.getMods();
    const rea = Mods.getReaction(reaction, varName, cache);
    const member = await this.getMemberFromData(data.member, data.varName2, cache);

    if (!rea) return this.callNextAction(cache);

    if (member) rea.users.remove(member);
    this.callNextAction(cache);
  },

  mod() {},
};
