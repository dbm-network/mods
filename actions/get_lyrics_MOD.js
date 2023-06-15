module.exports = {
  name: 'Get Song Lyrics',
  section: 'Other Stuff',
  meta: {
    version: '2.2.0',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/get_lyrics_MOD.js',
  },

  subtitle(data) {
    const info = ['Title', 'Artist', 'Lyrics', 'URL'];
    return `Get Lyrics - ${info[parseInt(data.info, 10)]}`;
  },

  variableStorage(data, varType) {
    if (parseInt(data.storage, 10) !== varType) return;
    let dataType = 'Unknown Type';
    switch (parseInt(data.info, 10)) {
      case 0:
      case 1:
      case 2:
        dataType = 'String';
        break;
      case 3:
        dataType = 'URL';
        break;
    }
    return [data.varName, dataType];
  },

  fields: ['song', 'key', 'info', 'storage', 'varName'],

  html() {
    return `
    <div>
      <span class="dbminputlabel">Song to Search</span>
      <textarea id="song" rows="2" placeholder="Write a song name here or use variables..."></textarea>
    </div>

    <div style="padding-top: 16px;">
      <span class="dbminputlabel">API Key</span>
      <textarea id="key" rows="2" placeholder="Write your key. Get one from Genius."></textarea>
    </div>

    <div style="padding-top: 16px;">
      <span class="dbminputlabel">Source Info</span>
      <select id="info" class="round">
        <option value="0" selected>Song Title</option>
        <option value="1">Song Artist</option>
        <option value="2">Song Lyrics</option>
        <option value="3">Song URL</option>
      </select>
    </div>
    
    <div style="padding-top: 16px;">
      <store-in-variable dropdownLabel="Store In" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></store-in-variable>
    </div>`;
  },

  init() {},

  async action(cache) {
    const { Actions } = this.getDBM();
    const data = cache.actions[cache.index];
    const info = parseInt(data.info, 10);
    const geniustoken = this.evalMessage(data.key, cache);
    const songname = this.evalMessage(data.song, cache);
    if (!geniustoken) return console.log('Please set your token in Get Lyrics Action!');

    const Mods = this.getMods();
    const analyrics = Mods.require('analyrics');

    analyrics.setToken(geniustoken);

    analyrics.getSong(songname, (song) => {
      let result;
      switch (info) {
        case 0:
          result = song.title;
          break;
        case 1:
          result = song.artist;
          break;
        case 2:
          result = song.lyrics;
          break;
        case 3:
          result = song.url;
          break;
        default:
          break;
      }
      if (result !== undefined) {
        const storage = parseInt(data.storage, 10);
        const varName2 = Actions.evalMessage(data.varName, cache);
        Actions.storeValue(result, storage, varName2, cache);
      }
      Actions.callNextAction(cache);
    });
  },

  mod() {},
};
