module.exports = {
  name: 'YouTube Search',
  section: 'Audio Control',
  meta: {
    version: '2.1.6',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/youtube_search_MOD.js',
  },

  subtitle(data) {
    const videoInfo = [
      'Video ID',
      'Video URL',
      'Video Title',
      'Video Description',
      'Video Channel ID',
      'Video Channel URL',
      'Video Channel Name',
      'Video Channel Avatar URL',
      'Video Thumbnail URL',
      'Video Duration',
      'Video Publish Date',
      'Video Views',
      'Video is live?',
    ];
    const playlistInfo = [
      'Playlist ID',
      'Playlist URL',
      'Playlist Name',
      'Playlist Description',
      'Playlist Thumbnail URL (Default)',
      'Playlist Thumbnail URL (Medium)',
      'Playlist Thumbnail URL (High)',
      'Playlist Channel ID',
      'Playlist Channel URL',
      'Playlist Channel Name',
      'Playlist Channel Thumbnail URL (Default)',
      'Playlist Channel Thumbnail URL (Medium)',
      'Playlist Channel Thumbnail URL (High)',
      'Video IDs',
      'Video URLs',
      'Video Titles',
      'Video Descriptions',
      'Video Channel IDs',
      'Video Channel URls',
      'Video Channel Names',
      'Video Channel Thumbnail URLs (Default)',
      'Video Channel Thumbnail URLs (Medium)',
      'Video Channel Thumbnail URLs (High)',
      'Video Thumbnail URLs (Default)',
      'Video Thumbnail URLs (Medium)',
      'Video Thumbnail URLs (High)',
      'Video Positions',
      'Video Publish Dates',
    ];
    if (parseInt(data.type, 10) === 1) {
      return `${playlistInfo[parseInt(data.info1, 10)]}`;
    }
    return `${videoInfo[parseInt(data.info0, 10)]}`;
  },

  variableStorage(data, varType) {
    if (parseInt(data.storage, 10) !== varType) return;
    let dataType = 'Unknown Type';
    switch (parseInt(data.type, 10)) {
      case 0: // Video
        // ----------------------------
        switch (parseInt(data.info0, 10)) {
          case 0: // Video ID
          case 2: // Video Title
          case 3: // Video Description
          case 4: // Video Channel ID
          case 6: // Video Channel Name
          case 17: // Video Duration
          case 18: // Video Publish Date
            dataType = 'Text';
            break;
          case 1: // Video URL
          case 5: // Video Channel URL
            dataType = 'URL';
            break;
          case 7: // Video Thumbnail URL
            dataType = 'Image URL';
            break;
          case 24: // Video is live?
            dataType = 'Boolean';
            break;
          case 19: // Video Views
            dataType = 'Number';
            break;
        }
        break;
      case 1: // Playlist
        // ----------------------------
        switch (parseInt(data.info1, 10)) {
          case 0: // Playlist ID
          case 2: // Playlist Name
          case 3: // Playlist Description
          case 7: // Playlist Channel ID
          case 9: // Playlist Channel Name
            dataType = 'Text';
            break;
          case 1: // Playlist URL
          case 8: // Playlist Channel URL
            dataType = 'URL';
            break;
          case 4: // Playlist Thumbnail URL (Default)
          case 5: // Playlist Thumbnail URL (Medium)
          case 6: // Playlist Thumbnail URL (High)
          case 10: // Playlist Channel Thumbnail URL (Default)
          case 11: // Playlist Channel Thumbnail URL (Medium)
          case 12: // Playlist Channel Thumbnail URL (High)
            dataType = 'Image URL';
            break;
          case 13: // Video IDs
          case 14: // Video URLs
          case 15: // Video Titles
          case 16: // Video Descriptions
          case 17: // Video Channel IDs
          case 18: // Video Channel URLs
          case 19: // Video Channel Names
          case 20: // Video Channel Thumbnail URLs (Default)
          case 21: // Video Channel Thumbnail URLs (Medium)
          case 22: // Video Channel Thumbnail URLs (High)
          case 23: // Video Thumbnail URLs (Default)
          case 24: // Video Thumbnail URLs (Medium)
          case 25: // Video Thumbnail URLs (High)
          case 26: // Video Positions
          case 27: // Video Publish Dates
            dataType = 'List';
            break;
        }
        break;
    }
    return [data.varName, dataType];
  },

  fields: ['type', 'input', 'info0', 'info1', 'apikey', 'results', 'storage', 'varName'],

  html(_isEvent, data) {
    return `
<div id ="wrexdiv" style="width: 550px; height: 350px; overflow-y: scroll; overflow-x: hidden;">
  <div style="float: left; width: 30%; padding-top: 8px;">
    Source Type:<br>
    <select id="type" class="round" onchange="glob.onChange1(this)">
      <option value="0" selected>YouTube Video</option>
      <option value="1">YouTube Playlist</option>
    </select>
  </div>
  <div style="float: left; width: 99%; padding-top: 8px;">
    <span id="tempName">Video</span> to search:<br>
    <textarea id="input" rows="2" placeholder="Insert your url or keywords in here..." style="width: 95%; font-family: monospace; white-space: nowrap; resize: none;"></textarea>
  </div>
  <div id="divinfo0"; style="float: left; width: 94%; padding-top: 8px;">
    Source Video Info:<br>
    <select id="info0" class="round">
      <option value="0">Video ID</option>
      <option value="1" selected>Video URL</option>
      <option value="2">Video Title</option>
      <option value="3">Video Description</option>
      <option value="4">Video Channel ID</option>
      <option value="5">Video Channel URL</option>
      <option value="6">Video Channel Name</option>
      <option value="7">Video Channel Avatar URL</option>
      <option value="8">Video Thumbnail URL</option>
      <option value="9">Video Duration</option>
      <option value="10">Video Publish Date</option>
      <option value="11">Video Views</option>
      <option value="12">Video is Live?</option>
    </select>
  </div>
  <div id="divinfo1"; style="float: left; width: 94%; padding-top: 8px;">
    Source Playlist Info:<br>
    <select id="info1" class="round">
      <option value="0">Playlist ID</option>
      <option value="1" selected>Playlist URL</option>
      <option value="2">Playlist Name</option>
      <option value="3">Playlist Description</option>
      <option value="4">Playlist Thumbnail URL (Default)</option>
      <option value="5">Playlist Thumbnail URL (Medium)</option>
      <option value="6">Playlist Thumbnail URL (High)</option>
      <option value="7">Playlist Channel ID</option>
      <option value="8">Playlist Channel URL</option>
      <option value="9">Playlist Channel Name</option>
      <option value="10">Playlist Channel Thumbnail URL (Default)</option>
      <option value="11">Playlist Channel Thumbnail URL (Medium)</option>
      <option value="12">Playlist Channel Thumbnail URL (High)</option>
      <option value="13">Video IDs</option>
      <option value="14">Video URLs</option>
      <option value="15">Video Titles</option>
      <option value="16">Video Descriptions</option>
      <option value="17">Video Channel IDs</option>
      <option value="18">Video Channel URLs</option>
      <option value="19">Video Channel Names</option>
      <option value="20">Video Channel Thumbnail URLs (Default)</option>
      <option value="21">Video Channel Thumbnail URLs (Medium)</option>
      <option value="22">Video Channel Thumbnail URLs (High)</option>
      <option value="23">Video Thumbnail URLs (Default)</option>
      <option value="24">Video Thumbnail URLs (Medium)</option>
      <option value="25">Video Thumbnail URLs (High)</option>
      <option value="26">Video Positions</option>
      <option value="27">Video Publish Dates</option>
    </select>
  </div>
  <div id="divresults" style="float: left; width: 94%; padding-top: 8px;">
    Result Number:<br>
    <select id="results" class="round">
      <option value="1">1st Result</option>
      <option value="2">2nd Result</option>
      <option value="3">3rd Result</option>
      <option value="4">4th Result</option>
      <option value="5">5th Result</option>
      <option value="6">6th Result</option>
      <option value="7">7th Result</option>
      <option value="8">8th Result</option>
      <option value="9">9th Result</option>
      <option value="10">10th Result</option>
      <option value="11">11th Result</option>
      <option value="12">12th Result</option>
      <option value="13">13th Result</option>
      <option value="14">14th Result</option>
      <option value="15">15th Result</option>
      <option value="16">16th Result</option>
      <option value="17">17th Result</option>
      <option value="18">18th Result</option>
      <option value="19">19th Result</option>
      <option value="20">20th Result</option>
    </select>
  </div>
  <div id="divapikey" style="float: left; width: 104%; padding-top: 8px;">
    API Key:<br>
    <input id="apikey" class="round" type="text" placeholder="Insert your YouTube Data V3 API Key... (Not needed for search)">
  </div>
  <div>
    <div style="float: left; width: 35%;  padding-top: 8px;">
      Store In:<br>
      <select id="storage" class="round" onchange="glob.variableChange(this, 'varNameContainer')">
        ${data.variables[1]}
      </select>
    </div>
    <div id="varNameContainer" style="float: right; width: 60%; padding-top: 8px;">
      Variable Name:<br>
      <input id="varName" class="round" type="text"><br>
    </div>
  </div>
</div>`;
  },

  init() {
    const { glob, document } = this;

    glob.variableChange(document.getElementById('storage'), 'varNameContainer');
    glob.onChange1 = function onChange1(event) {
      const id = parseInt(event.value, 10);
      // Load [Source Video Info], [Source Playlist Info], [API Key], [Max Results]
      const videoDiv = document.getElementById('divinfo0');
      const video = document.getElementById('info0');
      const playlistDiv = document.getElementById('divinfo1');
      const playlist = document.getElementById('info1');
      let result = '';
      switch (
        id // Show: [Source Video Info] Hide: [Source Playlist Info], [Max Results]
      ) {
        case 0:
          result = 'Video';
          video.style.display = null;
          videoDiv.style.display = null;
          playlist.style.display = 'none';
          playlistDiv.style.display = 'none';
          break;
        case 1: // Show: [Source Playlist Info], [Max Results] Hide: [Source Video Info]
          result = 'Playlist';
          video.style.display = 'none';
          videoDiv.style.display = 'none';
          playlist.style.display = null;
          playlistDiv.style.display = null;
          break;
      }
      // Replace text with [Video/Playlist]
      document.getElementById('tempName').innerHTML = result;
    };
    glob.onChange1(document.getElementById('type'));
  },

  async action(cache) {
    const data = cache.actions[cache.index];
    const { Actions } = this.getDBM();
    const Mods = this.getMods();
    const input = this.evalMessage(data.input, cache); // URL or Keywords
    const apikey = this.evalMessage(data.apikey, cache); // Api Key
    const type = parseInt(data.type, 10); // 0: Video | 1: Playlist
    const info0 = parseInt(data.info0, 10); // Video
    const info1 = parseInt(data.info1, 10); // Playlist
    const results = parseInt(data.results, 10);
    const { Client } = Mods.require('youtubei');
    const youtubei = new Client();
    const YTapi = Mods.require('simple-youtube-api');

    if (!input) {
      console.error('Please provide a url or some keywords to search for.');
      return this.callNextAction(cache);
    }

    switch (type) {
      case 0: {
        // Video
        const searchResults = await youtubei.search(input, { type: 'video' });
        if (!searchResults) return this.callNextAction(cache);
        const compact = searchResults[results - 1]; // Video Compact from search results
        if (!compact) return this.callNextAction(cache);
        const video = await youtubei.getVideo(compact.id); // Get the actual full video info from the ID
        if (!video) return this.callNextAction(cache);
        let result;

        switch (info0) {
          case 0: // Video ID
            result = video.id;
            break;
          case 1: // Video URL
            result = `https://www.youtube.com/watch?v=${video.id}`;
            break;
          case 2: // Video Title
            result = video.title;
            break;
          case 3: // Video Description
            result = video.description;
            break;
          case 4: // Video Channel ID
            result = video.channel.id;
            break;
          case 5: // Video Channel URL
            result = `https://www.youtube.com/channel/${video.channel.id}`;
            break;
          case 6: // Video Channel Name
            result = video.channel.name;
            break;
          case 7: // Video Channel Avatar
            result = video.channel.thumbnails[video.channel.thumbnails.length - 1].url;
            break;
          case 8: // Thumbnail URL
            result = video.thumbnails[video.thumbnails.length - 1].url;
            break;
          case 9: // Video Duration
            result = video.duration;
            break;
          case 10: // Video Publish Date
            result = video.uploadDate;
            break;
          case 11: // Video Views
            result = video.views;
            break;
          case 12: // is live?
            result = video.isLiveContent;
            break;
          default:
            break;
        }
        if (result !== undefined) {
          const storage = parseInt(data.storage, 10);
          const varName = this.evalMessage(data.varName, cache);
          this.storeValue(result, storage, varName, cache);
          return this.callNextAction(cache);
        }
        break;
      }
      case 1: {
        // Playlist
        if (apikey === undefined || apikey === '')
          return console.error('Please provide a valid api key for YouTube Search Playlist.');

        const YouTube = new YTapi(apikey);
        const playlists = await YouTube.searchPlaylists(input, results);

        let result;
        const playlist = playlists[results - 1];
        if (!playlist) return Actions.callNextAction(cache);

        switch (info1) {
          case 0: // Playlist ID
            result = playlist.id;
            break;
          case 1: // Playlist URL
            result = `https://www.youtube.com/playlist?list=${playlist.id}`;
            break;
          case 2: // Playlist Name
            result = playlist.title
              .replace(/&quot;/g, '"')
              .replace(/&amp;/g, '&')
              .replace(/&#39;/g, "'");
            break;
          case 3: // Playlist Description
            result = playlist.description
              .replace(/&quot;/g, '"')
              .replace(/&amp;/g, '&')
              .replace(/&#39;/g, "'");
            break;
          case 4: // Playlist Thumbnail URL (Default)
            result = playlist.thumbnails.default.url;
            break;
          case 5: // Playlist Thumbnail URL (Medium)
            result = playlist.thumbnails.default.medium;
            break;
          case 6: // Playlist Thumbnail URL (High)
            result = playlist.thumbnails.default.high;
            break;
          case 7: // Playlist Channel ID
            result = playlist.channel.id;
            break;
          case 8: // Playlist Channel URL
            result = `https://www.youtube.com/channel/${playlist.channel.id}`;
            break;
          case 9: // Playlist Channel Name
            result = playlist.channel.title;
            break;
          case 10: // Playlist Channel Thumbnail URL (Default)
            result = playlist.channel.raw.snippet.thumbnails.default.url;
            break;
          case 11: // Playlist Channel Thumbnail URL (Medium)
            result = playlist.channel.raw.snippet.thumbnails.medium.url;
            break;
          case 12: // Playlist Channel Thumbnail URL (High)
            result = playlist.channel.raw.snippet.thumbnails.high.url;
            break;
          default: {
            const videos = await playlist.getVideos();
            const result2 = [];
            videos.forEach((video, pos) => {
              switch (info1) {
                case 13: // Video IDs
                  result2.push(video.id);
                  break;
                case 14: // Video URLs
                  result2.push(`https://www.youtube.com/watch?v=${video.id}`);
                  break;
                case 15: // Video Titles
                  result2.push(
                    video.title
                      .replace(/&quot;/g, '"')
                      .replace(/&amp;/g, '&')
                      .replace(/&#39;/g, "'"),
                  );
                  break;
                case 16: // Video Descriptions
                  result2.push(
                    video.description
                      .replace(/&quot;/g, '"')
                      .replace(/&amp;/g, '&')
                      .replace(/&#39;/g, "'"),
                  );
                  break;
                case 17: // Video Channel IDs
                  result2.push(video.channel.id);
                  break;
                case 18: // Video Channel URLs
                  result2.push(`https://www.youtube.com/channel/${video.channel.id}`);
                  break;
                case 19: // Video Channel Names
                  result2.push(video.channel.title);
                  break;
                case 20: // Video Channel Thumbnail URLs (Default)
                  result2.push(video.channel.raw.snippet.thumbnails.default.url);
                  break;
                case 21: // Video Channel Thumbnail URLs (Medium)
                  result2.push(video.channel.raw.snippet.thumbnails.medium.url);
                  break;
                case 22: // Video Channel Thumbnail URLs (High)
                  result2.push(video.channel.raw.snippet.thumbnails.high.url);
                  break;
                case 23: // Video Thumbnail URLs (Default)
                  result2.push(video.thumbnails.default.url);
                  break;
                case 24: // Video Thumbnail URLs (Medium)
                  result2.push(video.thumbnails.medium.url);
                  break;
                case 25: // Video Thumbnail URLs (High)
                  result2.push(video.thumbnails.high.url);
                  break;
                case 26: // Video Positions
                  result2.push(pos + 1);
                  break;
                case 27: // Video Publish Dates
                  result2.push(video.publishedAt);
                  break;
                default:
                  console.error('Please check your YouTube Search action... There is something wrong.');
                  break;
              }
            });
            if (result2.length > 0) {
              const storage = parseInt(data.storage, 10);
              const varName = Actions.evalMessage(data.varName, cache);
              Actions.storeValue(result2, storage, varName, cache);
              return Actions.callNextAction(cache);
            }
            break;
          }
        }
        if (result !== undefined) {
          const storage = parseInt(data.storage, 10);
          const varName = Actions.evalMessage(data.varName, cache);
          Actions.storeValue(result, storage, varName, cache);
          return Actions.callNextAction(cache);
        }
        break;
      }
      default:
        break;
    }
    Actions.callNextAction(cache);
  },

  mod() {},
};
