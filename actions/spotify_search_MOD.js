module.exports = {
  name: 'Spotify Search',
  section: 'Other Stuff',
  meta: {
    version: '2.1.6',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/spotify_search_MOD.js',
  },

  subtitle(data) {
    const info1 = [
      'Track Name',
      'Track Artists Name',
      'Track Artists ID',
      'Track Album Name',
      'Track Album ID',
      'Track ID',
      'Track URL',
      'Track Available Markets List',
      'Track Duration',
      'Track Popularity',
      'Is Explicit?',
      'Is Local?',
      'Total Tracks Results',
      'Track Data',
    ];
    const info2 = [
      'Artist Name',
      'Artist ID',
      'Artist URL',
      'Artist Followers Number',
      'Artist Genres',
      'Artist Popularity',
      'Artist Image (H)',
      'Artist Image (M)',
      'Artist Image (L)',
      'Total Artists Results',
      'Artist Data',
    ];
    const info3 = [
      'Playlist Name',
      'Playlist ID',
      'Playlist URL',
      'Playlist Owner Name',
      'Playlist Owner ID',
      'Playlist Owner URL',
      'Playlist Snapshot ID',
      'Playlist Tracks Total',
      'Playlist Image (H)',
      'Playlist Image (M)',
      'Playlist Image (L)',
      'Is Collaborative?',
      'Total Playlists Results',
      'Playlist Data',
    ];
    const info4 = [
      'Album Name',
      'Album Artists Name',
      'Album Artists ID',
      'Album ID',
      'Album Release Date',
      'Album Type',
      'Album URL',
      'Album Total Tracks',
      'Album Available Markets List',
      'Album Image (H)',
      'Album Image (M)',
      'Album Image (L)',
      'Total Albums Results',
      'Album Data',
    ];
    return `${data.varName} - ${
      data.search === '0'
        ? `${info1[data.info1]}`
        : `${
            data.search === '1'
              ? `${info2[data.info2]}`
              : `${data.search === '2' ? `${info3[data.info3]}` : `${info4[data.info4]}`}`
          }`
    }`;
  },

  variableStorage(data, varType) {
    if (parseInt(data.storage, 10) !== varType) return;
    const info1 = parseInt(data.info1, 10);
    const info2 = parseInt(data.info2, 10);
    const info3 = parseInt(data.info3, 10);
    const info4 = parseInt(data.info4, 10);
    const searchtype = parseInt(data.search, 10);
    let dataType = 'Unknown Spotify Type';
    if (searchtype === 0) {
      switch (info1) {
        case 0:
          dataType = 'Spotify Track Name';
          break;
        case 1:
          dataType = 'Spotify Track Artists Name';
          break;
        case 2:
          dataType = 'Spotify Track Artists ID';
          break;
        case 3:
          dataType = 'Spotify Track Album Name';
          break;
        case 4:
          dataType = 'Spotify Track Album ID';
          break;
        case 5:
          dataType = 'Spotify Track ID';
          break;
        case 6:
          dataType = 'Spotify Track URL';
          break;
        case 7:
          dataType = 'Spotify Track Available Markets List';
          break;
        case 8:
          dataType = 'Spotify Track Duration';
          break;
        case 9:
          dataType = 'Spotify Track Popularity';
          break;
        case 10:
          dataType = 'Boolean';
          break;
        case 11:
          dataType = 'Boolean';
          break;
        case 12:
          dataType = 'Spotify Total Tracks Results';
          break;
        case 13:
          dataType = 'Spotify Track Data';
          break;
      }
    } else if (searchtype === 1) {
      switch (info2) {
        case 0:
          dataType = 'Spotify Artist Name';
          break;
        case 1:
          dataType = 'Spotify Artist ID';
          break;
        case 2:
          dataType = 'Spotify Artist URL';
          break;
        case 3:
          dataType = 'Spotify Artist Followers Number';
          break;
        case 4:
          dataType = 'Spotify Artist Genres';
          break;
        case 5:
          dataType = 'Spotify Artist Popularity';
          break;
        case 6:
          dataType = 'Spotify Artist Image (H)';
          break;
        case 7:
          dataType = 'Spotify Artist Image (M)';
          break;
        case 8:
          dataType = 'Spotify Artist Image (L)';
          break;
        case 9:
          dataType = 'Spotify Total Artists Results';
          break;
        case 10:
          dataType = 'Spotify Artist Data';
          break;
      }
    } else if (searchtype === 2) {
      switch (info3) {
        case 0:
          dataType = 'Spotify Playlist Name';
          break;
        case 1:
          dataType = 'Spotify Playlist ID';
          break;
        case 2:
          dataType = 'Spotify Playlist URL';
          break;
        case 3:
          dataType = 'Spotify Playlist Owner Name';
          break;
        case 4:
          dataType = 'Spotify Playlist Owner ID';
          break;
        case 5:
          dataType = 'Spotify Playlist Owner URL';
          break;
        case 6:
          dataType = 'Spotify Playlist Snapshot ID';
          break;
        case 7:
          dataType = 'Spotify Playlist Tracks Total';
          break;
        case 8:
          dataType = 'Spotify Playlist Image (H)';
          break;
        case 9:
          dataType = 'Spotify Playlist Image (M)';
          break;
        case 10:
          dataType = 'Spotify Playlist Image (L)';
          break;
        case 11:
          dataType = 'Boolean';
          break;
        case 12:
          dataType = 'Spotify Total Playlists Results';
          break;
        case 13:
          dataType = 'Spotify Playlist Data';
          break;
      }
    } else if (searchtype === 3) {
      switch (info4) {
        case 0:
          dataType = 'Spotify Album Name';
          break;
        case 1:
          dataType = 'Spotify Album Artists Name';
          break;
        case 2:
          dataType = 'Spotify Album Artists ID';
          break;
        case 3:
          dataType = 'Spotify Album ID';
          break;
        case 4:
          dataType = 'Spotify Album Release Date';
          break;
        case 5:
          dataType = 'Spotify Album Type';
          break;
        case 6:
          dataType = 'Spotify Album URL';
          break;
        case 7:
          dataType = 'Spotify Album Total Tracks';
          break;
        case 8:
          dataType = 'Spotify Album Available Markets List';
          break;
        case 9:
          dataType = 'Spotify Album Image (H)';
          break;
        case 10:
          dataType = 'Spotify Album Image (M)';
          break;
        case 11:
          dataType = 'Spotify Album Image (L)';
          break;
        case 12:
          dataType = 'Spotify Total Albums Results';
          break;
        case 13:
          dataType = 'Spotify Album Data';
          break;
      }
    }
    return [data.varName2, dataType];
  },

  fields: [
    'clientid',
    'clientsecret',
    'search',
    'varName',
    'info1',
    'info2',
    'info3',
    'info4',
    'resultNo',
    'storage',
    'varName2',
  ],

  html(_isEvent, data) {
    return `
<div id ="wrexdiv" style="width: 550px; height: 350px; overflow-y: scroll;">
  <div style="width: 95%; padding-top: 8px;">
    Client ID:<br>
    <textarea id="clientid" rows="2" placeholder="Write your Client ID. Get one from Spotify." style="width: 99%; font-family: monospace; white-space: nowrap; resize: none;"></textarea>
  </div>
  <div style="width: 95%; padding-top: 8px;">
    Client Secret:<br>
    <textarea id="clientsecret" rows="2" placeholder="Write your Client Secret. Get one from Spotify." style="width: 99%; font-family: monospace; white-space: nowrap; resize: none;"></textarea>
  </div>
  <div style="padding-top: 15px;">
    <div style="float: left; width: 35%;">
      Search for:<br>
      <select id="search" name="second-list" class="round" onchange="glob.onChange1(this)">
        <option value="0" selected>Track</option>
        <option value="1">Artist</option>
        <option value="2">Playlist</option>
        <option value="3">Album</option>
      </select>
    </div>
    <div id="varNameContainer" style="float: right; width: 60%;">
      Search Value:<br>
      <input id="varName" class="round" type="text">
    </div>
  </div><br><br><br>
  <div style="padding-top: 8px;">
    <div style="float: left; width: 50%;">
      Source Info:<br>
      <select id="info1" class="round">
        <option value="0" selected>Track Name</option>
        <option value="1">Track Artists Name</option>
        <option value="2">Track Artists ID</option>
        <option value="3">Track Album Name</option>
        <option value="4">Track Album ID</option>
        <option value="5">Track ID</option>
        <option value="6">Track URL</option>
        <option value="7">Track Available Markets List</option>
        <option value="8">Track Duration</option>
        <option value="9">Track Popularity</option>
        <option value="10">Is Explicit?</option>
        <option value="11">Is Local?</option>
        <option value="12">Total Tracks Results</option>
        <option value="13">Track Data</option>
      </select>
      <select id="info2" class="round">
        <option value="0" selected>Artist Name</option>
        <option value="1">Artist ID</option>
        <option value="2">Artist URL</option>
        <option value="3">Artist Followers Number</option>
        <option value="4">Artist Genres</option>
        <option value="5">Artist Popularity</option>
        <option value="6">Artist Image (High)</option>
        <option value="7">Artist Image (Medium)</option>
        <option value="8">Artist Image (Low)</option>
        <option value="9">Total Artists Results</option>
        <option value="10">Artist Data</option>
      </select>
      <select id="info3" class="round">
        <option value="0" selected>Playlist Name</option>
        <option value="1">Playlist ID</option>
        <option value="2">Playlist URL</option>
        <option value="3">Playlist Owner Name</option>
        <option value="4">Playlist Owner ID</option>
        <option value="5">Playlist Owner URL</option>
        <option value="6">Playlist Snapshot ID</option>
        <option value="7">Playlist Tracks Total</option>
        <option value="8">Playlist Image (High)</option>
        <option value="9">Playlist Image (Medium)</option>
        <option value="10">Playlist Image (Low)</option>
        <option value="11">Is Collaborative?</option>
        <option value="12">Total Playlists Results</option>
        <option value="13">Playlist Data</option>
      </select>
      <select id="info4" class="round">
        <option value="0" selected>Album Name</option>
        <option value="1">Album Artists Name</option>
        <option value="2">Album Artists ID</option>
        <option value="3">Album ID</option>
        <option value="4">Album Release Date</option>
        <option value="5">Album Type</option>
        <option value="6">Album URL</option>
        <option value="7">Album Total Tracks</option>
        <option value="8">Album Available Markets List</option>
        <option value="9">Album Image (High)</option>
        <option value="10">Album Image (Medium)</option>
        <option value="11">Album Image (Low)</option>
        <option value="12">Total Albums Results</option>
        <option value="13">Album Data</option>
      </select>
    </div>
    <div style="float: left; width: 35%; padding-left: 25px;">
      Result Number:<br>
      <select id="resultNo" class="round">
        <option value="1" selected>1st Result</option>
        <option value="2">2nd Result</option>
        <option value="3">3rd Result</option>
        <option value="4">4th Result</option>
        <option value="5">5th Result</option>
        <option value="6">6th Result</option>
        <option value="7">7th Result</option>
        <option value="8">8th Result</option>
        <option value="9">9th Result</option>
        <option value="10">10th Result</option>
      </select>
    </div>
  </div><br><br><br>
  <div>
    <div style="float: left; width: 35%; padding-top: 8px;">
      Store In:<br>
      <select id="storage" class="round" onchange="glob.variableChange(this, 'varNameContainer2')">
        ${data.variables[0]}
      </select>
    </div>
    <div id="varNameContainer2" style="float: right; width: 60%; padding-top: 8px;">
      Variable Name:<br>
      <input id="varName2" class="round" type="text"><br>
    </div>
  </div><br><br><br><br>
  <div style="float: left; width: 88%; padding-top: 8px;">
    <br>
    <p>
      To get your Client ID and Client Secret, create an App on <a href="https://developer.spotify.com/dashboard/applications">https://developer.spotify.com/dashboard/applications</a>
    </p>
  <div>
</div>`;
  },

  init() {
    const { glob, document } = this;

    glob.onChange1 = function onChange1(event) {
      const value = parseInt(event.value, 10);
      if (value === 0) {
        document.getElementById('info1').style.display = null;
        document.getElementById('info2').style.display = 'none';
        document.getElementById('info3').style.display = 'none';
        document.getElementById('info4').style.display = 'none';
      } else if (value === 1) {
        document.getElementById('info1').style.display = 'none';
        document.getElementById('info2').style.display = null;
        document.getElementById('info3').style.display = 'none';
        document.getElementById('info4').style.display = 'none';
      } else if (value === 2) {
        document.getElementById('info1').style.display = 'none';
        document.getElementById('info2').style.display = 'none';
        document.getElementById('info3').style.display = null;
        document.getElementById('info4').style.display = 'none';
      } else {
        document.getElementById('info1').style.display = 'none';
        document.getElementById('info2').style.display = 'none';
        document.getElementById('info3').style.display = 'none';
        document.getElementById('info4').style.display = null;
      }
    };

    glob.onChange1(document.getElementById('search'));
    glob.variableChange(document.getElementById('storage'), 'varNameContainer2');
  },

  async action(cache) {
    const data = cache.actions[cache.index];
    const { Actions } = this.getDBM();
    const Mods = this.getMods();
    const SpotifyWebApi = Mods.require('spotify-web-api-node');

    const clientId = this.evalMessage(data.clientid, cache);
    const clientSecret = this.evalMessage(data.clientsecret, cache);

    const searchtype = parseInt(data.search, 10);
    const value = this.evalMessage(data.varName, cache);

    const info1 = parseInt(data.info1, 10);
    const info2 = parseInt(data.info2, 10);
    const info3 = parseInt(data.info3, 10);
    const info4 = parseInt(data.info4, 10);

    const results = parseInt(data.resultNo, 10);
    const results2 = results - 1;

    const storage = parseInt(data.storage, 10);
    const varName2 = this.evalMessage(data.varName2, cache);

    if (!clientId && !clientSecret) return console.log('Please input your client credentials in Spotify Search Mod!');

    const spotifyApi = new SpotifyWebApi({
      clientId,
      clientSecret,
    });

    spotifyApi.clientCredentialsGrant().then(
      function then(data) {
        spotifyApi.setAccessToken(data.body.access_token);

        if (searchtype === 0) {
          spotifyApi.searchTracks(value, { limit: results }).then(
            (data) => {
              let result;

              switch (info1) {
                case 0:
                  result = data.body.tracks.items[results2].name; // Track Name
                  break;
                case 1:
                  result = data.body.tracks.items[results2].artists.map((a) => a.name); // Track Artists Name
                  break;
                case 2:
                  result = data.body.tracks.items[results2].artists.map((a) => a.id); // Track Artists ID
                  break;
                case 3:
                  result = data.body.tracks.items[results2].album.name; // Track Album Name
                  break;
                case 4:
                  result = data.body.tracks.items[results2].album.id; // Track Album ID
                  break;
                case 5:
                  result = data.body.tracks.items[results2].id; // Track ID
                  break;
                case 6:
                  result = data.body.tracks.items[results2].external_urls.spotify; // Track URL
                  break;
                case 7:
                  result = data.body.tracks.items[results2].available_markets; // Album Available Markets List
                  break;
                case 8:
                  result = data.body.tracks.items[results2].duration_ms; // Track Duration
                  break;
                case 9:
                  result = data.body.tracks.items[results2].popularity; // Track Popularity
                  break;
                case 10:
                  result = data.body.tracks.items[results2].explicit; // Is Explicit?
                  break;
                case 11:
                  result = data.body.tracks.items[results2].is_local; // Is Local?
                  break;
                case 12:
                  result = data.body.tracks.total; // Total Tracks Results
                  break;
                case 13:
                  result = data; // Track Data
                  break;
                default:
                  break;
              }
              Actions.storeValue(result, storage, varName2, cache);
              Actions.callNextAction(cache);
            },
            (err) => {
              console.log(err);
              Actions.callNextAction(cache);
            },
          );
        } else if (searchtype === 1) {
          spotifyApi.searchArtists(value, { limit: results }).then(
            (data) => {
              let result;

              switch (info2) {
                case 0:
                  result = data.body.artists.items[results2].name; // Artist Name
                  break;
                case 1:
                  result = data.body.artists.items[results2].id; // Artist ID
                  break;
                case 2:
                  result = data.body.artists.items[results2].external_urls.spotify; // Artist URL
                  break;
                case 3:
                  result = data.body.artists.items[results2].followers.total; // Artist Followers Number
                  break;
                case 4:
                  result = data.body.artists.items[results2].genres; // Artist Genres
                  break;
                case 5:
                  result = data.body.artists.items[results2].popularity; // Artist Popularity
                  break;
                case 6:
                  result = data.body.artists.items[results2].images[0].url; // Artist Image (High)
                  break;
                case 7:
                  result = data.body.artists.items[results2].images[1].url; // Artist Image (Medium)
                  break;
                case 8:
                  result = data.body.artists.items[results2].images[2].url; // Artist Image (Low)
                  break;
                case 9:
                  result = data.body.artists.total; // Total Artists Results
                  break;
                case 10:
                  result = data; // Artist Data
                  break;
                default:
                  break;
              }
              Actions.storeValue(result, storage, varName2, cache);
              Actions.callNextAction(cache);
            },
            (err) => {
              console.log(err);
              Actions.callNextAction(cache);
            },
          );
        } else if (searchtype === 2) {
          spotifyApi.searchPlaylists(value, { limit: results }).then(
            (data) => {
              let result;

              switch (info3) {
                case 0:
                  result = data.body.playlists.items[results2].name; // Playlist Name
                  break;
                case 1:
                  result = data.body.playlists.items[results2].id; // Playlist ID
                  break;
                case 2:
                  result = data.body.playlists.items[results2].external_urls.spotify; // Playlist URL
                  break;
                case 3:
                  result = data.body.playlists.items[results2].owner.display_name; // Playlist Owner Name
                  break;
                case 4:
                  result = data.body.playlists.items[results2].owner.id; // Playlist Owner ID
                  break;
                case 5:
                  result = data.body.playlists.items[results2].owner.external_urls.spotify; // Playlist Owner URL
                  break;
                case 6:
                  result = data.body.playlists.items[results2].snapshot_id; // Playlist Snapshot ID
                  break;
                case 7:
                  result = data.body.playlists.items[results2].tracks.total; // Playlist Tracks Total
                  break;
                case 8:
                  result = data.body.playlists.items[results2].images[0].url; // Playlist Image (High)
                  break;
                case 9:
                  result = data.body.playlists.items[results2].images[1].url; // Playlist Image (Medium)
                  break;
                case 10:
                  result = data.body.playlists.items[results2].images[2].url; // Playlist Image (Low)
                  break;
                case 11:
                  result = data.body.playlists.items[results2].collaborative; // Is Collaborative?
                  break;
                case 12:
                  result = data.body.playlists.total; // Total Playlists Results
                  break;
                case 13:
                  result = data; // Playlist Data
                  break;
                default:
                  break;
              }
              Actions.storeValue(result, storage, varName2, cache);
              Actions.callNextAction(cache);
            },
            (err) => {
              console.log(err);
              Actions.callNextAction(cache);
            },
          );
        } else if (searchtype === 3) {
          spotifyApi.searchAlbums(value, { limit: results }).then(
            (data) => {
              let result;

              switch (info4) {
                case 0:
                  result = data.body.albums.items[results2].name; // Album Name
                  break;
                case 1:
                  result = data.body.albums.items[results2].artists.map((a) => a.name); // Album Artists Name
                  break;
                case 2:
                  result = data.body.albums.items[results2].artists.map((a) => a.id); // Album Artists ID
                  break;
                case 3:
                  result = data.body.albums.items[results2].id; // Album ID
                  break;
                case 4:
                  result = data.body.albums.items[results2].release_date; // Album Release Date
                  break;
                case 5:
                  result = data.body.albums.items[results2].album_type; // Album Type
                  break;
                case 6:
                  result = data.body.albums.items[results2].external_urls.spotify; // Album URL
                  break;
                case 7:
                  result = data.body.albums.items[results2].total_tracks; // Album Total Tracks
                  break;
                case 8:
                  result = data.body.albums.items[results2].available_markets; // Album Available Markets List
                  break;
                case 9:
                  result = data.body.albums.items[results2].images[0].url; // Album Image (High)
                  break;
                case 10:
                  result = data.body.albums.items[results2].images[1].url; // Album Image (Medium)
                  break;
                case 11:
                  result = data.body.albums.items[results2].images[2].url; // Album Image (Low)
                  break;
                case 12:
                  result = data.body.albums.total; // Total Albums Results
                  break;
                case 13:
                  result = data; // Album Data
                  break;
                default:
                  break;
              }
              Actions.storeValue(result, storage, varName2, cache);
              Actions.callNextAction(cache);
            },
            (err) => {
              console.log(err);
              Actions.callNextAction(cache);
            },
          );
        } else {
          this.callNextAction(cache);
        }
      },
      (err) => {
        console.log('Something went wrong when retrieving an access token', err.message);
      },
    );
  },

  mod() {},
};
