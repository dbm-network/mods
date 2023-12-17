module.exports = {
  name: 'Create Private Thread',
  section: 'Channel Control',
  meta: {
    version: '2.1.7',
    preciseCheck: true,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/create_private_thread_MOD.js',
  },
  fields: ['channel', 'channelVarName', 'threadName', 'autoArchiveDuration', 'reason', 'storage', 'storageVarName'],

  subtitle(data, presets) {
    return `Create Private Thread In ${presets.getChannelText(data.channel ?? 0, data.channelVarName)}`;
  },

  variableStorage(data, varType) {
    const type = parseInt(data.storage, 10);
    if (type !== varType) return;
    return [data.storageVarName, 'Channel'];
  },

  html() {
    return `
  <channel-input dropdownLabel="Source Channel" selectId="channel" variableContainerId="varNameContainerChannel" variableInputId="channelVarName"></channel-input>
  
  <br><br><br><br>
  
  <div style="float: left; width: calc(50% - 12px);">
  
    <span class="dbminputlabel">Thread Name</span><br>
    <input id="threadName" class="round" type="text"><br>
  
  </div>
  <div style="float: right; width: calc(50% - 12px);">
  
    <span class="dbminputlabel">Auto-Archive Duration</span><br>
    <select id="autoArchiveDuration" class="round">
      <option value="60" selected>1 Hour</option>
      <option value="1440">24 Hours</option>
      <option value="4320">3 Days</option>
      <option value="10080">1 Week</option>
      <option value="max">Maximum</option>
    </select><br>
  
  </div>
  
  <br><br><br><br>
  
  <hr class="subtlebar" style="margin-top: 0px;">
  
  <br>
  
  <div>
    <span class="dbminputlabel">Reason</span>
    <input id="reason" placeholder="Opcional" class="round" type="text">
  </div>
  
  <br>
  
  <store-in-variable allowNone selectId="storage" variableInputId="storageVarName" variableContainerId="varNameContainer2"></store-in-variable>`;
  },

  init() {},

  async action(cache) {
    const data = cache.actions[cache.index];
    const channel = await this.getChannelFromData(data.channel, data.channelVarName, cache);

    const thread = await channel.threads.create({
      name: this.evalMessage(data.threadName, cache),
      autoArchiveDuration: data.autoArchiveDuration === 'max' ? 10080 : parseInt(data.autoArchiveDuration, 10),
      type: 'PrivateThread',
      reason: this.evalMessage(data.reason, cache) || null,
    });

    const storage = parseInt(data.storage, 10);
    const storageVarName = this.evalMessage(data.storageVarName, cache);
    this.storeValue(thread, storage, storageVarName, cache);

    this.callNextAction(cache);
  },

  mod() {},
};
