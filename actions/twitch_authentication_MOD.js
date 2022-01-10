module.exports = {
  name: 'Twitch Authentication',
  section: 'Other Stuff',
  meta: {
    version: '2.0.11',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/twitch_authentication_MOD.js',
  },

  subtitle(data) {
    if (data.client_id) {
      return `Authentication for client id : ${data.client_id}`;
    }
    return 'Authentication';
  },

  variableStorage(data, varType) {
    if (parseInt(data.storage, 10) !== varType) return;
    let dataType;
    switch (parseInt(data.info, 10)) {
      case 0:
        dataType = 'Access Token';
        break;
      case 1:
        dataType = 'Expires in Seconds';
        break;
      case 2:
        dataType = 'Authentication Object';
        break;
    }
    return [data.varName, dataType];
  },

  fields: ['client_id', 'client_secret', 'info', 'storage', 'varName', 'debug'],

  html(_isEvent, data) {
    return `
<div style="padding-top: 8px;">
  <div style="float: left; width: 104%;">
    Client Id:<br>
    <input id="client_id" class="round" type="text">
  </div>
</div><br><br><br>
<div style="padding-top: 8px;">
  <div style="float: left; width: 104%;">
    Client Secret:<br>
    <input id="client_secret" class="round" type="text">
  </div>
</div><br><br><br>
<div style="padding-top: 8px;">
  <div style="float: left; width: 70%;">
    Info:<br>
    <select id="info" class="round"><br>
      <option value="0" selected>Access Token</option>
      <option value="1">Expires In</option>
      <option value="1">Authentication Object</option>
    </select>
  </div>
<div><br><br><br>
<div style="padding-top: 8px;">
  <div style="float: left; width: 35%;">
    Store In:<br>
    <select id="storage" class="round">
      ${data.variables[1]}
    </select>
  </div>
  <div style="float: right; width: 60%;">
    Variable Name:<br>
    <input id="varName" class="round" type="text"><br>
  </div>
</div>
<input style="display: none" id="debug" value="true">`;
  },

  init() {},

  async action(cache) {
    const data = cache.actions[cache.index];
    const Mods = this.getMods();
    const fetch = Mods.require('node-fetch');
    const clientID = this.evalMessage(data.client_id, cache);
    const clientSecret = this.evalMessage(data.client_secret, cache);
    const info = parseInt(data.info, 10);
    const url = `https://id.twitch.tv/oauth2/token?client_id=${clientID}&client_secret=${clientSecret}&grant_type=client_credentials&scope=user:edit+user:read:email`;
    const oldUrl = this.getVariable(1, `${url}_URL`, cache);

    function getInfo(json) {
      let result;
      switch (info) {
        case 0:
          result = json.access_token;
          break;
        case 1:
          result = json.expires_in;
          break;
        case 2:
          result = json;
          break;
        default:
          break;
      }

      if (result) {
        const storage = parseInt(data.storage, 10);
        const varName = this.evalMessage(data.varName, cache);
        this.storeValue(result, storage, varName, cache);
        if (data.debug)
          console.log(
            "Twitch Authentication: Reminder: Please do save variable, don't request access token too many times",
          );
      }
      this.callNextAction(cache);
    }

    if (oldUrl && oldUrl === url) {
      const json = this.getVariable(1, url, cache);
      getInfo.call(this, json);
    } else {
      const res = await fetch(url, { method: 'POST' });
      if (res.ok) {
        const json = await res.json();
        if (json.error) {
          console.error(json);
        } else {
          this.storeValue(json, 1, url, cache);
          this.storeValue(url, 1, `${url}_URL`, cache);
          getInfo.call(this, json);
        }
      } else {
        console.error('Twitch Authentication: something wrong, please try again.');
      }
    }
  },

  mod() {},
};
