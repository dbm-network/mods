module.exports = {
  name: 'Set slowmode MOD',
  displayName: 'Set slowmode',
  section: 'Channel Control',
  meta: {
    version: '2.1.7',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/set_slowmode_MOD.js',
  },

  subtitle(data, presets) {
    return `${presets.getChannelText(data.storage, data.varName)} : ${data.amount} seconds`;
  },

  variableStorage(data, varType) {
    if (parseInt(data.storage2, 10) !== varType) return;
    return [data.varName2, 'Channel'];
  },

  fields: ['storage', 'varName', 'amount', 'reason'],

  html() {
    return `
    <div>
      <channel-input dropdownLabel="Source Channel" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"/>
    </div>
    <br><br><br>
    
    <div style="width: 100%; padding-top: 8px;">
      <div style="float: left; width: 35%;">
        <span class="dbminputlabel">Amount</span><br>
        <input id="amount" class="round" type="text" steps="5" placeholder="In seconds...">
      </div>
      <div style="float: right; width: 60%">
        <span class="dbminputlabel">Reason</span><br>
        <input id="reason" class="round" type="text" placeholder="Optional">
      </div>
    </div>`;
  },

  async action(cache) {
    const data = cache.actions[cache.index];
    const channel = await this.getChannelFromData(data.storage, data.varName, cache);
    const amount = this.evalMessage(data.amount, cache);
    const reason = this.evalMessage(data.reason, cache);

    if (!channel.setRateLimitPerUser) return this.callNextAction(cache);

    channel
      .setRateLimitPerUser(amount, reason)
      .then(() => this.callNextAction(cache))
      .catch((err) => this.displayError(data, cache, err));
  },

  mod() {},
};
