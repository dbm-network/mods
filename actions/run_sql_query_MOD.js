module.exports = {
  name: 'Run SQL Query',
  section: 'Other Stuff',
  meta: {
    version: '2.0.11',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/run_sql_query_MOD.js',
  },

  variableStorage(data, varType) {
    if (parseInt(data.storage, 10) !== varType) return;
    return [data.varName, 'JSON Object'];
  },

  subtitle(data) {
    let sub = '';
    if (data.store_source_conn_storage !== 0) {
      sub += 'C: Stored ';
    }

    if (data.query) {
      sub += `Q: ${data.query}`;
    }

    if (data.path) {
      sub += `P: ${data.path}`;
    }

    if (data.storage > 0) {
      const storage = ['', 'Temp', 'Server', 'Global'];
      sub += `${storage[parseInt(data.storage, 10)]} :${data.varName}`;
    }

    return sub;
  },

  fields: [
    'storage',
    'stringifyOutput',
    'varName',
    'hostname',
    'port',
    'username',
    'password',
    'database',
    'query',
    'path',
    'otype',
    'source_conn_storage',
    'source_conn_varName',
    'store_source_conn_storage',
    'store_source_conn_varName',
    'debugMode',
  ],

  html(_isEvent, data) {
    return `
<div id="wrexdiv" style="width: 550px; height: 350px; overflow-y: scroll;">
  <div>
    <p>
      With this mod you can run SQL queries using MySQL, MsSQL,
      postgres, and SQLite.
    </p>
    <p>
      <u><span class="wrexlink" data-url="https://www.w3schools.com/sql/">W3 Schools SQL Tutorial</span></u><br />
      <u><span class="wrexlink" data-url="https://tutorialzine.com/2016/01/learn-sql-in-20-minutes">Learn SQL In 20 Mins</span></u><br />
    </p>
  </div><br />
  <div id="getSource">
    If this is selected, it will use a stored connection
    instead!<br />
    <div style="float: left; width: 35%;">
      Source Connection:<br />
      <select id="source_conn_storage" class="round" onchange="glob.variableChange(this, 'varNameContainer2')">
        ${data.variables[0]}
      </select><br />
    </div>
    <div id="varNameContainer2" style="display: ; float: right; width: 60%;">
      Variable Name:<br />
      <input id="source_conn_varName" class="round" type="text" />
    </div><br /><br /><br /><br />
  </div>
  <div style="margin-left: 5px;" class="ui toggle checkbox">
    <input type="checkbox" name="public" id="toggleAuth" onclick='document.getElementById("authSection").style.display = this.checked ? "" : "none";' />
    <label><font color="white">Show Connection Options</font></label>
    Show/Hide Connection Options.<br />
    Will be disabled if above connection is selected
  </div>
  <div id="authSection" style="display: none;"><br />
    <div class="ui inverted column stackable center">
      <div class="four wide column"></div>
        <form class="ui six wide column form segment">
          <div class="ui form">
            <div class="field">
              <label>Type</label>
              <select id="otype" class="ui search dropdown round">
                <option value="0" selected="selected">mysql</option>
                <option value="1">postgres</option>
                <option value="2">mssql</option>
                <option value="3">sqlite</option>
              </select>
            </div>
            <div id="auth">
              <div class="two fields">
                <div class="field">
                  <label>Hostname</label>
                  <input id="hostname" placeholder="localhost" type="text" />
                </div>
                <div class="field">
                  <label>Port</label>
                  <input id="port" placeholder="3311" type="text" />
                </div>
              </div>
              <div class="two fields">
                <div class="field">
                  <label>Username</label>
                  <input id="username"placeholder="root" type="text" />
                </div>
                <div class="field">
                  <label>Password</label>
                  <input id="password" placeholder="password" type="text" />
                </div>
              </div>
            </div>
            <div class="field">
              <label>Database Path</label>
              <input id="database" placeholder="dbm" type="text" />
            </div>
              <div id="checkSection" class="tiny ui labeled button" tabindex="0">
                <div id="checkConnection" class="ui button">
                  Check
                </div>
                <a id="checkConnection_lbl" class="ui basic label yellow">Ready</a>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div><br />
        <label for="query">Query String</label>
        <textarea id="query" class="round" placeholder="SELECT * FROM 'users'" style="width: 94%; resize: none;" type="textarea" rows="8" cols="19"></textarea><br /><br />
      </div>
      JSON Path: (Leave blank to store everything) Supports the usage of JSON Path<br>
      More info here
      <u><span class="wrexlink" data-url="http://goessner.net/articles/JsonPath/index.html#e2">JSON Path</span></u><br>
      <input id="path" class="round"; style="width: 94%;" type="text"><br><br><br>
      <div style="float: left; width: 35%;">
        Store Results In:<br />
        <select id="storage" class="round" onchange="glob.variableChange(this, 'varNameContainer')">
          ${data.variables[0]}
        </select><br />
      </div>
      <div id="varNameContainer" style="display: ; float: right; width: 60%;">
        Variable Name:<br />
        <input id="varName" class="round" type="text" /><br />
      </div><br><br><br><br>
      <div id="storeSource"><br />
        Store the connection to a variable to save connections to the database.<br>
        Not used if Source connection is set.<br />
        <div style="float: left; width: 35%;">
          Store Source Connection:<br />
          <select id="store_source_conn_storage" class="round" onchange="glob.variableChange(this, 'varNameContainer3')">
            ${data.variables[0]}
          </select>
        </div>
        <div id="varNameContainer3" style="display: ; float: right; width: 60%;">
          Variable Name:<br />
          <input id="store_source_conn_varName" class="round" type="text" />
        </div>
      </div><br /><br /><br /><br /><br />
      <div style="float: left; width: 35%;">
        Debug Mode: (Enable to see verbose printing in the bot console)<br />
        <select id="debugMode" class="round">
          <option value="1" selected="selected">Enabled</option>
          <option value="0">Disabled</option>
        </select>
      </div><br /><br /><br /><br /><br /><br />
      <div style="float: left; width: 35%;">
        Stringify Output: (Stringify the results into chat)<br />
        Enable this to not show [Object object] in chat
        It Should be disabled for checking Conditions.<br />
      <select id="stringifyOutput" class="round">
        <option value="1">Enabled</option>
        <option value="0" selected="selected">Disabled</option>
      </select>
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

    function getType(key) {
      switch (key) {
        case '0':
          return 'mysql';
        case '1':
          return 'postgres';
        case '2':
          return 'mssql';
        case '3':
          return 'sqlite';
        default:
          return 'mysql';
      }
    }

    try {
      const type = document.getElementById('otype').value;
      const hostname = document.getElementById('hostname').value;
      const port = document.getElementById('port').value;
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      const database = document.getElementById('database').value;

      document.getElementById('checkConnection').onclick = function onclick() {
        const Sequelize = require('sequelize');

        const options = {
          host: hostname || 'localhost',
          port: port || '3311',
          dialect: getType(type) || 'sqlite',
          operatorsAliases: false,
          pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000,
          },
        };

        const sequelize = new Sequelize(
          database || 'database',
          username || 'username',
          password || 'password',
          options,
        );

        document.getElementById('checkConnection_lbl').setAttribute('class', 'ui basic label yellow');
        document.getElementById('checkConnection_lbl').innerHTML = 'Checking...';

        function isValid(bool, message = false) {
          document
            .getElementById('checkConnection_lbl')
            .setAttribute('class', `ui basic label ${bool ? 'green' : 'red'}`);
          document.getElementById('checkConnection_lbl').innerHTML =
            (bool ? 'Valid' : 'Invalid') + (message ? `: ${message}` : '');
        }

        sequelize
          .authenticate()
          .then(() => isValid(true))
          .catch((err) => isValid(false, err));
      };

      // to show/hide certian connection options if sqllite is selected
      document.getElementById('otype').onchange = function onchange(evt) {
        const lite = evt.target.value === '3';
        document.getElementById('auth').style.display = lite ? 'none' : '';
        document.getElementById('showPath').style.display = lite ? '' : 'none';
        document.getElementById('database').setAttribute('placeholder', lite ? './mydb.sql' : 'dbm');
      };
      document
        .getElementById('database')
        .setAttribute('placeholder', document.getElementById('otype').value === '3' ? './mydb.sql' : 'dbm');

      // interactive links
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
    } catch (error) {
      // write any init errors to errors.txt in dbms' main directory
      // eslint-disable-next-line no-undef
      alert(
        `[Run SQL Query] Error: \n\n ${error.message}\n\n Check \n ''${require('path').resolve(
          'dbmmods_dbm_errors.txt',
        )}' for more details.`,
      );
      require('fs').appendFileSync(
        'dbmmods_dbm_errors.txt',
        `${new Date().toUTCString()} : ${error.stack ? error.stack : error}\n\n`,
      );
    }

    glob.variableChange(document.getElementById('storage'), 'varNameContainer');
    glob.variableChange(document.getElementById('source_conn_storage'), 'varNameContainer2');
    glob.variableChange(document.getElementById('store_source_conn_storage'), 'varNameContainer3');
  },

  async action(cache) {
    // fields: ["storage", "varName", "hostname", "port", "username", "password", "database", "query", "otype",
    // "source_conn_storage", "storage_conn_varName", "store_source_conn_storage", "store_storage_conn_varName", "debugMode"],

    const data = cache.actions[cache.index];

    const sourceConnStorage = parseInt(data.source_conn_storage, 10);
    const sourceConnVarName = this.evalMessage(data.source_conn_varName, cache);

    const storeSourceConnStorage = parseInt(data.store_source_conn_storage, 10);
    const storeSourceConnVarName = this.evalMessage(data.store_source_conn_varName, cache);

    // 0=mysql, 1=postgres, 2=mssql, 3=sqllite
    const type = data.otype;
    const hostname = this.evalMessage(data.hostname, cache);
    const port = this.evalMessage(data.port, cache);
    const username = this.evalMessage(data.username, cache);
    const password = this.evalMessage(data.password, cache);
    const database = this.evalMessage(data.database, cache);
    const query = this.evalMessage(data.query, cache);
    const path = this.evalMessage(data.path, cache);
    const varName = this.evalMessage(data.varName, cache);

    const storage = parseInt(data.storage, 10);
    const DEBUG = parseInt(data.debugMode, 10);
    const stringifyOutput = parseInt(data.stringifyOutput, 10);

    const Mods = this.getMods();
    function getType(key) {
      let res;
      switch (key) {
        case '0':
          res = 'mysql';
          Mods.require('mysql2');
          break;
        case '1':
          res = 'postgres';
          Mods.require('pg-hstore');
          break;
        case '2':
          res = 'mssql';
          Mods.require('tedious');
          break;
        case '3':
          res = 'sqlite';
          Mods.require('sqlite3');
          break;
        default:
          res = 'sqlite';
          Mods.require('sqlite3');
          break;
      }
      return res;
    }

    try {
      const Sequelize = Mods.require('sequelize');

      const options = {
        host: hostname || 'localhost',
        port: port || '3311',
        dialect: getType(type) || 'sqlite',
        pool: {
          max: 5,
          min: 0,
          acquire: 30000,
          idle: 10000,
        },
      };

      if (DEBUG === 0) {
        options.logging = false;
      }

      if (getType(type) === 'sqlite') options.storage = require('path').resolve(database) || 'database.sqlite';

      let sequelize;
      if (sourceConnStorage > 0 && sourceConnVarName && storeSourceConnStorage === 0) {
        const storedConnection = this.getVariable(sourceConnStorage, sourceConnVarName, cache);
        sequelize = storedConnection && storedConnection.sequelize;
        if (sequelize) {
          if (DEBUG)
            console.log(
              `Using stored Connection for host '${storedConnection.hostname}:${storedConnection.port}', using database '${storedConnection.database}'`,
            );
        } else {
          sequelize = new Sequelize(database || 'database', username || 'username', password || 'password', options);
        }
      } else {
        sequelize = new Sequelize(database || 'database', username || 'username', password || 'password', options);
      }

      sequelize
        .authenticate()
        .then(() => {
          if (storeSourceConnStorage > 0 && storeSourceConnVarName && sourceConnStorage === 0) {
            if (sequelize) {
              const storedConnection = {
                hostname,
                port,
                database,
                sequelize,
              };
              if (DEBUG)
                console.log(
                  `Storing connection for host '${storedConnection.hostname}:${storedConnection.port}' using database '${storedConnection.database}'`,
                );
              this.storeValue(storedConnection, storeSourceConnStorage, storeSourceConnVarName, cache);
            }
          }
          if (query) {
            sequelize
              .query(query, {
                type:
                  Object.keys(Sequelize.QueryTypes).find((type) => query.toUpperCase().startsWith(type)) ||
                  Sequelize.QueryTypes.RAW,
              })
              .then((results) => {
                let jsonOut = false;
                if (results && path !== undefined) {
                  jsonOut = Mods.jsonPath(results, path);
                  // if it failed and if they didn't the required initial object, add it for them
                  if (jsonOut === false) jsonOut = Mods.jsonPath(results, '$.'.concat(path));
                  // if it failed still, try just pulling the first object
                  if (jsonOut === false) jsonOut = Mods.jsonPath(results, '$.[0].'.concat(path));
                  if (jsonOut) {
                    if (jsonOut.length === 1) jsonOut = jsonOut[0];
                    if (DEBUG)
                      console.log(`Run SQL Query: JSON Data values starting from [${path}] stored to: [${varName}]`);
                    if (DEBUG) console.dir(jsonOut);
                  }
                }
                if (results && path === undefined && DEBUG) {
                  console.log('\nStored value(s);\r\n');
                  console.log('Key =  Json');
                  for (let i = 0; i < results.length; i++) {
                    console.log(`[${i}] = ${JSON.stringify(results[i])}`);
                  }
                  console.log('\r\nAppend the key that you want to store that value to the variable.');
                  const storageType = ['', 'tempVars', 'serverVars', 'globalVars'];
                  const output = storageType[storage];
                  console.log('If not using the Path textbox in the mod, this is how to get special values.');
                  console.log(
                    `Example \${${output}("${varName}")} to \${${output}("${varName}")[0]["${
                      Object.keys(results[0])[0]
                    }"]}`,
                  );
                  console.log(
                    `Example Run Script ${output}("${varName}")["${
                      Object.keys(results[0])[0]
                    }"] or a place without \${}.\r\n`,
                  );
                  console.log(
                    'Append the path to the end after the key or use the Parse From Stored JSON mod,\nin order to get the value you want',
                  );
                  console.log(`Example \${${output}("${varName}")[key].path} or use the json path box in the mod UI.`);
                }
                const out = jsonOut || results;
                this.storeValue(stringifyOutput ? JSON.stringify(out) : out, storage, varName, cache);
                this.callNextAction(cache);
              })
              .catch((err) => {
                if (err && err.original) {
                  this.storeValue({ message: err.original, error: err.original }, storage, varName, cache);
                  console.error(err.original);
                  this.callNextAction(cache);
                }
              });
          } else {
            this.callNextAction(cache);
          }
        })
        .catch((err) => {
          console.log('Unable to connect to the database:');
          console.error(err);
        });
    } catch (error) {
      console.log(`SQL Mod Error: ${error.stack ? error.stack : error}`);
    }
  },

  mod() {},
};
