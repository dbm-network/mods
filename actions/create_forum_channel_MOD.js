module.exports = {
  name: 'Create Forum Channel',
  section: 'Channel Control',
  meta: {
    version: '2.1.7',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/create_forum_channel_MOD.js',
  },
  subtitle(data) {
    return `${data.channelName}`;
  },
  variableStorage(data, varType) {
    const type = parseInt(data.storage, 10);
    if (type !== varType) return;
    return [data.varName, 'Channel'];
  },
  fields: ['channelName', 'topic', 'position', 'storage', 'varName', 'categoryID', 'slowmodepost', 'reason'],
  html() {
    return `
<div style="height: 350px; overflow-y: scroll; overflow-x: hidden;">
  <div style="float: left; width: 100%; padding-top: 8px;">
    <span class="dbminputlabel">Name</span>
    <input id="channelName" class="round" type="text">
  </div>
  <div style="float: left; width: 100%; padding-top: 16px;">
    <span class="dbminputlabel">Guidelines</span>
    <textarea id="topic" rows="3" style="font-family: monospace; white-space: nowrap;"></textarea>
  </div>
  
  <div style="float: left; width: 100%;">
    <div style="float: left; width: 60%; padding-top: 16px;">
      <span class="dbminputlabel">Category ID</span>
      <input id= "categoryID" class="round" type="text" placeholder="Leave blank for no category">
    </div>
    <div style="float: right; width: 35%; padding-top: 16px;">
      <span class="dbminputlabel">Position</span>
      <input id="position" class="round" type="text" placeholder="Leave blank for default">
    </div>
  </div>
  <div style="float: left; width: 100%; padding-top: 16px;">
    <span class="dbminputlabel">Slowmode</span><br>
    <input id="slowmodepost" class="round" type="text" placeholder="Leave blank to disable">
  </div>
  <div style="float: left; width: 100%; padding-top: 16px;">
    <span class="dbminputlabel">Reason</span>
    <input id="reason" placeholder="Optional" class="round" type="text">
  </div>
  <div style="float: left; width: 100%; padding-top: 16px;">
    <store-in-variable allowNone dropdownLabel="Store In" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></store-in-variable>
  </div>
</div>
`;
  },
  init() {},
  async action(cache) {
    const data = cache.actions[cache.index];
    const { server } = cache;
    const name = this.evalMessage(data.channelName, cache);
    const channelData = { reason: this.evalMessage(data.reason, cache) };
    if (data.topic) {
      channelData.topic = this.evalMessage(data.topic, cache);
    }
    if (data.position) {
      channelData.position = parseInt(this.evalMessage(data.position, cache), 10);
    }
    if (data.categoryID) {
      channelData.parent = this.evalMessage(data.categoryID, cache);
    }
    if (data.slowmodepost) {
      channelData.rateLimitPerUser = parseInt(this.evalMessage(data.slowmodepost, cache), 10);
    }
    channelData.type = 15;
    server.channels
      .create(name, channelData)
      .then((channel) => {
        const storage = parseInt(data.storage, 10);
        const varName = this.evalMessage(data.varName, cache);
        this.storeValue(channel, storage, varName, cache);
        this.executeResults(true, data?.branch ?? data, cache);
      })
      .catch((err) => this.displayError(data, cache, err));
  },
  mod() {},
};
