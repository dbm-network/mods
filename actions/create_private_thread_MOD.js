module.exports = {
  name: 'Create Private Thread',
  section: 'Channel Control',
  meta: {
    version: '2.1.7',
    preciseCheck: false,
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
    return [data.storageVarName, 'Thread Channel'];
  },

  html() {
    return `
  <div style="width: 100%;">
    <channel-input dropdownLabel="Source Channel" selectId="channel" variableContainerId="varNameContainerChannel" variableInputId="channelVarName"></channel-input>
  </div>
  <br><br><br>
  
  <div style="padding-top: 8px; float: left; width: 100%;">
    <div style="float: left; width: 35%;">
      <span class="dbminputlabel">Thread Name</span><br>
      <input id="threadName" class="round" type="text"><br>
    </div>
    <div style="float: right; width: 60%;">
      <span class="dbminputlabel">Auto-Archive Duration</span><br>
      <select id="autoArchiveDuration" class="round">
        <option value="60" selected>1 Hour</option>
        <option value="1440">24 Hours</option>
        <option value="4320">3 Days</option>
        <option value="10080">1 Week</option>
        <option value="max">Maximum</option>
      </select>
    </div>
  </div>
 
  <div style="float: left; width: 100%;">
    <div style="width: 35%;">
      <span class="dbminputlabel">Reason</span>
      <input id="reason" placeholder="Optional" class="round" type="text">
    </div>
  </div>
  <br><br><br>

  <div style="padding-top: 16px; float: left; width: 100%;">
    <store-in-variable allowNone selectId="storage" variableInputId="storageVarName" variableContainerId="varNameContainer2"></store-in-variable>
  </div>
  <br><br><br><br>
  
  <p>This mod will be removed when the next version of DBM releases.</p>`;
  },

  init() {},

  async action(cache) {
    const data = cache.actions[cache.index];
    const channel = await this.getChannelFromData(data.channel, data.channelVarName, cache);

    const thread = await channel.threads
      .create({
        name: this.evalMessage(data.threadName, cache),
        autoArchiveDuration: data.autoArchiveDuration === 'max' ? 10080 : parseInt(data.autoArchiveDuration, 10),
        type: 'PrivateThread',
        reason: this.evalMessage(data.reason, cache) || null,
      })
      .catch((err) => this.displayError(data, cache, err));

    const storage = parseInt(data.storage, 10);
    const storageVarName = this.evalMessage(data.storageVarName, cache);
    this.storeValue(thread, storage, storageVarName, cache);
    this.callNextAction(cache);
  },

  mod() {},
};
