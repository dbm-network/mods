module.exports = {
  name: 'Store YouTube Channel Info',
  section: 'YouTube Tools',
  meta: {
    version: '2.1.7',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/store_youtube_channel_info_MOD.js',
  },

  subtitle() {
    return 'Store information about a YouTube channel.';
  },

  variableStorage(data, varType) {
    const type = parseInt(data.storage, 10);
    if (type !== varType) return;
    const dataType = 'YouTube Channel Info';
    return [data.varName, dataType];
  },

  fields: ['query', 'info', 'storage', 'varName'],

  html() {
    return `
<div style="width: 100%;">
  <span class="dbminputlabel">YouTube Channel ID</span>
  <input id="query" class="round" type="text">
</div>

<div style="padding-top: 16px; width: 50%;">
  <span class="dbminputlabel">Options</span>
  <select id="info" class="round">
    <option value="0" selected>Channel URL</option>
    <option value="1">Channel Name</option>
    <option value="2">Channel Description</option>
    <option value="3">Subscriber Count</option>
    <option value="4">Related Channels</option>
    <option value="5">Is Family Friendly?</option>
    <option value="6">Channel Banners</option>
    <option value="7">Author Thumbnails</option>
    <option value="8">Channel is Verified?</option>
    <option value="9">Channel Allowed Regions</option>
  </select>
</div>

<div style="padding-top: 16px;">
  <store-in-variable dropdownLabel="Store In" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></store-in-variable>
</div>`;
  },

  init() {},

  async action(cache) {
    const data = cache.actions[cache.index];
    const storage = parseInt(data.storage, 10);
    const varName = this.evalMessage(data.varName, cache);
    const channelId = this.evalMessage(data.query, cache);
    const info = parseInt(data.info, 10);
    const Mods = this.getMods();
    const ytch = Mods.require('yt-channel-info');
    let result;

    const channel = await ytch.getChannelInfo({ channelId });

    switch (info) {
      case 0:
        result = channel.authorUrl;
        break;
      case 1:
        result = channel.author;
        break;
      case 2:
        result = channel.description;
        break;
      case 3:
        result = channel.subscriberCount;
        break;
      case 4:
        result = channel.relatedChannels;
        break;
      case 5:
        result = channel.isFamilyFriendly;
        break;
      case 6:
        result = channel.authorBanners;
        break;
      case 7:
        result = channel.authorThumbnails;
        break;
      case 8:
        result = channel.isVerified;
        break;
      case 9:
        result = channel.allowedRegions;
        break;
    }

    this.storeValue(result, storage, varName, cache);
    this.callNextAction(cache);
  },

  mod() {},
};
