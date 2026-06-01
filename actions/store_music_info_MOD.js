module.exports = {
  // ---------------------------------------------------------------------
  // Action Name
  // ---------------------------------------------------------------------

  name: 'Store Music Info',

  // ---------------------------------------------------------------------
  // Action Section
  // ---------------------------------------------------------------------

  section: 'Music',

  // ---------------------------------------------------------------------
  // Action Subtitle
  // ---------------------------------------------------------------------

  subtitle(data, presets) {
    const info = [
      'Music Title',
      'Music Url',
      'Music Author',
      'Music Views',
      'Music Thumbnail',
      'Music Duration',
      'Music Description',
      'Music Requested By',
      'Music Source',
    ];
    return `Retrieve the ${info[parseInt(data.info, 10)]}`;
  },

  // ---------------------------------------------------------------------
  // Action Storage Function
  // ---------------------------------------------------------------------

  variableStorage(data, varType) {
    const type = parseInt(data.storage, 10);
    if (type !== varType) return;
    const info = parseInt(data.info, 10);
    let dataType = 'Unknown Type';
    switch (info) {
      case 0:
        dataType = 'Music Title';
        break;
      case 1:
        dataType = 'Music Url';
        break;
      case 2:
        dataType = 'Music Author';
        break;
      case 3:
        dataType = 'Music Views';
        break;
      case 4:
        dataType = 'Music Thumbnail';
        break;
      case 5:
        dataType = 'Music Duration';
        break;
      case 6:
        dataType = 'Music Description';
        break;
      case 7:
        dataType = 'Music Requested By (member)';
        break;
      case 8:
        dataType = 'Music Source';
        break;
    }
    return [data.varName2, dataType];
  },

  // ---------------------------------------------------------------------
  // Action Meta Data
  // ---------------------------------------------------------------------

  meta: {
    version: '2.2.0',
    preciseCheck: true,
    author: 'Shadow',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadUrl: 'https://github.com/dbm-network/mods',
  },

  // ---------------------------------------------------------------------
  // Action Fields
  // ---------------------------------------------------------------------

  fields: ['type', 'song', 'info', 'storage', 'varName2'],

  // ---------------------------------------------------------------------
  // Command HTML
  // ---------------------------------------------------------------------

  html(isEvent, data) {
    return `
    <div class="dbmmodsbr1" style="height: 59px">
    <p>Mod Info:</p>
    <p>Created by Shadow</p>
    <p>
      Help:
      <a
        href="https://discord.gg/9HYB4n3Dz4"
        target="_blank"
        style="color: #0077ff; text-decoration: none"
        >discord</a
      >
    </p>
  </div>
  
  <div class="dbmmodsbr dbmmodsbr2">
    <p>Mod Version:</p>
    <p>
      <a
        href="https://github.com/Shadow64gg/DBM-14"
        target="_blank"
        style="color: #0077ff; text-decoration: none"
        >2.0</a
      >
    </p>
  </div>
  
  <style>
    .dbmmodsbr1,
    .dbmmodsbr2 {
      position: absolute;
      bottom: 0px;
      background: rgba(0, 0, 0, 0.7);
      color: #999;
      padding: 5px;
      font-size: 12px;
      z-index: 999999;
      cursor: pointer;
      line-height: 1.2;
      border-radius: 8px;
      transition: transform 0.3s ease, background-color 0.6s ease, color 0.6s ease;
    }
  
    .dbmmodsbr1 {
      left: 0px;
      border: 2px solid rgba(50, 50, 50, 0.7);
    }
  
    .dbmmodsbr2 {
      right: 0px;
      text-align: center;
    }
  
    .dbmmodsbr1:hover,
    .dbmmodsbr2:hover {
      transform: scale(1.01);
      background-color: rgba(29, 29, 29, 0.9);
      color: #fff;
    }
  
    .dbmmodsbr1 p,
    .dbmmodsbr2 p {
      margin: 0;
      padding: 0;
    }
  
    .dbmmodsbr1 a,
    .dbmmodsbr2 a {
      font-size: 12px;
      color: #0077ff;
      text-decoration: none;
    }
  
    .dbmmodsbr1 a:hover,
    .dbmmodsbr2 a:hover {
      text-decoration: underline;
    }
  </style>
  
    </div><br>
    <div style="float: left; width: calc(100% - 12px);">
      <retrieve-from-variable dropdownLabel="Source Music" selectId="type" variableContainerId="varNameContainer" variableInputId="song"></retrieve-from-variable>
    </div>

       <div style="float: left; width: calc(100% - 12px);">
      <span class="dbminputlabel">Source Info</span><br>
      <select id="info" class="round">
          <option value="0" selected>Music Title</option>
          <option value="1">Music Url</option>
          <option value="2">Music Author</option>
          <option value="3">Music Views</option>
          <option value="4">Music Thumbnail</option>
          <option value="5">Music Duration</option>
          <option value="6">Music Description</option>
          <option value="7">Music Requested By</option>
          <option value="8">Music Source</option>
      </select>
      <br>
      <store-in-variable dropdownLabel="Store In" selectId="storage" variableContainerId="varNameContainer2" variableInputId="varName2"></store-in-variable>
  </div>`;
  },

  // ---------------------------------------------------------------------
  // Action Editor Init Code
  // ---------------------------------------------------------------------

  init() {},

  // ---------------------------------------------------------------------
  // Action Bot Function
  // ---------------------------------------------------------------------

  async action(cache) {
    const data = cache.actions[cache.index];
    const song = this.getVariable(parseInt(data.type, 10), data.song, cache);

    if (!song) {
      this.callNextAction(cache);
      return;
    }

    const info = parseInt(data.info, 10);

    let result;
    switch (info) {
      case 0:
        result = song.title;
        break;
      case 1:
        result = song.url;
        break;
      case 2:
        result = song.author;
        break;
      case 3:
        result = song.views;
        break;
      case 4:
        result = song.thumbnail;
        break;
      case 5:
        result = song.duration;
        break;
      case 6:
        result = song.description;
        break;
      case 7:
        result = `<@${song.requestedBy}>`;
        break;
      case 8:
        result = song.source;
        break;
      default:
        break;
    }

    if (result !== undefined) {
      const storage = parseInt(data.storage, 10);
      const varName2 = this.evalMessage(data.varName2, cache);
      this.storeValue(result, storage, varName2, cache);
    }
    this.callNextAction(cache);
  },

  // ---------------------------------------------------------------------
  // Action Bot Mod
  // ---------------------------------------------------------------------

  mod() {},
};
