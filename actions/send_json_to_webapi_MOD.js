module.exports = {
  name: 'Send Json to WebAPI',
  section: 'JSON Things',
  meta: {
    version: '2.1.6',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/send_json_to_webapi_MOD.js',
  },

  subtitle(data) {
    return `Store: ${data.varName} DebugMode: ${data.debugMode === '1' ? 'Enabled' : 'Disabled'}`;
  },

  variableStorage(data, varType) {
    if (parseInt(data.storage, 10) !== varType) return;
    return [data.varName, 'JSON Object'];
  },

  fields: [
    'hideUrl',
    'debugMode',
    'postUrl',
    'postJson',
    'storage',
    'varName',
    'token',
    'user',
    'pass',
    'headers',
    'method',
  ],

  html(_isEvent, data) {
    return `
<div id ="wrexdiv" style="width: 550px; height: 350px; overflow-y: scroll;">
  <div style="padding: 10px;" class="ui toggle checkbox">
    <input type="checkbox" id="toggleAuth" onclick='document.getElementById("authSection").style.display = this.checked  ? "block" : "none";'>
    <label><font color="white" style="font-size: 90%;">Show URL & Connection Options</font></label>
    <text style="font-size: 60%;">Show/Hide the Url and Connection Options</text>
  </div><br>
  <div id="authSection" style="display: none; ">
    WebAPI Url:<br>
    <input id="postUrl" class="round" type="text">
    <text style="font-size: 60%">The url needs to accept&nbsp&nbsp<code style="background-color: black">application/json</code></text><br>
    Headers: (By default 'User-Agent: Other' is applied, It's 1 per line, (<b>key:value</b>))<br>
    <textarea id="headers" class="round" placeholder="User-Agent: Other" style="width: 99%; resize: none;" type="textarea" rows="4" cols="20"></textarea>
    <text style="font-size: 60%">If the API requires headers or something thats not included on the form, use headers!</text><br>
    Bearer Token:<br>
    <textarea id="token" class="round" placeholder="blank if none" style="width: 99%; resize: none;" type="textarea" rows="4" cols="20"></textarea>
    <text style="font-size: 60%">If the API requires a bearer token, input it in the field above!</text><br>
    Username:<br>
    <input id="user" class="round"  placeholder="blank if none" style="width: 99%; resize: none;" ><br>
    Password:<br>
    <input id="pass" class="round"  placeholder="blank if none"  style="width: 99%; resize: none;" >
    <text style="font-size: 60%">If the API requires basic authentication, use username and password! </text><br>
  </div>
  <div style="padding-top: 4px;">
    Method:<br>
    <select id="method" class="round" style="width: 15%;">
      <option value="POST" selected>Post</option>
      <option value="PATCH">Patch</option>
      <option value="PUT">Put</option>
      <option value="DELETE">Delete</option>
    </select><br>
    Json To Post:<br>
    <textarea id="postJson" rows="13" style="width: 99%; white-space: nowrap; resize: none;"></textarea>
    <text style="font-size: 60%">This must parse into Json or be Json!.<br>
  </div><br>
  <div>
    <div style="float: left; width: 35%;">
      Store Response In:<br>
      <select id="storage" class="round" onchange="glob.variableChange(this, 'varNameContainer')">
        ${data.variables[0]}
      </select>
    </div>
    <div id="varNameContainer" style="display: none; float: right; width: 60%;">
      Response Variable Name: <br>
      <input id="varName" class="round" type="text">
    </div><br><br><br><br>
    <div>
      Debug Mode (Print More Info To Console):<br>
      <select id="debugMode" class="round" style="width: 45%">
        <option value="0" selected>Disabled</option>
        <option value="1">Enabled</option>
      </select><br>
    </div>
    <div>
      <p>
        <u>Note:</u><br>
        Enables printing to console, disable to remove all messages. Turn on to see errors.<br>
        Use <b>Parse From Stored Json</b> to parse the response into a variable!<br><br>
      </p>
    </div>
  </div>
<style>
  .embed {
    position: relative;
  }

  .embedinfo {
    background: rgba(46,48,54,.45) fixed;
    border: 1px solid hsla(0,0%,80%,.3);
    padding: 10px;
    margin:0 4px 0 7px;
    border-radius: 0 3px 3px 0;
  }

  embedleftline {
    background-color: #eee;
    width: 4px;
    border-radius: 3px 0 0 3px;
    border: 0;
    height: 100%;
    margin-left: 4px;
    position: absolute;
  }

  span {
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  }

  span.embed-auth {
    color: rgb(255, 255, 255);
  }

  span.embed-desc {
    color: rgb(128, 128, 128);
  }

  span.wrexlink {
    color: #99b3ff;
    text-decoration:underline;
    cursor:pointer;
  }

  span.wrexlink:hover {
    color:#4676b9;
  }
</style>`;
  },

  init() {
    const { glob, document } = this;

    const wrexlinks = document.getElementsByClassName('wrexlink');
    for (let x = 0; x < wrexlinks.length; x++) {
      const wrexlink = wrexlinks[x];
      const url = wrexlink.getAttribute('data-url');
      if (url) {
        wrexlink.setAttribute('title', url);
        wrexlink.addEventListener('click', (e) => {
          e.stopImmediatePropagation();
          console.log(`Launching URL: [${url}] in your default browser.`);
          require('child_process').execSync(`start ${url}`);
        });
      }
    }

    glob.variableChange(document.getElementById('storage'), 'varNameContainer');
  },

  async action(cache) {
    const data = cache.actions[cache.index];
    const { Actions } = this.getDBM();

    const Mods = this.getMods();
    const fetch = require('node-fetch');

    let url = this.evalMessage(data.postUrl, cache);
    const method = this.evalMessage(data.method, cache);
    const token = this.evalMessage(data.token, cache);
    const user = this.evalMessage(data.user, cache);
    const pass = this.evalMessage(data.pass, cache);
    const headers = this.evalMessage(data.headers, cache);

    const varName = this.evalMessage(data.varName, cache);
    const storage = parseInt(data.storage, 10);
    const debugMode = parseInt(data.debugMode, 10);

    const postJson = this.evalMessage(data.postJson, cache);

    if (!Mods.checkURL(url)) url = encodeURI(url);

    if (Mods.checkURL(url)) {
      if (postJson) {
        // Test the json
        try {
          JSON.parse(JSON.stringify(postJson));
        } catch (error) {
          const errorJson = JSON.stringify({
            error,
            statusCode: 0,
            success: false,
          });
          if (debugMode) console.error(error.stack || error);

          return this.storeValue(errorJson, storage, varName, cache);
        }

        const setHeaders = {};

        // set default required header
        setHeaders['User-Agent'] = 'Other';
        setHeaders['Content-Type'] = 'application/json';

        // if user or pass, apply it to headers
        if (user || pass) setHeaders.Authorization = `Basic ${Buffer.from(`${user}:${pass}`).toString('base64')}`;

        // if token, apply it to headers
        if (token) setHeaders.Authorization = `Bearer ${token}`;

        // Because headers are a dictionary ;)
        if (headers) {
          const lines = String(headers).split('\n');
          for (let i = 0; i < lines.length; i++) {
            const header = lines[i].split(':');

            if (lines[i].includes(':') && header.length > 0) {
              const key = header[0] || 'Unknown';
              const value = header[1] || 'Unknown';
              setHeaders[key] = value;

              if (debugMode) console.log(`Applied Header: ${lines[i]}`);
            } else if (debugMode)
              console.error(
                `WebAPI: Error: Custom Header line ${lines[i]} is wrongly formatted. You must split the key from the value with a colon (:)`,
              );
          }
        }

        const jsonData = await fetch(url, { method, body: postJson, headers: setHeaders }).then((r) => r.json());

        try {
          if (jsonData) {
            Actions.storeValue(jsonData, storage, varName, cache);

            if (debugMode) {
              console.log(`WebAPI: JSON Data Response value stored to: [${varName}]`);
              console.log('Response (Disable DebugMode to stop printing the response data to the console):\r\n');
              console.log(JSON.stringify(jsonData, null, 4));
            }
          } else {
            const errorJson = JSON.stringify({ statusCode: 0 });
            Actions.storeValue(errorJson, storage, varName, cache);

            if (debugMode) console.error(`WebAPI: Error: ${errorJson} stored to: [${varName}]`);
          }

          Actions.callNextAction(cache);
        } catch (err) {
          if (debugMode) console.error(err.stack || err);
        }
      }
    } else if (debugMode) console.error(`URL [${url}] Is Not Valid`);
  },

  mod() {},
};
