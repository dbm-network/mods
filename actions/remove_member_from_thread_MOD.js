module.exports = {
  name: 'Remove Member from Thread',
  section: 'Channel Control',
  meta: {
    version: '2.1.7',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/remove_member_from_thread_MOD.js',
  },

  fields: ['storage', 'varName', 'member', 'varName2', 'iffalse', 'iffalseVal'],

  subtitle(data, presets) {
    const storeTypes = presets.variables;
    return `${storeTypes[parseInt(data.storage, 10)]} (${data.varName})`;
  },

  html() {
    return `
      <retrieve-from-variable dropdownLabel="Source Thread" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></retrieve-from-variable>
      
      <br><br><br><br>

      <member-input dropdownLabel="Member" selectId="member" variableContainerId="varNameContainer2" variableInputId="varName2"></member-input>
      
    `;
  },

  async action(cache) {
    const data = cache.actions[cache.index];
    const storage = parseInt(data.storage, 10);
    const varName = this.evalMessage(data.varName, cache);
    const th = this.getVariable(storage, varName, cache);
    const member = await this.getMemberFromData(data.member, data.varName2, cache);

    try {
      await th.members.remove(member.id);
      this.callNextAction(cache);
    } catch {
      this.executeResults(false, data, cache);
    }
  },

  mod() {},
};
