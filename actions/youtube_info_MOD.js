module.exports = {
  name: 'Store YouTube Info',
  section: 'YouTube Tools',
  meta: {
    version: '2.1.7',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/youtube_info_MOD.js',
  },

  subtitle(data) {
    const info = [
      'Video ID',
      'Video URL',
      'Video Title',
      'Video Description',
      'Video Channel Name',
      'Video Channel ID',
      'Video Thumbnail URL',
      'Unused but needed!',
      'Unused but needed!',
      'Unused but needed!',
      'Video is Unlisted?',
      'Video is Family Friendly?',
      'Video Duration',
      'Video Views',
      'Available Countries',
      'Video Like Count',
      'Video Dislike Count',
      'Unused but needed!',
      'Unused but needed!',
      'Video is Live?',
      'Unused but needed!',
      'Video Publish Date',
      'Video Owner Viewing?',
      'Video is Age Restricted?',
      'Video Channel Avatar URL',
      'Video Channel is Verified?',
      'Video Channel Subscriber Count',
    ];
    return `${info[parseInt(data.info, 10)]}`;
  },

  variableStorage(data, varType) {
    if (parseInt(data.storage, 10) !== varType) return;
    let dataType = 'Unknown Type';
    switch (parseInt(data.info, 10)) {
      case 0: // Video ID
      case 2: // Video URL
      case 3: // Video Description
      case 5: // Video Channel ID
      case 4: // Video Channel Name
      case 12: // Video Duration
      case 21: // Video Publish Date
        dataType = 'Text';
        break;
      case 1: // Video URL
      case 20: // Video Channel URL
      case 24: // Video Channel Avatar URL
        dataType = 'URL';
        break;
      case 6: // Video Thumbnail URL
        dataType = 'Image URL';
        break;
      case 19: // Video is live?
      case 22: // Video Owner Viewing?
      case 23: // Video is Age Restricted?
      case 25: // Video Channel is Verified?
      case 11: // Video is Family Friendly?
      case 10: // Video is Unlisted?
        dataType = 'Boolean';
        break;
      case 13: // Video Views
      case 16: // Video Like Count
      case 17: // Video Dislike Count
      case 26: // Video Channel Subscriber Count
        dataType = 'Number';
        break;
      case 14: // Available Countries
        dataType = 'Object';
        break;
    }
    return [data.varName, dataType];
  },

  fields: ['video', 'info', 'storage', 'varName'],

  html() {
    return `
<div>
  <div style="width: 100%;">
    <span class="dbminputlabel">Video URL</span>
    <textarea id="video"></textarea>
  </div>

  <div style="width: 100%; padding-top: 16px;">
    <span class="dbminputlabel">Source Info</span>
    <select id="info" class="round">
      <option value="0">Video ID</option>
      <option value="1">Video URL</option>
      <option value="2">Video Title</option>
      <option value="3">Video Description</option>
      <option value="4">Video Channel Name</option>
      <option value="5">Video Channel ID</option>
      <option value="6">Video Thumbnail URL</option>
      <option value="20">Video Channel URL</option>
      <option value="24">Video Channel Avatar URL</option>
      <option value="25">Video Channel is Verified?</option>
      <option value="26">Video Channel Subscriber Count</option>
      <option value="10">Video is Unlisted?</option>
      <option value="11">Video is Family Friendly?</option>
      <option value="12">Video Duration</option>
      <option value="13">Video Views</option>
      <option value="14">Available Countries</option>
      <option value="16">Video Like Count</option>
      <option value="17">Video Dislike Count</option>
      <option value="21">Video Publish Date</option>
      <option value="19">Video is Live?</option>
      <option value="22">Video Owner Viewing?</option>
      <option value="23">Video is Age Restricted?</option>
    </select>
  </div>
  <br>

  <div>
    <store-in-variable dropdownLabel="Store In" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></store-in-variable>
  </div>
</div>`;
  },

  init() {},

  async action(cache) {
    const data = cache.actions[cache.index];
    const info = parseInt(data.info, 10);
    const input = this.evalMessage(data.video, cache);
    const Mods = this.getMods();
    const ytsr = Mods.require('ytsr');
    const ytdl = Mods.require('ytdl-core');
    let result;

    if (!input) return console.log('Please specify a video to get video information.');

    const searchResults = await ytsr(input);
    if (!searchResults) return this.callNextAction(cache);
    const sr = searchResults.items[0];
    if (!sr) return this.callNextAction(cache);
    let video = await ytdl.getBasicInfo(sr.url);
    video = video.videoDetails;

    switch (info) {
      case 0: // Video ID
        result = video.videoID;
        break;
      case 1: // Video URL
        result = video.video_url;
        break;
      case 2: // Video Title
        result = video.title
          .replace(/&quot;/g, '"')
          .replace(/&amp;/g, '&')
          .replace(/&#39;/g, "'");
        break;
      case 3: // Video Description
        result = video.description
          .replace(/&quot;/g, '"')
          .replace(/&amp;/g, '&')
          .replace(/&#39;/g, "'");
        break;
      case 4: // Video Channel Name
        result = video.author.name;
        break;
      case 5: // Video Channel ID
        result = video.author.id;
        break;
      case 6: // Thumbnail URL (auto)
        result = sr.bestThumbnail.url;
        break;
      case 10: // Is unlisted
        result = video.isUnlisted;
        break;
      case 11: // Is family friendly?
        result = video.isFamilySafe;
        break;
      case 12: // Video Duration
        result = video.lengthSeconds;
        break;
      case 13: // Video Views
        result = video.views;
        break;
      case 14: // Available Countries
        result = video.availableCountries;
        break;
      case 16: // Like Count
        result = video.likes;
        break;
      case 17: // Dislike Count
        result = video.dislikes;
        break;
      case 19: // is live?
        result = video.isLiveContent;
        break;
      case 20: // Video Channel URL
        result = video.author.ref;
        break;
      case 21: // Video Publish Date
        result = video.publishDate;
        break;
      case 22: // Is owner Viewing?
        result = video.sOwnerViewing;
        break;
      case 23: // Age Restricted?
        result = video.age_restricted;
        break;
      case 24: // Video Channel Avatar URL
        result = sr.author.bestAvatar.url;
        break;
      case 25: // Is channel verified?
        result = video.author.verified;
        break;
      case 26: // Video Channel Subscriber Count
        result = video.author.subscriber_count;
        break;
      default:
        break;
    }

    if (result !== undefined) {
      const storage = parseInt(data.storage, 10);
      const varName2 = this.evalMessage(data.varName, cache);
      this.storeValue(result, storage, varName2, cache);
    }
    this.callNextAction(cache);
  },
  mod() {},
};
