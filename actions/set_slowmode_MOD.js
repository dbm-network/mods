module.exports = {
  name: 'Set slowmode MOD',
  section: 'Channel Control',
  meta: {
    version: '2.1.6',
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

  fields: ['storage', 'varName', 'varName2', 'amount', 'reason'],

  html() {
    return `
    <channel-input
        style="padding-top: 8px;"
        dropdownLabel="Source Channel"
        selectId="storage"
        variableContainerId="varNameContainer"
        variableInputId="varName"
        selectWidth="45%"
        variableInputWidth="50%"/>
    <br><br><br>
    
    <div>
      <div style="padding-top: 8px;">
        <div style="float: left; width: 50%;" padding-top: 16px;">
          <span class="dbminputlabel">Amount</span><br>
          <input id="amount" class="round" type="text" steps="5" placeholder="In seconds..."><br>
          <span class="dbminputlabel">Reason</span><br>
          <input id="reason" class="round" type="text" placeholder="Optional"><br>
        </div>
      </div>
      <div id="varNameContainer2" style="display: none; padding-left: 5%; float: left; width: 65%;">
        <span class="dbminputlabel">Variable Name</span><br>
        <input id="varName2" class="round" type="text">
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
