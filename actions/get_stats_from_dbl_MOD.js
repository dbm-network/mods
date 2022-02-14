module.exports = {
  name: 'Get Bot Stats From DBL',
  displayname: 'Get Bot Stats From TopGG',
  section: 'Other Stuff',
  meta: {
    version: '2.0.11',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/get_stats_from_dbl_MOD.js',
  },

  subtitle(data) {
    const info = [
      'Invite URL',
      'GitHub Repository URL',
      'Website URL',
      'Long Description',
      'Short Description',
      'Prefix',
      'Library',
      'Avatar URL',
      'Approved On',
      'Support Server Invite URL',
      'Server Count',
      'Shard Count',
      'Vanity URL',
      'Guild ID(s)',
      'Servers on Shards',
      'Monthly Vote Count',
      'Total Vote Count',
      'Owner ID(s)',
      'Tag(s)',
      'Username',
      'Discriminator',
    ];
    return `Get Bots' ${info[parseInt(data.info, 10)]}`;
  },

  variableStorage(data, varType) {
    if (parseInt(data.storage, 10) !== varType) return;
    let dataType = 'A TopGG Stat';
    switch (parseInt(data.info, 10)) {
      case 0:
        dataType = 'Invite URL';
        break;
      case 1:
        dataType = 'GitHub Repository URL';
        break;
      case 2:
        dataType = 'Website URL';
        break;
      case 3:
        dataType = 'Long Description';
        break;
      case 4:
        dataType = 'Short Description';
        break;
      case 5:
        dataType = 'Prefix';
        break;
      case 6:
        dataType = 'Library';
        break;
      case 7:
        dataType = 'Avatar URL';
        break;
      case 8:
        dataType = 'Approved On';
        break;
      case 9:
        dataType = 'Support Server Invite URL';
        break;
      case 10:
        dataType = 'Server Count';
        break;
      case 11:
        dataType = 'Shard Count';
        break;
      case 12:
        dataType = 'Vanity URL';
        break;
      case 13:
        dataType = 'Guild ID(s)';
        break;
      case 14:
        dataType = 'Servers on Shards';
        break;
      case 15:
        dataType = 'Monthly Vote Count';
        break;
      case 16:
        dataType = 'Total Vote Count';
        break;
      case 17:
        dataType = 'Owner ID(s)';
        break;
      case 18:
        dataType = 'Tag(s)';
        break;
      case 19:
        dataType = 'Username';
        break;
      case 20:
        dataType = 'Discriminator';
        break;
      default:
        break;
    }
    return [data.varName, dataType];
  },
  fields: ['botID', 'token', 'info', 'storage', 'varName'],

  html(_isEvent, data) {
    return `
<div id="modinfo">
  <div style="float: left; width: 99%; padding-top: 8px;">
    Bots' ID (Must be ID):<br>
    <input id="botID" class="round" type="text">
  </div><br>
  <div style="float: left; width: 99%; padding-top: 8px;">
    Your TopGG Token:<br>
    <input id="token" class="round" type="text">
  </div><br>
  <div style="float: left; width: 90%; padding-top: 8px;">
    Source Info:<br>
    <select id="info" class="round">
    <option value="0">Invite URL</option>
    <option value="1">GitHub Repository URL</option>
    <option value="2">Website URL</option>
    <option value="3">Long Description</option>
    <option value="4">Short Description</option>
    <option value="5">Prefix</option>
    <option value="6">Library</option>
    <option value="7">Avatar URL</option>
    <option value="8">Approved On</option>
    <option value="9">Support Server Invite URL</option>
    <option value="10">Server Count</option>
    <option value="11">Shard Count</option>
    <option value="12">Vanity URL (Only If Certified)</option>
    <option value="13">Guild ID(s)</option>
    <option value="14">Servers on Shards (If Sending with Module)</option>
    <option value="15">Monthly Vote Count</option>
    <option value="16">Total Vote Count</option>
    <option value="17">Owner ID(s)</option>
    <option value="18">Tag(s)</option>
    <option value="19">Bots' Username</option>
    <option value="20">Bots' Discriminator</option>
  </select>
  </div><br>
  <div style="float: left; width: 35%; padding-top: 8px;">
    Store Result In:<br>
    <select id="storage" class="round" onchange="glob.variableChange(this, 'varNameContainer')">
      ${data.variables[0]}
    </select>
  </div><br><br><br><br><br>
  <div id="varNameContainer" style="float: right; display: none; width: 60%; padding-top: 8px;">
    Variable Name:<br>
    <input id="varName" class="round" type="text">
  </div><br><br><br><br>
  <div id="commentSection" style="padding-top: 8px;">
    <p>
      Some options will only work for certified or special bots. You better use some check variables to check if they exist.
      <b>Note:</b> TopGG is going to update the API and you'll need a token after the update!
    </p>
  </div>
</div>`;
  },

  init() {
    const { glob, document } = this;

    glob.variableChange(document.getElementById('storage'), 'varNameContainer');
  },

  async action(cache) {
    const data = cache.actions[cache.index];
    const botID = this.evalMessage(data.botID, cache);
    const info = parseInt(data.info, 10);
    const dblToken = this.evalMessage(data.token, cache);

    const Mods = this.getMods();
    const fetch = Mods.require('node-fetch');

    fetch(`https://top.gg/api/bots/${botID}`, {
      method: 'GET',
      headers: { Authorization: dblToken || '' },
    })
      .then((res) => res.json())
      .then((r) => {
        let result;
        switch (info) {
          case 0:
            result = r.invite;
            break;
          case 1:
            result = r.github;
            break;
          case 2:
            result = r.website;
            break;
          case 3:
            result = r.longdesc;
            break;
          case 4:
            result = r.shortdesc;
            break;
          case 5:
            result = r.prefix;
            break;
          case 6:
            result = r.lib;
            break;
          case 7:
            result = `https://cdn.discordapp.com/avatars/${botID}/${r.avatar}.png`;
            break;
          case 8:
            result = r.date;
            break;
          case 9:
            result = r.support;
            break;
          case 10:
            result = r.server_count;
            break;
          case 11:
            result = r.shard_count;
            break;
          case 12:
            result = r.vanity;
            break;
          case 13:
            result = r.guilds;
            break;
          case 14:
            result = r.shards;
            break;
          case 15:
            result = r.monthlyPoints;
            break;
          case 16:
            result = r.points;
            break;
          case 17:
            result = r.owners;
            break;
          case 18:
            result = r.tags;
            break;
          case 19:
            result = r.username;
            break;
          case 20:
            result = r.discriminator;
            break;
          default:
            break;
        }

        const storage = parseInt(data.storage, 10);
        const varName = this.evalMessage(data.varName, cache);
        this.storeValue(result, storage, varName, cache);
        this.callNextAction(cache);
      });
  },

  mod() {},
};
