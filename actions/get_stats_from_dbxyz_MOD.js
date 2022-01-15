module.exports = {
  name: 'Get Bot Stats From DBXYZ',
  displayName: 'Get Bot Stats From Discord Boats',
  section: 'Other Stuff',
  meta: {
    version: '2.0.11',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/get_stats_from_dbxyz_MOD.js',
  },

  subtitle(data) {
    const info = [
      'Bot ID',
      'Bot Name',
      'Prefix',
      'Bots Lib',
      'Server Count',
      'Short Description',
      'Description',
      'Avatar',
      'Owner ID',
      'Owner Name',
      'Invite',
      'Support Server',
      'Website',
      'Waiting For Review',
      'Certified?',
      'Vanity Url',
    ];
    return `Get Bots' ${info[parseInt(data.info, 10)]}`;
  },

  variableStorage(data, varType) {
    if (parseInt(data.storage, 10) !== varType) return;
    let dataType = 'A Discord Boats Stat';
    switch (parseInt(data.info, 10)) {
      case 0:
        dataType = 'Bot ID';
        break;
      case 1:
        dataType = 'Bot Name';
        break;
      case 2:
        dataType = 'Bot Prefix';
        break;
      case 3:
        dataType = 'Library';
        break;
      case 4:
        dataType = 'Server Count';
        break;
      case 5:
        dataType = 'Short Description';
        break;
      case 6:
        dataType = 'Long Description';
        break;
      case 7:
        dataType = 'Avatar';
        break;
      case 8:
        dataType = 'Bot Owner ID';
        break;
      case 9:
        dataType = 'Bot Owner Name';
        break;
      case 10:
        dataType = 'Bot Invite';
        break;
      case 11:
        dataType = 'Support Server';
        break;
      case 12:
        dataType = 'Website';
        break;
      case 13:
        dataType = 'Waiting For Approval?';
        break;
      case 14:
        dataType = 'Certified?';
        break;
      case 15:
        dataType = 'Vanity Url';
        break;
      default:
        break;
    }
    return [data.varName, dataType];
  },
  fields: ['botID', 'info', 'storage', 'varName'],

  html(isEvent, data) {
    return `
<div id="modinfo">
  <div style="float: left; width: 99%; padding-top: 8px;">
    Bots' ID (Must be ID):<br>
    <input id="botID" class="round" type="text">
  </div><br>
  <div style="float: left; width: 90%; padding-top: 8px;">
    Source Info:<br>
    <select id="info" class="round">
    <option value="0">Bot ID</option>
    <option value="1">Bot Name</option>
    <option value="2">Bot Prefix</option>
    <option value="3">Library</option>
    <option value="4">Server Count</option>
    <option value="5">Short Description</option>
    <option value="6">Long Description</option>
    <option value="7">Avatar</option>
    <option value="8">Owner ID</option>
    <option value="9">Owner Name</option>
    <option value="10">Bots Invite</option>
    <option value="11">Support Url</option>
    <option value="12">Website</option>
    <option value="13">Waiting For Approval?</option>
    <option value="14">Certified?</option>
    <option value="15">Vanity Url (Only if certified)</option>
  </select>
  </div><br>
  <div style="float: left; width: 35%; padding-top: 8px;">
    Store Result In:<br>
    <select id="storage" class="round" onchange="glob.variableChange(this, 'varNameContainer')">
      ${data.variables[0]}
    </select>
  </div><br><br><br>
  <div id="varNameContainer" style="float: right; display: none; width: 60%; padding-top: 8px;">
    Variable Name:<br>
    <input id="varName" class="round" type="text">
  </div><br><br><br><br>
  <div id="commentSection" style="padding-top: 8px;">
    <p>
    Some options will only work for certified or special bots. You better use some check variables to check if they exist.
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

    const Mods = this.getMods();
    const sf = Mods.require('snekfetch');

    sf.get(`https://discord.boats/api/bot/${botID}`)
      .then((r) => {
        let result;
        switch (info) {
          case 0:
            result = r.body.id;
            break;
          case 1:
            result = r.body.name;
            break;
          case 2:
            result = r.body.prefix;
            break;
          case 3:
            result = r.body.lib;
            break;
          case 4:
            result = r.body.server_count;
            break;
          case 5:
            result = r.body.shortDesc;
            break;
          case 6:
            result = r.body.desc;
            break;
          case 7:
            result = `https://cdn.discordapp.com/avatars/${botID}/${r.body.avatar}.png`;
            break;
          case 8:
            result = r.body.ownerid;
            break;
          case 9:
            result = r.body.ownername;
            break;
          case 10:
            result = r.body.invite;
            break;
          case 11:
            result = r.body.discord;
            break;
          case 12:
            result = r.body.website;
            break;
          case 13:
            result = r.body.inQueue;
            break;
          case 14:
            result = r.body.certified;
            break;
          case 15:
            result = r.body.vanity_url;
            break;
          default:
            break;
        }

        if (result !== undefined) {
          const storage = parseInt(data.storage, 10);
          const varName = this.evalMessage(data.varName, cache);
          this.storeValue(result, storage, varName, cache);
        }
        this.callNextAction(cache);
      })
      .catch((e) => {
        console.log(`Get Stats From Discord Boats Error:\n${e.stack || e}`);
      });
  },

  mod() {},
};
