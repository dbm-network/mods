module.exports = {
  name: 'Store Json From WebAPI',
  section: 'JSON Things',
  meta: {
    version: '2.1.7',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/store_json_from_webapi_MOD.js',
  },

  subtitle(data) {
    return `${data.varName}`;
  },

  variableStorage(data, varType) {
    if (parseInt(data.storage, 10) !== varType) return;
    return [data.varName, 'JSON Object'];
  },

  fields: ['token', 'user', 'pass', 'url', 'path', 'storage', 'varName', 'debugMode', 'headers', 'reUse'],

  html() {
    return `
<div id="wrexdiv" style="height: 350px; overflow-y: scroll;">
  <div style="float: left; width: 100%; padding-top: 8px;">
    <span class="dbminputlabel">WebAPI URL</span>
    <textarea id="url" class="round" style="resize: none;" type="textarea" rows="4" cols="20"></textarea>
    <p style="margin-left: 4px;">If the url is the same, json data will be used from the initial store json within the command</p>
  </div>
  <div style="float: left; width: 100%; padding-top: 16px;">
    <span class="dbminputlabel">Headers (By default 'User-Agent: Other' is applied, It's 1 per line, (<b>key:value</b>))</span>
    <textarea id="headers" class="round" placeholder="User-Agent: Other" style=" resize: none;" type="textarea" rows="4" cols="20"></textarea>
  </div>
  <div class="ui toggle checkbox" style="float: left; width: 90%; margin-top: 16px; margin-left: 10px;">
    <input type="checkbox" name="public" id="toggleAuth" onclick="glob.checkBox(this, 'auth');"></input>
    <label><font color="white">Show Authentication Options</font></label>
    <text>Show/Hide Auth Options</text>
  </div>

  <div id="authSection" style="float: left; padding-top: 16px; width: 100%;">
    <div style="float: left; width: 100%;">
      <span class="dbminputlabel">Bearer Token</span>
      <textarea id="token" class="round" placeholder="blank if none" style="width: 99%; resize: none;" type="textarea" rows="4" cols="20"></textarea>
    </div>
    <div style="float: left; padding-top: 16px; width: 100%;">
      <span class="dbminputlabel">Username</span>
      <input id="user" class="round" placeholder="blank if none" style="width: 99%; resize: none;" ></input>
    </div>
    <div style="float: left; padding-top: 16px; width: 100%;">
      <span class="dbminputlabel">Password</span>
      <input id="pass" class="round" placeholder="blank if none" style="width: 99%; resize: none;"></input>
    </div>
  </div>

  <div style="float: left; width: 100%; padding-top: 16px;">
    <div style="width: 60%;">
      <details>
        <summary>Click here for more info about: <b>JSON Path</b></summary>
        JSON Path: (Leave blank to store everything)<br>
        • Supports the usage of JSON Path (Regex)<br>
        • You don't need to add the x. of JSON Path<br>
        <a href="http://goessner.net/articles/JsonPath/index.html#e2">More info here</a>
      </details>
    </div>
  </div>

  <div style="float: left; width: 95%;">
    <div style="padding-top: 16px;">
      <span class="dbminputlabel">JSON Path</span>
      <input id="path" class="round" style="width: 75%;" type="text"></input>
    </div>

    <store-in-variable dropdownLabel="Store In" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></store-in-variable>
  </div>

  <div style="float: left; width: 95%; padding-top: 16px;">
    <div style="float: left; width: 47.5%;">
      <label for="reUse"><span class="dbminputlabel">Re-Use Previously Stored</span></label>
      <select id="reUse" class="round" onchange="glob.disallowAlert(this)">
        <option value="1" selected>Allow</option>
        <option value="0">Disallow</option>
      </select>
      <p style="margin-left: 4px;">Toggles re-use of previously stored JSON from same URL.</p>
    </div>
    <div style="float: right; width: 47.5%;">
      <label for="debugMode"><span class="dbminputlabel">Debug Mode</span></label>
      <select id="debugMode" class="round">
        <option value="1">Enabled</option>
        <option value="0" selected>Disabled</option>
      </select>
      <p style="margin-left: 4px;">Enables printing to console, disable to remove all messages. Turn on to see errors.</p>
    </div>
  </div>
</div>
</div>
  <style>
    details {
      border: 1px solid #aaa;
      border-radius: 4px;
      padding: 0.5em 0.5em 0;
}

    summary {
      font - weight: bold;
    margin: -0.5em -0.5em 0;
    padding: 0.5em;
}

    details[open] {
      padding: 0.5em;
}

    details[open] summary {
      border - bottom: 1px solid #aaa;
    margin-bottom: 0.5em;
}
</style>`;
  },

  init() {
    const { glob, document } = this;

    glob.checkBox = function checkBox(element, type) {
      if (type === 'auth') {
        document.getElementById('authSection').style.display = element.checked ? '' : 'none';
        document.getElementById('showAuth').value = element.checked ? '1' : '0';
      }
    };

    glob.disallowAlert = function disallowAlert(element) {
      if (element.value === '0') {
        alert('Disabling this could lead to you being banned or rate limited by APIs, please be careful.');
      }
    };

    glob.checkBox(document.getElementById('toggleAuth'), 'auth');
  },

  async action(cache) {
    const data = cache.actions[cache.index];
    const { Actions } = this.getDBM();
    const Mods = this.getMods();
    const fetch = Mods.require('node-fetch', '2');
    const debugMode = parseInt(data.debugMode, 10);
    const storage = parseInt(data.storage, 10);
    const varName = this.evalMessage(data.varName, cache);
    let url = this.evalMessage(data.url, cache);
    const path = this.evalMessage(data.path, cache);
    const token = this.evalMessage(data.token, cache);
    const user = this.evalMessage(data.user, cache);
    const reUse = parseInt(data.reUse, 10);
    const pass = this.evalMessage(data.pass, cache);
    const headers = this.evalMessage(data.headers, cache);

    // if it fails the check, try to re-encode the url
    if (!Mods.checkURL(url)) {
      url = encodeURI(url);
    }

    if (Mods.checkURL(url)) {
      try {
        // eslint-disable-next-line no-inner-declarations
        function storeData(error, res, jsonData) {
          const statusCode = res ? res.statusCode : 200;
          let errorJson;
          if (error) {
            errorJson = JSON.stringify({ error, statusCode });
            Actions.storeValue(errorJson, storage, varName, cache);

            if (debugMode) {
              console.error(`WebAPI: Error: ${errorJson} stored to: [${varName}]`);
            }
          } else if (path) {
            const outData = Mods.jsonPath(jsonData, path);

            if (debugMode) console.dir(outData);

            try {
              JSON.parse(JSON.stringify(outData));
            } catch (error) {
              errorJson = JSON.stringify({ error, statusCode, success: false });
              Actions.storeValue(errorJson, storage, varName, cache);
              if (debugMode) console.error(error.stack ? error.stack : error);
            }

            const outValue = eval(JSON.stringify(outData), cache);

            if (!outData) {
              errorJson = JSON.stringify({
                error: 'No JSON Data Returned',
                statusCode: 0,
              });
              Actions.storeValue(errorJson, storage, varName, cache);
              if (debugMode) {
                console.error(`WebAPI: Error: ${errorJson} NO JSON data returned. Check the URL: ${url}`);
              }
              // eslint-disable-next-line no-eq-null
            } else if (outData.success != null) {
              errorJson = JSON.stringify({ error, statusCode, success: false });
              Actions.storeValue(errorJson, storage, varName, cache);
              if (debugMode) {
                console.log(`WebAPI: Error Invalid JSON, is the Path and/or URL set correctly? [${path}]`);
              }
              // eslint-disable-next-line no-eq-null
            } else if (outValue.success != null || !outValue) {
              errorJson = JSON.stringify({ error, statusCode, success: false });
              Actions.storeValue(errorJson, storage, varName, cache);
              if (debugMode) {
                console.log(`WebAPI: Error Invalid JSON, is the Path and/or URL set correctly? [${path}]`);
              }
            } else {
              Actions.storeValue(outValue, storage, varName, cache);
              Actions.storeValue(jsonData, 1, url, cache);
              Actions.storeValue(url, 1, `${url}_URL`, cache);
              if (debugMode) {
                console.log(`WebAPI: JSON Data values starting from [${path}] stored to: [${varName}]`);
              }
            }
          } else {
            if (debugMode) console.dir(jsonData);
            Actions.storeValue(jsonData, storage, varName, cache);
            Actions.storeValue(jsonData, 1, url, cache);
            Actions.storeValue(url, 1, `${url}_URL`, cache);
            if (debugMode) {
              console.log(`WebAPI: JSON Data Object stored to: [${varName}]`);
            }
          }
          Actions.callNextAction(cache);
        }

        const oldUrl = this.getVariable(1, `${url}_URL`, cache);

        if (url === oldUrl && reUse === 1) {
          let jsonData;
          let error;
          const res = { statusCode: 200 };

          try {
            jsonData = this.getVariable(1, url, cache);
          } catch (err) {
            error = err;
          }

          if (debugMode) {
            console.log(
              'WebAPI: Using previously stored json data from the initial store json action within this command.',
            );
          }

          storeData(error, res, jsonData);
        } else {
          const setHeaders = {};

          // set default required header
          setHeaders['User-Agent'] = 'Other';

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
              } else if (debugMode) {
                console.error(
                  `WebAPI: Error: Custom Header line ${lines[i]} is wrongly formatted. You must split the key from the value with a colon (:)`,
                );
              }
            }
          }
          if (token) setHeaders.Authorization = `Bearer ${token}`;
          if (user && pass) {
            setHeaders.Authorization = `Basic ${Buffer.from(`${user}:${pass}`).toString('base64')}`;
          }

          try {
            const response = await fetch(url, { headers: setHeaders });
            const json = await response.json();
            storeData('', response, json);
          } catch (err) {
            if (debugMode) console.error(err.stack || err);
          }
        }
      } catch (err) {
        if (debugMode) console.error(err.stack || err);
      }
    } else if (debugMode) console.error(`URL [${url}] Is Not Valid`);
  },

  mod() {},
};
