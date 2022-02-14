module.exports = {
  name: 'Set slowmode MOD',
  section: 'Channel Control',
  meta: {
    version: '2.0.11',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/set_slowmode_MOD.js',
  },

  subtitle(data) {
    const names = [
      'Same Channel',
      'Mentioned Channel',
      'Default Channel',
      'Temp Variable',
      'Server Variable',
      'Global Variable',
    ];
    const index = parseInt(data.storage, 10);
    return index < 3 ? `Set slowmode : ${names[index]}` : `Set slowmode : ${names[index]} - ${data.varName}`;
  },

  variableStorage(data, varType) {
    if (parseInt(data.storage2, 10) !== varType) return;
    return [data.varName2, 'Channel'];
  },

  fields: ['storage', 'varName', 'varName2', 'amount', 'reason'],

  html(isEvent, data) {
    return `
<div style="padding-top: 8px;">
  <div style="float: left; width: 35%;" padding-top: 16px;">
    Source Channel:<br>
    <select id="storage" class="round" onchange="glob.channelChange(this, 'varNameContainer')">
      ${data.channels[isEvent ? 1 : 0]}
    </select>
  </div>
  <div id="varNameContainer" style="display: none; padding-left: 5%; float: left; width: 65%;">
    Variable Name:<br>
    <input id="varName" class="round" type="text" list="variableList"><br>
  </div>
</div><br><br><br>
<div style="padding-top: 8px;">
  <div style="float: left; width: 50%;" padding-top: 16px;">
    Amount:<br>
    <input id="amount" class="round" type="text" steps="5" placeholder="In seconds..."><br>
    Reason:<br>
    <input id="reason" class="round" type="text" placeholder="Optional"><br>
  </div>
</div>
  <div id="varNameContainer2" style="display: none; padding-left: 5%; float: left; width: 65%;">
    Variable Name:<br>
    <input id="varName2" class="round" type="text">
  </div>`;
  },

  async action(cache) {
    const data = cache.actions[cache.index];
    const storage = parseInt(data.storage, 10);
    const varName = this.evalMessage(data.varName, cache);
    const channel = await this.getChannel(storage, varName, cache);
    const amount = this.evalMessage(data.amount, cache);
    const reason = this.evalMessage(data.reason, cache);
    const { type } = channel;

    if (type !== 'text') return this.callNextAction(cache);

    channel.setRateLimitPerUser(amount, reason);

    this.callNextAction(cache);
  },

  mod() {},
};
