module.exports = {
  name: 'Check DBL Voted',
  displayname: 'Check TopGG Voted',
  section: 'Conditions',
  meta: {
    version: '2.1.7',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/check_dbl_voted_MOD.js',
  },

  subtitle(data, presets) {
    return `${presets.getConditionsText(data)}`;
  },

  fields: ['member', 'apitoken', 'varName', 'branch'],

  html() {
    return `
<div>
  <member-input dropdownLabel="Source Member" selectId="member" variableContainerId="varNameContainer" variableInputId="varName"></member-input>
</div>
<br><br><br>

<div>
  <div style="float: left; width: 89%;">
    <span class="dbminputlabel">TopGG API Token</span>
    <input id="apitoken" class="round" type="text">
  </div>
</div>
<br><br><br>

<conditional-input id="branch" style="padding-top: 16px;"></conditional-input>`;
  },

  init() {},

  async action(cache) {
    const data = cache.actions[cache.index];
    const apitoken = this.evalMessage(data.apitoken, cache);
    const member = await this.getMemberFromData(data.member, data.varName, cache);

    const Mods = this.getMods();
    const TopGG = Mods.require('@top-gg/sdk');

    if (!apitoken) return console.log('ERROR! Please provide an API token for TopGG!');

    const api = new TopGG.Api(apitoken);
    api.hasVoted(member.id).then((voted) => this.executeResults(voted, data?.branch ?? data, cache));
  },

  modInit(data) {
    this.prepareActions(data.branch?.iftrueActions);
    this.prepareActions(data.branch?.iffalseActions);
  },

  mod() {},
};
