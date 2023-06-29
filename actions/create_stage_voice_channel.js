module.exports = {
  name: 'Create Stage Voice Channel',
  section: 'Channel Control',
  meta: {
    version: '2.1.7',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadUrl: 'https://github.com/dbm-network/mods/blob/master/actions/create_stage_voice_channel.js',
  },
  fields: ['channelName', 'categoryID', 'bitrate', 'userLimit', 'reason', 'storage', 'varName'],

  subtitle(data) {
    return `${data.channelName}`;
  },

  variableStorage(data, varType) {
    const type = parseInt(data.storage, 10);
    if (type !== varType) return;
    return [data.varName, 'Voice Channel'];
  },
  html() {
    return `
<span class="dbminputlabel">Stage Name</span><br>
<input id="channelName" class="round" type="text">

<br>

<span class="dbminputlabel">Category ID</span><br>
<input id= "categoryID" class="round" type="text" placeholder="Leave blank for default!">

<br>

<div style="float: left; width: calc(50% - 12px);">
	<span class="dbminputlabel">Bitrate</span><br>
	<input id="bitrate" class="round" type="text" placeholder="Leave blank for default!"><br>
</div>
<div style="float: right; width: calc(50% - 12px);">
	<span class="dbminputlabel">User Limit</span><br>
	<input id="userLimit" class="round" type="text" placeholder="Leave blank for default! Max 10k Limit"><br>
</div>

<div>
  <span class="dbminputlabel">Reason</span>
  <input id="reason" placeholder="Optional" class="round" type="text">
</div>

<br>

<store-in-variable allowNone selectId="storage" variableInputId="varName" variableContainerId="varNameContainer"></store-in-variable>`;
  },

  init() {},

  action(cache) {
    const data = cache.actions[cache.index];
    const server = cache.server;
    if (!server?.channels) return this.callNextAction(cache);
    const name = this.evalMessage(data.channelName, cache);
    const storage = parseInt(data.storage, 10);
    const channelData = { type: 'GUILD_STAGE_VOICE' };
    if (data.reason) {
      channelData.reason = this.evalMessage(data.reason, cache);
    }
    if (data.bitrate) {
      channelData.bitrate = parseInt(this.evalMessage(data.bitrate, cache), 10) * 1000;
    }
    if (data.userLimit) {
      channelData.userLimit = parseInt(this.evalMessage(data.userLimit, cache), 10);
    }
    if (data.categoryID) {
      channelData.parent = this.evalMessage(data.categoryID, cache);
    }
    server.channels
      .create(name, channelData)
      .then((channel) => {
        const varName = this.evalMessage(data.varName, cache);
        this.storeValue(channel, storage, varName, cache);
        this.callNextAction(cache);
      })
      .catch((err) => this.displayError(data, cache, err));
  },

  mod() {},
};
